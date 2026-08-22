import { KnowledgeChunk, SchemeSource } from '../shared/types';
import { KNOWLEDGE_CHUNKS } from './chunks';
import { OFFICIAL_SOURCES } from '../backend/data/sources';
import { LocalVectorStore } from './vectorStore';

export interface RetrievalResult {
  chunks: (KnowledgeChunk & { relevanceScore: number })[];
  sources: SchemeSource[];
  query: string;
}

const vectorStore = new LocalVectorStore();

export async function retrieveKnowledge(query: string, filter?: { category?: string; state?: string; schemeId?: string }, topK: number = 4): Promise<RetrievalResult> {
  await vectorStore.upsert(KNOWLEDGE_CHUNKS);
  const normalizedQuery = query.toLowerCase().trim();
  const queryTokens = normalizedQuery.split(/\s+/).filter(t => t.length > 2);

  // Score each chunk
  const scoredChunks = KNOWLEDGE_CHUNKS.map((chunk) => {
    // Only search ACTIVE chunks
    if (chunk.status !== 'ACTIVE') return { ...chunk, relevanceScore: 0 };

    let score = 0;
    const contentLower = chunk.content.toLowerCase();
    const schemeLower = chunk.schemeName.toLowerCase();
    const sectionLower = chunk.section.toLowerCase();

    // Exact phrase match
    if (contentLower.includes(normalizedQuery)) score += 30;
    if (schemeLower.includes(normalizedQuery)) score += 40;

    // Token matching in content
    queryTokens.forEach((token) => {
      if (contentLower.includes(token)) score += 10;
      if (schemeLower.includes(token)) score += 15;
      if (sectionLower.includes(token)) score += 8;
      if (chunk.keywords.some(kw => kw.toLowerCase().includes(token))) score += 12;
    });

    // Scheme ID filter if provided
    if (filter?.schemeId && chunk.schemeId === filter.schemeId) {
      score += 50;
    }

    return { ...chunk, relevanceScore: score };
  });

  const vectorResults = await vectorStore.search(query, topK * 2, filter?.schemeId);
  const vectorScores = new Map(vectorResults.map((result) => [result.id, result.similarity]));
  const relevant = scoredChunks
    .filter((chunk) => chunk.relevanceScore > 0 || vectorScores.has(chunk.id))
    .map((chunk) => ({
      ...chunk,
      relevanceScore: chunk.relevanceScore + Math.round((vectorScores.get(chunk.id) || 0) * 100),
    }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, topK);

  // If no specific match was found, provide general top active knowledge chunks
  const finalChunks = relevant.length > 0
    ? relevant
    : vectorResults.slice(0, topK).map((result) => ({ ...result.chunk, relevanceScore: Math.round(result.similarity * 100) }));

  // Collect corresponding official sources
  const sourceDocIds = new Set(finalChunks.map((c) => c.documentId));
  const matchedSources = OFFICIAL_SOURCES.filter((s) => sourceDocIds.has(s.documentId));

  return {
    chunks: finalChunks,
    sources: matchedSources,
    query
  };
}
