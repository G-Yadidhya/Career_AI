import {
  AIMemoryProfile,
  CareerRoadmap,
  CoverLetterResult,
  GeneratedResumeData,
  InterviewSession,
  JobMatchResult,
  QuestionItem,
  RAGSource,
  ResumeAnalysis,
  User,
  WritingStyleType,
} from '../types';

const API_BASE = '/api';

export const api = {
  // Agent Chat (Tool Calling)
  agentChat: async (message: string, history: any[] = [], resumeText: string = '', jobDescription: string = '') => {
    const res = await fetch(`${API_BASE}/agent/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, resumeText, jobDescription }),
    });
    if (!res.ok) {
      throw new Error('Failed to fetch chat response');
    }
    return res.json() as Promise<{ reply: string; calls: any[] }>;
  },
  // Auth
  async login(email: string, password: string, role?: string): Promise<{ token: string; user: User }> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API connection offline, using fallback login logic');
    }
    // Fallback
    const assignedRole = role === 'admin' || email.includes('admin') ? 'admin' : 'user';
    const name = email.split('@')[0] || 'User';
    return {
      token: `token-${Date.now()}`,
      user: {
        id: `u-${Date.now()}`,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email,
        role: assignedRole,
        targetRole: 'AI & Full Stack Engineer',
        experienceLevel: 'Entry Level',
        createdAt: new Date().toISOString(),
      },
    };
  },

  async register(name: string, email: string, password: string, role?: string, targetRole?: string): Promise<{ token: string; user: User }> {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, targetRole }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API offline, using fallback register');
    }
    return {
      token: `token-${Date.now()}`,
      user: {
        id: `u-${Date.now()}`,
        name,
        email,
        role: (role as any) || 'user',
        targetRole: targetRole || 'Software Engineer',
        experienceLevel: 'Entry Level',
        createdAt: new Date().toISOString(),
      },
    };
  },

  // Resume File Text Extraction & Parsing
  async parseResumeFile(file: File): Promise<{ success: boolean; fileName: string; extractedText: string; characterCount: number }> {
    if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
      const text = await file.text();
      return {
        success: true,
        fileName: file.name,
        extractedText: text,
        characterCount: text.length,
      };
    }

    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const res = reader.result as string;
        const base64 = res.includes(',') ? res.split(',')[1] : res;
        resolve(base64 || '');
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

    const res = await fetch(`${API_BASE}/resume/parse-file`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type || 'application/pdf',
        base64Data,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'File text extraction failed' }));
      throw new Error(err.error || 'Failed to extract text from file');
    }
    return res.json();
  },

  // Resume Analyzer
  async analyzeResume(resumeText: string, fileName?: string): Promise<ResumeAnalysis> {
    const res = await fetch(`${API_BASE}/resume/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText, fileName }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Analysis failed' }));
      throw new Error(err.error || 'Failed to analyze resume');
    }
    return res.json();
  },

  // Job Description Matcher
  async matchJobDescription(jobTitle: string, jobDescription: string, resumeText?: string): Promise<JobMatchResult> {
    const res = await fetch(`${API_BASE}/job/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobTitle, jobDescription, resumeText }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Job matching failed' }));
      throw new Error(err.error || 'Failed to match job description');
    }
    return res.json();
  },

  // Career Advisor Roadmap
  async generateCareerRoadmap(
    targetRole: string,
    currentSkills: string[] | string,
    timelineWeeks: number = 8,
    resumeText: string = ''
  ): Promise<CareerRoadmap> {
    const res = await fetch(`${API_BASE}/career/roadmap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetRole, currentSkills, timelineWeeks, resumeText }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Roadmap generation failed' }));
      throw new Error(err.error || 'Failed to generate career roadmap');
    }
    return res.json();
  },

  // Interview Evaluation
  async evaluateInterviewAnswer(params: {
    questionId: number;
    questionText: string;
    userAnswer: string;
    category?: string;
    targetRole?: string;
  }) {
    const res = await fetch(`${API_BASE}/interview/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Evaluation failed' }));
      throw new Error(err.error || 'Failed to evaluate interview response');
    }
    return res.json();
  },

  // TTS Speech Synthesis
  async synthesizeSpeech(text: string, voice?: string): Promise<{ audioBase64: string | null; mimeType?: string }> {
    try {
      const res = await fetch(`${API_BASE}/interview/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('TTS request error:', e);
    }
    return { audioBase64: null };
  },

  // AI Resume Builder
  async buildResume(existingResumeText?: string, targetRole?: string, targetJobDescription?: string): Promise<GeneratedResumeData> {
    const res = await fetch(`${API_BASE}/resume/build`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ existingResumeText, targetRole, targetJobDescription }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Resume building failed' }));
      throw new Error(err.error || 'Failed to build AI resume');
    }
    return res.json();
  },

  // Cover Letter Generation
  async generateCoverLetter(params: {
    jobTitle: string;
    companyName: string;
    jobDescriptionText: string;
    resumeText: string;
    writingStyle?: WritingStyleType;
  }): Promise<CoverLetterResult> {
    const res = await fetch(`${API_BASE}/cover-letter/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Cover letter generation failed' }));
      throw new Error(err.error || 'Failed to generate cover letter');
    }
    return res.json();
  },

  // RAG Knowledge Search
  async queryRAGKnowledge(query: string): Promise<{ query: string; retrievedCount: number; sources: RAGSource[] }> {
    try {
      const res = await fetch(`${API_BASE}/rag/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('RAG Query offline');
    }
    return { query, retrievedCount: 0, sources: [] };
  },

  // AI Memory System
  async getAIMemory(): Promise<AIMemoryProfile> {
    const res = await fetch(`${API_BASE}/memory`);
    if (!res.ok) {
      throw new Error('Failed to fetch AI memory profile');
    }
    return res.json();
  },

  async updateAIMemory(data: { careerGoals?: Partial<AIMemoryProfile['careerGoals']>; learningProgress?: Partial<AIMemoryProfile['learningProgress']> }): Promise<AIMemoryProfile> {
    const res = await fetch(`${API_BASE}/memory`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error('Failed to update AI memory profile');
    }
    return res.json();
  },

  async clearAIMemory(): Promise<{ success: boolean; memory: AIMemoryProfile }> {
    const res = await fetch(`${API_BASE}/memory/clear`, {
      method: 'POST',
    });
    if (!res.ok) {
      throw new Error('Failed to clear AI memory');
    }
    return res.json();
  },

  async deleteAIMemoryItem(category: string, itemId: string): Promise<{ success: boolean; memory: AIMemoryProfile }> {
    const res = await fetch(`${API_BASE}/memory/item`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, itemId }),
    });
    if (!res.ok) {
      throw new Error('Failed to remove AI memory item');
    }
    return res.json();
  }
};
