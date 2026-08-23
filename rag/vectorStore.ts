import { KnowledgeChunk } from '../shared/types.ts';
import { cosineSimilarity, createEmbedding } from './embeddings.ts';

export interface VectorRecord {
  id: string;
  chunk: KnowledgeChunk;
  embedding: number[];
}

/** Small in-process vector database for the demo; replace storage with Atlas/Qdrant in production. */
export class LocalVectorStore {
  private records: VectorRecord[] = [];
  private ready = false;

  async upsert(chunks: KnowledgeChunk[]) {
    if (this.ready) return;
    this.records = await Promise.all(chunks.map(async (chunk) => ({
      id: chunk.id,
      chunk,
      embedding: await createEmbedding(this.documentText(chunk)),
    })));
    this.ready = true;
  }

  async search(query: string, topK = 4, schemeId?: string) {
    const queryEmbedding = await createEmbedding(query);
    return this.records
      .filter((record) => record.chunk.status === 'ACTIVE' && (!schemeId || record.chunk.schemeId === schemeId))
      .map((record) => ({ ...record, similarity: cosineSimilarity(queryEmbedding, record.embedding) }))
      .sort((left, right) => right.similarity - left.similarity)
      .slice(0, topK);
  }

  get size() {
    return this.records.length;
  }

  private documentText(chunk: KnowledgeChunk) {
    return `${chunk.schemeName} ${chunk.section} ${chunk.content} ${chunk.keywords.join(' ')}`;
  }
}
