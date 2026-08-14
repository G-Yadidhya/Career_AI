import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import { GoogleGenAI, Modality, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { RAG_KNOWLEDGE_DOCUMENTS } from './src/data/knowledgeBase';
import {
  orchestratorAgent,
  toolOrchestratorAgent,
  resumeAnalysisAgent,
  atsOptimizationAgent,
  jobMatchAgent,
  careerAgent,
  interviewAgent,
  coverLetterAgent,
  resumeBuilderAgent,
  learningRoadmapAgent
} from './src/agents';
import { defaultRAGEngine } from './src/rag/ragEngine';
import { ragService } from './src/rag/ragService';
import { userMemoryStore } from './src/memory/userMemoryStore';
import { modelManager } from './src/utils/modelManager';

const app = express();
const PORT = 3000;

// Trust proxy for rate limiter (required when running behind a reverse proxy like Cloud Run)
app.set('trust proxy', 1);

// Security Middleware (Helmet)
// Disabling CSP in dev for Vite compatibility, otherwise use default
app.use(helmet({
  contentSecurityPolicy: false, 
}));

// Rate limiting to prevent API abuse and DDoS attacks
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // Limit each IP to 150 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', apiLimiter);
app.use(express.json({ limit: '25mb' }));

// Lazy Gemini AI initialization with User-Agent header as required by SDK guidelines
let aiInstance: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiInstance && process.env.GEMINI_API_KEY) {
    aiInstance = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

// Helper to execute Gemini API calls with exponential backoff and circuit breaker on transient errors (503 / 429)
async function callGeminiWithRetry<T>(
  fn: (model: string) => Promise<T>,
  maxRetries = 3,
  preferredModel = 'gemini-3.7-flash'
): Promise<T | null> {
  const modelCandidates = modelManager.getCandidateModels(preferredModel);

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const currentModel = modelCandidates[attempt % modelCandidates.length];
    try {
      const res = await fn(currentModel);
      modelManager.reportModelSuccess(currentModel);
      return res;
    } catch (err: any) {
      const isTransient = modelManager.isTransientError(err);
      modelManager.reportModelError(currentModel, err);

      if (isTransient && attempt < maxRetries) {
        const nextModel = modelCandidates[(attempt + 1) % modelCandidates.length];
        const delay = 200 + Math.floor(Math.random() * 200);
        console.info(
          `[Server] Gemini API transient error (503/429) on ${currentModel}. Rotating to ${nextModel}...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      console.warn(`Gemini API call unsuccessful (${err?.message || err}). Falling back to ground truth database response.`);
      return null;
    }
  }
  return null;
}

// Simple RAG retrieval helper
function retrieveRAGContext(query: string, limit = 3) {
  const queryLower = query.toLowerCase();
  const sorted = [...RAG_KNOWLEDGE_DOCUMENTS].sort((a, b) => {
    const aMatch = queryLower.split(' ').reduce((acc, word) => word.length > 3 && a.snippet.toLowerCase().includes(word) ? acc + 1 : acc, 0);
    const bMatch = queryLower.split(' ').reduce((acc, word) => word.length > 3 && b.snippet.toLowerCase().includes(word) ? acc + 1 : acc, 0);
    return bMatch - aMatch;
  });
  return sorted.slice(0, limit);
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
});

// AI Memory API Endpoints
app.get('/api/memory', (req, res) => {
  try {
    const memory = userMemoryStore.getMemory('default-user');
    res.json(memory);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve AI memory profile' });
  }
});

app.put('/api/memory', (req, res) => {
  try {
    const { careerGoals, learningProgress } = req.body;
    let memory = userMemoryStore.getMemory('default-user');
    if (careerGoals) {
      userMemoryStore.updateCareerGoals('default-user', careerGoals);
    }
    if (learningProgress) {
      userMemoryStore.updateLearningProgress('default-user', learningProgress);
    }
    memory = userMemoryStore.getMemory('default-user');
    res.json(memory);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update AI memory profile' });
  }
});

app.post('/api/memory/clear', (req, res) => {
  try {
    const cleared = userMemoryStore.clearMemory('default-user');
    res.json({ success: true, memory: cleared });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to clear AI memory' });
  }
});

app.delete('/api/memory/item', (req, res) => {
  try {
    const { category, itemId } = req.body;
    if (!category || !itemId) {
      return res.status(400).json({ error: 'Category and itemId are required' });
    }
    const updated = userMemoryStore.removeMemoryItem('default-user', category, itemId);
    res.json({ success: true, memory: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete memory item' });
  }
});

// Authentication Mock / API
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const assignedRole = role === 'admin' || email.includes('admin') ? 'admin' : 'user';
  const name = email.split('@')[0] || 'User';

  res.json({
    token: `jwt-token-${Date.now()}`,
    user: {
      id: `u-${Date.now()}`,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
      role: assignedRole,
      targetRole: 'AI & Full Stack Engineer',
      experienceLevel: 'Entry Level',
      createdAt: new Date().toISOString(),
    },
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, targetRole } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email and password required' });
  }

  res.json({
    token: `jwt-token-${Date.now()}`,
    user: {
      id: `u-${Date.now()}`,
      name,
      email,
      role: role || 'user',
      targetRole: targetRole || 'Software Engineer',
      experienceLevel: 'Entry Level',
      createdAt: new Date().toISOString(),
    },
  });
});

// Resume File Parsing Endpoint (Extracts text from PDF, DOCX, TXT, or scanned files)
app.post('/api/resume/parse-file', async (req, res) => {
  try {
    const { fileName, fileType, base64Data } = req.body;
    if (!base64Data) {
      return res.status(400).json({ error: 'File base64 content is required' });
    }

    const buffer = Buffer.from(base64Data, 'base64');
    let extractedText = '';

    const lowerName = (fileName || '').toLowerCase();
    const isPDF = lowerName.endsWith('.pdf') || (fileType && fileType.includes('pdf'));
    const isDOCX = lowerName.endsWith('.docx') || lowerName.endsWith('.doc') || (fileType && fileType.includes('word'));
    const isImage = lowerName.endsWith('.png') || lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg') || (fileType && fileType.startsWith('image/'));

    if (isPDF) {
      try {
        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        if (result && result.text && result.text.trim().length > 15) {
          extractedText = result.text;
        }
      } catch (pdfErr: any) {
        console.warn('PDFParse raw parser error, falling back to Gemini multimodal:', pdfErr?.message);
      }
    } else if (isDOCX) {
      try {
        const docResult = await mammoth.extractRawText({ buffer });
        if (docResult && docResult.value && docResult.value.trim().length > 15) {
          extractedText = docResult.value;
        }
      } catch (docErr: any) {
        console.warn('mammoth raw parser error:', docErr?.message);
      }
    } else if (!isImage) {
      extractedText = buffer.toString('utf-8');
    }

    // Clean up extracted text
    extractedText = extractedText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\t/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    // If text is sparse, garbled, or document is an image/scanned PDF, use Gemini multimodal to transcribe document verbatim
    if ((!extractedText || extractedText.length < 35 || isImage) && process.env.GEMINI_API_KEY) {
      try {
        const ai = getAI();
        if (ai) {
          const mime = isPDF ? 'application/pdf' : (isDOCX ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : (fileType || 'application/pdf'));
          const response = await callGeminiWithRetry(async (model) => {
            return ai.models.generateContent({
              model,
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      inlineData: {
                        mimeType: mime,
                        data: base64Data
                      }
                    },
                    {
                      text: 'Extract and transcribe all text from this resume document verbatim and comprehensively. Preserve every section (Candidate Name, Contact Info, Summary, Education, Skills, Work Experience, Projects, Certifications, Achievements) and all bullet points.'
                    }
                  ]
                }
              ]
            });
          });
          if (response?.text && response.text.trim().length > 20) {
            extractedText = response.text.trim();
          }
        }
      } catch (geminiDocErr: any) {
        console.warn('Gemini document transcription note:', geminiDocErr?.message);
      }
    }

    if (!extractedText || extractedText.length < 10) {
      extractedText = `Document: ${fileName || 'Uploaded_Resume.pdf'}\n` +
        `Note: Text extraction produced sparse text. Please ensure document is not password protected.`;
    }

    return res.json({
      success: true,
      fileName: fileName || 'Uploaded_Resume.pdf',
      extractedText,
      characterCount: extractedText.length,
    });
  } catch (error: any) {
    console.error('Error in /api/resume/parse-file:', error);
    res.status(500).json({ error: error?.message || 'Failed to extract text from resume file' });
  }
});

// Resume Analysis Endpoint (Delegated to modular ResumeAnalysisAgent)
app.post('/api/resume/analyze', async (req, res) => {
  try {
    const { resumeText, fileName } = req.body;
    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 20) {
      return res.status(400).json({ error: 'Please provide valid resume content (at least 20 characters).' });
    }

    const agentResult = await resumeAnalysisAgent.analyze(resumeText, fileName);
    const parsedData = agentResult.data;

    // Auto-save resume snapshot and feedback to user AI memory
    if (parsedData?.parsedResume) {
      userMemoryStore.addResumeRecord('default-user', {
        title: fileName || parsedData.parsedResume.candidateName ? `${parsedData.parsedResume.candidateName}'s Resume` : 'Uploaded Resume',
        topSkills: parsedData.parsedResume.skills || [],
        summary: parsedData.parsedResume.summary || '',
        atsScoreSnapshot: parsedData.detailedScores?.atsScore?.score || 80
      });

      if (parsedData.resumeOptimizationTips && parsedData.resumeOptimizationTips.length > 0) {
        userMemoryStore.addFeedbackRecord('default-user', {
          category: 'resume',
          title: 'Resume Audit Feedback',
          summary: parsedData.resumeOptimizationTips[0] || 'Resume analysis completed.',
          actionItems: parsedData.resumeOptimizationTips.slice(0, 3)
        });
      }
    }

    return res.json({
      ...agentResult.data,
      agentMeta: agentResult.meta
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to analyze resume' });
  }
});

// Job Description Matcher Endpoint (Delegated to modular JobMatchAgent)
app.post('/api/job/match', async (req, res) => {
  try {
    const { jobTitle, jobDescription, resumeText } = req.body;
    if (!jobDescription || typeof jobDescription !== 'string') {
      return res.status(400).json({ error: 'Job description text is required' });
    }

    const agentResult = await jobMatchAgent.evaluateMatch(
      jobTitle || 'Target Position',
      jobDescription,
      resumeText || ''
    );

    return res.json({
      ...agentResult.data,
      jobDescriptionText: jobDescription,
      agentMeta: agentResult.meta
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to perform job matching' });
  }
});

// Career Advisor Roadmap Endpoint (Delegated to modular CareerAgent)
app.post('/api/career/roadmap', async (req, res) => {
  try {
    const { targetRole, currentSkills, timelineWeeks, resumeText } = req.body;
    const skillArray = Array.isArray(currentSkills)
      ? currentSkills
      : (typeof currentSkills === 'string' ? currentSkills.split(',') : []);
    const timelineWeeksNum = parseInt(timelineWeeks, 10) || 8;

    const memoryProfile = userMemoryStore.getMemory('default-user');

    const agentResult = await careerAgent.generateRoadmap(
      targetRole || 'AI & Full Stack Engineer',
      timelineWeeksNum,
      skillArray,
      resumeText || '',
      undefined,
      memoryProfile
    );

    const data = agentResult.data;

    // Auto-update career goals in user AI memory
    userMemoryStore.updateCareerGoals('default-user', {
      primaryTargetRole: targetRole || data.targetRole || 'AI & Full Stack Engineer',
      targetTimelineWeeks: timelineWeeksNum,
      keySkillsToDevelop: data.skillGapsToBridge || []
    });

    return res.json({
      id: `road-${Date.now()}`,
      targetRole: data.targetRole || targetRole || 'AI & Full Stack Engineer',
      currentSkills: skillArray,
      timelineWeeks: data.timelineWeeks || timelineWeeksNum,
      difficultyLevel: data.difficultyLevel || 'Intermediate',
      resumeMatchScore: data.resumeMatchScore || 80,
      personalizedSummary: data.personalizedSummary || '',
      skillGapsToBridge: data.skillGapsToBridge || [],
      existingStrengths: data.existingStrengths || skillArray,
      
      weeklyRoadmap: data.weeklyRoadmap || [],
      recommendedProjects: data.recommendedProjects || [],
      courses: data.courses || [],
      books: data.books || [],
      videos: data.videos || [],
      certifications: data.certifications || [],
      careerPaths: data.careerPaths || [],

      // Legacy fallback mapping for older views
      learningRoadmap: (data.weeklyRoadmap || []).map((w, idx) => ({
        month: Math.ceil(w.weekNumber / 4),
        title: w.title,
        focusArea: w.phaseName,
        objectives: w.weeklyObjectives,
        recommendedCourses: (w.recommendedCourses || []).map(c => ({ title: c.title, provider: c.provider })),
        keyMilestones: w.focusTopics
      })),
      requiredSkills: data.skillGapsToBridge || [],
      portfolioImprovements: (data.recommendedProjects || []).map(p => `Build ${p.title} (${p.techStack.join(', ')})`),
      
      generatedAt: new Date().toISOString(),
      agentMeta: agentResult.meta
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to generate career roadmap' });
  }
});

// Local Interview Answer Analyzer (Strict Relevance, Quality & Fallback Evaluator)
function analyzeInterviewAnswerLocally(questionText: string, userAnswer: string) {
  const answerTrimmed = (userAnswer || '').trim();
  const answerLower = answerTrimmed.toLowerCase();
  const questionLower = (questionText || '').toLowerCase();

  // 1. Check for extreme brevity (< 15 chars) or empty
  if (answerTrimmed.length < 15) {
    return {
      isRelevant: false,
      score: 15,
      confidenceScore: 10,
      communicationScore: 20,
      technicalScore: 10,
      grammarScore: 40,
      strengths: ['None - Answer is incomplete or too brief (<15 characters)'],
      areasToImprove: [
        'Your answer is too short to evaluate meaningfully.',
        'Please answer the question directly using the STAR method (Situation, Task, Action, Result).'
      ]
    };
  }

  // 2. Check for gibberish or character repetition (e.g. "asdfghjk", "aaaaaaaa", "123123123")
  const strippedAnswer = answerLower.replace(/[^a-z0-9]/g, '');
  const uniqueChars = new Set(strippedAnswer).size;
  if (uniqueChars < 5 && strippedAnswer.length > 15) {
    return {
      isRelevant: false,
      score: 10,
      confidenceScore: 5,
      communicationScore: 10,
      technicalScore: 5,
      grammarScore: 20,
      strengths: ['None - Answer contains non-sensical character repetitions or gibberish'],
      areasToImprove: [
        'Please provide a legitimate answer addressing the interview question.',
        'Focus on describing real technical concepts or work experiences.'
      ]
    };
  }

  // 3. Keyword / semantic overlap check against question prompt
  const stopWords = new Set(['what', 'how', 'why', 'when', 'where', 'who', 'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'to', 'in', 'of', 'for', 'with', 'your', 'you', 'describe', 'tell', 'me', 'about', 'time', 'have', 'do', 'can', 'should', 'would', 'could', 'was', 'were', 'been', 'being', 'this', 'that']);
  const qKeywords = questionLower
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));

  const aTokens = new Set(answerLower.replace(/[^\w\s]/g, '').split(/\s+/));

  let matchCount = 0;
  for (const kw of qKeywords) {
    if (aTokens.has(kw) || answerLower.includes(kw)) {
      matchCount++;
    }
  }

  const coreTechTerms = ['react', 'node', 'express', 'python', 'java', 'sql', 'database', 'api', 'state', 'bug', 'test', 'performance', 'code', 'system', 'team', 'project', 'client', 'server', 'async', 'hook', 'class', 'function', 'object', 'array', 'log', 'deploy', 'star', 'situation', 'task', 'action', 'result', 'metric', 'latency', 'cache'];
  let techMatchCount = 0;
  for (const t of coreTechTerms) {
    if (aTokens.has(t)) techMatchCount++;
  }

  // If question has key terms, but answer shares ZERO keywords and zero tech terms and is short:
  if (qKeywords.length >= 2 && matchCount === 0 && techMatchCount === 0 && answerTrimmed.length < 120) {
    return {
      isRelevant: false,
      score: 25,
      confidenceScore: 20,
      communicationScore: 30,
      technicalScore: 15,
      grammarScore: 50,
      strengths: ['Readable sentence structure, but response is off-topic'],
      areasToImprove: [
        `The response does not address key topics from the question prompt (${qKeywords.slice(0, 3).join(', ')}).`,
        'Re-read the question carefully and respond with relevant technical or behavioral experience.'
      ]
    };
  }

  // Relevant answer! Compute realistic dynamic score
  let score = 72;
  if (answerTrimmed.length > 120) score += 6;
  if (answerTrimmed.length > 250) score += 6;
  if (matchCount > 0) score += Math.min(10, matchCount * 3);
  if (techMatchCount > 0) score += Math.min(6, techMatchCount * 2);
  score = Math.min(94, Math.max(50, score));

  return {
    isRelevant: true,
    score,
    confidenceScore: Math.min(95, score + 2),
    communicationScore: Math.min(95, score + 4),
    technicalScore: Math.min(95, score - 2),
    grammarScore: Math.min(98, score + 5),
    strengths: [
      'Addresses question prompt with clear context',
      'Uses relevant domain terminology',
      answerTrimmed.length > 200 ? 'Elaborates thoroughly on the scenario' : 'Concise and focused answer'
    ],
    areasToImprove: [
      'Include quantitative impact metrics (e.g., % latency reduction, user count)',
      'Follow STAR framework: explicitly detail Situation, Task, Action, and Result'
    ]
  };
}

// Interview Question Evaluator Endpoint (Delegated to modular InterviewAgent)
app.post('/api/interview/evaluate', async (req, res) => {
  try {
    const { questionId, questionText, userAnswer, category, targetRole } = req.body;
    if (!userAnswer || typeof userAnswer !== 'string') {
      return res.status(400).json({ error: 'User answer is required' });
    }

    // Local baseline check for extreme brevity or off-topic gibberish
    const localEval = analyzeInterviewAnswerLocally(questionText, userAnswer);

    if (!localEval.isRelevant) {
      return res.json({
        questionId: Number(questionId) || 1,
        questionText,
        userAnswer,
        score: localEval.score,
        confidenceScore: localEval.confidenceScore,
        communicationScore: localEval.communicationScore,
        technicalScore: localEval.technicalScore,
        grammarScore: localEval.grammarScore,
        strengths: localEval.strengths,
        areasToImprove: localEval.areasToImprove,
        suggestedBetterAnswer: `Please answer using the STAR method: Situation, Task, Action, Result.`,
        evaluatedAt: new Date().toISOString()
      });
    }

    const memoryProfile = userMemoryStore.getMemory('default-user');

    const agentResult = await interviewAgent.evaluateAnswer(
      questionText,
      userAnswer,
      category || 'Behavioral',
      targetRole || 'Software Engineer',
      memoryProfile
    );

    const feedback = agentResult.data;

    // Auto-save interview session and feedback to AI Memory
    userMemoryStore.addInterviewRecord('default-user', {
      role: targetRole || 'Software Engineer',
      totalQuestions: 1,
      overallScore: feedback.score || 80,
      strengths: feedback.strengths || [],
      weaknesses: feedback.weaknesses || feedback.areasToImprove || [],
      topSTARFeedback: feedback.overallScoreDetail?.reason || 'STAR answer evaluated'
    });

    if (feedback.areasToImprove && feedback.areasToImprove.length > 0) {
      userMemoryStore.addFeedbackRecord('default-user', {
        category: 'interview',
        title: `Interview STAR Feedback (${category || 'Behavioral'})`,
        summary: feedback.overallScoreDetail?.reason || 'Interview answer evaluation',
        actionItems: feedback.areasToImprove.slice(0, 3)
      });
    }

    return res.json({
      questionId: Number(questionId) || 1,
      questionText,
      userAnswer,
      category,
      score: feedback.score || 80,
      confidenceScore: feedback.confidenceScore || 82,
      communicationScore: feedback.communicationScore || 85,
      technicalScore: feedback.technicalScore || 78,
      grammarScore: feedback.grammarScore || 90,

      overallScoreDetail: feedback.overallScoreDetail,
      confidenceDetail: feedback.confidenceDetail,
      grammarDetail: feedback.grammarDetail,
      communicationDetail: feedback.communicationDetail,
      technicalDepthDetail: feedback.technicalDepthDetail,

      star: feedback.star,

      strengths: feedback.strengths || ['Good structure', 'Direct answer'],
      weaknesses: feedback.weaknesses || ['Lacks quantitative metrics in result section'],
      areasToImprove: feedback.areasToImprove || feedback.weaknesses || ['Quantify your results with percentage metrics'],
      followUpQuestions: feedback.followUpQuestions || [
        'How would your solution perform under 10x traffic load?',
        'What error handling or fallback strategy did you put in place?'
      ],
      improvementPlan: feedback.improvementPlan || [
        {
          stepNumber: 1,
          title: 'Quantify Results',
          action: 'Include numbers, percentages, or dollar impact in your STAR result.',
          expectedOutcome: 'Boosts result score and overall impact.'
        }
      ],
      suggestedBetterAnswer: feedback.suggestedBetterAnswer || 'To structure an optimal response, utilize the STAR framework with metric-driven outcomes.',
      evaluatedAt: new Date().toISOString(),
      agentMeta: agentResult.meta
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to evaluate interview answer' });
  }
});

// Tool Calling Chat Agent API Endpoint
app.post('/api/agent/chat', async (req, res) => {
  try {
    const { message, history, resumeText, jobDescription } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = await toolOrchestratorAgent.chat(message, history || [], resumeText || '', jobDescription || '');
    res.json(result.data);
  } catch (error) {
    console.error('Agent Chat Error:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

// Central Orchestrator Suite Endpoint
app.post('/api/orchestrator', async (req, res) => {
  try {
    const {
      intent,
      resumeText,
      fileName,
      jobTitle,
      companyName,
      jobDescriptionText,
      targetRole,
      interviewQuestion,
      userAnswer,
      category,
      currentSkills
    } = req.body;

    if (!intent) {
      return res.status(400).json({ error: 'Intent is required for Orchestrator execution.' });
    }

    const agentResult = await orchestratorAgent.orchestrate({
      intent,
      resumeText,
      fileName,
      jobTitle,
      companyName,
      jobDescriptionText,
      targetRole,
      interviewQuestion,
      userAnswer,
      category,
      currentSkills
    });

    return res.json({
      ...agentResult.data,
      agentMeta: agentResult.meta
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to orchestrate AI agent suite' });
  }
});

// ATS Optimization Dedicated Endpoint
app.post('/api/ats/optimize', async (req, res) => {
  try {
    const { resumeText, jobDescriptionText } = req.body;
    if (!resumeText) {
      return res.status(400).json({ error: 'Resume text is required' });
    }

    const agentResult = await atsOptimizationAgent.optimize(resumeText, jobDescriptionText);
    return res.json({
      ...agentResult.data,
      agentMeta: agentResult.meta
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to optimize ATS content' });
  }
});

// Cover Letter Generation Dedicated Endpoint
app.post('/api/cover-letter/generate', async (req, res) => {
  try {
    const { jobTitle, companyName, jobDescriptionText, resumeText, writingStyle } = req.body;
    const memoryProfile = userMemoryStore.getMemory('default-user');

    const agentResult = await coverLetterAgent.generateCoverLetter(
      jobTitle || 'Software Engineer',
      companyName || 'Target Company',
      jobDescriptionText || '',
      resumeText || '',
      writingStyle || 'Professional & Confident',
      undefined,
      memoryProfile
    );

    // Auto-save cover letter feedback to AI Memory
    userMemoryStore.addFeedbackRecord('default-user', {
      category: 'cover-letter',
      title: `Cover Letter Tailored for ${companyName || 'Target Role'}`,
      summary: `Generated cover letter in ${writingStyle || 'Professional'} style with alignment score ${agentResult.data.matchAlignmentScore || 85}%.`,
      actionItems: [`Tailored for ${jobTitle || 'Target Position'} at ${companyName || 'Target Company'}`]
    });

    return res.json({
      ...agentResult.data,
      agentMeta: agentResult.meta
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to generate cover letter' });
  }
});

// Resume Builder Dedicated Endpoint
app.post('/api/resume/build', async (req, res) => {
  try {
    const { existingResumeText, targetRole, targetJobDescription } = req.body;
    const agentResult = await resumeBuilderAgent.buildResume(
      existingResumeText || '',
      targetRole || 'Software Engineer',
      targetJobDescription
    );
    return res.json({
      ...agentResult.data,
      agentMeta: agentResult.meta
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to build resume' });
  }
});

// Dedicated Vector RAG Search & Inspection Endpoint
app.post('/api/rag/search', async (req, res) => {
  try {
    const { query, categoryFilter, topK } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const ragContext = await ragService.retrieveContext(query, {
      categoryFilter: categoryFilter || 'All',
      topK: topK || 4
    });

    const stats = ragService.getStats();

    return res.json({
      query,
      categoryFilter: categoryFilter || 'All',
      context: ragContext,
      stats
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'RAG vector search failed' });
  }
});

// Speech Feedback Endpoint (TTS using gemini-3.1-flash-tts-preview)
app.post('/api/interview/tts', async (req, res) => {
  try {
    const { text, voice } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required for TTS' });

    const ai = getAI();
    if (ai) {
      const response = await callGeminiWithRetry(
        (model) =>
          ai.models.generateContent({
            model: 'gemini-3.1-flash-tts-preview',
            contents: [{ parts: [{ text: `Say encouragingly: ${text.slice(0, 1200)}` }] }],
            config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: voice || 'Zephyr' },
                },
              },
            },
          }),
        2,
        'gemini-3.1-flash-tts-preview'
      );

      const base64Audio = response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return res.json({ audioBase64: base64Audio, mimeType: 'audio/pcm;rate=24000' });
      }
    }

    res.json({ audioBase64: null, message: 'Audio synthesis simulated or unavailable without key' });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'TTS Error' });
  }
});

// RAG Query API
app.post('/api/rag/query', (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Query is required' });
  const docs = retrieveRAGContext(query, 5);
  res.json({
    query,
    retrievedCount: docs.length,
    sources: docs,
  });
});

// Helper Fallback Functions
function generateFallbackResumeAnalysis(resumeText: string, fileName?: string, ragDocs: any[] = []) {
  return {
    id: `res-${Date.now()}`,
    fileName: fileName || 'Resume_Doc.pdf',
    uploadedAt: new Date().toISOString(),
    atsScore: 84,
    parsedResume: {
      rawText: resumeText,
      candidateName: 'Aditya Sharma',
      email: 'aditya.sharma@example.com',
      phone: '+1 (555) 234-5678',
      summary: 'Passionate Software Developer with experience building scalable React web apps, Express microservices, and database schemas.',
      skills: ['Python', 'Java', 'TypeScript', 'React', 'HTML5', 'CSS3', 'Node.js', 'Express', 'SQL', 'Git'],
      projects: [
        {
          title: 'AI Resume & Career Advisor',
          description: 'Full stack AI platform with ATS evaluator, RAG knowledge retrieval, and mock interview coach.',
          technologies: ['React', 'TypeScript', 'Express', 'Gemini AI', 'Tailwind CSS'],
        },
        {
          title: 'Distributed Analytics Engine',
          description: 'High-throughput data ingestion pipeline handling 10k events/sec.',
          technologies: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
        },
      ],
      education: [
        {
          degree: 'B.Tech in Computer Science & Engineering',
          institution: 'State Technological University',
          year: '2022 - 2026',
          gpa: '3.8 / 4.0',
        },
      ],
      experience: [
        {
          role: 'Software Engineering Intern',
          company: 'TechCorp Solutions',
          duration: 'Jun 2025 - Aug 2025',
          highlights: ['Optimized API payload size by 30%', 'Implemented JWT authentication and RBAC permissions'],
        },
      ],
      certifications: ['AWS Certified Cloud Practitioner', 'Meta Front-End Developer Specialization'],
      achievements: ['Winner - National University Hackathon 2025', 'Published research paper on RAG Hallucination Mitigation'],
    },
    atsBreakdown: {
      formattingScore: 88,
      keywordScore: 82,
      experienceScore: 80,
      skillsMatchScore: 86,
      readabilityScore: 85,
    },
    resumeSummary: 'Strong technical baseline with good project structure. Adding explicit cloud microservice keywords and quantified metric bullet points will push ATS score above 90.',
    strengths: [
      'Clean bullet point structure with active verbs',
      'Solid core technical skills (Python, TypeScript, React)',
      'Clear project descriptions with tech stacks',
    ],
    weaknesses: [
      'Lacks explicit containerization keywords (Docker/Kubernetes)',
      'Missing metrics in work experience (e.g. reduced latency by X%)',
    ],
    grammarSuggestions: [
      {
        originalText: 'Responsible for writing APIs for backend.',
        suggestedText: 'Architected and deployed high-throughput RESTful APIs serving 50,000+ daily requests.',
        reason: 'Replace passive duty descriptions with high-impact action verbs and quantitative metrics.',
        type: 'impact',
      },
      {
        originalText: 'Worked on fixing UI bugs in react.',
        suggestedText: 'Resolved 25+ critical UI state bugs in React, enhancing overall user retention by 14%.',
        reason: 'Capitalize framework names and highlight business impact.',
        type: 'grammar',
      },
    ],
    formattingSuggestions: [
      'Use bullet points starting with strong past-tense verbs (Architected, Spearheaded, Engineered)',
      'Consolidate skills into categorized sections (Languages, Frameworks, Databases, Tools)',
    ],
    missingKeywords: ['Docker', 'CI/CD Pipelines', 'RESTful API Architecture', 'Unit Testing (Jest/Vitest)', 'PostgreSQL'],
    missingSkills: ['Cloud Infrastructure (GCP/AWS)', 'Vector Databases (ChromaDB)', 'System Design'],
    improvementSuggestions: [
      'Include live demo links and GitHub repositories for all listed projects',
      'Add a dedicated "Cloud & DevOps" section to pass specialized ATS filters',
    ],
    ragSourcesUsed: ragDocs.map(d => d.title),
  };
}

function generateFallbackRoadmap(targetRole: string, currentSkillsStr: string) {
  return {
    id: `road-${Date.now()}`,
    targetRole,
    currentSkills: currentSkillsStr.split(',').map(s => s.trim()),
    careerPaths: [
      {
        title: `${targetRole} Specialist`,
        description: `Direct focus on mastering advanced ${targetRole} paradigms, cloud infrastructure, and AI system design.`,
        matchScore: 94,
        avgSalaryRange: '$115,000 - $155,000 / yr',
        growthDemand: 'Very High (+32% annual growth)',
      },
      {
        title: 'Full Stack AI Solutions Architect',
        description: 'Lead technical teams, design end-to-end LLM-powered enterprise architectures, and oversee deployment pipelines.',
        matchScore: 88,
        avgSalaryRange: '$135,000 - $185,000 / yr',
        growthDemand: 'High Demand',
      },
    ],
    requiredSkills: ['Python 3.12+', 'TypeScript / React 19', 'RAG & Vector DBs (ChromaDB)', 'FastAPI / Express', 'Docker & Kubernetes', 'System Security (JWT/OAuth)'],
    certifications: [
      { name: 'Google Cloud Professional Machine Learning Engineer', issuer: 'Google Cloud', difficulty: 'Advanced' },
      { name: 'AWS Certified Developer - Associate', issuer: 'Amazon Web Services', difficulty: 'Intermediate' },
    ],
    learningRoadmap: [
      {
        month: 1,
        title: 'Month 1: Modern Stack & API Architecture',
        focusArea: 'TypeScript, React 19, Express, & Docker',
        objectives: [
          'Master async/await patterns and clean architecture in TypeScript',
          'Build containerized microservices with Docker',
          'Implement JWT auth and defensive rate-limiting',
        ],
        recommendedCourses: [
          { title: 'Full Stack TypeScript & Modern Node.js Architecture', provider: 'Coursera / Meta' },
          { title: 'Docker & Microservices Masterclass', provider: 'Udemy' },
        ],
        keyMilestones: ['Deploy first dockerized REST service', 'Complete TypeScript code review audit'],
      },
      {
        month: 2,
        title: 'Month 2: AI Engineering & RAG Systems',
        focusArea: 'Gemini API, Embeddings, ChromaDB, & LangChain',
        objectives: [
          'Understand vector spaces and Sentence Transformer embeddings',
          'Implement RAG with document chunking and metadata filtering',
          'Build automated prompt validation & hallucination checks',
        ],
        recommendedCourses: [
          { title: 'Generative AI Engineering with LLMs & RAG', provider: 'DeepLearning.AI' },
        ],
        keyMilestones: ['Build working RAG pipeline with custom vector index', 'Benchmark retrieval precision'],
      },
      {
        month: 3,
        title: 'Month 3: Advanced Cloud & Database Design',
        focusArea: 'PostgreSQL, ORM, Caching, & CI/CD',
        objectives: [
          'Design normalized PostgreSQL database schemas with indexing',
          'Set up GitHub Actions CI/CD pipeline for automated testing',
          'Configure Redis caching for high-frequency queries',
        ],
        recommendedCourses: [
          { title: 'PostgreSQL Database Performance Tuning', provider: 'Pluralsight' },
        ],
        keyMilestones: ['Setup automated CI/CD pipeline with unit & integration tests'],
      },
      {
        month: 4,
        title: 'Month 4: Portfolio Polish & Technical Mock Interviews',
        focusArea: 'Full System Integration & Mock Coaching',
        objectives: [
          'Finalize production deployment with custom domain and SSL',
          'Conduct 10+ AI Mock Interview sessions on Technical & STAR questions',
          'Optimize resume ATS score above 90%',
        ],
        recommendedCourses: [
          { title: 'Tech Interview Prep: Algorithms & System Design', provider: 'Educative.io' },
        ],
        keyMilestones: ['Achieve 90+ ATS Score', 'Complete 5 STAR interview session reviews'],
      },
    ],
    recommendedProjects: [
      {
        title: 'RAG Knowledge Assistant for Enterprise Specs',
        difficulty: 'Intermediate',
        techStack: ['Python', 'FastAPI', 'ChromaDB', 'Gemini 3.7 Flash', 'React'],
        description: 'Self-hosted AI query system for indexing company PDFs with source citations and ground truth enforcement.',
        keyFeatures: ['Vector similarity search', 'Interactive citation popover', 'Hallucination rate telemetry'],
        portfolioImpact: 'Very High - Highlights modern GenAI capability',
      },
      {
        title: 'Real-Time Collaborative Code & Mock Interview Platform',
        difficulty: 'Advanced',
        techStack: ['TypeScript', 'Express', 'React 19', 'WebSockets', 'Tailwind CSS'],
        description: 'Multi-user mock interview workspace with live code execution, audio feedback, and automated STAR scorecards.',
        keyFeatures: ['Live WebSockets session', 'TTS voice questions', 'Automated rubric grading'],
        portfolioImpact: 'High - Demonstrates complex full-stack architecture',
      },
    ],
    portfolioImprovements: [
      'Host all side projects on cloud platforms (Cloud Run / Railway / Vercel) with live working URLs',
      'Create clean README files for GitHub repos with architecture diagrams, setup instructions, and badges',
    ],
    generatedAt: new Date().toISOString(),
  };
}

// Vite integration (Development vs Production)
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Resume & Career Advisor server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
