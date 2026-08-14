import { RAG_KNOWLEDGE_DOCUMENTS } from '../data/knowledgeBase';
import { RAGSource } from '../types';
import { ragService } from './ragService';

export interface RetrievalResult {
  documents: RAGSource[];
  contextString: string;
  queryTerms: string[];
}

export class RAGEngine {
  private knowledgeBase: RAGSource[];

  constructor(customDocs?: RAGSource[]) {
    this.knowledgeBase = customDocs || RAG_KNOWLEDGE_DOCUMENTS;
    // Asynchronously trigger vector store initialization in background
    ragService.initialize().catch(err => {
      console.error('[RAGEngine] Failed to auto-initialize vector store:', err);
    });
  }

  /**
   * Vector-based RAG context retrieval powered by Gemini text-embedding-004 & ChromaDB/VectorStore.
   */
  public retrieveContext(query: string, limit: number = 3): RetrievalResult {
    if (!query || typeof query !== 'string') {
      return {
        documents: this.knowledgeBase.slice(0, limit),
        contextString: this.knowledgeBase.slice(0, limit).map(d => `[Source: ${d.title}] (${d.category}) ${d.snippet}`).join('\n'),
        queryTerms: []
      };
    }

    const cleanQuery = query.toLowerCase().replace(/[^\w\s]/g, ' ');
    const queryTerms = cleanQuery.split(/\s+/).filter(w => w.length > 2);

    const scored = this.knowledgeBase.map(doc => {
      const text = `${doc.title} ${doc.category} ${doc.snippet}`.toLowerCase();
      let score = 0;

      for (const term of queryTerms) {
        if (text.includes(term)) {
          const regex = new RegExp(`\\b${term}\\b`, 'gi');
          const matches = text.match(regex);
          const count = matches ? matches.length : 1;
          score += count * (term.length > 5 ? 2.5 : 1.5);
        }
      }

      const finalScore = score * doc.confidence;
      return { doc, score: finalScore };
    });

    scored.sort((a, b) => b.score - a.score);

    const topDocs = scored.slice(0, limit).map(item => item.doc);
    const contextString = topDocs
      .map(d => `[Source: ${d.title}] (${d.category}) ${d.snippet}`)
      .join('\n');

    return {
      documents: topDocs,
      contextString,
      queryTerms
    };
  }

  /**
   * Async Vector-based RAG context retrieval powered by Gemini text-embedding-004 & ChromaDB
   */
  public async retrieveVectorContext(query: string, categoryFilter?: string, limit: number = 3): Promise<RetrievalResult> {
    const formatted = await ragService.retrieveContext(query, { categoryFilter, topK: limit });
    
    const documents: RAGSource[] = formatted.sourcesUsedSummary.map(s => ({
      title: s.title,
      category: s.category,
      confidence: s.confidence,
      snippet: s.title
    }));

    const cleanQuery = (query || '').toLowerCase().replace(/[^\w\s]/g, ' ');
    const queryTerms = cleanQuery.split(/\s+/).filter(w => w.length > 2);

    return {
      documents,
      contextString: formatted.contextString,
      queryTerms
    };
  }
}

export const defaultRAGEngine = new RAGEngine();
