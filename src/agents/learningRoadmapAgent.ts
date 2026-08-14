import { BaseAgent, AgentResponse } from './baseAgent';
import { AgentSharedMemory } from '../memory/sharedMemory';

export interface WeeklyLearningModule {
  weekNumber: number;
  topic: string;
  keyConcepts: string[];
  handsOnProject: string;
  recommendedResources: {
    title: string;
    type: 'Course' | 'Documentation' | 'Book' | 'Practice';
    url?: string;
  }[];
  estimatedHours: number;
}

export interface LearningRoadmapResult {
  targetRole: string;
  timeframeWeeks: number;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites: string[];
  weeklyModules: WeeklyLearningModule[];
  capstoneProject: {
    title: string;
    description: string;
    techStack: string[];
    portfolioImpact: string;
  };
}

export class LearningRoadmapAgent extends BaseAgent {
  constructor() {
    super('LearningRoadmapAgent', 'gemini-3.7-flash');
  }

  public async generateRoadmap(
    targetRole: string,
    missingSkills: string[] = [],
    timeframeWeeks: number = 12,
    sharedMemory?: AgentSharedMemory
  ): Promise<AgentResponse<LearningRoadmapResult>> {
    const startTime = Date.now();

    const ragResult = this.ragEngine.retrieveContext(`${targetRole} ${missingSkills.join(' ')}`, 3);

    const prompt = `You are a Principal Curriculum Director and Tech Education Architect.
Construct a step-by-step weekly technical learning roadmap to rapidly master required skill gaps for "${targetRole}".

Ground Truth Curriculum Reference:
${ragResult.contextString}

Target Role: ${targetRole}
Target Missing Skills to Master:
${missingSkills.length > 0 ? missingSkills.join(', ') : 'Docker, Kubernetes, PostgreSQL, Gemini Vector RAG, System Design'}
Timeframe Weeks: ${timeframeWeeks}

Return a valid JSON object matching EXACTLY this structure:
{
  "targetRole": "${targetRole}",
  "timeframeWeeks": ${timeframeWeeks},
  "skillLevel": "Intermediate",
  "prerequisites": ["HTML/CSS", "JavaScript/TypeScript Fundamentals", "Git"],
  "weeklyModules": [
    {
      "weekNumber": 1,
      "topic": "Advanced TypeScript Generics & Async Architecture",
      "keyConcepts": ["Utility Types", "Generics Constraints", "Async/Await Event Loops"],
      "handsOnProject": "Build a custom strongly-typed HTTP request middleware library.",
      "recommendedResources": [
        {"title": "TypeScript Handbook & Deep Dive", "type": "Documentation"},
        {"title": "Advanced TypeScript Masterclass", "type": "Course"}
      ],
      "estimatedHours": 10
    },
    {
      "weekNumber": 2,
      "topic": "Relational Database Design with PostgreSQL & Drizzle",
      "keyConcepts": ["Schema Normalization", "Indexes & Execution Plans", "Connection Pooling"],
      "handsOnProject": "Design e-commerce schema with indexed search.",
      "recommendedResources": [
        {"title": "PostgreSQL High Performance", "type": "Book"}
      ],
      "estimatedHours": 12
    }
  ],
  "capstoneProject": {
    "title": "Production GenAI & Vector RAG Platform",
    "description": "Full stack vector index app built with React 19, Express, ChromaDB, and Cloud Run.",
    "techStack": ["React 19", "TypeScript", "Express", "ChromaDB", "Gemini API"],
    "portfolioImpact": "High - Demonstrates production AI engineering capabilities."
  }
}`;

    const apiResponse = await this.callGeminiWithRetry((ai, model) =>
      ai.models.generateContent({
        model: model,
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      })
    );

    const parsed = this.parseStructuredJSON<LearningRoadmapResult>(apiResponse?.text);

    if (parsed && Array.isArray(parsed.weeklyModules) && parsed.weeklyModules.length > 0) {
      if (sharedMemory) {
        sharedMemory.saveAgentOutput(this.name, parsed);
      }
      return this.createResult(parsed, startTime, false);
    }

    const fallback: LearningRoadmapResult = {
      targetRole: targetRole || 'Full Stack AI Engineer',
      timeframeWeeks,
      skillLevel: 'Intermediate',
      prerequisites: ['TypeScript', 'React', 'Node.js Basics'],
      weeklyModules: [
        {
          weekNumber: 1,
          topic: 'Advanced TypeScript & Component Patterns',
          keyConcepts: ['Generics', 'Discriminated Unions', 'State Management'],
          handsOnProject: 'Build a typed state store component library.',
          recommendedResources: [{ title: 'TypeScript Deep Dive', type: 'Documentation' }],
          estimatedHours: 8
        },
        {
          weekNumber: 2,
          topic: 'Backend REST APIs & PostgreSQL Architecture',
          keyConcepts: ['Express Middleware', 'PostgreSQL Indexes', 'ORMs'],
          handsOnProject: 'Build relational database proxy service.',
          recommendedResources: [{ title: 'PostgreSQL Mastery', type: 'Course' }],
          estimatedHours: 10
        },
        {
          weekNumber: 3,
          topic: 'Docker Containerization & Cloud Deployment',
          keyConcepts: ['Dockerfile Syntax', 'Multi-stage Builds', 'Cloud Run'],
          handsOnProject: 'Containerize and deploy full stack app.',
          recommendedResources: [{ title: 'Docker Official Docs', type: 'Documentation' }],
          estimatedHours: 10
        }
      ],
      capstoneProject: {
        title: 'Full Stack Vector RAG Application',
        description: 'End-to-end vector search application with Gemini integration and deployment.',
        techStack: ['React', 'TypeScript', 'Express', 'Gemini API', 'Docker'],
        portfolioImpact: 'Very High'
      }
    };

    if (sharedMemory) {
      sharedMemory.saveAgentOutput(this.name, fallback);
    }
    return this.createResult(fallback, startTime, true);
  }
}

export const learningRoadmapAgent = new LearningRoadmapAgent();
