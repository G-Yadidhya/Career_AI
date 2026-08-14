import { RerankedChunkResult } from './reranker';

export interface FormattedRAGContext {
  contextString: string;
  sourceTitles: string[];
  totalChunksUsed: number;
  sourcesUsedSummary: Array<{
    title: string;
    category: string;
    confidence: number;
    rerankScore: number;
  }>;
}

export class ContextBuilder {
  /**
   * Builds structured, high-density system prompt context from reranked chunks.
   */
  public buildContext(rerankedResults: RerankedChunkResult[]): FormattedRAGContext {
    if (!rerankedResults || rerankedResults.length === 0) {
      return {
        contextString: '[No relevant background grounding documents found for this query]',
        sourceTitles: [],
        totalChunksUsed: 0,
        sourcesUsedSummary: []
      };
    }

    const sourceTitles = Array.from(new Set(rerankedResults.map(r => r.chunk.title)));
    
    const contextBlocks = rerankedResults.map((item, idx) => {
      const percentage = (item.rerankScore * 100).toFixed(0);
      return `--- Grounding Snippet ${idx + 1} ---
[Source: ${item.chunk.title} | Category: ${item.chunk.category} | Trust Score: ${percentage}%]
${item.chunk.content}`;
    });

    const contextString = `Official Ground Truth Knowledge Base Context:\n\n${contextBlocks.join('\n\n')}`;

    const sourcesUsedSummary = rerankedResults.map(item => ({
      title: item.chunk.title,
      category: item.chunk.category,
      confidence: item.chunk.confidence,
      rerankScore: item.rerankScore
    }));

    return {
      contextString,
      sourceTitles,
      totalChunksUsed: rerankedResults.length,
      sourcesUsedSummary
    };
  }
}

export const contextBuilder = new ContextBuilder();
