import { GoogleGenAI } from '@google/genai';
import { defaultRAGEngine, RAGEngine } from '../rag/ragEngine';
import { modelManager } from '../utils/modelManager';

export interface AgentExecutionMeta {
  agentName: string;
  executionTimeMs: number;
  modelUsed: string;
  isFallback: boolean;
  timestamp: string;
}

export interface AgentResponse<T> {
  success: boolean;
  data: T;
  meta: AgentExecutionMeta;
  error?: string;
}

export class BaseAgent {
  protected name: string;
  protected defaultModel: string;
  protected ragEngine: RAGEngine;

  constructor(name: string, defaultModel = 'gemini-3.7-flash') {
    this.name = name;
    this.defaultModel = defaultModel;
    this.ragEngine = defaultRAGEngine;
  }

  /**
   * Helper to retrieve server-side GoogleGenAI SDK client instance
   */
  protected getAIClient(): GoogleGenAI | null {
    if (!process.env.GEMINI_API_KEY) {
      return null;
    }
    return new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  /**
   * Resilient Gemini SDK call wrapper with circuit breaker and model candidate rotation on transient quota/503 errors
   */
  protected async callGeminiWithRetry<T>(
    fn: (ai: GoogleGenAI, model: string) => Promise<T>,
    maxRetries = 3,
    baseDelayMs = 1500
  ): Promise<T | null> {
    const ai = this.getAIClient();
    if (!ai) return null;

    const modelCandidates = modelManager.getCandidateModels(this.defaultModel);

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      // Re-fetch candidate models on each attempt so that newly cooled down models are deprioritized
      const candidates = modelManager.getCandidateModels(this.defaultModel);
      const currentModel = candidates[attempt % candidates.length];
      try {
        const res = await fn(ai, currentModel);
        modelManager.reportModelSuccess(currentModel);
        return res;
      } catch (err: any) {
        const isTransient = modelManager.isTransientError(err);
        modelManager.reportModelError(currentModel, err);

        if (isTransient && attempt < maxRetries) {
          const freshCandidates = modelManager.getCandidateModels(this.defaultModel);
          const nextModel = freshCandidates[(attempt + 1) % freshCandidates.length];
          const delay = 250 + Math.floor(Math.random() * 250);
          console.info(
            `[${this.name}] Transient rate/quota limit on ${currentModel}. Rotating to healthy model: ${nextModel}...`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        
        console.warn(
          `[${this.name}] AI generation note: ${
            err?.message || err
          }. Delegating to deterministic domain heuristics.`
        );
        return null;
      }
    }
    return null;
  }

  /**
   * Safe, ultra-resilient JSON parser with markdown fence stripping, outer boundary extraction, and trailing comma repair
   */
  protected parseStructuredJSON<T>(rawText: string | undefined): T | null {
    if (!rawText || typeof rawText !== 'string') return null;

    let clean = rawText.trim();

    // 1. Direct try
    try {
      return JSON.parse(clean) as T;
    } catch {
      // Continue to cleanup strategies
    }

    // 2. Strip standard markdown fences
    if (clean.includes('```')) {
      const match = clean.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      if (match && match[1]) {
        clean = match[1].trim();
        try {
          return JSON.parse(clean) as T;
        } catch {
          // Continue to boundary extraction
        }
      } else {
        clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
      }
    }

    // 3. Extract outermost object { ... } or array [ ... ]
    const firstBracket = clean.indexOf('{');
    const firstSquare = clean.indexOf('[');
    let candidate = clean;

    if (firstBracket !== -1 && (firstSquare === -1 || firstBracket < firstSquare)) {
      const lastBracket = clean.lastIndexOf('}');
      if (lastBracket !== -1 && lastBracket > firstBracket) {
        candidate = clean.substring(firstBracket, lastBracket + 1);
      }
    } else if (firstSquare !== -1) {
      const lastSquare = clean.lastIndexOf(']');
      if (lastSquare !== -1 && lastSquare > firstSquare) {
        candidate = clean.substring(firstSquare, lastSquare + 1);
      }
    }

    try {
      return JSON.parse(candidate) as T;
    } catch {
      // 4. Try removing trailing commas before closing braces/brackets
      try {
        const repaired = candidate
          .replace(/,\s*([}\]])/g, '$1')
          .replace(/[\u201C\u201D]/g, '"') // Replace smart quotes
          .replace(/[\u2018\u2019]/g, "'");
        return JSON.parse(repaired) as T;
      } catch (e) {
        console.warn(`[${this.name}] Structured JSON parsing non-fatal fallback. Context length: ${clean.length}`);
        return null;
      }
    }
  }

  /**
   * Wraps result in standardized Agent Response format
   */
  protected createResult<T>(
    data: T,
    startTime: number,
    isFallback: boolean,
    error?: string
  ): AgentResponse<T> {
    const endTime = Date.now();
    return {
      success: !error,
      data,
      meta: {
        agentName: this.name,
        executionTimeMs: endTime - startTime,
        modelUsed: isFallback ? 'Deterministic-Domain-Engine' : this.defaultModel,
        isFallback,
        timestamp: new Date().toISOString(),
      },
      error,
    };
  }
}
