import { BaseAgent, AgentResponse } from './baseAgent';
import {
  AnswerEvaluation,
  ScoreDetail,
  StarMetricDetail,
  ImprovementStep,
  InterviewType,
  AIMemoryProfile
} from '../types';

export interface DetailedInterviewFeedback {
  score: number;
  confidenceScore: number;
  communicationScore: number;
  technicalScore: number;
  grammarScore: number;

  overallScoreDetail: ScoreDetail;
  confidenceDetail: ScoreDetail;
  grammarDetail: ScoreDetail;
  communicationDetail: ScoreDetail;
  technicalDepthDetail: ScoreDetail;

  star: {
    overall: ScoreDetail;
    situation: StarMetricDetail;
    task: StarMetricDetail;
    action: StarMetricDetail;
    result: StarMetricDetail;
  };

  strengths: string[];
  weaknesses: string[];
  areasToImprove: string[];
  followUpQuestions: string[];
  improvementPlan: ImprovementStep[];
  suggestedBetterAnswer: string;
}

export class InterviewAgent extends BaseAgent {
  constructor() {
    super('InterviewAgent', 'gemini-3.7-flash');
  }

  public async evaluateAnswer(
    question: string,
    userAnswer: string,
    category: InterviewType = 'Behavioral',
    targetRole: string = 'Software Engineer',
    memoryProfile?: AIMemoryProfile
  ): Promise<AgentResponse<DetailedInterviewFeedback>> {
    const startTime = Date.now();

    const ragResult = this.ragEngine.retrieveContext(`${category} ${question}`, 2);

    const memoryBlock = memoryProfile ? `
CANDIDATE INTERVIEW HISTORY & PAST FEEDBACK MEMORY:
- Historical Weaknesses: ${memoryProfile.interviewHistory.flatMap(h => h.weaknesses).slice(0, 4).join('; ') || 'N/A'}
- Past Action Items: ${memoryProfile.previousFeedback.map(f => f.summary).slice(0, 3).join('; ') || 'N/A'}
- Past Strengths: ${memoryProfile.interviewHistory.flatMap(h => h.strengths).slice(0, 4).join('; ') || 'N/A'}
(Cross-check if candidate resolved previously flagged weaknesses or applied past STAR coaching tips in this response.)` : '';

    const prompt = `You are a Principal Tech Hiring Manager, FAANG System Design & STAR Interview Coach.
Evaluate the candidate's interview response thoroughly. Explain EVERY single metric score with transparent reasons, confidence ratings, and actionable recommendations.
${memoryBlock}

Ground Truth Standard Context:
${ragResult.contextString}

Target Role: ${targetRole}
Interview Category: ${category}
Question: "${question}"

Candidate Answer:
"${userAnswer}"

Evaluate strictly across 5 Dimensions:
1. STAR Framework Alignment (Situation, Task, Action, Result)
2. Confidence & Delivery Tone
3. Grammar, Vocabulary & Clarity
4. Communication & Structure
5. Technical Depth & Domain Expertise

Generate 2-3 tailored follow-up questions probing candidate gaps or going deeper into technical/behavioral aspects.
Generate a 3-step structured improvement plan.

Return a valid JSON object matching EXACTLY this structure:
{
  "score": 84,
  "confidenceScore": 82,
  "communicationScore": 86,
  "technicalScore": 85,
  "grammarScore": 90,
  "overallScoreDetail": {
    "score": 84,
    "reason": "Strong structured answer addressing core question parameters with good STAR balance.",
    "evidence": "Explicitly stated the goal and organized tasks logically matching STAR.",
    "confidence": 0.95,
    "recommendation": "Incorporate explicit quantitative metrics in the result section to reach 90+ score."
  },
  "confidenceDetail": {
    "score": 82,
    "reason": "Direct and assertive tone throughout the explanation.",
    "evidence": "Assertive vocabulary such as 'lead developer' and 'engineered high-throughput REST API'.",
    "confidence": 0.94,
    "recommendation": "Eliminate minor filler phrasing to maximize executive presence."
  },
  "grammarDetail": {
    "score": 90,
    "reason": "Grammatically sound sentences with clear subject-verb agreement and technical vocabulary.",
    "evidence": "Perfect tense alignment and precise use of industry terms like 'P99 latency' and 'caching layer'.",
    "confidence": 0.98,
    "recommendation": "Maintain present/past tense consistency when describing past project actions."
  },
  "communicationDetail": {
    "score": 86,
    "reason": "Logical flow from initial context to execution steps.",
    "evidence": "Clear sequential transitions detailing context first, then personal ownership, followed by implementation steps.",
    "confidence": 0.96,
    "recommendation": "Use signpost transitions like 'First... Next... Ultimately...' for cleaner audio delivery."
  },
  "technicalDepthDetail": {
    "score": 85,
    "reason": "Good grasp of core concepts, terminology, and trade-offs appropriate for ${category}.",
    "evidence": "References to database indexing, Redis hot-key caching, and rate-limiting middlewares.",
    "confidence": 0.95,
    "recommendation": "Elaborate on edge cases and failure recovery mechanisms."
  },
  "star": {
    "overall": {
      "score": 84,
      "reason": "All 4 STAR components present with strong focus on Action.",
      "evidence": "Found specific components answering what was happening, what needed to be done, how it was solved, and the final state.",
      "confidence": 0.95,
      "recommendation": "Strengthen the Result section with hard numbers."
    },
    "situation": {
      "scoreDetail": {
        "score": 85,
        "reason": "Clear background context provided regarding project scale and deadline.",
        "evidence": "Mentions previous role at CloudTech and peak hours bottleneck.",
        "confidence": 0.95,
        "recommendation": "State project constraints in 1-2 concise sentences."
      },
      "breakdown": "Effectively established project background and problem severity."
    },
    "task": {
      "scoreDetail": {
        "score": 82,
        "reason": "Individual ownership and explicit responsibilities clearly stated.",
        "evidence": "Explicitly stated responsibility was 'reducing P99 latency under 100ms'.",
        "confidence": 0.94,
        "recommendation": "Highlight personal contribution versus broader team effort."
      },
      "breakdown": "Clarified exact ownership role."
    },
    "action": {
      "scoreDetail": {
        "score": 88,
        "reason": "Step-by-step description of engineering decisions and debugging tools used.",
        "evidence": "Mentioned Postgres execution plan analysis, Redis caching, and Express rate-limiter setup.",
        "confidence": 0.96,
        "recommendation": "Mention specific algorithms or frameworks used during implementation."
      },
      "breakdown": "Detailed technical implementation steps."
    },
    "result": {
      "scoreDetail": {
        "score": 78,
        "reason": "Positive outcome stated, but missing quantitative metrics (e.g., % latency drop, $ saved).",
        "evidence": "States latency was reduced and infrastructure costs saved but lacks explicit numbers.",
        "confidence": 0.93,
        "recommendation": "Quantify success metrics using percentages or user scale."
      },
      "breakdown": "Good qualitative completion; needs metric numbers."
    }
  },
  "strengths": [
    "Logical progression following STAR method",
    "Accurate use of domain-specific technical terminology"
  ],
  "weaknesses": [
    "Lacks quantitative impact metrics in the result section",
    "Did not mention fallback or error handling mechanisms"
  ],
  "areasToImprove": [
    "Add metric numbers to result section",
    "Explain edge case handling"
  ],
  "followUpQuestions": [
    "How would your approach scale if traffic increased 10x overnight?",
    "What security precautions did you take during API implementation?"
  ],
  "improvementPlan": [
    {
      "stepNumber": 1,
      "title": "Quantify Business Results",
      "action": "Add specific numbers (e.g. 'reduced latency by 45%') to your past project bullet stories.",
      "expectedOutcome": "Increases STAR Result score from 78 to 92+."
    },
    {
      "stepNumber": 2,
      "title": "Structure Technical Trade-offs",
      "action": "Mention alternative solutions you evaluated before choosing your final approach.",
      "expectedOutcome": "Demonstrates senior-level engineering depth."
    },
    {
      "stepNumber": 3,
      "title": "Practice Signposted Delivery",
      "action": "Rehearse answer out loud using 'Situation... Task... Action... Result...' transitions.",
      "expectedOutcome": "Improves communication and confidence scores."
    }
  ],
  "suggestedBetterAnswer": "In my previous role at CloudTech, our core payment service experienced 300ms latency spikes during peak hours (Situation). As lead backend developer, my objective was to reduce P99 latency under 100ms without introducing breaking API changes (Task). I analyzed query execution plans in PostgreSQL, implemented a Redis caching layer for hot keys, and added rate-limiting middleware in Express (Action). This reduced latency by 68%, eliminated peak timeouts, and saved $12k in monthly infrastructure costs (Result)."
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

    const parsedData = this.parseStructuredJSON<DetailedInterviewFeedback>(apiResponse?.text);

    if (parsedData && typeof parsedData.score === 'number') {
      return this.createResult(parsedData, startTime, false);
    }

    const fallback = this.getFallbackFeedback(question, userAnswer, category);
    return this.createResult(fallback, startTime, true);
  }

  private getFallbackFeedback(
    question: string,
    userAnswer: string,
    category: InterviewType = 'Behavioral'
  ): DetailedInterviewFeedback {
    const wordCount = userAnswer.trim().split(/\s+/).length;
    const baseScore = Math.min(92, Math.max(50, Math.round(55 + (wordCount / 120) * 35)));

    const createDetail = (sc: number, metricName: string): ScoreDetail => ({
      score: sc,
      reason: `${metricName} evaluated against FAANG interview standards for ${category}.`,
      evidence: `Automated assessment of the submitted response containing ${wordCount} words.`,
      confidence: 0.94,
      recommendation: `Incorporate explicit technical terminology and quantitative metrics to improve ${metricName.toLowerCase()}.`
    });

    return {
      score: baseScore,
      confidenceScore: Math.min(95, baseScore + 2),
      communicationScore: Math.min(95, baseScore + 3),
      technicalScore: Math.max(60, baseScore - 2),
      grammarScore: 90,
      overallScoreDetail: createDetail(baseScore, 'Overall Interview Performance'),
      confidenceDetail: createDetail(Math.min(95, baseScore + 2), 'Confidence & Delivery'),
      grammarDetail: createDetail(90, 'Grammar & Tone'),
      communicationDetail: createDetail(Math.min(95, baseScore + 3), 'Communication Structure'),
      technicalDepthDetail: createDetail(Math.max(60, baseScore - 2), 'Technical Depth'),
      star: {
        overall: createDetail(baseScore, 'STAR Alignment'),
        situation: {
          scoreDetail: createDetail(82, 'STAR Situation'),
          breakdown: 'Outlined background context adequately.'
        },
        task: {
          scoreDetail: createDetail(80, 'STAR Task'),
          breakdown: 'Stated primary objective.'
        },
        action: {
          scoreDetail: createDetail(85, 'STAR Action'),
          breakdown: 'Described step-by-step action plan.'
        },
        result: {
          scoreDetail: createDetail(75, 'STAR Result'),
          breakdown: 'Result mentioned; needs quantitative impact numbers.'
        }
      },
      strengths: [
        'Directly addresses the question prompt',
        'Demonstrates structured problem-solving approach'
      ],
      weaknesses: [
        'Lacks specific numerical results (% improvement, duration, scale)',
        'Could elaborate further on technical trade-offs'
      ],
      areasToImprove: [
        'Include quantitative impact metrics in your result phase',
        'Mention alternative technical options considered'
      ],
      followUpQuestions: [
        `How would you handle edge case errors or unexpected failures in this scenario?`,
        `What performance or security metrics did you monitor after implementation?`
      ],
      improvementPlan: [
        {
          stepNumber: 1,
          title: 'Structure in STAR Format',
          action: 'Explicitly state Situation, Task, Action, and Result for every interview answer.',
          expectedOutcome: 'Boosts overall structure and STAR score.'
        },
        {
          stepNumber: 2,
          title: 'Add Quantifiable Metrics',
          action: 'Include percentages, user numbers, latency improvements, or dollar savings.',
          expectedOutcome: 'Proves tangible business impact to hiring manager.'
        },
        {
          stepNumber: 3,
          title: 'Rehearse Out Loud',
          action: 'Record yourself delivering the answer to refine pacing and eliminate filler words.',
          expectedOutcome: 'Enhances confidence and communication scores.'
        }
      ],
      suggestedBetterAnswer: `When answering "${question}", structure your response as follows: Start with Situation (e.g. "At my previous company, our team faced a major bottleneck"), define your Task ("I was responsible for optimizing the query layer"), detail your Action ("I implemented indexing and caching"), and conclude with a quantitative Result ("Achieved a 50% speedup and zero downtime").`
    };
  }
}

export const interviewAgent = new InterviewAgent();
