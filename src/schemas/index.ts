import { Type, Schema } from '@google/genai';

/**
 * Reusable Structured JSON Schema Definitions for Gemini API
 * Ensures strictly typed outputs that match our UI interfaces.
 */

// 1. Generic Score Detail containing reasoning, evidence, confidence, recommendation
export const ScoreDetailSchema: Schema = {
  type: Type.OBJECT,
  description: 'A detailed evaluation metric conforming to the anti-hallucination mandate.',
  properties: {
    score: {
      type: Type.INTEGER,
      description: 'An objective integer score between 0 and 100.'
    },
    reason: {
      type: Type.STRING,
      description: 'Clear, logical explanation and justification of the assigned score.'
    },
    evidence: {
      type: Type.STRING,
      description: 'Exact direct quote or precise snippet from the parsed resume or source document.'
    },
    confidence: {
      type: Type.NUMBER,
      description: 'Confidence score between 0.0 and 1.0 representing accuracy of evaluation.'
    },
    recommendation: {
      type: Type.STRING,
      description: 'Actionable step by step advice on how the candidate can improve this score.'
    }
  },
  required: ['score', 'reason', 'evidence', 'confidence', 'recommendation']
};

// 2. ATS Score Breakdown Schema
export const AtsBreakdownSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    formattingScore: ScoreDetailSchema,
    keywordScore: ScoreDetailSchema,
    experienceScore: ScoreDetailSchema,
    skillsMatchScore: ScoreDetailSchema,
    readabilityScore: ScoreDetailSchema
  },
  required: ['formattingScore', 'keywordScore', 'experienceScore', 'skillsMatchScore', 'readabilityScore']
};

// 3. Complete Resume Analysis Schema
export const ResumeAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    parsedResume: {
      type: Type.OBJECT,
      properties: {
        candidateName: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        summary: { type: Type.STRING },
        skills: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ['candidateName', 'email', 'phone', 'summary', 'skills']
    },
    atsScore: { type: Type.INTEGER },
    atsBreakdown: {
      type: Type.OBJECT,
      properties: {
        formattingScore: { type: Type.INTEGER },
        keywordScore: { type: Type.INTEGER },
        experienceScore: { type: Type.INTEGER },
        skillsMatchScore: { type: Type.INTEGER },
        readabilityScore: { type: Type.INTEGER }
      },
      required: ['formattingScore', 'keywordScore', 'experienceScore', 'skillsMatchScore', 'readabilityScore']
    },
    detailedScores: {
      type: Type.OBJECT,
      properties: {
        atsScore: ScoreDetailSchema,
        formattingScore: ScoreDetailSchema,
        readabilityScore: ScoreDetailSchema,
        keywordDensityScore: ScoreDetailSchema,
        grammarScore: ScoreDetailSchema,
        actionVerbsScore: ScoreDetailSchema,
        duplicateDetectionScore: ScoreDetailSchema,
        achievementScore: ScoreDetailSchema
      },
      required: [
        'atsScore',
        'formattingScore',
        'readabilityScore',
        'keywordDensityScore',
        'grammarScore',
        'actionVerbsScore',
        'duplicateDetectionScore',
        'achievementScore'
      ]
    },
    resumeSummary: { type: Type.STRING },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
    improvementSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ['parsedResume', 'atsScore', 'detailedScores', 'resumeSummary', 'strengths', 'weaknesses', 'improvementSuggestions']
};

// 4. Detailed Interview Evaluation Schema
export const InterviewEvaluationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overallScoreDetail: ScoreDetailSchema,
    confidenceDetail: ScoreDetailSchema,
    grammarDetail: ScoreDetailSchema,
    communicationDetail: ScoreDetailSchema,
    technicalDepthDetail: ScoreDetailSchema,
    star: {
      type: Type.OBJECT,
      properties: {
        overall: ScoreDetailSchema,
        situation: ScoreDetailSchema,
        task: ScoreDetailSchema,
        action: ScoreDetailSchema,
        result: ScoreDetailSchema
      },
      required: ['overall', 'situation', 'task', 'action', 'result']
    },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
    followUpQuestions: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: [
    'overallScoreDetail',
    'confidenceDetail',
    'grammarDetail',
    'communicationDetail',
    'technicalDepthDetail',
    'star',
    'strengths',
    'weaknesses',
    'followUpQuestions'
  ]
};
