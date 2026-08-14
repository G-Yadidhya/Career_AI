import { BaseAgent, AgentResponse } from './baseAgent';
import { AgentSharedMemory } from '../memory/sharedMemory';
import { AIMemoryProfile } from '../types';

export interface CourseResource {
  title: string;
  provider: string;
  url?: string;
  duration?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface BookResource {
  title: string;
  author: string;
  focusArea: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface VideoResource {
  title: string;
  platform: string;
  channelOrSpeaker: string;
  duration?: string;
  topic: string;
}

export interface CertificationResource {
  name: string;
  issuer: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  prepTimeWeeks?: number;
  careerImpact: string;
}

export interface WeeklyRoadmapStep {
  weekNumber: number;
  title: string;
  phaseName: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  focusTopics: string[];
  weeklyObjectives: string[];
  handsOnProject: {
    title: string;
    description: string;
    techStack: string[];
  };
  recommendedCourses?: CourseResource[];
  recommendedBooks?: BookResource[];
  recommendedVideos?: VideoResource[];
  estimatedHours: number;
}

export interface ProjectIdea {
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  techStack: string[];
  description: string;
  keyFeatures: string[];
  portfolioImpact: string;
}

export interface UpgradedCareerRoadmapResponse {
  targetRole: string;
  timelineWeeks: number;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  resumeMatchScore: number;
  personalizedSummary: string;
  skillGapsToBridge: string[];
  existingStrengths: string[];
  
  weeklyRoadmap: WeeklyRoadmapStep[];
  recommendedProjects: ProjectIdea[];
  courses: CourseResource[];
  books: BookResource[];
  videos: VideoResource[];
  certifications: CertificationResource[];
  
  careerPaths: {
    title: string;
    description: string;
    matchScore: number;
    avgSalaryRange: string;
    growthDemand: string;
  }[];
}

export class CareerAgent extends BaseAgent {
  constructor() {
    super('CareerAgent', 'gemini-3.7-flash');
  }

  public async generateRoadmap(
    targetRole: string,
    timelineWeeks: number = 8,
    currentSkills: string[] = [],
    resumeText: string = '',
    sharedMemory?: AgentSharedMemory,
    memoryProfile?: AIMemoryProfile
  ): Promise<AgentResponse<UpgradedCareerRoadmapResponse>> {
    const startTime = Date.now();
    const roleQuery = targetRole || 'AI & Full Stack Engineer';

    const ragResult = this.ragEngine.retrieveContext(roleQuery, 3);

    const memoryBlock = memoryProfile ? `
CANDIDATE AI MEMORY PROFILE & LEARNING PROGRESS:
- Previously Mastered Skills: ${memoryProfile.learningProgress.masteredSkills.join(', ') || 'N/A'}
- Completed Learning Milestones: Weeks ${memoryProfile.learningProgress.completedWeekNumbers.join(', ') || 'None yet'}
- Ongoing Career Goals: ${memoryProfile.careerGoals.primaryTargetRole || roleQuery}
- Identified Skill Gaps to Focus On: ${memoryProfile.careerGoals.keySkillsToDevelop.join(', ') || 'N/A'}
(Ensure roadmap builds on top of candidate's already mastered skills without duplicating completed elementary topics.)` : '';

    const prompt = `You are a Principal Curriculum Architect, Senior CTO, and Tech Career Strategist.
Construct a highly personalized, weekly step-by-step career acceleration roadmap for a candidate aiming to become a "${roleQuery}" over a ${timelineWeeks}-week timeline.
${memoryBlock}

Ground Truth Reference Context:
${ragResult.contextString}

Candidate Known Skills:
${currentSkills.length > 0 ? currentSkills.join(', ') : 'JavaScript, React, Node.js, HTML, CSS, Git'}

Candidate Resume / Background Text:
${resumeText ? resumeText.slice(0, 2000) : 'Not provided - base evaluation on provided skills.'}

INSTRUCTIONS:
1. Conduct a skill-gap analysis comparing candidate background/resume against "${roleQuery}" industry requirements.
2. Identify existing strengths and key skill gaps to bridge.
3. Build a detailed WEEK-BY-WEEK roadmap (${timelineWeeks} weeks total).
4. Provide dedicated lists for:
   - Hands-on Projects (3+ portfolio project specs)
   - Online Courses (3+ curated courses with provider and difficulty)
   - Books (3+ essential industry books with author and focus area)
   - Videos / Talks (3+ video lectures or tech conference talks)
   - Industry Certifications (2+ certifications with issuer and difficulty)

Return a valid JSON object matching EXACTLY this JSON schema:
{
  "targetRole": "${roleQuery}",
  "timelineWeeks": ${timelineWeeks},
  "difficultyLevel": "Intermediate",
  "resumeMatchScore": 78,
  "personalizedSummary": "Clear 2-sentence summary of candidate baseline and roadmap goal.",
  "skillGapsToBridge": ["Docker Containerization", "PostgreSQL Query Optimization", "Vector RAG Embeddings"],
  "existingStrengths": ["React 19 Frontend Development", "TypeScript Type Systems", "RESTful API Integration"],
  "weeklyRoadmap": [
    {
      "weekNumber": 1,
      "title": "Advanced TypeScript Architecture & Async Streams",
      "phaseName": "Phase 1: Advanced Core Engineering",
      "difficulty": "Intermediate",
      "focusTopics": ["Generics Constraints", "Discriminated Unions", "Async Event Loops"],
      "weeklyObjectives": [
        "Master strict TypeScript type inference across Express API routes",
        "Implement custom middleware for request validation"
      ],
      "handsOnProject": {
        "title": "Type-Safe REST Middleware Engine",
        "description": "Build an open-source middleware package enforcing runtime zod schema validation.",
        "techStack": ["TypeScript", "Node.js", "Express", "Zod"]
      },
      "estimatedHours": 10
    }
  ],
  "recommendedProjects": [
    {
      "title": "Production GenAI & Vector RAG Platform",
      "difficulty": "Advanced",
      "techStack": ["React 19", "TypeScript", "Express", "ChromaDB", "Gemini 3.6 API"],
      "description": "Full-stack vector indexing application with semantic search and Cloud Run containerization.",
      "keyFeatures": ["Dense vector embeddings", "Multi-file document chunking", "Streaming LLM responses"],
      "portfolioImpact": "Very High"
    }
  ],
  "courses": [
    {
      "title": "Full Stack Open: Modern Web Development",
      "provider": "University of Helsinki",
      "duration": "40 hours",
      "difficulty": "Intermediate"
    },
    {
      "title": "PostgreSQL High Performance Architecture",
      "provider": "Udemy",
      "duration": "18 hours",
      "difficulty": "Advanced"
    }
  ],
  "books": [
    {
      "title": "Designing Data-Intensive Applications",
      "author": "Martin Kleppmann",
      "focusArea": "Distributed Systems & Storage Engines",
      "difficulty": "Advanced"
    },
    {
      "title": "Clean Code & System Architecture",
      "author": "Robert C. Martin",
      "focusArea": "Software Design Patterns",
      "difficulty": "Intermediate"
    }
  ],
  "videos": [
    {
      "title": "Building Production Vector Search Engines",
      "platform": "YouTube",
      "channelOrSpeaker": "GOTO Conferences",
      "duration": "45 mins",
      "topic": "Vector Databases & Dense Retrieval"
    },
    {
      "title": "React 19 Compiler & Server Components Deep Dive",
      "platform": "YouTube",
      "channelOrSpeaker": "Vercel / React Core Team",
      "duration": "50 mins",
      "topic": "Frontend Optimization & React Internals"
    }
  ],
  "certifications": [
    {
      "name": "Google Cloud Certified Professional Cloud Architect",
      "issuer": "Google Cloud Platform",
      "difficulty": "Advanced",
      "prepTimeWeeks": 6,
      "careerImpact": "Top 5 highest paying cloud certification globally"
    },
    {
      "name": "AWS Certified Developer - Associate",
      "issuer": "Amazon Web Services",
      "difficulty": "Intermediate",
      "prepTimeWeeks": 4,
      "careerImpact": "Industry standard credential for backend cloud developers"
    }
  ],
  "careerPaths": [
    {
      "title": "${roleQuery}",
      "description": "Primary goal role with strong growth trajectory in cloud & AI ecosystems.",
      "matchScore": 88,
      "avgSalaryRange": "$125,000 - $175,000",
      "growthDemand": "High Demand (+28% YoY)"
    }
  ]
}`;

    const apiResponse = await this.callGeminiWithRetry((ai, model) =>
      ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      })
    );

    const parsedData = this.parseStructuredJSON<UpgradedCareerRoadmapResponse>(apiResponse?.text);

    if (parsedData && Array.isArray(parsedData.weeklyRoadmap) && parsedData.weeklyRoadmap.length > 0) {
      if (sharedMemory) {
        sharedMemory.saveAgentOutput(this.name, parsedData);
      }
      return this.createResult(parsedData, startTime, false);
    }

    const fallback = this.getFallbackRoadmap(roleQuery, timelineWeeks, currentSkills);
    if (sharedMemory) {
      sharedMemory.saveAgentOutput(this.name, fallback);
    }
    return this.createResult(fallback, startTime, true);
  }

