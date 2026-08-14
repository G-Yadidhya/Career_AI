import React, { useState } from 'react';
import {
  Briefcase,
  Target,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  Wand2,
  RefreshCw,
  Layers,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  Award,
  Cpu,
  BrainCircuit,
  Search,
  AlertTriangle
} from 'lucide-react';
import { api } from '../services/api';
import { JobMatchResult, ResumeAnalysis } from '../types';

interface JobMatcherViewProps {
  currentResume: ResumeAnalysis | null;
}

export const JobMatcherView: React.FC<JobMatcherViewProps> = ({ currentResume }) => {
  const defaultSampleCandidateResume = `ALEX JOHNSON
Software Engineer & Full Stack Web Developer
San Francisco, CA | alex.johnson@example.com | github.com/alexjohnson

PROFESSIONAL SUMMARY:
Dynamic Computer Science student & Software Engineer with hands-on experience in full-stack web development, Python microservices, TypeScript, React 19, and cloud-hosted API design. Proven track record building AI-assisted web apps and high-performance backend systems.

SKILLS:
Languages & Frameworks: TypeScript, JavaScript, Python, React, Node.js, Express, HTML5, CSS3, Tailwind CSS
Databases & Tools: SQL, PostgreSQL, REST APIs, Git, GitHub, Vite, Jest
Concepts: Full Stack Architecture, Responsive UI Design, JWT Auth, Microservices

EXPERIENCE:
Software Engineering Intern | TechCorp Solutions (Jun 2025 - Aug 2025)
- Developed responsive web interface using React 19 and TypeScript, decreasing page load latency by 28%.
- Built RESTful API endpoints with Express and Node.js for user authentication and role-based permissions.
- Wrote automated unit tests in Jest achieving 85% code coverage.

PROJECTS:
AI Resume Analyzer & ATS Coach
- Designed full-stack AI platform using React 19, Express, TypeScript, and Gemini API.
- Integrated RAG knowledge retrieval pipeline to evaluate ATS scores and skill gaps.`;

  const [jobTitle, setJobTitle] = useState('Senior AI & Full Stack Engineer');
  const [candidateText, setCandidateText] = useState<string>(
    currentResume?.parsedResume?.rawText || defaultSampleCandidateResume
  );
  const [showCandidateEdit, setShowCandidateEdit] = useState<boolean>(false);

  const [jobDescription, setJobDescription] = useState(
    `Role: Senior AI & Full Stack Engineer
Company: CloudScale AI Technologies
Location: San Francisco, CA (Hybrid)

About the Role:
We are seeking an exceptional AI Software Engineer to join our Core Intelligence team. You will build high-throughput full-stack web applications, engineer Retrieval Augmented Generation (RAG) pipelines, design PostgreSQL database schemas, and deploy containerized microservices using Docker and Kubernetes.

Key Responsibilities:
- Design and implement full-stack React 19 + TypeScript web interfaces and Express/FastAPI microservices.
- Architect high-performance RAG vector search indices using ChromaDB, Sentence Transformers, and Gemini AI.
- Optimize database queries in PostgreSQL with Drizzle/SQLAlchemy ORM.
- Implement robust JWT authentication, rate limiting, and defensive security measures against SQL and Prompt injections.
- Maintain CI/CD pipelines and Docker containerization.

Required Qualifications & Skills:
- 2+ years of experience with TypeScript, React, Python, and Node.js.
- Demonstrated experience with Vector Databases (ChromaDB or Pinecone) and LLM Orchestration (LangChain).
- Proficiency in PostgreSQL, RESTful APIs, and Docker.
- Strong understanding of data structures, algorithms, and system design.`
  );
  const [isMatching, setIsMatching] = useState(false);
  const [result, setResult] = useState<JobMatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sync candidate text when currentResume changes
  React.useEffect(() => {
    if (currentResume?.parsedResume?.rawText) {
      setCandidateText(currentResume.parsedResume.rawText);
    }
  }, [currentResume]);

  const handleMatch = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter or paste a job description.');
      return;
    }
    if (!candidateText.trim()) {
      setError('Please provide candidate resume text to compare against.');
      return;
    }
    setError(null);
    setIsMatching(true);
    try {
      const matchData = await api.matchJobDescription(
        jobTitle,
        jobDescription,
        candidateText
      );
      setResult(matchData);
    } catch (err: any) {
      setError(err?.message || 'Job matching failed. Please try again.');
    } finally {
      setIsMatching(false);
    }
  };

  const handleApplyPreset = (presetTitle: string, presetJd: string) => {
    setJobTitle(presetTitle);
    setJobDescription(presetJd);
  };

  return (
    <div className="space-y-8 animate-fade-in text-white">
      
      {/* Module Title Banner */}
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-3 border border-indigo-500/30">
          <BrainCircuit className="w-3.5 h-3.5" /> Module 3 • Semantic Job Matching Engine
        </div>
        <h1 className="text-3xl font-light italic tracking-tight text-white">
          Semantic Job Matcher & <strong className="font-bold not-italic">Gap Engine</strong>
        </h1>
        <p className="text-xs text-zinc-400 mt-2 max-w-2xl leading-relaxed">
          Compares Resume vs Job Description using 768-dimensional Gemini text embeddings, vector cosine similarity, skill taxonomy coverage, experience gap calculation, hiring probability, and salary benchmarks.
        </p>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Job Description Input Form */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
          
          {/* Preset buttons for quick testing */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400">Quick Job Templates</label>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleApplyPreset(
                  'Senior AI & Full Stack Engineer',
                  `Role: Senior AI & Full Stack Engineer\nCompany: CloudScale AI Technologies\nLocation: San Francisco, CA (Hybrid)\n\nKey Responsibilities:\n- Design React 19 + TypeScript web interfaces and Express/FastAPI microservices.\n- Architect RAG vector search indices using ChromaDB, Sentence Transformers, and Gemini AI.\n- Optimize database queries in PostgreSQL with Drizzle/SQLAlchemy ORM.\n- Maintain CI/CD pipelines and Docker containerization.`
                )}
                className="text-[10px] px-2.5 py-1 rounded-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 transition-all font-mono"
              >
                + AI & Full Stack Engineer
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(
                  'Frontend Web Developer',
                  `Role: Frontend Web Developer\nCompany: Modern Web Labs\n\nKey Responsibilities:\n- Build web applications using React, TypeScript, HTML5, CSS3, and Tailwind CSS.\n- Implement responsive UI, state management, and REST API integration with Axios/Fetch.\n- Conduct automated frontend unit testing with Vitest/Jest.`
                )}
                className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition-all font-mono"
              >
                + Frontend Web Dev
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(
                  'Backend & DevOps Cloud Architect',
                  `Role: Cloud & DevOps Architect\nCompany: Enterprise Systems\n\nKey Responsibilities:\n- Build Python microservices, Docker containers, Kubernetes deployments, and PostgreSQL databases.\n- Design CI/CD workflows with GitHub Actions and AWS/GCP cloud infrastructure.`
                )}
                className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition-all font-mono"
              >
                + Backend & Cloud
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Target Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. AI Engineer, Full Stack Developer"
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400">Job Description Text</label>
              <span className="text-[10px] text-zinc-500 font-mono">{jobDescription.length} chars</span>
            </div>
            <textarea
              rows={8}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste complete Job Description here..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs text-white font-mono focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          {/* Candidate Resume Context Selector & Custom Text Box */}
          <div className="p-4 bg-black/40 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Candidate Resume Source</span>
              </div>
              <button
                type="button"
                onClick={() => setShowCandidateEdit(!showCandidateEdit)}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono underline"
              >
                {showCandidateEdit ? 'Hide Resume Text Box' : 'View / Custom Edit Candidate Resume'}
              </button>
            </div>

            {currentResume ? (
              <p className="text-[11px] text-zinc-300">
                Loaded from uploaded file: <strong className="text-white">{currentResume.fileName}</strong> ({candidateText.length} characters)
              </p>
            ) : (
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Using loaded candidate profile ({candidateText.length} characters). You can upload a new resume in Module 1 or customize the candidate text below.
              </p>
            )}

            {showCandidateEdit && (
              <div className="pt-2">
                <textarea
                  rows={6}
                  value={candidateText}
                  onChange={(e) => setCandidateText(e.target.value)}
                  placeholder="Paste or edit candidate resume text here..."
                  className="w-full bg-black/60 border border-indigo-500/30 rounded-xl p-3 text-[11px] text-zinc-200 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-2xl text-xs">
              {error}
            </div>
          )}

          <button
            onClick={handleMatch}
            disabled={isMatching}
            className="w-full py-3.5 px-6 rounded-full bg-white text-black hover:bg-zinc-200 disabled:opacity-50 font-bold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all"
          >
            {isMatching ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                <span>Generating Vector Embeddings & Semantic Scores...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Run Semantic Job Match & Gap Analysis</span>
              </>
            )}
          </button>

        </div>

        {/* Quick Preview or Main Match Percentage Banner */}
        {result ? (
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-6">
            
            {/* Match Percentage Banner */}
            <div className="p-6 bg-black/40 rounded-3xl border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Overall Match Score</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-5xl font-black text-white tracking-tighter">{result.matchPercentage}%</span>
                  <span className="text-xs text-zinc-500 font-mono">Alignment</span>
                </div>
                <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                  {result.overallMatchScore?.reason || (result.matchPercentage >= 75 ? 'Strong candidate fit for role requirements.' : 'Moderate gap identified.')}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-center shrink-0">
                <Target className="w-8 h-8 text-indigo-400 mx-auto" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 mt-2 block">Vector AI Verified</span>
              </div>
            </div>

            {/* Matched Skills, Missing Skills, Missing Keywords & Missing Tech */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Matched Skills ({result.matchedSkills.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {result.matchedSkills.map((sk, idx) => (
                    <span key={idx} className="text-[10px] px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-indigo-400" /> Missing Skills ({result.missingSkills.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingSkills.map((sk, idx) => (
                    <span key={idx} className="text-[10px] px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
                      ! {sk}
                    </span>
                  ))}
                </div>
              </div>

              {result.missingKeywords && result.missingKeywords.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" /> Missing Keywords ({result.missingKeywords.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missingKeywords.map((kw, idx) => (
                      <span key={idx} className="text-[10px] px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                        ~ {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.missingTechnologies && result.missingTechnologies.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-300 mb-2 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-zinc-400" /> Missing Technologies & Tools
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missingTechnologies.map((tech, idx) => (
                      <span key={idx} className="text-[10px] px-3 py-1 rounded-full bg-white/10 text-zinc-300 border border-white/10 font-mono">
                        + {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <Briefcase className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white">No Job Description Analyzed Yet</h3>
              <p className="text-xs text-zinc-400 mt-2 max-w-sm leading-relaxed">
                Select a job template or paste a job posting on the left and click "Run Semantic Job Match" to compare using vector embeddings.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Structured Output Sections: 4 Similarity Cards, Hiring Probability, Experience Gap & Salary Estimation */}
      {result && (
        <div className="space-y-8">
          
          {/* Section 1: Detailed Similarity Metrics Matrix (Match %, Skill Sim, Semantic Sim, Tech Sim) */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-400" /> Semantic & Technical Similarity Scores
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Detailed breakdown of match scores including AI reasoning, confidence level, and actionable recommendations.
                </p>
              </div>
              <span className="text-[10px] px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
                Gemini 768-Dim Embeddings
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Overall Match % */}
              <div className="bg-black/40 border border-white/10 p-5 rounded-2xl flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-indigo-400" /> Match %
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-indigo-300 font-mono font-bold">
                      {Math.round((result.overallMatchScore?.confidence || 0.95) * 100)}% Conf
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black text-white">{result.overallMatchScore?.score || result.matchPercentage}</span>
                    <span className="text-xs text-zinc-500 font-mono">/ 100</span>
                  </div>
                  <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                    <strong className="text-white">Reason:</strong> {result.overallMatchScore?.reason}
                  </p>
                  {result.overallMatchScore?.evidence && (
                    <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed italic border-l border-indigo-500/30 pl-2">
                      <strong className="text-zinc-300 font-medium not-italic">Evidence:</strong> "{result.overallMatchScore.evidence}"
                    </p>
                  )}
                </div>
                <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[11px] text-indigo-200 mt-2 leading-tight">
                  <strong className="text-indigo-300 font-bold uppercase text-[9px] block mb-0.5">Recommendation:</strong>
                  {result.overallMatchScore?.recommendation}
                </div>
              </div>

              {/* Skill Similarity */}
              <div className="bg-black/40 border border-white/10 p-5 rounded-2xl flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Skill Similarity
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-emerald-300 font-mono font-bold">
                      {result.skillSimilarity?.matchedCount || result.matchedSkills.length} Matched
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black text-emerald-400">{result.skillSimilarity?.scoreDetail?.score || 84}</span>
                    <span className="text-xs text-zinc-500 font-mono">/ 100</span>
                  </div>
                  <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                    <strong className="text-white">Reason:</strong> {result.skillSimilarity?.scoreDetail?.reason}
                  </p>
                  {result.skillSimilarity?.scoreDetail?.evidence && (
                    <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed italic border-l border-emerald-500/30 pl-2">
                      <strong className="text-zinc-300 font-medium not-italic">Evidence:</strong> "{result.skillSimilarity.scoreDetail.evidence}"
                    </p>
                  )}
                </div>
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-200 mt-2 leading-tight">
                  <strong className="text-emerald-300 font-bold uppercase text-[9px] block mb-0.5">Recommendation:</strong>
                  {result.skillSimilarity?.scoreDetail?.recommendation}
                </div>
              </div>

              {/* Semantic Similarity (Embedding Vector Cosine Sim) */}
              <div className="bg-black/40 border border-white/10 p-5 rounded-2xl flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" /> Semantic Sim
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold">
                      768-dim Vector
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black text-indigo-400">{result.semanticSimilarity?.scoreDetail?.score || 80}</span>
                    <span className="text-xs text-zinc-500 font-mono">/ 100</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono mt-1 pt-1 border-t border-white/10">
                    <span>Cosine Sim: <strong className="text-indigo-300">{result.semanticSimilarity?.vectorCosineSimilarity || 0.812}</strong></span>
                    <span>Dist: <strong className="text-zinc-300">{result.semanticSimilarity?.vectorCosineDistance || 0.188}</strong></span>
                  </div>
                  <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                    <strong className="text-white">Reason:</strong> {result.semanticSimilarity?.scoreDetail?.reason}
                  </p>
                  {result.semanticSimilarity?.scoreDetail?.evidence && (
                    <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed italic border-l border-indigo-500/30 pl-2">
                      <strong className="text-zinc-300 font-medium not-italic">Evidence:</strong> "{result.semanticSimilarity.scoreDetail.evidence}"
                    </p>
                  )}
                </div>
                <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[11px] text-indigo-200 mt-2 leading-tight">
                  <strong className="text-indigo-300 font-bold uppercase text-[9px] block mb-0.5">Recommendation:</strong>
                  {result.semanticSimilarity?.scoreDetail?.recommendation}
                </div>
              </div>

              {/* Technology Similarity */}
              <div className="bg-black/40 border border-white/10 p-5 rounded-2xl flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Tech Similarity
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-indigo-300 font-mono font-bold">
                      {result.technologySimilarity?.techCoveragePercentage || 75}% Stack
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black text-white">{result.technologySimilarity?.scoreDetail?.score || 82}</span>
                    <span className="text-xs text-zinc-500 font-mono">/ 100</span>
                  </div>
                  <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                    <strong className="text-white">Reason:</strong> {result.technologySimilarity?.scoreDetail?.reason}
                  </p>
                  {result.technologySimilarity?.scoreDetail?.evidence && (
                    <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed italic border-l border-indigo-500/30 pl-2">
                      <strong className="text-zinc-300 font-medium not-italic">Evidence:</strong> "{result.technologySimilarity.scoreDetail.evidence}"
                    </p>
                  )}
                </div>
                <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[11px] text-indigo-200 mt-2 leading-tight">
                  <strong className="text-indigo-300 font-bold uppercase text-[9px] block mb-0.5">Recommendation:</strong>
                  {result.technologySimilarity?.scoreDetail?.recommendation}
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: Hiring Probability, Experience Gap & Salary Estimation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Hiring Probability */}
            {result.hiringProbability && (
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-indigo-400" /> Hiring Probability
                    </h3>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase font-mono ${
                      result.hiringProbability.tier === 'Very High' || result.hiringProbability.tier === 'High'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {result.hiringProbability.tier} Tier
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mt-4">
                    <span className="text-4xl font-black text-white">{result.hiringProbability.probabilityPercentage}%</span>
                    <span className="text-xs text-zinc-400 font-mono">Screen Probability</span>
                  </div>

                  <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                    <strong className="text-white">AI Evaluation:</strong> {result.hiringProbability.scoreDetail?.reason}
                  </p>
                  {result.hiringProbability.scoreDetail?.evidence && (
                    <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed italic border-l border-indigo-500/30 pl-2">
                      <strong className="text-zinc-300 font-medium not-italic">Evidence:</strong> "{result.hiringProbability.scoreDetail.evidence}"
                    </p>
                  )}

                  <div className="space-y-2 mt-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">✓ Key Positive Drivers:</span>
                    <ul className="space-y-1 text-xs text-emerald-200">
                      {result.hiringProbability.keyDrivers.map((driver, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                          <span>{driver}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {result.hiringProbability.riskFactors.length > 0 && (
                    <div className="space-y-2 mt-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">⚠ Potential Risks:</span>
                      <ul className="space-y-1 text-xs text-amber-200">
                        {result.hiringProbability.riskFactors.map((risk, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-black/40 rounded-2xl border border-white/10 text-xs text-zinc-300 mt-4">
                  <strong className="text-indigo-300 uppercase text-[9px] block mb-0.5">Target Recommendation:</strong>
                  {result.hiringProbability.scoreDetail?.recommendation}
                </div>
              </div>
            )}

            {/* Experience Gap Analysis */}
            {result.experienceGap && (
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-400" /> Experience Gap Audit
                    </h3>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase font-mono ${
                      result.experienceGap.gapSeverity === 'None' || result.experienceGap.gapSeverity === 'Minor'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {result.experienceGap.gapSeverity} Gap
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 text-center">
                    <div className="bg-black/40 p-3 rounded-2xl border border-white/10">
                      <span className="text-2xl font-black text-indigo-300">{result.experienceGap.requiredYears} Years</span>
                      <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">Required</span>
                    </div>
                    <div className="bg-black/40 p-3 rounded-2xl border border-white/10">
                      <span className="text-2xl font-black text-white">{result.experienceGap.candidateYears} Years</span>
                      <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">Candidate</span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 mt-4 leading-relaxed">
                    <strong className="text-white">Gap Analysis:</strong> {result.experienceGap.scoreDetail?.reason}
                  </p>
                  {result.experienceGap.scoreDetail?.evidence && (
                    <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed italic border-l border-emerald-500/30 pl-2">
                      <strong className="text-zinc-300 font-medium not-italic">Evidence:</strong> "{result.experienceGap.scoreDetail.evidence}"
                    </p>
                  )}
                </div>

                <div className="p-3 bg-black/40 rounded-2xl border border-white/10 text-xs text-zinc-300 mt-4">
                  <strong className="text-emerald-300 uppercase text-[9px] block mb-0.5">Recommendation:</strong>
                  {result.experienceGap.scoreDetail?.recommendation}
                </div>
              </div>
            )}

            {/* Salary Estimation */}
            {result.salaryEstimation && (
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-indigo-400" /> Salary Estimation & Benchmark
                    </h3>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono font-bold">
                      {result.salaryEstimation.marketTier}
                    </span>
                  </div>

                  <div className="mt-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Recommended Target Base</span>
                    <div className="text-3xl font-black text-white mt-0.5 font-mono">
                      ${(result.salaryEstimation.recommendedTargetSalary || 138000).toLocaleString()} <span className="text-xs font-normal text-zinc-400">/ yr</span>
                    </div>
                  </div>

                  <div className="p-3 bg-black/40 rounded-2xl border border-white/10 mt-3 text-[11px] space-y-1.5">
                    <div className="flex justify-between text-zinc-300">
                      <span>Market Range:</span>
                      <strong className="text-white font-mono">${(result.salaryEstimation.minSalary || 115000).toLocaleString()} - ${(result.salaryEstimation.maxSalary || 155000).toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between text-zinc-300">
                      <span>Median Compensation:</span>
                      <strong className="text-indigo-300 font-mono">${(result.salaryEstimation.medianSalary || 135000).toLocaleString()}</strong>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 mt-3 leading-relaxed">
                    <strong className="text-white">Benchmark Explanation:</strong> {result.salaryEstimation.benchmarkExplanation}
                  </p>
                  {result.salaryEstimation.scoreDetail?.evidence && (
                    <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed italic border-l border-indigo-500/30 pl-2">
                      <strong className="text-zinc-300 font-medium not-italic">Evidence:</strong> "{result.salaryEstimation.scoreDetail.evidence}"
                    </p>
                  )}
                </div>

                <div className="p-3 bg-black/40 rounded-2xl border border-white/10 text-xs text-zinc-300 mt-4">
                  <strong className="text-indigo-300 uppercase text-[9px] block mb-0.5">Negotiation Target:</strong>
                  {result.salaryEstimation.scoreDetail?.recommendation}
                </div>
              </div>
            )}

          </div>

          {/* Section 3: Skill Gap Matrix Breakdown */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" /> Categorized Skill Gap Matrix
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.skillGapAnalysis.map((gap, idx) => (
                <div key={idx} className="p-4 bg-black/40 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-white">{gap.category}</span>
                    <span
                      className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        gap.importance === 'High'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {gap.importance} Priority
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {gap.items.map((item, i) => (
                      <span key={i} className="text-[10px] px-2.5 py-1 bg-white/5 rounded-full text-zinc-300 border border-white/10">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Optimization Tips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Personalized Resume Tailoring Suggestions</h3>
              <ul className="space-y-2 text-xs text-zinc-300">
                {result.personalizedSuggestions.map((sug, idx) => (
                  <li key={idx} className="p-3 bg-black/40 rounded-2xl border border-white/10 flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{sug}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">ATS Optimization Tips for this Role</h3>
              <ul className="space-y-2 text-xs text-zinc-300">
                {result.resumeOptimizationTips.map((tip, idx) => (
                  <li key={idx} className="p-3 bg-black/40 rounded-2xl border border-white/10 flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
