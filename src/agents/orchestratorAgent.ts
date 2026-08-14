import { BaseAgent, AgentResponse } from './baseAgent';
import { AgentSharedMemory } from '../memory/sharedMemory';
import { resumeAnalysisAgent } from './resumeAnalysisAgent';
import { atsOptimizationAgent } from './atsOptimizationAgent';
import { jobMatchAgent } from './jobMatchAgent';
import { careerAgent } from './careerAgent';
import { interviewAgent } from './interviewAgent';
import { resumeBuilderAgent } from './resumeBuilderAgent';
import { coverLetterAgent } from './coverLetterAgent';
import { learningRoadmapAgent } from './learningRoadmapAgent';

export type OrchestrationIntent =
  | 'FULL_CAREER_SUITE'
  | 'RESUME_OPTIMIZE'
  | 'JOB_MATCH_ANALYSIS'
  | 'CAREER_ROADMAP'
  | 'INTERVIEW_EVAL'
  | 'COVER_LETTER_GEN'
  | 'RESUME_BUILD_GEN'
  | 'LEARNING_ROADMAP_GEN';

export interface OrchestratorRequest {
  intent: OrchestrationIntent;
  resumeText?: string;
  fileName?: string;
  jobTitle?: string;
  companyName?: string;
  jobDescriptionText?: string;
  targetRole?: string;
  interviewQuestion?: string;
  userAnswer?: string;
  category?: string;
  currentSkills?: string[];
}

export interface OrchestratedSuiteResult {
  intent: OrchestrationIntent;
  sharedMemoryContextSummary: {
    hasResumeText: boolean;
    hasJobContext: boolean;
    executedAgents: string[];
  };
  resumeAnalysis?: any;
  atsOptimization?: any;
  jobMatch?: any;
  careerStrategy?: any;
  interviewFeedback?: any;
  generatedCoverLetter?: any;
  builtResume?: any;
  learningRoadmap?: any;
  synthesisSummary: string;
}

export class OrchestratorAgent extends BaseAgent {
  constructor() {
    super('OrchestratorAgent', 'gemini-3.7-flash');
  }

