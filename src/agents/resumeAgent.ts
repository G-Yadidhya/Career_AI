import { BaseAgent, AgentResponse } from './baseAgent';
import { ResumeAnalysis } from '../types';
import { resumeAnalysisAgent } from './resumeAnalysisAgent';

export class ResumeAgent extends BaseAgent {
  constructor() {
    super('ResumeAgent', 'gemini-3.7-flash');
  }

  public async analyzeResume(
    resumeText: string,
    fileName?: string
  ): Promise<AgentResponse<ResumeAnalysis>> {
    return resumeAnalysisAgent.analyze(resumeText, fileName);
  }
}

export const resumeAgent = new ResumeAgent();
