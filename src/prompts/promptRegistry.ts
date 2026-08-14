import { Type, Schema } from '@google/genai';
export type { Schema };
export { Type };

export interface FewShotExample {
  userInput: string;
  modelOutput: string;
}

export interface PromptTemplateDefinition {
  id: string;
  version: string;
  description: string;
  systemInstruction: string;
  userTemplate: (vars: Record<string, any>) => string;
  fewShots?: FewShotExample[];
  responseSchema?: Schema;
  fallbackTemplateId?: string; 
}

export const PromptRegistry: Record<string, PromptTemplateDefinition> = {};

export function registerPrompt(template: PromptTemplateDefinition) {
  PromptRegistry[`${template.id}_${template.version}`] = template;
}

// ------------------------------------------------------------------
// 1. Resume Analysis Prompts
// ------------------------------------------------------------------

registerPrompt({
  id: 'resume_analysis_strict',
  version: 'v1.0',
  description: 'Strict ATS parsing and metric analysis for standard resumes. Features prompt chaining and output validation.',
  systemInstruction: `You are an elite ATS Parser and Resume Evaluator. Your primary job is to extract exact candidate details directly from the provided candidate resume text with 100% precision.

CRITICAL EXTRACTION MANDATE:
1. Extract ALL structured sections directly from the candidate's resume text:
   - Candidate Name, Email, Phone Number, Professional Summary
   - Technical Skills & Categorization:
     * Extract ONLY actual technical tools, programming languages, frameworks, libraries, databases, cloud services, and core engineering concepts.
     * NEVER extract full sentences, job descriptions, action verbs ("Developed", "Built with"), dates, degrees, or generic soft buzzwords ("communication", "team player", "hard working", "problem solving", "leadership", "passionate").
     * Categorize all extracted skills into standard groups: "Programming Languages", "Frameworks & Libraries", "Databases & Storage", "Cloud & DevOps", "AI & Data Science", "Developer Tools & Testing", "Core Concepts & Architecture", and "Other Technical Skills".
     * Populate both the flat 'skills' array and the structured 'categorizedSkills' array ({ category: string, skills: string[] }).
   - Projects: Extract EVERY project found in the resume. For each project, extract:
     * title: Exact project name
     * description: Full description or combined bullet points of what was built and achieved
     * technologies: Array of technologies/tools specifically mentioned for that project
   - Education: Extract EVERY education entry found in the resume. For each entry, extract:
     * degree: Exact degree or qualification (e.g. "Master of Science in Computer Science", "B.Tech in Information Technology", "Bachelor of Science", "High School Diploma")
     * institution: Exact university, college, institute, or school name (e.g. "Stanford University", "IIT Bombay", "MIT")
     * year: Exact date range or graduation year (e.g. "2020 - 2022", "2016 - 2020", "2022")
     * gpa: GPA, CGPA, percentage, or grade if stated (e.g. "3.9/4.0", "8.8/10", "92%"), or empty string if not mentioned
   - Work Experience: Role title, company name, duration/dates, and all highlight bullet points.
   - Certifications & Achievements: List exact certification titles, honors, or awards found in the candidate resume text.

2. ABSOLUTE ZERO HALLUCINATION RULE:
   - DO NOT hallucinate, manufacture, or insert sample candidate data (e.g. "Alex Johnson", "Stanford", "TypeScript", "React", "State University") if they are not in the candidate's resume text.
   - If a field or section is not present in the candidate resume text, return an empty string "" or empty array [].

3. Compute detailed component scores (0-100) structured as objects with:
   - score (integer 0-100)
   - reason (comprehensive logical justification based ONLY on the candidate's resume)
   - evidence (direct quote or precise snippet from candidate resume text)
   - confidence (float 0.0-1.0)
   - recommendation (actionable advice to improve)

Do not leave reason, evidence, or recommendation empty. Do not invent facts not present in the candidate resume text.`,
  userTemplate: (vars) => `CANDIDATE RESUME TEXT TO PARSE:
==============================
${vars.resumeText}
==============================

REFERENCE ATS EVALUATION GUIDELINES (Use ONLY for scoring metrics, NOT for extracting candidate facts):
${vars.contextString}

TASK: Strictly parse the CANDIDATE RESUME TEXT above into structured sections inside the 'parsedResume' object (candidateName, email, phone, summary, skills, projects, education, experience, certifications, achievements).
Extract ALL education records, projects, and skills explicitly present in the candidate's resume text.
Compute ATS scores and detailed component evaluation, then return the full JSON object.`,
  responseSchema: {
    type: Type.OBJECT,
    properties: {
      atsScore: { type: Type.INTEGER },
      parsedResume: {
        type: Type.OBJECT,
        properties: {
          candidateName: { type: Type.STRING },
          email: { type: Type.STRING },
          phone: { type: Type.STRING },
          summary: { type: Type.STRING },
          skills: { type: Type.ARRAY, items: { type: Type.STRING } },
          categorizedSkills: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                skills: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['category', 'skills']
            }
          },
          projects: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                technologies: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          },
          education: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                degree: { type: Type.STRING },
                institution: { type: Type.STRING },
                year: { type: Type.STRING },
                gpa: { type: Type.STRING }
              }
            }
          },
          experience: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                role: { type: Type.STRING },
                company: { type: Type.STRING },
                duration: { type: Type.STRING },
                highlights: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          },
          certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
          achievements: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      },
      detailedScores: {
        type: Type.OBJECT,
        properties: {
          atsScore: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              reason: { type: Type.STRING },
              evidence: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              recommendation: { type: Type.STRING }
            }
          },
          formattingScore: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              reason: { type: Type.STRING },
              evidence: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              recommendation: { type: Type.STRING }
            }
          },
          readabilityScore: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              reason: { type: Type.STRING },
              evidence: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              recommendation: { type: Type.STRING }
            }
          },
          keywordDensityScore: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              reason: { type: Type.STRING },
              evidence: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              recommendation: { type: Type.STRING }
            }
          },
          grammarScore: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              reason: { type: Type.STRING },
              evidence: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              recommendation: { type: Type.STRING }
            }
          },
          actionVerbsScore: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              reason: { type: Type.STRING },
              evidence: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              recommendation: { type: Type.STRING }
            }
          },
          duplicateDetectionScore: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              reason: { type: Type.STRING },
              evidence: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              recommendation: { type: Type.STRING }
            }
          },
          achievementScore: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              reason: { type: Type.STRING },
              evidence: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              recommendation: { type: Type.STRING }
            }
          }
        }
      },
      resumeSummary: { type: Type.STRING },
      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
      formattingSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
      missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
      missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
      improvementSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
    }
  },
  fallbackTemplateId: 'resume_analysis_relaxed'
});

registerPrompt({
  id: 'resume_analysis_relaxed',
  version: 'v1.0',
  description: 'Relaxed parsing for unstructured, creative, or sparse resumes (Fallback)',
  systemInstruction: `You are a helpful AI assisting a candidate with their resume. Extract candidateName, email, phone, summary, skills, projects, education, experience, certifications, and achievements from the resume text into JSON format.`,
  userTemplate: (vars) => `Please parse this resume text as best as you can into structured sections (candidateName, email, phone, summary, skills, projects, education, experience). Resume: ${vars.resumeText}`
});
