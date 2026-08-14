import { GoogleGenAI } from '@google/genai';

/**
 * Service to generate vector embeddings using Gemini text-embedding-004
 * with in-memory caching to avoid redundant API calls.
 */
export class EmbeddingService {
  private cache: Map<string, number[]> = new Map();
  private aiInstance: GoogleGenAI | null = null;
  private embeddingModel = 'gemini-embedding-2-preview';
  private vectorDim = 768;

  private getAI(): GoogleGenAI | null {
    if (!this.aiInstance) {
      const key = process.env.GEMINI_API_KEY;
      if (!key) return null;
      this.aiInstance = new GoogleGenAI({ 
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return this.aiInstance;
  }

  /**
   * Generates a 768-dimensional float embedding for the given input text.
   */
  public async generateEmbedding(text: string): Promise<number[]> {
    const cleanText = (text || '').trim();
    if (!cleanText) {
      return new Array(this.vectorDim).fill(0);
    }

    // Check cache
    if (this.cache.has(cleanText)) {
      return this.cache.get(cleanText)!;
    }

    const ai = this.getAI();
    if (ai) {
      try {
        const response = await ai.models.embedContent({
          model: this.embeddingModel,
          contents: cleanText,
        });

        const resAny = response as any;
        const values = resAny?.embedding?.values || resAny?.embeddings?.[0]?.values;
        if (Array.isArray(values) && values.length > 0) {
          this.cache.set(cleanText, values);
          return values;
        }
      } catch (err) {
        console.warn('[EmbeddingService] Gemini embedding call failed, falling back to local vector generation:', err);
      }
    }

    // Fallback deterministic local embedding generator (768 dimensions)
    const fallbackVector = this.generateLocalFallbackEmbedding(cleanText);
    this.cache.set(cleanText, fallbackVector);
    return fallbackVector;
  }

  /**
   * Generates a batch of embeddings in parallel or sequentially
   */
  public async generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map(t => this.generateEmbedding(t)));
  }

  /**
   * Local deterministic 768-dim pseudo-vector generator for offline/fallback environments.
   */
  private generateLocalFallbackEmbedding(text: string): number[] {
    const vector = new Array(this.vectorDim).fill(0);
    const clean = text.toLowerCase().replace(/[^\w\s]/g, ' ');
    const words = clean.split(/\s+/).filter(Boolean);

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      for (let j = 0; j < word.length; j++) {
        const charCode = word.charCodeAt(j);
        const idx = (charCode * (i + 1) * 31 + j) % this.vectorDim;
        vector[idx] += 0.05 * (j + 1);
      }
    }

    // L2 Normalize
    let norm = 0;
    for (let i = 0; i < this.vectorDim; i++) {
      norm += vector[i] * vector[i];
    }
    norm = Math.sqrt(norm);

    if (norm > 0) {
      for (let i = 0; i < this.vectorDim; i++) {
        vector[i] = vector[i] / norm;
      }
    } else {
      vector[0] = 1.0;
    }

    return vector;
  }

  public getCacheSize(): number {
    return this.cache.size;
  }

  public clearCache(): void {
    this.cache.clear();
  }
}

export const embeddingService = new EmbeddingService();
