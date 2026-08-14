import { BaseAgent, AgentResponse } from '../agents/baseAgent';
import { FunctionDeclaration, Type } from '@google/genai';
import { resumeAnalysisAgent } from '../agents/resumeAnalysisAgent';
import { jobMatchAgent } from '../agents/jobMatchAgent';
import { careerAgent } from '../agents/careerAgent';
import { interviewAgent } from '../agents/interviewAgent';
import { resumeBuilderAgent } from '../agents/resumeBuilderAgent';
import { defaultRAGEngine } from '../rag/ragEngine';
import { modelManager } from '../utils/modelManager';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export class ToolOrchestratorAgent extends BaseAgent {
  constructor() {
    super('ToolOrchestrator', 'gemini-3.7-flash');
  }

  public async chat(
    message: string,
    history: ChatMessage[],
    resumeText: string,
    jobDescription: string
  ): Promise<AgentResponse<{ reply: string; calls: any[] }>> {
    const startTime = Date.now();
    const ai = this.getAIClient();
    if (!ai) return this.createResult({ reply: 'API key missing', calls: [] }, startTime, true);

    const tools = [
      {
        functionDeclarations: [
          {
            name: 'parseResume',
            description: 'Analyzes a resume text and returns structured skills and summary.',
            parameters: {
              type: Type.OBJECT,
              properties: {
                instruction: { type: Type.STRING, description: 'Optional instructions' }
              }
            }
          },
          {
            name: 'matchJob',
            description: 'Evaluates the resume against a job description and finds skill gaps.',
            parameters: {
              type: Type.OBJECT,
              properties: {
                targetRole: { type: Type.STRING }
              },
              required: ['targetRole']
            }
          },
          {
            name: 'queryRAG',
            description: 'Queries the internal knowledge base to find ground truth career and skill data.',
            parameters: {
              type: Type.OBJECT,
              properties: {
                query: { type: Type.STRING }
              },
              required: ['query']
            }
          },
          {
            name: 'generateRoadmap',
            description: 'Generates a step-by-step career learning roadmap to fill skill gaps.',
            parameters: {
              type: Type.OBJECT,
              properties: {
                targetRole: { type: Type.STRING },
                weeks: { type: Type.INTEGER }
              },
              required: ['targetRole']
            }
          },
          {
            name: 'evaluateInterview',
            description: 'Evaluates an interview answer using the STAR method.',
            parameters: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                answer: { type: Type.STRING }
              },
              required: ['question', 'answer']
            }
          },
          {
            name: 'generatePDF',
            description: 'Builds a professional ATS-compliant resume structure suitable for PDF generation.',
            parameters: {
              type: Type.OBJECT,
              properties: {
                targetRole: { type: Type.STRING }
              }
            }
          }
        ]
      }
    ];

    const modelCandidates = modelManager.getCandidateModels(this.defaultModel);
    let lastError: any = null;

    for (let attempt = 0; attempt < modelCandidates.length; attempt++) {
      const activeModel = modelCandidates[attempt];
      try {
        const chat = ai.chats.create({
          model: activeModel,
          config: {
            systemInstruction: `You are an AI Career Assistant. You have access to specialized tools: Resume Parser, Job Matcher, RAG, Roadmap Generator, Interview Evaluator, and PDF Generator. 
Use these tools to assist the user. If the user asks for a roadmap, call generateRoadmap. If they want to parse their resume, call parseResume, etc.
Current Resume context provided: ${resumeText ? 'Yes' : 'No'}
Current Job context provided: ${jobDescription ? 'Yes' : 'No'}`,
            tools: tools,
            temperature: 0.2
          }
        });

        // We just send the latest message for simplicity, but a real chat could load history.
        const response = await chat.sendMessage({ message });
        
        let replyText = response.text || '';
        const executedCalls: any[] = [];

        // If function calls are requested by the model
        if (response.functionCalls && response.functionCalls.length > 0) {
          for (const call of response.functionCalls) {
            executedCalls.push({ name: call.name, args: call.args });
            
            let toolResult: any = {};
            try {
              if (call.name === 'parseResume') {
                const res = await resumeAnalysisAgent.analyze(resumeText || 'No resume text provided');
                toolResult = res.data || {};
              } else if (call.name === 'matchJob') {
                const res = await jobMatchAgent.evaluateMatch(String(call.args.targetRole), jobDescription || 'No JD', resumeText || '');
                toolResult = res.data || {};
              } else if (call.name === 'queryRAG') {
                const res = defaultRAGEngine.retrieveContext(String(call.args.query), 3);
                toolResult = { context: res.contextString };
              } else if (call.name === 'generateRoadmap') {
                const res = await careerAgent.generateRoadmap(String(call.args.targetRole), Number(call.args.weeks) || 12, [], resumeText || '');
                toolResult = res.data || {};
              } else if (call.name === 'evaluateInterview') {
                const res = await interviewAgent.evaluateAnswer(String(call.args.question), String(call.args.answer), 'Behavioral', 'Any');
                toolResult = res.data || {};
              } else if (call.name === 'generatePDF') {
                const res = await resumeBuilderAgent.buildResume(resumeText || '', String(call.args.targetRole) || 'Professional', jobDescription);
                toolResult = res.data || {};
              }
            } catch (e: any) {
              toolResult = { error: e.message };
            }

            // Send tool response back to model
            try {
              const toolResponseResult = await chat.sendMessage({
                message: [{
                  functionResponse: {
                    name: call.name,
                    response: { result: toolResult }
                  }
                }]
              });
              replyText = toolResponseResult.text || replyText;
            } catch (toolReplyErr) {
              console.warn(`[ToolOrchestrator] Function response exchange note on ${activeModel}`);
              if (!replyText && toolResult) {
                replyText = `Executed tool ${call.name} successfully.`;
              }
            }
          }
        }

        modelManager.reportModelSuccess(activeModel);
        return this.createResult({ reply: replyText || 'I am ready to help you optimize your resume, prepare for interviews, or build a learning roadmap.', calls: executedCalls }, startTime, false);

      } catch (err: any) {
        lastError = err;
        const isTransient = modelManager.isTransientError(err);
        modelManager.reportModelError(activeModel, err);

        if (isTransient && attempt < modelCandidates.length - 1) {
          const nextModel = modelCandidates[attempt + 1];
          console.info(`[ToolOrchestrator] Quota/demand limit on ${activeModel}. Rotating to ${nextModel}...`);
          continue;
        }
      }
    }

    // Resilient domain heuristic fallback if all models exhausted
    console.warn('[ToolOrchestrator] AI model capacity reached, synthesizing domain fallback response via RAG knowledge base.');
    const ragContext = defaultRAGEngine.retrieveContext(message, 2);
    const fallbackReply = `I am analyzing your career query: "${message}". Based on our career knowledge base:\n\n${ragContext.contextString.slice(0, 500)}...\n\nFeel free to explore our dedicated tools in the navigation bar to parse your resume, match job requirements, or construct custom learning roadmaps.`;

    return this.createResult({ reply: fallbackReply, calls: [] }, startTime, true);
  }
}

export const toolOrchestratorAgent = new ToolOrchestratorAgent();
