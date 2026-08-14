import { embeddingService } from '../embeddings/embeddingService';
import { documentChunker, RawDocumentInput, DocumentChunk } from './documentChunker';
import { vectorStore, VectorRecord } from './vectorStore';
import { reranker } from './reranker';
import { contextBuilder, FormattedRAGContext } from './contextBuilder';
import { RAG_KNOWLEDGE_DOCUMENTS } from '../data/knowledgeBase';

export interface RAGQueryOptions {
  categoryFilter?: string;
  topK?: number;
  minScoreThreshold?: number;
}

export class RAGService {
  private isInitialized = false;
  private queryCache = new Map<string, FormattedRAGContext>();

  /**
   * Initializes and populates the vector store with comprehensive domain knowledge.
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('[RAGService] Ingesting knowledge documents into vector store...');

    // Core Domain Knowledge Base (Resume tips, ATS rules, Interview knowledge, Career guidance, Job requirements)
    const rawDocs: RawDocumentInput[] = [
      ...RAG_KNOWLEDGE_DOCUMENTS.map((doc, idx) => ({
        id: `kb-doc-${idx + 1}`,
        title: doc.title,
        category: doc.category,
        content: doc.snippet,
        confidence: doc.confidence,
        source: doc.title
      })),
      {
        id: 'kb-doc-resume-1',
        title: 'FAANG & Enterprise Resume Formatting Standard',
        category: 'Resume Tips',
        confidence: 0.99,
        content: `Standard single-column layout is strongly preferred by ATS parsers (Taleo, Workday, Greenhouse, Lever). Use standard section titles: 'Professional Summary', 'Technical Skills', 'Work Experience', 'Projects', and 'Education'. Keep bullet points to 1-2 lines starting with strong action verbs (Architected, Engineered, Spearheaded, Optimized, Scaled) followed by quantifiable business outcomes.`
      },
      {
        id: 'kb-doc-ats-1',
        title: 'ATS Keyword Density & Parser Optimization',
        category: 'ATS Rules',
        confidence: 0.98,
        content: `ATS keyword match algorithms evaluate exact term matching, abbreviation variations (e.g. React.js and React 19, TypeScript and TS, PostgreSQL and Postgres), and frequency relative to overall word count. Avoid putting critical skills inside headers, footers, or image alt tags. Use standard font choices (Arial, Calibri, Inter, Times New Roman).`
      },
      {
        id: 'kb-doc-interview-1',
        title: 'Behavioral & STAR Method Interview Mastery',
        category: 'Interview Knowledge',
        confidence: 0.97,
        content: `Structure every behavioral question using the STAR framework: Situation (set context in 2 sentences), Task (explain your core objective), Action (detail your individual technical contributions using 'I' instead of 'we'), and Result (highlight measurable outcome, e.g. 'reduced latency by 40%' or 'saved 15 hours weekly').`
      },
      {
        id: 'kb-doc-career-1',
        title: 'Technical Career Progression & Salary Benchmarks (2026)',
        category: 'Career Guidance',
        confidence: 0.96,
        content: `For Full Stack & AI Software Engineers, career progression from L4 (Software Engineer) to L5 (Senior Software Engineer) requires demonstrating system design ownership, mentorship, cross-functional collaboration, and business metrics impact. Target tech stack priorities in 2026: TypeScript, React 19, Node.js, Cloud Native (GCP/AWS), Vector Databases (ChromaDB), and GenAI Orchestration.`
      },
      {
        id: 'kb-doc-job-1',
        title: 'Modern Full Stack & AI Job Description Requirements',
        category: 'Job Requirements',
        confidence: 0.97,
        content: `High-converting candidate profiles match key job description requirements: 80%+ exact match on primary languages (TypeScript/Python), framework proficiency (React, Express, Next.js), database systems (PostgreSQL, Redis), containerization (Docker, Kubernetes), and CI/CD pipelines.`
      }
    ];

    // Chunk all documents
    const allChunks: DocumentChunk[] = [];
    for (const doc of rawDocs) {
      const chunks = documentChunker.chunkDocument(doc);
      allChunks.push(...chunks);
    }

    // Generate vector embeddings for all chunks
    const chunkTexts = allChunks.map(c => `${c.title} ${c.category} ${c.content}`);
    const embeddings = await embeddingService.generateBatchEmbeddings(chunkTexts);

    // Build vector records and add to VectorStore
    const vectorRecords: VectorRecord[] = allChunks.map((chunk, index) => ({
      id: chunk.chunkId,
      documentId: chunk.documentId,
      chunk,
      embedding: embeddings[index],
      metadata: {
        title: chunk.title,
        category: chunk.category,
        source: chunk.metadata.source,
        chunkIndex: chunk.metadata.chunkIndex
      }
    }));

    await vectorStore.addRecords(vectorRecords);
    this.isInitialized = true;
    console.log(`[RAGService] Vector store initialized with ${vectorStore.getRecordCount()} indexed chunk embeddings.`);
  }

  /**
   * Primary entry point for semantic retrieval and context building.
   */
  public async retrieveContext(
    query: string,
    options: RAGQueryOptions = {}
  ): Promise<FormattedRAGContext> {
    const cleanQuery = (query || '').trim();
    if (!cleanQuery) {
      return {
        contextString: '[Empty query string provided to RAG retriever]',
        sourceTitles: [],
        totalChunksUsed: 0,
        sourcesUsedSummary: []
      };
    }

    const topK = options.topK ?? 4;
    const categoryFilter = options.categoryFilter ?? 'All';
    const cacheKey = `${cleanQuery}::${categoryFilter}::${topK}`;

    // Return cached context if available
    if (this.queryCache.has(cacheKey)) {
      return this.queryCache.get(cacheKey)!;
    }

    // Ensure knowledge base is initialized
    if (!this.isInitialized) {
      await this.initialize();
    }

    // 1. Generate Query Vector Embedding
    const queryEmbedding = await embeddingService.generateEmbedding(cleanQuery);

    // 2. Vector Search in VectorStore (Top-K)
    const vectorSearchCandidates = await vectorStore.search(queryEmbedding, topK * 2, categoryFilter);

    // 3. Re-rank retrieved candidates
    const rerankedChunks = reranker.rerank(cleanQuery, vectorSearchCandidates, topK);

    // 4. Build Structured Context String
    const formattedContext = contextBuilder.buildContext(rerankedChunks);

    // Cache result
    this.queryCache.set(cacheKey, formattedContext);

    return formattedContext;
  }

  public getStats(): { totalIndexedChunks: number; cachedEmbeddings: number; cachedQueries: number } {
    return {
      totalIndexedChunks: vectorStore.getRecordCount(),
      cachedEmbeddings: embeddingService.getCacheSize(),
      cachedQueries: this.queryCache.size
    };
  }
}

export const ragService = new RAGService();
