import { BaseAgent, AgentResponse } from './baseAgent';
import { AgentSharedMemory } from '../memory/sharedMemory';

export interface AtsOptimizationResult {
  overallAtsScore: number;
  keywordDensityScore: number;
  formattingComplianceScore: number;
  quantifiedBulletRatio: number;
  highImpactBulletRewrites: Array<{
    originalBullet: string;
    rewrittenBullet: string;
    impactGain: string;
    addedKeywords: string[];
  }>;
  criticalMissingKeywords: string[];
  suggestedSectionHeaders: string[];
  formattingRulesToFix: string[];
}

export class AtsOptimizationAgent extends BaseAgent {
  constructor() {
    super('AtsOptimizationAgent', 'gemini-3.7-flash');
  }

  public async optimize(
    resumeText: string,
    targetJobDescription?: string,
    sharedMemory?: AgentSharedMemory
  ): Promise<AgentResponse<AtsOptimizationResult>> {
    const startTime = Date.now();

    const ragResult = this.ragEngine.retrieveContext(resumeText + ' ' + (targetJobDescription || ''), 3);

    const prompt = `You are a FAANG ATS Optimization Specialist and Resume Engineering Auditor.
Analyze the resume and target job description to produce high-impact ATS optimization recommendations.

Ground Truth Reference Context:
${ragResult.contextString}

Resume Text:
${resumeText}

Target Job Description (if available):
${targetJobDescription || 'Standard Software Engineer position requiring full-stack web skills, clean architecture, and cloud deployment.'}

Return a valid JSON object matching EXACTLY this schema:
{
  "overallAtsScore": 88,
  "keywordDensityScore": 85,
  "formattingComplianceScore": 92,
  "quantifiedBulletRatio": 65,
  "highImpactBulletRewrites": [
    {
      "originalBullet": "Built front end components with React.",
      "rewrittenBullet": "Spearheaded responsive UI component library with React 19 and TypeScript, accelerating feature build velocity by 35%.",
      "impactGain": "Added action verb 'Spearheaded' and 35% quantifiable velocity metric.",
      "addedKeywords": ["React 19", "TypeScript", "UI Component Library"]
    }
  ],
  "criticalMissingKeywords": ["Docker", "Kubernetes", "PostgreSQL", "CI/CD"],
  "suggestedSectionHeaders": ["PROFESSIONAL SUMMARY", "TECHNICAL SKILLS", "WORK EXPERIENCE", "PROJECTS", "EDUCATION"],
  "formattingRulesToFix": [
    "Ensure standard 1-inch margins on all sides",
    "Replace graphic skill progress bars with explicit text skill lists"
  ]
}`;

    const apiResponse = await this.callGeminiWithRetry((ai, model) =>
      ai.models.generateContent({
        model: model,
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      })
    );

    const parsed = this.parseStructuredJSON<AtsOptimizationResult>(apiResponse?.text);

    if (parsed && typeof parsed.overallAtsScore === 'number') {
      if (sharedMemory) {
        sharedMemory.saveAgentOutput(this.name, parsed);
      }
      return this.createResult(parsed, startTime, false);
    }

    const fallback: AtsOptimizationResult = {
      overallAtsScore: 84,
      keywordDensityScore: 82,
      formattingComplianceScore: 90,
      quantifiedBulletRatio: 60,
      highImpactBulletRewrites: [
        {
          originalBullet: 'Responsible for managing database queries and Express endpoints.',
          rewrittenBullet: 'Engineered high-throughput REST API endpoints in Express and Node.js, reducing database query latency by 28%.',
          impactGain: 'Replaced passive phrasing with active verb "Engineered" and 28% metric.',
          addedKeywords: ['Node.js', 'Express', 'REST API', 'Database Optimization']
        }
      ],
      criticalMissingKeywords: ['Docker', 'PostgreSQL', 'CI/CD Pipelines'],
      suggestedSectionHeaders: ['TECHNICAL SUMMARY', 'CORE COMPETENCIES', 'WORK EXPERIENCE', 'PROJECTS'],
      formattingRulesToFix: [
        'Avoid multi-column tables that break ATS parser linear reading flows',
        'Use standard font choices (Inter, Arial, Calibri)'
      ]
    };

    if (sharedMemory) {
      sharedMemory.saveAgentOutput(this.name, fallback);
    }
    return this.createResult(fallback, startTime, true);
  }
}

export const atsOptimizationAgent = new AtsOptimizationAgent();