  public async orchestrate(
    request: OrchestratorRequest
  ): Promise<AgentResponse<OrchestratedSuiteResult>> {
    const startTime = Date.now();
    const memory = new AgentSharedMemory();
    const executedAgentNames: string[] = [];

    // Populate initial memory context
    if (request.resumeText) {
      memory.setResumeText(request.resumeText);
    }
    if (request.jobTitle || request.jobDescriptionText) {
      memory.setJobContext(request.jobTitle || 'Target Position', request.jobDescriptionText || '');
    }

    const suiteResult: OrchestratedSuiteResult = {
      intent: request.intent,
      sharedMemoryContextSummary: {
        hasResumeText: Boolean(request.resumeText),
        hasJobContext: Boolean(request.jobDescriptionText),
        executedAgents: [],
      },
      synthesisSummary: '',
    };

    try {
      switch (request.intent) {
        case 'FULL_CAREER_SUITE': {
          // 1. Parse & Analyze Resume
          if (request.resumeText) {
            const resAnalysis = await resumeAnalysisAgent.analyze(
              request.resumeText,
              request.fileName,
              memory
            );
            suiteResult.resumeAnalysis = resAnalysis.data;
            executedAgentNames.push(resAnalysis.meta.agentName);
          }

          // 2. Perform Job Matching if Job Description provided
          if (request.jobDescriptionText) {
            const matchRes = await jobMatchAgent.evaluateMatch(
              request.jobTitle || 'Target Role',
              request.jobDescriptionText,
              request.resumeText || '',
              memory
            );
            suiteResult.jobMatch = matchRes.data;
            executedAgentNames.push(matchRes.meta.agentName);
          }

          // 3. Run ATS Optimization
          if (request.resumeText) {
            const atsRes = await atsOptimizationAgent.optimize(
              request.resumeText,
              request.jobDescriptionText,
              memory
            );
            suiteResult.atsOptimization = atsRes.data;
            executedAgentNames.push(atsRes.meta.agentName);
          }

          // 4. Generate Career Roadmap & Learning Plan (In parallel for maximum speed)
          const [careerRes, learnRes] = await Promise.all([
            careerAgent.generateRoadmap(
              request.targetRole || request.jobTitle || 'AI & Full Stack Engineer',
              12,
              request.currentSkills || (suiteResult.resumeAnalysis?.parsedResume?.skills ?? []),
              request.resumeText || '',
              memory
            ),
            learningRoadmapAgent.generateRoadmap(
              request.targetRole || request.jobTitle || 'AI & Full Stack Engineer',
              suiteResult.jobMatch?.missingSkills || ['Docker', 'PostgreSQL', 'CI/CD'],
              12,
              memory
            )
          ]);

          suiteResult.careerStrategy = careerRes.data;
          suiteResult.learningRoadmap = learnRes.data;
          executedAgentNames.push(careerRes.meta.agentName, learnRes.meta.agentName);

          suiteResult.synthesisSummary = `Successfully executed comprehensive 5-agent career diagnostic suite. Combined ATS formatting audit, job match skill gap analysis, and tailored 12-week technical learning plan.`;
          break;
        }

        case 'RESUME_OPTIMIZE': {
          if (request.resumeText) {
            const [resAnalysis, atsRes] = await Promise.all([
              resumeAnalysisAgent.analyze(request.resumeText, request.fileName, memory),
              atsOptimizationAgent.optimize(request.resumeText, request.jobDescriptionText, memory)
            ]);
            suiteResult.resumeAnalysis = resAnalysis.data;
            suiteResult.atsOptimization = atsRes.data;
            executedAgentNames.push(resAnalysis.meta.agentName, atsRes.meta.agentName);
          }
          suiteResult.synthesisSummary = `Completed ATS optimization audit and structural parsing.`;
          break;
        }

        case 'JOB_MATCH_ANALYSIS': {
          const matchRes = await jobMatchAgent.evaluateMatch(
            request.jobTitle || 'Target Role',
            request.jobDescriptionText || '',
            request.resumeText || '',
            memory
          );
          suiteResult.jobMatch = matchRes.data;
          executedAgentNames.push(matchRes.meta.agentName);
          suiteResult.synthesisSummary = `Completed job description matching and skill gap breakdown.`;
          break;
        }

        case 'COVER_LETTER_GEN': {
          const covRes = await coverLetterAgent.generateCoverLetter(
            request.jobTitle || 'Software Engineer',
            request.companyName || 'Target Company',
            request.jobDescriptionText || '',
            request.resumeText || '',
            'Professional & Confident',
            memory
          );
          suiteResult.generatedCoverLetter = covRes.data;
          executedAgentNames.push(covRes.meta.agentName);
          suiteResult.synthesisSummary = `Generated tailored cover letter matching candidate profile to ${request.companyName || 'target company'}.`;
          break;
        }

        case 'RESUME_BUILD_GEN': {
          const buildRes = await resumeBuilderAgent.buildResume(
            request.resumeText || '',
            request.targetRole || 'Software Engineer',
            request.jobDescriptionText,
            memory
          );
          suiteResult.builtResume = buildRes.data;
          executedAgentNames.push(buildRes.meta.agentName);
          suiteResult.synthesisSummary = `Generated Harvard-style ATS optimized resume content.`;
          break;
        }

        case 'INTERVIEW_EVAL': {
          const intRes = await interviewAgent.evaluateAnswer(
            request.interviewQuestion || 'Tell me about a challenging project',
            request.userAnswer || '',
            (request.category as any) || 'Behavioral',
            request.targetRole || 'Software Engineer'
          );
          suiteResult.interviewFeedback = intRes.data;
          executedAgentNames.push(intRes.meta.agentName);
          suiteResult.synthesisSummary = `Evaluated candidate interview response using STAR framework.`;
          break;
        }

        case 'LEARNING_ROADMAP_GEN': {
          const learnRes = await learningRoadmapAgent.generateRoadmap(
            request.targetRole || 'Software Engineer',
            request.currentSkills || [],
            12,
            memory
          );
          suiteResult.learningRoadmap = learnRes.data;
          executedAgentNames.push(learnRes.meta.agentName);
          suiteResult.synthesisSummary = `Generated step-by-step weekly technical learning roadmap.`;
          break;
        }

        default: {
          suiteResult.synthesisSummary = `Executed general pipeline for intent: ${request.intent}`;
        }
      }

      suiteResult.sharedMemoryContextSummary.executedAgents = executedAgentNames;
      return this.createResult(suiteResult, startTime, false);
    } catch (err: any) {
      console.error(`[OrchestratorAgent] Error executing intent ${request.intent}:`, err);
      return this.createResult(suiteResult, startTime, true, err?.message || 'Orchestration failed');
    }
  }
}

export const orchestratorAgent = new OrchestratorAgent();
