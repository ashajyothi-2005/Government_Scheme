import { GoogleGenAI } from '@google/genai';

const EMBEDDING_DIMENSIONS = 128;
let embeddingClient: GoogleGenAI | null = null;

function getEmbeddingClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!embeddingClient) embeddingClient = new GoogleGenAI({ apiKey });
  return embeddingClient;
}

/** Creates a stable local embedding when Gemini embeddings are unavailable. */
function localEmbedding(text: string): number[] {
  const vector = new Array<number>(EMBEDDING_DIMENSIONS).fill(0);
  const tokens = text.toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
  tokens.forEach((token, tokenIndex) => {
    let hash = 2166136261;
    for (const character of token) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
    const index = Math.abs(hash) % EMBEDDING_DIMENSIONS;
    vector[index] += 1 / Math.sqrt(token.length + tokenIndex + 1);
    vector[(index * 31 + token.length) % EMBEDDING_DIMENSIONS] += 0.35;
  });
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
  return vector.map((value) => value / magnitude);
}

export async function createEmbedding(text: string): Promise<number[]> {
  const client = getEmbeddingClient();
  if (!client) return localEmbedding(text);

  try {
    const response = await client.models.embedContent({
      model: 'gemini-embedding-001',
      contents: text,
      config: { outputDimensionality: EMBEDDING_DIMENSIONS },
    });
    const values = response.embeddings?.[0]?.values;
    return values?.length ? values : localEmbedding(text);
  } catch (error) {
    console.warn('Gemini embedding unavailable; using local embeddings.', error);
    return localEmbedding(text);
  }
}

export function cosineSimilarity(left: number[], right: number[]): number {
  const length = Math.min(left.length, right.length);
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;
  for (let index = 0; index < length; index += 1) {
    dot += left[index] * right[index];
    leftMagnitude += left[index] ** 2;
    rightMagnitude += right[index] ** 2;
  }
  if (!leftMagnitude || !rightMagnitude) return 0;
  return dot / Math.sqrt(leftMagnitude * rightMagnitude);
}
