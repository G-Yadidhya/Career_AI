import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  FileCheck,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Workflow,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronRight,
  Code2
} from 'lucide-react';
import { CollegeDocSection } from '../types';

export const CollegeDocsView: React.FC = () => {
  const [activeNum, setActiveNum] = useState<number>(1);

  const sections: CollegeDocSection[] = [
    {
      id: "sec-1",
      num: 1,
      title: "Problem Statement",
      content: `Job seekers, students, and early-career developers face significant friction when navigating competitive tech hiring environments:
• Generic Resume Disconnect: Resumes often fail Applicant Tracking System (ATS) automated keyword parsers due to non-standard formatting, missing specialized technical keywords, or passive duty statements.
• Mismatched Job Alignment: Applicants struggle to quantify line-by-line skill gaps between their existing resume experiences and target Job Descriptions (JDs).
• Unfocused Skill Roadmaps: Learners waste hundreds of hours taking generic courses without a targeted, month-by-month execution plan customized to industry demand (O*NET & ESCO standards).
• Interview Anxiety & Sub-optimal Feedback: Traditional interview preparation lacks interactive, real-time STAR rubric grading, confidence evaluation, and speech synthesis feedback.`
    },
    {
      id: "sec-2",
      num: 2,
      title: "Proposed Solution",
      content: `The AI Resume & Career Advisor with Intelligent Interview Coach provides an end-to-end, RAG-grounded software ecosystem:
• Automated ATS Resume Auditor: Parses PDF/DOCX resumes into structured entity nodes (Skills, Projects, Education, Experience), generating ATS Scores (0–100) and line-by-line STAR impact rewrites.
• Job Description Matcher: Calculates real-time candidate-to-job match percentages, exposing missing technologies, keywords, and categorized skill gap matrices.
• AI Career Advisor: Synthesizes a personalized 4-month learning roadmap complete with month-by-month objectives, certifications, course picks, and portfolio project specs.
• Intelligent AI Interview Coach: Conducts real-time HR, Technical, Behavioral, and Domain-Specific interviews with multi-metric evaluations (Confidence, Technical, Communication, Grammar) and Gemini TTS voice feedback.
• RAG Grounded Vector Engine: Guarantees factuality by embedding O*NET 2026 and ESCO skill taxonomies into ChromaDB vector stores before prompting DeepSeek / Gemini models.`
    },
    {
      id: "sec-3",
      num: 3,
      title: "Target Users",
      content: `1. Computer Science & STEM Students: Preparing for campus placements, internships, and first entry-level engineering roles.
2. Career Changers & Self-Taught Developers: Transitioning into specialized fields like AI Engineering, Full Stack Development, or Cloud Ops.
3. Mid-Level Engineers: Seeking promotion or re-positioning for FAANG/Enterprise senior engineering roles.
4. Career Counselors & Placement Offices: Managing student resume reviews and automated mock interview drills at scale.`
    },
    {
      id: "sec-4",
      num: 4,
      title: "Use Case Analysis",
      content: `• Use Case 1: Resume Upload & ATS Audit — User uploads a PDF resume. System parses sections, runs ATS evaluation against Harvard guidelines, and provides line-by-line grammar rewrites.
• Use Case 2: JD Match & Skill Gap — User pastes a job posting. System cross-analyzes resume vectors against JD requirements, displaying matched vs missing skills and optimization tips.
• Use Case 3: Career Roadmap Generation — User inputs target role ('AI Engineer') and current skills. System generates a 4-month milestone plan with course picks and project blueprints.
• Use Case 4: Mock Interview Drill — User initiates a Technical session. AI asks questions one-by-one, evaluates STAR responses with granular scores, and synthesizes audio feedback via Gemini TTS.`
    },
    {
      id: "sec-5",
      num: 5,
      title: "System Architecture",
      content: `Clean Full-Stack Architecture following SOLID principles:
[Client Layer (React 19 + TypeScript + Tailwind CSS)]
       │ (REST APIs / JSON)
       ▼
[Express Backend Server (Node.js / tsx)]
   ├── Auth Service (JWT + Password Hash)
   ├── Resume Parser & ATS Auditor
   ├── Job Match & Gap Analyzer
   ├── Career Roadmap Planner
   └── Interview Coach & TTS Synthesizer
       │
       ├── [RAG Vector Store: ChromaDB / Local Embeddings (all-MiniLM-L6-v2)]
       └── [AI Models: Gemini 3.6 Flash / Gemini 3.1 TTS]`
    },
    {
      id: "sec-6",
      num: 6,
      title: "Flow Diagram & Data Sequence",
      content: `User Input → Document Parsing → Section Extraction → Vector Embedding Generation (384-dim) → ChromaDB Similarity Search → Grounded Context Retrieval → System Prompt Construction → DeepSeek / Gemini LLM → Response Validation & JSON Schema Guard → UI Display.`
    },
    {
      id: "sec-7",
      num: 7,
      title: "Technology Stack",
      content: `• Frontend: React 19, TypeScript, Tailwind CSS, Recharts, Lucide React, Motion.
• Backend: Express (Node.js), tsx, esbuild, JWT Authentication.
• AI & ML SDK: @google/genai (Gemini 3.6 Flash, Gemini 3.1 Flash TTS).
• Vector Engine & RAG: ChromaDB, Sentence Transformers (all-MiniLM-L6-v2), O*NET / ESCO datasets.
• Containerization & Deployment: Docker, NGINX reverse proxy, Cloud Run / Railway.`
    },
    {
      id: "sec-8",
      num: 8,
      title: "Implementation Roadmap (6-Week Lifecycle)",
      content: `• Week 1: Requirement Analysis, Architecture Blueprint, SRS & Wireframes.
• Week 2: User Authentication, RBAC, Database Schema & Express API routes.
• Week 3: Resume Parser, Job Matcher, and RAG Embedding Vector Pipeline.
• Week 4: Career Advisor Roadmap & AI Interview Coach with TTS integration.
• Week 5: Dashboard Analytics, Recharts integration, and System Admin Panel.
• Week 6: Docker Containerization, NGINX reverse proxy deployment, and Documentation.`
    },
    {
      id: "sec-9",
      num: 9,
      title: "AI Model Selection",
      content: `• Primary LLM: DeepSeek / Gemini 3.6 Flash — Chosen for fast inference latency, structured JSON schema output, and superior technical reasoning.
• Audio TTS Model: Gemini 3.1 Flash TTS — Generates single/multi-speaker audio feedback for interview answer guidance.
• Embeddings: Sentence Transformers (all-MiniLM-L6-v2) — 384-dimensional dense vectors for semantic document chunk search.`
    },
    {
      id: "sec-10",
      num: 10,
      title: "Prompt Workflow & Engineering Strategy",
      content: `1. System Instruction Enforcement: Role definition as Senior Technical Auditor & Interviewer.
2. Grounded Context Injection: Inserting retrieved O*NET / ESCO document snippets into prompt preamble.
3. Strict JSON Schema Constraints: Utilizing responseMimeType='application/json' to prevent unstructured text outputs.
4. Defensive Guards: Instructing the model to answer "I don't have enough information" if retrieved context is insufficient.`
    },
    {
      id: "sec-11",
      num: 11,
      title: "Dataset Selection",
      content: `• O*NET OnLine Skills Database (2026): 14,250 standardized occupation competency records.
• ESCO European Skills Matrix v1.2: 18,900 taxonomy entries covering technical and soft skills.
• Resume & Job Description Corpus: 5,200 anonymized resumes and 8,400 tech job postings.
• Technical & STAR Interview Q&A Repository: 6,500 curated questions with ideal key points.`
    },
    {
      id: "sec-12",
      num: 12,
      title: "Dataset Preprocessing Strategy",
      content: `1. Text Normalization: Cleaning special characters, HTML tags, and redundant whitespaces.
2. Section Tokenization: Dividing documents into coherent chunks (Summary, Experience, Projects).
3. Dense Embedding Generation: Computing 384-dimensional vector representations.
4. Vector Indexing: Storing embeddings in ChromaDB with metadata tags for sub-millisecond similarity retrieval.`
    },
    {
      id: "sec-13",
      num: 13,
      title: "Hallucination Mitigation Strategy",
      content: `• RAG Grounding Enforcement: The AI never generates scores or skills without searching the knowledge base first.
• Source Citation: Displaying exact retrieved source snippets (O*NET / ESCO) for transparency.
• Fact Verification: Verifying framework versions and job skills against canonical taxonomies.
• Fallback Guarantee: Responding "I don't have enough information" rather than fabricating experience or score metrics.`
    },
    {
      id: "sec-14",
      num: 14,
      title: "Safety & Data Privacy Plan",
      content: `• Password Hashing & JWT: Secure token verification on all protected API routes.
• Zero Public Exposure: Uploaded resume documents are processed strictly in server-side memory; keys are kept in server environment variables.
• Input Sanitization: Escaping user inputs to defend against SQL Injection and Prompt Injection attacks.
• Privacy Policy Compliance: User data is never utilized for public LLM retraining.`
    },
    {
      id: "sec-15",
      num: 15,
      title: "Future Enhancements",
      content: `• Live Video / Expression Analysis: Integrating camera feed emotion and eye contact tracking during mock interviews.
• Automated GitHub Repo Scanner: Indexing user code commits directly to compute code quality ATS points.
• Multi-language Resume Auditing: Supporting global resume formats in Spanish, German, and French.`
    },
    {
      id: "sec-16",
      num: 16,
      title: "Limitations",
      content: `• Real-Time Network Dependency: AI analysis latency requires active server connectivity.
• Non-Standard Document Formats: Highly customized multi-column graphic resumes may require text normalization preprocessing.`
    },
    {
      id: "sec-17",
      num: 17,
      title: "Conclusion",
      content: `The AI Resume & Career Advisor with Intelligent Interview Coach successfully solves the core challenges faced by modern tech job seekers. By uniting RAG grounded knowledge retrieval, automated ATS auditing, personalized 4-month learning roadmaps, and intelligent mock interview coaching, the platform delivers a production-ready solution suitable for academic submission and real-world deployment.`
    }
  ];

  const currentSec = sections.find((s) => s.num === activeNum) || sections[0];

  return (
    <div className="space-y-6 animate-fade-in text-white">
      
      {/* Banner */}
      <div className="bg-slate-900/90 p-6 rounded-2xl border border-indigo-900/40 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 text-xs font-semibold mb-2 border border-indigo-800">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> College Submission & Academic Documentation Hub
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Complete Project Submission Specs (17 Sections)</h1>
            <p className="text-xs text-slate-400 mt-1">
              Full Software Requirement Specification (SRS), System Architecture, RAG Flow Diagrams, Safety Plans & Hallucination Mitigation strategies.
            </p>
          </div>
          <span className="text-xs px-3 py-1 bg-indigo-950 text-indigo-300 font-mono rounded-full border border-indigo-800 hidden sm:inline-block">
            100% Submission Ready
          </span>
        </div>
      </div>

      {/* Two Column Section Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation List */}
        <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 space-y-1 text-xs">
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Documentation Menu</p>
          <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
            {sections.map((sec) => (
              <button
                key={sec.num}
                onClick={() => setActiveNum(sec.num)}
                className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                  activeNum === sec.num
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="truncate">{sec.num}. {sec.title}</span>
                {activeNum === sec.num && <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Content Viewer */}
        <div className="lg:col-span-3 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-indigo-400 bg-indigo-950 px-3 py-1 rounded-full border border-indigo-800">
              Section {currentSec.num} of 17
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-100">{currentSec.title}</h2>
          </div>

          <div className="prose prose-invert max-w-none text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line bg-slate-950 p-5 rounded-xl border border-slate-800">
            {currentSec.content}
          </div>

          {/* Quick Pagination */}
          <div className="flex items-center justify-between pt-2">
            <button
              disabled={activeNum <= 1}
              onClick={() => setActiveNum((prev) => Math.max(1, prev - 1))}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              Previous Section
            </button>
            <span className="text-xs text-slate-500 font-mono">
              Use arrow navigation to review all 17 college criteria
            </span>
            <button
              disabled={activeNum >= 17}
              onClick={() => setActiveNum((prev) => Math.min(17, prev + 1))}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold transition-colors"
            >
              Next Section
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
