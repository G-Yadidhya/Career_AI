import { SimilaritySearchResult } from './vectorStore';
import { DocumentChunk } from './documentChunker';

export interface RerankedChunkResult {
  chunk: DocumentChunk;
  originalVectorScore: number;
  rerankScore: number;
  relevanceExplanation: string;
}

export class Reranker {
  private minScoreThreshold: number;

  constructor(minScoreThreshold: number = 0.30) {
    this.minScoreThreshold = minScoreThreshold;
  }

  /**
   * Reranks retrieved vector candidates based on vector similarity,
   * domain confidence, and intent term matches.
   */
  public rerank(
    query: string,
    candidates: SimilaritySearchResult[],
    limit: number = 3
  ): RerankedChunkResult[] {
    if (!candidates || candidates.length === 0) return [];

    const cleanQuery = query.toLowerCase().replace(/[^\w\s]/g, ' ');
    const queryTerms = cleanQuery.split(/\s+/).filter(w => w.length > 2);

    const scored = candidates.map(item => {
      const chunkText = `${item.chunk.title} ${item.chunk.category} ${item.chunk.content} ${item.chunk.metadata.tags.join(' ')}`.toLowerCase();
      
      let termFrequencyBonus = 0;
      for (const term of queryTerms) {
        if (chunkText.includes(term)) {
          termFrequencyBonus += 0.08;
        }
      }

      // Confidence multiplier from source
      const confidenceBoost = item.chunk.confidence || 0.95;

      // Composite Rerank Score
      const rerankScore = (item.score * 0.65) + (termFrequencyBonus * 0.20) + (confidenceBoost * 0.15);

      const explanation = `Vector Sim: ${(item.score * 100).toFixed(1)}%, Term Bonus: ${(termFrequencyBonus * 100).toFixed(1)}%, Domain Trust: ${(confidenceBoost * 100).toFixed(1)}%`;

      return {
        chunk: item.chunk,
        originalVectorScore: item.score,
        rerankScore: Math.min(1.0, rerankScore),
        relevanceExplanation: explanation
      };
    });

    // Filter out low relevance items below threshold
    const filtered = scored.filter(s => s.rerankScore >= this.minScoreThreshold);

    // Sort descending by final composite rerankScore
    filtered.sort((a, b) => b.rerankScore - a.rerankScore);

    return filtered.slice(0, limit);
  }
}

export const reranker = new Reranker();
