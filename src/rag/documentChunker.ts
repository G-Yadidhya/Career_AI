export interface DocumentChunk {
  chunkId: string;
  documentId: string;
  title: string;
  category: 'Resume Tips' | 'ATS Rules' | 'Interview Knowledge' | 'Career Guidance' | 'Job Requirements' | 'O*NET Taxonomy' | 'ESCO Taxonomy' | 'General';
  content: string;
  confidence: number;
  metadata: {
    source: string;
    parentTitle: string;
    chunkIndex: number;
    totalChunks: number;
    wordCount: number;
    tags: string[];
  };
}

export interface RawDocumentInput {
  id: string;
  title: string;
  category: string;
  content: string;
  confidence?: number;
  source?: string;
  tags?: string[];
}

export class DocumentChunker {
  private defaultChunkSize: number;
  private defaultChunkOverlap: number;

  constructor(chunkSize: number = 300, chunkOverlap: number = 60) {
    this.defaultChunkSize = chunkSize;
    this.defaultChunkOverlap = chunkOverlap;
  }

  /**
   * Intelligently splits a document into semantic chunks with overlapping boundaries.
   */
  public chunkDocument(doc: RawDocumentInput): DocumentChunk[] {
    const rawText = (doc.content || '').trim();
    if (!rawText) return [];

    // Split by logical paragraphs or double newlines first
    const paragraphs = rawText.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    const textBlocks: string[] = [];

    for (const para of paragraphs) {
      if (para.length <= this.defaultChunkSize) {
        textBlocks.push(para);
      } else {
        // Sentence-boundary sub-chunking
        const sentences = para.match(/[^.!?]+[.!?]+/g) || [para];
        let currentBlock = '';

        for (const sentence of sentences) {
          if ((currentBlock + ' ' + sentence).length > this.defaultChunkSize) {
            if (currentBlock.trim()) textBlocks.push(currentBlock.trim());
            currentBlock = sentence;
          } else {
            currentBlock += (currentBlock ? ' ' : '') + sentence;
          }
        }
        if (currentBlock.trim()) textBlocks.push(currentBlock.trim());
      }
    }

    // Convert text blocks to DocumentChunk objects
    const chunks: DocumentChunk[] = textBlocks.map((block, index) => {
      const chunkId = `chk-${doc.id}-${index + 1}`;
      const words = block.split(/\s+/).filter(Boolean);

      return {
        chunkId,
        documentId: doc.id,
        title: doc.title,
        category: this.normalizeCategory(doc.category),
        content: block,
        confidence: doc.confidence ?? 0.95,
        metadata: {
          source: doc.source || doc.title,
          parentTitle: doc.title,
          chunkIndex: index,
          totalChunks: textBlocks.length,
          wordCount: words.length,
          tags: doc.tags || this.extractTags(block, doc.category)
        }
      };
    });

    return chunks;
  }

  private normalizeCategory(rawCategory: string): DocumentChunk['category'] {
    const lower = rawCategory.toLowerCase();
    if (lower.includes('ats')) return 'ATS Rules';
    if (lower.includes('interview') || lower.includes('q&a') || lower.includes('star')) return 'Interview Knowledge';
    if (lower.includes('resume')) return 'Resume Tips';
    if (lower.includes('career') || lower.includes('guidance')) return 'Career Guidance';
    if (lower.includes('job') || lower.includes('requirement')) return 'Job Requirements';
    if (lower.includes('o*net')) return 'O*NET Taxonomy';
    if (lower.includes('esco')) return 'ESCO Taxonomy';
    return 'General';
  }

  private extractTags(content: string, category: string): string[] {
    const tags = new Set<string>();
    tags.add(category.toLowerCase());

    const keywords = [
      'react', 'typescript', 'node.js', 'express', 'postgresql', 'docker', 'kubernetes',
      'vector', 'chromadb', 'rag', 'gemini', 'ats', 'star method', 'resume', 'system design',
      'behavioral', 'metrics', 'action verbs', 'agile', 'rest api', 'jwt'
    ];

    const contentLower = content.toLowerCase();
    for (const kw of keywords) {
      if (contentLower.includes(kw)) {
        tags.add(kw);
      }
    }

    return Array.from(tags);
  }
}

export const documentChunker = new DocumentChunker();
