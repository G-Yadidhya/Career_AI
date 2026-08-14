/**
 * Centralized Model Manager & Circuit Breaker for Google Gemini APIs.
 * Tracks model rate limits, quota exhaustion (429), and temporary high demand (503),
 * automatically routing requests to active, healthy fallback models (gemini-3.1-flash-lite, gemini-flash-latest).
 */

export interface ModelHealthStatus {
  modelName: string;
  isCoolingDown: boolean;
  cooldownUntil: number;
  lastError?: string;
  failureCount: number;
}

export class ModelManager {
  private static instance: ModelManager;

  // Ordered list of models to use (Free-tier safe and standard SDK compliant)
  private readonly defaultCandidates: string[] = [
    'gemini-3.7-flash',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
  ];

  private modelHealth: Map<string, ModelHealthStatus> = new Map();

  private constructor() {
    for (const model of this.defaultCandidates) {
      this.modelHealth.set(model, {
        modelName: model,
        isCoolingDown: false,
        cooldownUntil: 0,
        failureCount: 0,
      });
    }
  }

  public static getInstance(): ModelManager {
    if (!ModelManager.instance) {
      ModelManager.instance = new ModelManager();
    }
    return ModelManager.instance;
  }

  /**
   * Returns an ordered list of candidate models, prioritizing currently healthy models.
   */
  public getCandidateModels(preferredModel?: string): string[] {
    const now = Date.now();
    const list = [...this.defaultCandidates];
    if (preferredModel && !list.includes(preferredModel) && !preferredModel.includes('pro')) {
      list.unshift(preferredModel);
    }

    // Partition into available and cooling-down models
    const available: string[] = [];
    const coolingDown: string[] = [];

    for (const m of list) {
      const status = this.modelHealth.get(m);
      if (status && status.isCoolingDown && status.cooldownUntil > now) {
        coolingDown.push(m);
      } else {
        if (status && status.isCoolingDown && status.cooldownUntil <= now) {
          status.isCoolingDown = false;
          status.failureCount = 0;
        }
        available.push(m);
      }
    }

    return [...available, ...coolingDown];
  }

  /**
   * Reports an error on a model to trigger cooldown/circuit breaking
   */
  public reportModelError(modelName: string, error: any): number {
    const now = Date.now();
    const errStr = (typeof error?.message === 'string' ? error.message : '') + ' ' + JSON.stringify(error || '');
    
    // Parse retry delay from error if available (e.g. "Please retry in 26.5s" or retryDelay: "26s")
    let retryDelayMs = 30000; // Default 30s cooldown
    const delayMatch = errStr.match(/retry in ([0-9.]+)\s*s/i) || errStr.match(/"retryDelay"\s*:\s*"([0-9]+)s"/i);
    if (delayMatch && delayMatch[1]) {
      const parsedSec = parseFloat(delayMatch[1]);
      if (!isNaN(parsedSec) && parsedSec > 0) {
        retryDelayMs = Math.ceil(parsedSec * 1000) + 2000; // Add 2s margin
      }
    }

    // Check if error is quota exhaustion (429) or high demand / unavailable (503)
    const isQuotaOrDemand = 
      error?.status === 'RESOURCE_EXHAUSTED' ||
      error?.status === 'UNAVAILABLE' ||
      error?.code === 429 ||
      error?.status === 429 ||
      error?.code === 503 ||
      error?.status === 503 ||
      /429|503|quota|RESOURCE_EXHAUSTED|high demand|UNAVAILABLE|rate limit|exceeded/i.test(errStr);

    let status = this.modelHealth.get(modelName);
    if (!status) {
      status = {
        modelName,
        isCoolingDown: false,
        cooldownUntil: 0,
        failureCount: 0,
      };
      this.modelHealth.set(modelName, status);
    }

    status.failureCount += 1;
    status.lastError = error?.message || String(error);

    if (isQuotaOrDemand) {
      status.isCoolingDown = true;
      status.cooldownUntil = now + retryDelayMs;
      console.info(`[ModelManager] Circuit breaker activated for ${modelName} (${Math.round(retryDelayMs / 1000)}s cooldown). Routing to alternate models.`);
    }

    return retryDelayMs;
  }

  /**
   * Reports a successful call on a model, clearing failure counts
   */
  public reportModelSuccess(modelName: string): void {
    const status = this.modelHealth.get(modelName);
    if (status) {
      status.isCoolingDown = false;
      status.cooldownUntil = 0;
      status.failureCount = 0;
    }
  }

  /**
   * Checks if an error is transient (429, 503, etc.)
   */
  public isTransientError(error: any): boolean {
    const errStr = (typeof error?.message === 'string' ? error.message : '') + ' ' + JSON.stringify(error || '');
    return (
      error?.status === 'UNAVAILABLE' ||
      error?.status === 'RESOURCE_EXHAUSTED' ||
      error?.code === 503 ||
      error?.status === 503 ||
      error?.code === 429 ||
      error?.status === 429 ||
      /503|429|high demand|UNAVAILABLE|quota|RESOURCE_EXHAUSTED|rate|limit/i.test(errStr)
    );
  }
}

export const modelManager = ModelManager.getInstance();