  private getFallbackRoadmap(targetRole: string, timelineWeeks: number, currentSkills: string[]): UpgradedCareerRoadmapResponse {
    const weeksCount = Math.max(4, Math.min(24, timelineWeeks || 8));
    const weeklyModules: WeeklyRoadmapStep[] = [];

    const sampleTopics = [
      {
        title: 'Advanced TypeScript & Component Architecture',
        phaseName: 'Phase 1: Core Foundation',
        difficulty: 'Intermediate' as const,
        focusTopics: ['Generics', 'Discriminated Unions', 'Component State Hygiene'],
        weeklyObjectives: [
          'Master strict TypeScript interfaces across frontend components',
          'Build reusable custom hooks for API state management'
        ],
        handsOnProject: {
          title: 'Typed Form & State Library',
          description: 'Custom React form engine with zero external dependencies.',
          techStack: ['React 19', 'TypeScript', 'Tailwind CSS']
        },
        hours: 10
      },
      {
        title: 'Backend Microservices & REST API Proxying',
        phaseName: 'Phase 1: Core Foundation',
        difficulty: 'Intermediate' as const,
        focusTopics: ['Express Router', 'Async Handler Middleware', 'Rate Limiting'],
        weeklyObjectives: [
          'Architect secure server-side Express API routes',
          'Implement process.env secret isolation for third-party keys'
        ],
        handsOnProject: {
          title: 'Secure Express Gateway',
          description: 'API proxy server with JWT authentication and redis rate limiting.',
          techStack: ['Node.js', 'Express', 'Redis', 'TypeScript']
        },
        hours: 12
      },
      {
        title: 'Relational Database Design with PostgreSQL & Drizzle',
        phaseName: 'Phase 2: Database & Systems',
        difficulty: 'Advanced' as const,
        focusTopics: ['Schema Normalization', 'Index Execution Plans', 'Connection Pooling'],
        weeklyObjectives: [
          'Write Drizzle ORM migrations and query builders',
          'Optimize database join operations and foreign key cascades'
        ],
        handsOnProject: {
          title: 'E-Commerce Schema & Query Benchmark',
          description: 'High-throughput database service managing 50k transactions/sec.',
          techStack: ['PostgreSQL', 'Drizzle ORM', 'TypeScript']
        },
        hours: 12
      },
      {
        title: 'Docker Containerization & Multi-Service Compose',
        phaseName: 'Phase 2: Database & Systems',
        difficulty: 'Intermediate' as const,
        focusTopics: ['Multi-stage Dockerfiles', 'Docker Compose Networking', 'Volume Persist'],
        weeklyObjectives: [
          'Containerize Node backend and static Vite frontend assets',
          'Configure docker-compose for local development parity'
        ],
        handsOnProject: {
          title: 'Containerized Stack Blueprint',
          description: 'Multi-container web architecture with automated health checks.',
          techStack: ['Docker', 'Docker Compose', 'Nginx', 'Node.js']
        },
        hours: 10
      },
      {
        title: 'Vector Databases, RAG Indexing & Gemini API',
        phaseName: 'Phase 3: GenAI Engineering',
        difficulty: 'Advanced' as const,
        focusTopics: ['Vector Embeddings', 'ChromaDB Indexing', 'Cosine Similarity Search'],
        weeklyObjectives: [
          'Build document chunking pipeline for dense semantic retrieval',
          'Integrate Gemini 3.6 API with streaming RAG context'
        ],
        handsOnProject: {
          title: 'AI Vector RAG Document Search',
          description: 'Semantic PDF search engine using ChromaDB and Gemini embeddings.',
          techStack: ['ChromaDB', 'Gemini API', 'TypeScript', 'Express']
        },
        hours: 15
      },
      {
        title: 'Cloud Run Deployment, CI/CD & Production Operations',
        phaseName: 'Phase 3: GenAI Engineering',
        difficulty: 'Advanced' as const,
        focusTopics: ['Google Cloud Run', 'GitHub Actions CI/CD', 'Production Monitoring'],
        weeklyObjectives: [
          'Set up automated GitHub Actions workflow for linting and building',
          'Deploy containerized full-stack application to Cloud Run'
        ],
        handsOnProject: {
          title: 'Production Production Cloud Deployment',
          description: 'Automated CI/CD pipeline deploying web application to Cloud Run.',
          techStack: ['Google Cloud Run', 'GitHub Actions', 'Docker']
        },
        hours: 12
      }
    ];

    for (let i = 0; i < weeksCount; i++) {
      const topicItem = sampleTopics[i % sampleTopics.length];
      weeklyModules.push({
        weekNumber: i + 1,
        title: `Week ${i + 1}: ${topicItem.title}`,
        phaseName: topicItem.phaseName,
        difficulty: topicItem.difficulty,
        focusTopics: topicItem.focusTopics,
        weeklyObjectives: topicItem.weeklyObjectives,
        handsOnProject: topicItem.handsOnProject,
        estimatedHours: topicItem.hours
      });
    }

    return {
      targetRole: targetRole || 'AI & Full Stack Engineer',
      timelineWeeks: weeksCount,
      difficultyLevel: 'Intermediate',
      resumeMatchScore: 82,
      personalizedSummary: `Accelerated ${weeksCount}-week learning roadmap tailored for ${targetRole}, designed to bridge critical skill gaps in backend architecture, relational databases, and cloud deployment.`,
      skillGapsToBridge: ['PostgreSQL Schema Design', 'Docker Containerization', 'Vector RAG Indexing'],
      existingStrengths: currentSkills.length > 0 ? currentSkills : ['React 19', 'TypeScript', 'REST APIs'],
      weeklyRoadmap: weeklyModules,
      recommendedProjects: [
        {
          title: 'Production GenAI Vector RAG Application',
          difficulty: 'Advanced',
          techStack: ['React 19', 'TypeScript', 'Express', 'ChromaDB', 'Gemini 3.6 API'],
          description: 'Full-stack document vector search engine with automated context retrieval.',
          keyFeatures: ['Vector semantic search', 'Streaming response hydration', 'Containerized Cloud deployment'],
          portfolioImpact: 'Very High'
        },
        {
          title: 'High-Throughput Microservice Gateway',
          difficulty: 'Intermediate',
          techStack: ['Go / Node.js', 'Redis', 'PostgreSQL', 'Docker'],
          description: 'Rate-limited microservice gateway supporting 10k requests/sec.',
          keyFeatures: ['JWT Auth', 'Redis Rate Limiter', 'PostgreSQL Connection Pooling'],
          portfolioImpact: 'High'
        }
      ],
      courses: [
        {
          title: 'Full Stack Open: Modern Web Development',
          provider: 'University of Helsinki',
          duration: '40 hours',
          difficulty: 'Intermediate'
        },
        {
          title: 'PostgreSQL High Performance Architecture',
          provider: 'Udemy / Coursera',
          duration: '20 hours',
          difficulty: 'Advanced'
        },
        {
          title: 'Docker & Kubernetes Fundamentals',
          provider: 'Pluralsight',
          duration: '15 hours',
          difficulty: 'Intermediate'
        }
      ],
      books: [
        {
          title: 'Designing Data-Intensive Applications',
          author: 'Martin Kleppmann',
          focusArea: 'Distributed Databases, Replication & Consensus',
          difficulty: 'Advanced'
        },
        {
          title: 'Refactoring: Improving the Design of Existing Code',
          author: 'Martin Fowler',
          focusArea: 'Clean Architecture & Code Design',
          difficulty: 'Intermediate'
        },
        {
          title: 'System Design Interview – An Insider\'s Guide',
          author: 'Alex Xu',
          focusArea: 'Scalable Systems & High Availability',
          difficulty: 'Intermediate'
        }
      ],
      videos: [
        {
          title: 'Building Scalable RAG Pipelines with Gemini & ChromaDB',
          platform: 'YouTube / TechTalks',
          channelOrSpeaker: 'Google Cloud Tech',
          duration: '45 mins',
          topic: 'Generative AI & Vector Search'
        },
        {
          title: 'PostgreSQL Indexing & Query Execution Plans',
          platform: 'YouTube',
          channelOrSpeaker: 'Hussein Nasser',
          duration: '35 mins',
          topic: 'Database Performance Optimization'
        },
        {
          title: 'Docker Multi-Stage Builds & Container Security',
          platform: 'YouTube',
          channelOrSpeaker: 'TechWorld with Nana',
          duration: '30 mins',
          topic: 'DevOps & Containerization'
        }
      ],
      certifications: [
        {
          name: 'Google Cloud Certified Professional Cloud Architect',
          issuer: 'Google Cloud',
          difficulty: 'Advanced',
          prepTimeWeeks: 6,
          careerImpact: 'Top industry credential for cloud architecture'
        },
        {
          name: 'AWS Certified Solutions Architect – Associate',
          issuer: 'Amazon Web Services',
          difficulty: 'Intermediate',
          prepTimeWeeks: 4,
          careerImpact: 'Globally recognized backend & cloud certification'
        }
      ],
      careerPaths: [
        {
          title: targetRole || 'AI & Full Stack Engineer',
          description: 'Primary target role with continuous industry demand and competitive compensation.',
          matchScore: 88,
          avgSalaryRange: '$125,000 - $175,000',
          growthDemand: 'Very High (+28% YoY)'
        }
      ]
    };
  }
}

export const careerAgent = new CareerAgent();

