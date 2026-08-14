import { BaseAgent, AgentResponse } from './baseAgent';
import { AgentSharedMemory } from '../memory/sharedMemory';

export interface GeneratedResumeData {
  contactInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
  };
  executiveSummary: string;
  technicalSkills: {
    category: string;
    skills: string[];
  }[];
  professionalExperience: {
    title: string;
    company: string;
    location: string;
    dates: string;
    bulletPoints: string[];
  }[];
  projects: {
    title: string;
    techStack: string[];
    link?: string;
    bulletPoints: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
  }[];
  formattedMarkdown: string;
}

export class ResumeBuilderAgent extends BaseAgent {
  constructor() {
    super('ResumeBuilderAgent', 'gemini-3.7-flash');
  }

  public async buildResume(
    existingResumeText: string,
    targetRole: string = 'Software Engineer',
    targetJobDescription?: string,
    sharedMemory?: AgentSharedMemory
  ): Promise<AgentResponse<GeneratedResumeData>> {
    const startTime = Date.now();

    const ragResult = this.ragEngine.retrieveContext(`${targetRole} ${targetJobDescription || ''}`, 3);

    const prompt = `You are a Principal Technical Resume Writer and ATS Architect.
Transform the candidate's draft resume into a high-converting, ATS-optimized, Harvard-style resume structure.

Ground Truth Standard:
${ragResult.contextString}

Target Role: ${targetRole}
Job Description Target:
${targetJobDescription || 'Full Stack & Cloud Software Engineering Position.'}

Candidate Raw Resume:
${existingResumeText || 'Candidate with React, TypeScript, Node.js, and web application experience.'}

Return a valid JSON object matching EXACTLY this structure:
{
  "contactInfo": {
    "fullName": "Alex Johnson",
    "email": "alex.johnson@example.com",
    "phone": "+1 (555) 019-2831",
    "location": "San Francisco, CA",
    "linkedin": "linkedin.com/in/alexjohnson",
    "github": "github.com/alexjohnson"
  },
  "executiveSummary": "Results-driven Full Stack Engineer with expertise in React 19, TypeScript, and Express API services.",
  "technicalSkills": [
    {
      "category": "Frontend & Frameworks",
      "skills": ["React 19", "TypeScript", "Tailwind CSS", "HTML5/CSS3"]
    },
    {
      "category": "Backend & Cloud",
      "skills": ["Node.js", "Express", "PostgreSQL", "Docker", "REST APIs"]
    }
  ],
  "professionalExperience": [
    {
      "title": "Software Development Engineer",
      "company": "Tech Solutions Inc.",
      "location": "San Francisco, CA",
      "dates": "2024 - Present",
      "bulletPoints": [
        "Architected scalable React 19 single-page applications, reducing client load times by 32%.",
        "Engineered server-side Express endpoints with TypeScript type safety and rate limiting."
      ]
    }
  ],
  "projects": [
    {
      "title": "AI Career Coach & ATS Matching Platform",
      "techStack": ["TypeScript", "React", "Express", "Gemini API"],
      "link": "github.com/alexjohnson/ai-career-coach",
      "bulletPoints": [
        "Implemented multi-agent AI pipeline for automated resume parsing and ATS gap detection."
      ]
    }
  ],
  "education": [
    {
      "degree": "B.S. in Computer Science",
      "institution": "State University",
      "year": "2025",
      "gpa": "3.8 / 4.0"
    }
  ],
  "formattedMarkdown": "# Alex Johnson\\nSan Francisco, CA | alex.johnson@example.com\\n\\n## Professional Summary\\nResults-driven engineer..."
}`;

    const apiResponse = await this.callGeminiWithRetry((ai, model) =>
      ai.models.generateContent({
        model: model,
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      })
    );

    const parsed = this.parseStructuredJSON<GeneratedResumeData>(apiResponse?.text);

    if (parsed && parsed.formattedMarkdown) {
      if (sharedMemory) {
        sharedMemory.saveAgentOutput(this.name, parsed);
      }
      return this.createResult(parsed, startTime, false);
    }

    const fallback: GeneratedResumeData = {
      contactInfo: {
        fullName: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        phone: '+1 (555) 019-2831',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/alexjohnson',
        github: 'github.com/alexjohnson'
      },
      executiveSummary: `Results-driven Software Engineer targeting ${targetRole} positions with strong full-stack skills.`,
      technicalSkills: [
        { category: 'Languages & Web', skills: ['TypeScript', 'JavaScript', 'React', 'HTML5/CSS3', 'Node.js'] },
        { category: 'Backend & Data', skills: ['Express', 'PostgreSQL', 'REST APIs', 'Git', 'Docker'] }
      ],
      professionalExperience: [
        {
          title: 'Full Stack Engineer',
          company: 'Tech Solutions Inc.',
          location: 'San Francisco, CA',
          dates: '2024 - Present',
          bulletPoints: [
            'Architected client interfaces using React and TypeScript, boosting response velocity by 25%.',
            'Integrated RESTful express routing with robust input validation and error handling.'
          ]
        }
      ],
      projects: [
        {
          title: 'Full-Stack Web App',
          techStack: ['React', 'TypeScript', 'Node.js'],
          bulletPoints: ['Designed clean single-page interface with responsive Tailwind styling.']
        }
      ],
      education: [
        { degree: 'B.S. Computer Science', institution: 'State University', year: '2025', gpa: '3.8/4.0' }
      ],
      formattedMarkdown: `# Alex Johnson\nalex.johnson@example.com | +1 (555) 019-2831\n\n## Executive Summary\nResults-driven Software Engineer with full stack capabilities.`
    };

    if (sharedMemory) {
      sharedMemory.saveAgentOutput(this.name, fallback);
    }
    return this.createResult(fallback, startTime, true);
  }
}

export const resumeBuilderAgent = new ResumeBuilderAgent();
