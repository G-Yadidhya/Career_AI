import { DocumentChunk } from './documentChunker';

export interface VectorRecord {
  id: string;
  documentId: string;
  chunk: DocumentChunk;
  embedding: number[];
  metadata: Record<string, any>;
}

export interface SimilaritySearchResult {
  chunk: DocumentChunk;
  score: number; // Cosine similarity score (0.0 to 1.0)
  distance: number;
}

export class VectorStore {
  private records: Map<string, VectorRecord> = new Map();

  /**
   * Upserts vector records into the store
   */
  public async addRecords(records: VectorRecord[]): Promise<void> {
    for (const record of records) {
      this.records.set(record.id, record);
    }
  }

  /**
   * Retrieves Top-K records sorted by vector cosine similarity to the query embedding.
   */
  public async search(
    queryEmbedding: number[],
    topK: number = 5,
    categoryFilter?: string
  ): Promise<SimilaritySearchResult[]> {
    if (this.records.size === 0 || !queryEmbedding || queryEmbedding.length === 0) {
      return [];
    }

    const results: SimilaritySearchResult[] = [];

    for (const record of Array.from(this.records.values())) {
      // Optional category filtering
      if (categoryFilter && categoryFilter !== 'All') {
        const cat = record.chunk.category.toLowerCase();
        const filter = categoryFilter.toLowerCase();
        if (!cat.includes(filter) && !filter.includes(cat)) {
          continue;
        }
      }

      const simScore = this.cosineSimilarity(queryEmbedding, record.embedding);
      const distance = 1 - simScore;

      results.push({
        chunk: record.chunk,
        score: simScore,
        distance,
      });
    }

    // Sort descending by similarity score
    results.sort((a, b) => b.score - a.score);

    return results.slice(0, topK);
  }

  /**
   * Calculates cosine similarity between two numeric vectors.
   */
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    if (magnitude === 0) return 0;

    const sim = dotProduct / magnitude;
    return Math.max(0, Math.min(1, sim));
  }

  public getRecordCount(): number {
    return this.records.size;
  }

  public clear(): void {
    this.records.clear();
  }
}

export const vectorStore = new VectorStore();
