import { AIMemoryProfile, MemoryResumeRecord, MemoryInterviewRecord, MemoryFeedbackRecord } from '../types';

// In-memory persistent AI Memory store keyed by userId (defaults to 'default-user')
class UserMemoryStore {
  private store: Map<string, AIMemoryProfile> = new Map();

  constructor() {
    // Seed initial lightweight default memory profile
    const defaultProfile: AIMemoryProfile = {
      userId: 'default-user',
      lastUpdated: new Date().toISOString(),
      pastResumes: [
        {
          id: 'res-init-1',
          title: 'Full Stack & AI Engineer Resume v1',
          uploadDate: new Date(Date.now() - 86400000 * 3).toISOString(),
          topSkills: ['React 19', 'TypeScript', 'Express', 'Node.js', 'REST APIs'],
          summary: 'Full stack developer with 3+ years experience building web applications.',
          atsScoreSnapshot: 78,
          targetRole: 'AI & Full Stack Engineer'
        }
      ],
      careerGoals: {
        id: 'goal-1',
        primaryTargetRole: 'AI & Full Stack Engineer',
        targetSalary: '$130,000 - $160,000',
        targetTimelineWeeks: 8,
        preferredIndustries: ['AI & Machine Learning', 'Cloud SaaS', 'Fintech'],
        keySkillsToDevelop: ['PostgreSQL Schema Design', 'Docker Containerization', 'Vector RAG Indexing'],
        updatedAt: new Date().toISOString()
      },
      interviewHistory: [
        {
          id: 'int-init-1',
          date: new Date(Date.now() - 86400000 * 2).toISOString(),
          role: 'Full Stack Developer',
          totalQuestions: 5,
          overallScore: 82,
          strengths: ['Clear technical articulation of React state', 'Good problem decomposition'],
          weaknesses: ['Needs more quantified metrics in STAR situation results'],
          topSTARFeedback: 'Structure answers with explicit Situation, Task, Action, and Result (quantify performance gains).'
        }
      ],
      previousFeedback: [
        {
          id: 'fb-init-1',
          date: new Date(Date.now() - 86400000 * 2).toISOString(),
          category: 'resume',
          title: 'ATS Keyword Density Audit',
          summary: 'Increase keyword density for PostgreSQL, Docker, and Gemini API integration.',
          actionItems: [
            'Add quantitative metrics to experience bullet points',
            'Include cloud deployment technologies in skills summary'
          ]
        },
        {
          id: 'fb-init-2',
          date: new Date(Date.now() - 86400000 * 1).toISOString(),
          category: 'interview',
          title: 'STAR Answer Coaching',
          summary: 'Quantify impact in the Result phase of behavioural questions.',
          actionItems: ['State percentage latency reduction or user growth numbers']
        }
      ],
      learningProgress: {
        completedWeekNumbers: [1, 2],
        masteredSkills: ['React 19', 'TypeScript', 'Express Router', 'REST APIs'],
        completedProjects: ['Type-Safe REST Middleware Engine', 'Secure Express Gateway'],
        overallProgressPct: 25,
        lastActiveDate: new Date().toISOString()
      }
    };

    this.store.set('default-user', defaultProfile);
  }

  public getMemory(userId: string = 'default-user'): AIMemoryProfile {
    if (!this.store.has(userId)) {
      const newProfile: AIMemoryProfile = {
        userId,
        lastUpdated: new Date().toISOString(),
        pastResumes: [],
        careerGoals: {
          id: `goal-${Date.now()}`,
          primaryTargetRole: 'Full Stack Engineer',
          targetTimelineWeeks: 8,
          keySkillsToDevelop: [],
          updatedAt: new Date().toISOString()
        },
        interviewHistory: [],
        previousFeedback: [],
        learningProgress: {
          completedWeekNumbers: [],
          masteredSkills: [],
          completedProjects: [],
          overallProgressPct: 0,
          lastActiveDate: new Date().toISOString()
        }
      };
      this.store.set(userId, newProfile);
    }
    return this.store.get(userId)!;
  }

  public updateMemory(userId: string = 'default-user', update: Partial<AIMemoryProfile>): AIMemoryProfile {
    const current = this.getMemory(userId);
    const updated: AIMemoryProfile = {
      ...current,
      ...update,
      lastUpdated: new Date().toISOString()
    };
    this.store.set(userId, updated);
    return updated;
  }

