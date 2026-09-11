import { getGeminiClient } from './gemini';
import { Chunk } from '../src/types';

export class VectorStore {
  private chunks: Chunk[] = [];

  constructor() {
    this.chunks = [];
  }

  public getChunks(): Chunk[] {
    return this.chunks;
  }

  public addChunks(newChunks: Chunk[]): void {
    // Overwrite or append
    const existingIds = new Set(newChunks.map((c) => c.id));
    this.chunks = this.chunks.filter((c) => !existingIds.has(c.id)).concat(newChunks);
  }

  public removeSourceChunks(sourceId: string): void {
    this.chunks = this.chunks.filter((c) => c.sourceId !== sourceId);
  }

  /**
   * Generates a lightweight numerical embedding representation for text.
   * If Gemini is configured, it calls gemini-embedding-2-preview.
   * Otherwise, generates a deterministic token frequency vector.
   */
  public async getEmbedding(text: string): Promise<number[]> {
    const ai = getGeminiClient();
    if (ai) {
      try {
        const response = await ai.models.embedContent({
          model: 'gemini-embedding-2-preview',
          contents: text.slice(0, 2048),
        });
        const emb = (response as any).embedding?.values || (response as any).embeddings?.[0]?.values;
        if (emb && Array.isArray(emb)) {
          return emb;
        }
      } catch (err) {
        console.warn('Gemini embedding failed or rate-limited, falling back to local semantic vectorizer:', err);
      }
    }

    return this.generateLocalEmbedding(text);
  }

  public generateLocalEmbedding(text: string): number[] {
    const dims = 64;
    const vector = new Array(dims).fill(0);
    const cleaned = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
    const tokens = cleaned.split(/\s+/).filter((t) => t.length > 2);

    for (let i = 0; i < tokens.length; i++) {
      const word = tokens[i];
      let hash = 0;
      for (let j = 0; j < word.length; j++) {
        hash = (hash << 5) - hash + word.charCodeAt(j);
        hash |= 0;
      }
      const index = Math.abs(hash) % dims;
      vector[index] += 1;
    }

    // Normalize
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (magnitude === 0) return vector;
    return vector.map((val) => val / magnitude);
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (!vecA.length || !vecB.length) return 0;
    const len = Math.min(vecA.length, vecB.length);
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < len; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    return denominator === 0 ? 0 : dotProduct / denominator;
  }

  private keywordRelevance(query: string, content: string): number {
    const queryTerms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
    if (!queryTerms.length) return 0;
    const text = content.toLowerCase();
    let matches = 0;
    for (const term of queryTerms) {
      if (text.includes(term)) matches++;
    }
    return matches / queryTerms.length;
  }

  public async search(
    query: string,
    options: {
      sourceIds?: string[];
      topK?: number;
      minScore?: number;
    } = {}
  ): Promise<{ chunk: Chunk; score: number }[]> {
    const { sourceIds, topK = 4, minScore = 0.15 } = options;

    let candidateChunks = this.chunks;
    if (sourceIds && sourceIds.length > 0) {
      const allowed = new Set(sourceIds);
      candidateChunks = candidateChunks.filter((c) => allowed.has(c.sourceId));
    }

    if (candidateChunks.length === 0) {
      return [];
    }

    const queryEmbedding = await this.getEmbedding(query);

    const scored = candidateChunks.map((chunk) => {
      let vectorScore = 0;
      if (chunk.embedding && chunk.embedding.length > 0) {
        vectorScore = this.cosineSimilarity(queryEmbedding, chunk.embedding);
      }
      const kwScore = this.keywordRelevance(query, chunk.content);
      // Combined hybrid score (70% vector + 30% keyword)
      const combinedScore = vectorScore * 0.7 + kwScore * 0.3;
      return {
        chunk,
        score: Math.max(combinedScore, kwScore * 0.8),
      };
    });

    return scored
      .filter((item) => item.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
}

export const globalVectorStore = new VectorStore();
