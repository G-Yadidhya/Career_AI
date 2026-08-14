import { RAGSource, ResumeAnalysis, JobMatchResult } from '../types';

export interface SharedMemoryContext {
  resumeText?: string;
  parsedResume?: ResumeAnalysis;
  jobTitle?: string;
  jobDescriptionText?: string;
  jobMatchResult?: JobMatchResult;
  targetRole?: string;
  currentSkills?: string[];
  ragSources?: RAGSource[];
  rawAgentOutputs: Record<string, any>;
  createdAt: string;
  lastUpdatedAt: string;
}

export class AgentSharedMemory {
  private memory: SharedMemoryContext;

  constructor(initialData?: Partial<SharedMemoryContext>) {
    this.memory = {
      rawAgentOutputs: {},
      createdAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      ...initialData,
    };
  }

  public getContext(): SharedMemoryContext {
    return this.memory;
  }

  public setResumeText(text: string): void {
    this.memory.resumeText = text;
    this.touch();
  }

  public getResumeText(): string | undefined {
    return this.memory.resumeText;
  }

  public setParsedResume(analysis: ResumeAnalysis): void {
    this.memory.parsedResume = analysis;
    this.touch();
  }

  public getParsedResume(): ResumeAnalysis | undefined {
    return this.memory.parsedResume;
  }

  public setJobContext(jobTitle: string, jobDescriptionText: string): void {
    this.memory.jobTitle = jobTitle;
    this.memory.jobDescriptionText = jobDescriptionText;
    this.touch();
  }

  public setJobMatchResult(result: JobMatchResult): void {
    this.memory.jobMatchResult = result;
    this.touch();
  }

  public getJobMatchResult(): JobMatchResult | undefined {
    return this.memory.jobMatchResult;
  }

  public setRAGSources(sources: RAGSource[]): void {
    this.memory.ragSources = sources;
    this.touch();
  }

  public getRAGSources(): RAGSource[] | undefined {
    return this.memory.ragSources;
  }

  public saveAgentOutput(agentName: string, output: any): void {
    this.memory.rawAgentOutputs[agentName] = output;
    this.touch();
  }

  public getAgentOutput<T>(agentName: string): T | undefined {
    return this.memory.rawAgentOutputs[agentName] as T;
  }

  private touch(): void {
    this.memory.lastUpdatedAt = new Date().toISOString();
  }
}