  public addResumeRecord(userId: string = 'default-user', record: Omit<MemoryResumeRecord, 'id' | 'uploadDate'>): MemoryResumeRecord {
    const profile = this.getMemory(userId);
    const newRecord: MemoryResumeRecord = {
      id: `res-${Date.now()}`,
      uploadDate: new Date().toISOString(),
      ...record
    };
    // Keep max 5 most recent past resumes to avoid storing unnecessary data
    profile.pastResumes = [newRecord, ...profile.pastResumes.filter(r => r.title !== record.title)].slice(0, 5);
    profile.lastUpdated = new Date().toISOString();
    return newRecord;
  }

  public updateCareerGoals(userId: string = 'default-user', goals: Partial<AIMemoryProfile['careerGoals']>): AIMemoryProfile['careerGoals'] {
    const profile = this.getMemory(userId);
    profile.careerGoals = {
      ...profile.careerGoals,
      ...goals,
      updatedAt: new Date().toISOString()
    };
    profile.lastUpdated = new Date().toISOString();
    return profile.careerGoals;
  }

  public addInterviewRecord(userId: string = 'default-user', record: Omit<MemoryInterviewRecord, 'id' | 'date'>): MemoryInterviewRecord {
    const profile = this.getMemory(userId);
    const newRecord: MemoryInterviewRecord = {
      id: `int-${Date.now()}`,
      date: new Date().toISOString(),
      ...record
    };
    // Keep max 10 interview records
    profile.interviewHistory = [newRecord, ...profile.interviewHistory].slice(0, 10);
    profile.lastUpdated = new Date().toISOString();
    return newRecord;
  }

  public addFeedbackRecord(userId: string = 'default-user', record: Omit<MemoryFeedbackRecord, 'id' | 'date'>): MemoryFeedbackRecord {
    const profile = this.getMemory(userId);
    const newRecord: MemoryFeedbackRecord = {
      id: `fb-${Date.now()}`,
      date: new Date().toISOString(),
      ...record
    };
    // Keep max 10 feedback records
    profile.previousFeedback = [newRecord, ...profile.previousFeedback].slice(0, 10);
    profile.lastUpdated = new Date().toISOString();
    return newRecord;
  }

  public updateLearningProgress(userId: string = 'default-user', progress: Partial<AIMemoryProfile['learningProgress']>): AIMemoryProfile['learningProgress'] {
    const profile = this.getMemory(userId);
    profile.learningProgress = {
      ...profile.learningProgress,
      ...progress,
      lastActiveDate: new Date().toISOString()
    };
    profile.lastUpdated = new Date().toISOString();
    return profile.learningProgress;
  }

  public removeMemoryItem(userId: string = 'default-user', category: 'pastResumes' | 'interviewHistory' | 'previousFeedback', itemId: string): AIMemoryProfile {
    const profile = this.getMemory(userId);
    if (category === 'pastResumes') {
      profile.pastResumes = profile.pastResumes.filter(item => item.id !== itemId);
    } else if (category === 'interviewHistory') {
      profile.interviewHistory = profile.interviewHistory.filter(item => item.id !== itemId);
    } else if (category === 'previousFeedback') {
      profile.previousFeedback = profile.previousFeedback.filter(item => item.id !== itemId);
    }
    profile.lastUpdated = new Date().toISOString();
    return profile;
  }

  public clearMemory(userId: string = 'default-user'): AIMemoryProfile {
    const emptyProfile: AIMemoryProfile = {
      userId,
      lastUpdated: new Date().toISOString(),
      pastResumes: [],
      careerGoals: {
        id: `goal-${Date.now()}`,
        primaryTargetRole: 'Software Engineer',
        targetTimelineWeeks: 8,
        keySkillsToDevelop: [],
        updatedAt: new Date().toISOString()
      },
      interviewHistory: [],
      previousFeedback: [],
      learningProgress: {
        completedWeekNumbers: [],
        masteredSkills: [],
        completedProjects: [],
        overallProgressPct: 0,
        lastActiveDate: new Date().toISOString()
      }
    };
    this.store.set(userId, emptyProfile);
    return emptyProfile;
  }
}

export const userMemoryStore = new UserMemoryStore();
