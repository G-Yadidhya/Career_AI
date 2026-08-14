import { BaseAgent, AgentResponse } from './baseAgent';
import { AgentSharedMemory } from '../memory/sharedMemory';
import { AIMemoryProfile } from '../types';

export interface CoverLetterResult {
  candidateName: string;
  targetRole: string;
  companyName: string;
  writingStyle?: string;
  openingParagraph: string;
  bodyParagraphs: string[];
  closingParagraph: string;
  fullMarkdownText: string;
  highlightedKeywords: string[];
  matchAlignmentScore: number;
}

export class CoverLetterAgent extends BaseAgent {
  constructor() {
    super('CoverLetterAgent', 'gemini-3.7-flash');
  }

  public async generateCoverLetter(
    jobTitle: string,
    companyName: string,
    jobDescriptionText: string,
    resumeText: string,
    writingStyle: string = 'Professional & Confident',
    sharedMemory?: AgentSharedMemory,
    memoryProfile?: AIMemoryProfile
  ): Promise<AgentResponse<CoverLetterResult>> {
    const startTime = Date.now();

    const ragResult = this.ragEngine.retrieveContext(`${jobTitle} ${companyName}`, 3);

    const styleInstructions: Record<string, string> = {
      'Professional & Confident': 'Use an executive, polished, balanced tone that projects confidence, capability, and career achievement.',
      'Technical & Direct': 'Focus heavily on hard technical architecture, frameworks, system design patterns, exact tech stack alignment, and quantified engineering metrics.',
      'Persuasive & Storytelling': 'Use a compelling narrative arc linking candidate passion, career trajectory, core problem-solving ethos, and why this specific role excites them.',
      'Executive & Strategic': 'Emphasize leadership, cross-functional vision, ROI, team mentorship, product scaling, and business impact.',
      'Creative & Enthusiastic': 'Use an energetic, high-impact, modern tone showcasing enthusiasm, innovation, and startup/product culture fit.'
    };

    const selectedStyleGuide = styleInstructions[writingStyle] || styleInstructions['Professional & Confident'];

    const memoryBlock = memoryProfile ? `
CANDIDATE LONG-TERM AI MEMORY CONTEXT:
- Primary Career Goal: ${memoryProfile.careerGoals.primaryTargetRole || jobTitle}
- Mastered Tech Stack: ${memoryProfile.learningProgress.masteredSkills.join(', ') || 'React, Node.js, TypeScript'}
- Past Resume Highlights: ${memoryProfile.pastResumes.map(r => r.summary).filter(Boolean).slice(0, 2).join('; ')}
- Past Feedback/Coaching Action Items: ${memoryProfile.previousFeedback.map(f => f.summary).slice(0, 2).join('; ')}
(Personalize narrative by subtly incorporating these ongoing career trajectory strengths and addressing past feedback guidance.)` : '';

    const prompt = `You are an Executive Tech Career Coach and Cover Letter Copywriter.
Draft a highly compelling, ATS-tailored cover letter linking the candidate's actual background to the target job description.

WRITING STYLE REQUIREMENT:
Desired Style: ${writingStyle}
Style Guidance: ${selectedStyleGuide}
${memoryBlock}

Taxonomy Ground Truth Context:
${ragResult.contextString}

Job Title: ${jobTitle || 'Target Position'}
Company Name: ${companyName || 'Innovate Tech'}
Job Description:
${jobDescriptionText || 'Full Stack Engineer with React, TypeScript, and Express API expertise.'}

Candidate Resume Context:
${resumeText || 'Candidate with React, TypeScript, Express, and web application development skills.'}

Return a valid JSON object matching EXACTLY this schema:
{
  "candidateName": "Candidate Name extracted or Alex Johnson",
  "targetRole": "${jobTitle || 'Target Role'}",
  "companyName": "${companyName || 'Innovate Tech'}",
  "writingStyle": "${writingStyle}",
  "openingParagraph": "Strong hook tailored in the requested style expressing enthusiastic interest in the target role.",
  "bodyParagraphs": [
    "Paragraph 1 detailing relevant past technical achievements matching job requirements.",
    "Paragraph 2 highlighting problem-solving, cloud architecture, or engineering leadership."
  ],
  "closingParagraph": "Confident call to action proposing a brief conversation.",
  "fullMarkdownText": "Complete formatted cover letter string in Markdown format including salutation and sign-off.",
  "highlightedKeywords": ["React 19", "TypeScript", "REST APIs", "Microservices"],
  "matchAlignmentScore": 92
}`;

    const apiResponse = await this.callGeminiWithRetry((ai, model) =>
      ai.models.generateContent({
        model: model,
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      })
    );

    const parsed = this.parseStructuredJSON<CoverLetterResult>(apiResponse?.text);

    if (parsed && parsed.fullMarkdownText) {
      if (sharedMemory) {
        sharedMemory.saveAgentOutput(this.name, parsed);
      }
      return this.createResult(parsed, startTime, false);
    }

    const fallback: CoverLetterResult = {
      candidateName: 'Alex Johnson',
      targetRole: jobTitle || 'Full Stack Engineer',
      companyName: companyName || 'Target Tech Company',
      openingParagraph: `I am writing to express my strong interest in the ${jobTitle || 'Software Engineering'} position at ${companyName || 'your company'}. With hands-on experience building scalable web applications using React, TypeScript, and Node.js, I am eager to contribute immediately.`,
      bodyParagraphs: [
        `In my recent work, I architected responsive full-stack web applications with React 19 and Express backends, focusing on clean modular architecture and low-latency API integration. My technical portfolio demonstrates a track record of delivering reliable features under tight deadlines.`,
        `Furthermore, I bring a strong foundation in modern software development workflows, version control with Git, automated testing, and cloud deployment practices.`
      ],
      closingParagraph: `I would welcome the opportunity to discuss how my technical skills and passion for clean engineering align with your team's goals. Thank you for your time and consideration.`,
      fullMarkdownText: `**Dear Hiring Team,**\n\nI am writing to express my strong interest in the **${jobTitle || 'Software Engineering'}** position at **${companyName || 'your company'}**...\n\nSincerely,\nAlex Johnson`,
      highlightedKeywords: ['React', 'TypeScript', 'Node.js', 'Express', 'REST APIs'],
      matchAlignmentScore: 88
    };

    if (sharedMemory) {
      sharedMemory.saveAgentOutput(this.name, fallback);
    }
    return this.createResult(fallback, startTime, true);
  }
}

export const coverLetterAgent = new CoverLetterAgent();
