import { GoogleGenAI } from '@google/genai';
import { PromptRegistry, PromptTemplateDefinition } from './promptRegistry';
import { modelManager } from '../utils/modelManager';

export class PromptEngine {
  private aiInstance: GoogleGenAI | null = null;
  private defaultModel: string;

  constructor(defaultModel: string = 'gemini-3.7-flash') {
    this.defaultModel = defaultModel;
  }

  private getAI(): GoogleGenAI {
    if (!this.aiInstance) {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY environment variable is missing.');
      }
      this.aiInstance = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
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
   * Executes a prompt template with the provided variables.
   * Features: 
   * - Few-shot prompting (via contents mapping)
   * - Output validation (JSON Schema enforced by SDK)
   * - Retry logic with ModelManager circuit breaker
   * - Fallback prompts on complete failure
   */
  public async executePrompt<T>(
    templateId: string,
    version: string,
    variables: Record<string, any>,
    maxRetries: number = 3
  ): Promise<T> {
    const templateKey = `${templateId}_${version}`;
    const template = PromptRegistry[templateKey];

    if (!template) {
      throw new Error(`Prompt template '${templateKey}' not found in registry.`);
    }

    let attempt = 0;
    let lastError: any = null;
    const modelCandidates = modelManager.getCandidateModels(this.defaultModel);

    while (attempt <= maxRetries) {
      const currentModel = modelCandidates[attempt % modelCandidates.length];
      try {
        const response = await this.callLLM(template, variables, currentModel);
        let cleanResponse = response.trim();
        if (cleanResponse.startsWith('```json')) {
          cleanResponse = cleanResponse.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
        } else if (cleanResponse.startsWith('```')) {
          cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/```$/, '').trim();
        }
        
        // Find outermost JSON object or array if extra commentary was appended
        const firstBracket = cleanResponse.indexOf('{');
        const firstSquare = cleanResponse.indexOf('[');
        let startIdx = 0;
        if (firstBracket !== -1 && (firstSquare === -1 || firstBracket < firstSquare)) {
          startIdx = firstBracket;
          const lastBracket = cleanResponse.lastIndexOf('}');
          if (lastBracket !== -1) {
            cleanResponse = cleanResponse.substring(startIdx, lastBracket + 1);
          }
        } else if (firstSquare !== -1) {
          startIdx = firstSquare;
          const lastSquare = cleanResponse.lastIndexOf(']');
          if (lastSquare !== -1) {
            cleanResponse = cleanResponse.substring(startIdx, lastSquare + 1);
          }
        }

        const parsed = JSON.parse(cleanResponse);
        modelManager.reportModelSuccess(currentModel);
        return parsed as T;
      } catch (err: any) {
        lastError = err;
        const isTransient = modelManager.isTransientError(err);
        modelManager.reportModelError(currentModel, err);
        attempt++;

        if (attempt <= maxRetries) {
          // When switching to a healthy alternate model on 429/503, use a very short switch delay
          const delay = isTransient ? 200 + Math.floor(Math.random() * 200) : Math.min(3000, 1000 * Math.pow(1.5, attempt - 1));
          const nextModel = modelCandidates[attempt % modelCandidates.length];
          console.info(`[PromptEngine] Attempt ${attempt} rotated from ${currentModel} to ${nextModel}.`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    // Fallback logic
    if (template.fallbackTemplateId) {
      console.warn(`[PromptEngine] Retrying with fallback template: ${template.fallbackTemplateId}.`);
      return this.executePrompt<T>(template.fallbackTemplateId, version, variables, 1);
    }

    throw new Error(`[PromptEngine] Execution completed via fallback for ${templateKey}. (${lastError?.message || 'Rate limit/demand constraint'})`);
  }

  private async callLLM(template: PromptTemplateDefinition, variables: Record<string, any>, modelOverride?: string): Promise<string> {
    const userPrompt = template.userTemplate(variables);
    
    const contents: any[] = [];
    if (template.fewShots && template.fewShots.length > 0) {
      for (const shot of template.fewShots) {
        contents.push({ role: 'user', parts: [{ text: shot.userInput }] });
        contents.push({ role: 'model', parts: [{ text: shot.modelOutput }] });
      }
    }
    contents.push({ role: 'user', parts: [{ text: userPrompt }] });

    const config: any = {
      systemInstruction: template.systemInstruction,
      temperature: 0.2, // Deterministic logic
      responseMimeType: 'application/json' // Force JSON
    };

    if (template.responseSchema) {
      config.responseSchema = template.responseSchema;
    }

    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: modelOverride || this.defaultModel,
      contents,
      config
    });

    if (!response.text) {
      throw new Error("Received empty response text from Gemini.");
    }

    return response.text;
  }
}

export const promptEngine = new PromptEngine();
