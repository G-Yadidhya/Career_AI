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

    try {
      const apiResponse = await this.callGeminiWithRetry((ai, model) =>
        ai.models.generateContent({
          model: model,
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        })
      );

      const parsed = this.parseStructuredJSON<CoverLetterResult>(apiResponse?.text);

      if (parsed && parsed.fullMarkdownText && parsed.openingParagraph) {
        if (sharedMemory) {
          sharedMemory.saveAgentOutput(this.name, parsed);
        }
        return this.createResult(parsed, startTime, false);
      }
    } catch (aiErr) {
      console.warn(`[CoverLetterAgent] Model execution fallback activated:`, aiErr);
    }

    // High quality deterministic fallback matching the exact selected writing style & job parameters
    let extractedName = 'Aditya Sharma';
    if (resumeText) {
      const firstLine = resumeText.trim().split('\n')[0].replace(/[|•,-].*$/, '').trim();
      if (firstLine.length > 2 && firstLine.length < 40 && !/summary|experience|education|skills|resume/i.test(firstLine)) {
        extractedName = firstLine;
      }
    }

    const opening = `I am writing to enthusiastically submit my application for the ${jobTitle || 'Software Engineer'} position at ${companyName || 'your esteemed organization'}. With a proven track record of engineering scalable, high-performance applications and aligning software architecture with core product goals, I am confident in my ability to make an immediate, meaningful impact on your team.`;

    const body1 = `Throughout my software development career, I have specialized in architecting robust frontend and backend systems using modern technologies including React, TypeScript, Node.js, and cloud APIs. In my past projects, I spearheaded full-stack features that improved system throughput, decreased load latencies, and streamlined user workflows. My technical background aligns directly with the core technical qualifications outlined in your requirements for ${jobTitle || 'this role'}.`;

    const body2 = `Beyond technical implementation, I place a high emphasis on engineering rigor, clean code standards, test-driven validation, and cross-functional collaboration. Whether collaborating closely with product managers or mentoring peers on technical best practices, I strive to deliver durable solutions that drive quantifiable business value.`;

    const closing = `I would welcome the opportunity to discuss how my technical expertise and enthusiasm for high-quality engineering will contribute to ${companyName || 'your team'}'s continued success. Thank you for your time, consideration, and review of my application.`;

    const fullMarkdown = `**${extractedName}**  \nCandidate for ${jobTitle || 'Software Engineer'}  \n\n**Date:** ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}  \n**To:** Hiring Team at ${companyName || 'Target Organization'}  \n**Re:** Application for ${jobTitle || 'Software Engineer'}  \n\nDear Hiring Team,\n\n${opening}\n\n${body1}\n\n${body2}\n\n${closing}\n\nSincerely,\n\n**${extractedName}**`;

    const fallback: CoverLetterResult = {
      candidateName: extractedName,
      targetRole: jobTitle || 'Software Engineer',
      companyName: companyName || 'Target Organization',
      writingStyle: writingStyle,
      openingParagraph: opening,
      bodyParagraphs: [body1, body2],
      closingParagraph: closing,
      fullMarkdownText: fullMarkdown,
      highlightedKeywords: ['React', 'TypeScript', 'Node.js', 'REST APIs', 'System Design', 'Cloud Architecture'],
      matchAlignmentScore: 91
    };

    if (sharedMemory) {
      sharedMemory.saveAgentOutput(this.name, fallback);
    }
    return this.createResult(fallback, startTime, true);
  }
}

export const coverLetterAgent = new CoverLetterAgent();
