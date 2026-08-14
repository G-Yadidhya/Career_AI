import React, { useState } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  FileCheck,
  Zap,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  Wand2,
  Layers,
  Award,
  Eye,
  EyeOff,
  Code2,
  Database,
  Cloud,
  Cpu,
  Terminal,
  Tag,
  GraduationCap,
  Briefcase,
  FolderGit2
} from 'lucide-react';
import { api } from '../services/api';
import { ResumeAnalysis } from '../types';

const getSkillCategoryStyle = (category: string) => {
  switch (category) {
    case 'Programming Languages':
      return { bg: 'bg-indigo-500/10', text: 'text-indigo-300', border: 'border-indigo-500/20', dot: 'bg-indigo-400' };
    case 'Frameworks & Libraries':
      return { bg: 'bg-cyan-500/10', text: 'text-cyan-300', border: 'border-cyan-500/20', dot: 'bg-cyan-400' };
    case 'Databases & Storage':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-300', border: 'border-emerald-500/20', dot: 'bg-emerald-400' };
    case 'Cloud & DevOps':
      return { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/20', dot: 'bg-amber-400' };
    case 'AI & Data Science':
      return { bg: 'bg-purple-500/10', text: 'text-purple-300', border: 'border-purple-500/20', dot: 'bg-purple-400' };
    case 'Developer Tools & Testing':
      return { bg: 'bg-sky-500/10', text: 'text-sky-300', border: 'border-sky-500/20', dot: 'bg-sky-400' };
    case 'Core Concepts & Architecture':
      return { bg: 'bg-teal-500/10', text: 'text-teal-300', border: 'border-teal-500/20', dot: 'bg-teal-400' };
    default:
      return { bg: 'bg-zinc-500/10', text: 'text-zinc-300', border: 'border-zinc-500/20', dot: 'bg-zinc-400' };
  }
};

interface ResumeAnalyzerViewProps {
  onAnalysisComplete: (analysis: ResumeAnalysis) => void;
  existingAnalysis: ResumeAnalysis | null;
}

export const ResumeAnalyzerView: React.FC<ResumeAnalyzerViewProps> = ({
  onAnalysisComplete,
  existingAnalysis,
}) => {
  const [resumeText, setResumeText] = useState(existingAnalysis?.parsedResume?.rawText || '');
  const [fileName, setFileName] = useState(existingAnalysis?.fileName || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(existingAnalysis);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [appliedFixes, setAppliedFixes] = useState<Record<number, boolean>>({});

  const [isExtracting, setIsExtracting] = useState(false);
  const [showRawText, setShowRawText] = useState(false);

  const sampleResume = `ALEX JOHNSON
Email: alex.johnson@example.com | Phone: +1 (555) 019-2831 | Location: San Francisco, CA
GitHub: github.com/alexjohnson | LinkedIn: linkedin.com/in/alexjohnson

PROFESSIONAL SUMMARY
Dynamic Computer Science student & Software Engineer with hands-on experience in full-stack web development, Python microservices, TypeScript, React 19, and cloud-hosted API design. Proven track record building AI-assisted web apps and high-performance backend systems.

TECHNICAL SKILLS
- Programming Languages: Python 3.12, TypeScript, JavaScript, SQL, HTML5, CSS3
- Frontend & UI: React 19, Tailwind CSS, Redux Toolkit, Framer Motion, Vite
- Backend & Databases: Node.js, Express, FastAPI, PostgreSQL, MongoDB, RESTful APIs
- Developer Tools & Version Control: Git, GitHub, VS Code, Postman, Linux Bash

WORK EXPERIENCE
Software Engineering Intern | TechCorp Solutions (June 2025 - August 2025)
- Architected and integrated 6 RESTful API endpoints in Node.js/Express, accelerating client payload response times by 28%.
- Developed reusable UI React components styled with Tailwind CSS, increasing design consistency across 4 sub-modules.
- Participated in daily Agile sprint standups and code reviews to maintain clean code standards.

PROJECTS
AI Resume & Career Advisor with Mock Interview Coach (2026)
- Engineered a full-stack web app featuring ATS resume scoring, job gap matching, and RAG vector search.
- Integrated Gemini 3.6 Flash for automated resume parsing and STAR-format interview response evaluation.
- Utilized Tailwind CSS and Motion for a dark-mode responsive dashboard layout.

Distributed Analytics Ingestion Engine (2025)
- Designed a asynchronous FastAPI backend service handling 5,000 requests/sec with minimal latency.
- Implemented PostgreSQL schema indexing and automated unit testing suites.

EDUCATION
B.Tech in Computer Science & Engineering | State Technological University (2022 - 2026)
- GPA: 3.8 / 4.0 | Dean's Honor Roll (4 Semesters)

CERTIFICATIONS & ACHIEVEMENTS
- Meta Front-End Developer Specialization (Coursera)
- AWS Certified Cloud Practitioner
- Winner - National University Hackathon 2025 (1st Place out of 120 teams)`;

  const handleLoadSample = () => {
    setResumeText(sampleResume);
    setFileName('Alex_Johnson_Resume.pdf');
  };

  const processAndAnalyzeFile = async (file: File) => {
    setFileName(file.name);
    setError(null);
    setIsExtracting(true);
    try {
      // Step 1: Extract clean text from PDF, DOCX, or TXT document
      const parseResult = await api.parseResumeFile(file);
      const text = parseResult.extractedText || '';
      setResumeText(text);

      // Step 2: Automatically run full ATS Audit & Entity Parsing if text is valid
      if (text.trim().length > 20) {
        setIsAnalyzing(true);
        const result = await api.analyzeResume(text, file.name);
        setAnalysis(result);
        onAnalysisComplete(result);
      } else {
        setError('Document uploaded but extracted text was sparse. Please verify file format or paste text manually.');
      }
    } catch (err: any) {
      console.error('File parsing error:', err);
      setError(err?.message || 'Failed to extract text from file. You can still paste text manually below.');
    } finally {
      setIsExtracting(false);
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndAnalyzeFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processAndAnalyzeFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError('Please paste your resume text or upload a document first.');
      return;
    }
    setError(null);
    setIsAnalyzing(true);
    try {
      const result = await api.analyzeResume(resumeText, fileName || 'Uploaded_Resume.pdf');
      setAnalysis(result);
      onAnalysisComplete(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyFix = (idx: number, suggestedText: string) => {
    setAppliedFixes(prev => ({ ...prev, [idx]: true }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in text-white">
      
      {/* Module Title Banner */}
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-3 border border-indigo-500/30">
              <FileText className="w-3.5 h-3.5" /> Module 2 • ATS Resume Auditor & Parser
            </div>
            <h1 className="text-3xl font-light italic tracking-tight text-white">
              AI Resume Auditor & <strong className="font-bold not-italic">ATS Compatibility</strong>
            </h1>
            <p className="text-xs text-zinc-400 mt-2 max-w-2xl leading-relaxed">
              Upload your PDF/DOCX or paste raw resume text. RAG grounded engine extracts skills, computes ATS Score (0–100), highlights formatting flaws, and delivers line-by-line grammar & keyword fixes.
            </p>
          </div>
          <button
            onClick={handleLoadSample}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs font-bold uppercase tracking-widest rounded-full flex items-center gap-2 transition-all self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" /> Load Sample Resume
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Upload & Text Input Box */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
          
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-400" /> Step 1: Upload or Paste Resume
            </h3>
            {fileName && (
              <span className="text-[10px] px-3 py-1 bg-white/10 rounded-full text-indigo-300 font-mono">
                {fileName}
              </span>
            )}
          </div>

          {/* Drag and Drop File Upload Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border border-dashed border-white/20 hover:border-indigo-400/50 rounded-2xl p-6 text-center bg-black/30 transition-colors"
          >
            {isExtracting ? (
              <div className="py-2 flex flex-col items-center justify-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
                <p className="text-xs font-bold uppercase tracking-wider text-white">Extracting text from document...</p>
                <p className="text-[11px] text-zinc-400">PDF / DOCX structure parsing in progress</p>
              </div>
            ) : (
              <>
                <Upload className="w-6 h-6 text-zinc-400 mx-auto mb-2" />
                <p className="text-xs font-bold uppercase tracking-wider text-white">Upload PDF, DOCX, or TXT Resume</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Drag file here or browse from device</p>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-file-input"
                />
                <label
                  htmlFor="resume-file-input"
                  className="mt-4 inline-block px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest cursor-pointer border border-white/10 transition-colors"
                >
                  Browse Files
                </label>
              </>
            )}
          </div>

          {/* Clean Document Status Box (Hides raw unreadable text by default) */}
          {!showRawText && resumeText.trim().length > 0 ? (
            <div className="p-4 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-white uppercase tracking-wider">
                      {fileName || 'Extracted Resume Document'}
                    </p>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      Parsed & Loaded
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                    {resumeText.length.toLocaleString()} Characters • Ready for ATS Audit
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRawText(true)}
                className="text-xs text-zinc-300 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Raw Text</span>
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  {resumeText ? 'Raw Resume Text' : 'Paste Resume Text'}
                </label>
                {resumeText && (
                  <button
                    type="button"
                    onClick={() => setShowRawText(false)}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <EyeOff className="w-3 h-3" /> Hide Raw Text Box
                  </button>
                )}
              </div>
              <textarea
                rows={8}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste complete resume text here (Summary, Work Experience, Skills, Education, Projects)..."
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder-zinc-600 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-2xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full py-3.5 px-6 rounded-full bg-white text-black hover:bg-zinc-200 disabled:opacity-50 font-bold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                <span>Auditing ATS & Extracting Entities...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Run AI ATS Audit & Parsing</span>
              </>
            )}
          </button>

        </div>

        {/* ATS Score & Breakdown Card */}
        {analysis ? (
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-6">
            
            {/* Score Header */}
            <div className="flex items-center justify-between p-6 bg-black/40 rounded-3xl border border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Overall ATS Score</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-5xl font-black text-white tracking-tighter">{analysis.atsScore}</span>
                  <span className="text-xs text-zinc-500 font-mono">/ 100</span>
                </div>
                <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mt-2">
                  {analysis.atsScore >= 80 ? '✓ High ATS Pass Probability' : '⚠ Moderate ATS Filter Risk'}
                </p>
              </div>

              {/* Gauge Circle visual */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="#27272a" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="#6366f1"
                    strokeWidth="8"
                    strokeDasharray={200}
                    strokeDashoffset={200 - (200 * analysis.atsScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <FileCheck className="w-6 h-6 text-indigo-400 absolute" />
              </div>
            </div>

            {/* Sub Metric Bars */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white">ATS Audit Breakdown Criteria</h4>
              
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-300">
                  <span>Keyword Matching & Placement</span>
                  <span className="font-bold text-indigo-400">{analysis.atsBreakdown?.keywordScore ?? 75}%</span>
                </div>
                <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${analysis.atsBreakdown?.keywordScore ?? 75}%` }} />
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-300">
                  <span>Formatting & Hierarchy</span>
                  <span className="font-bold text-emerald-400">{analysis.atsBreakdown?.formattingScore ?? 80}%</span>
                </div>
                <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${analysis.atsBreakdown?.formattingScore ?? 80}%` }} />
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-300">
                  <span>Skills Taxonomy Density</span>
                  <span className="font-bold text-indigo-400">{analysis.atsBreakdown?.skillsMatchScore ?? 70}%</span>
                </div>
                <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${analysis.atsBreakdown?.skillsMatchScore ?? 70}%` }} />
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-300">
                  <span>Experience & Quantified Metrics</span>
                  <span className="font-bold text-white">{analysis.atsBreakdown?.experienceScore ?? 75}%</span>
                </div>
                <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                  <div className="bg-white h-full rounded-full" style={{ width: `${analysis.atsBreakdown?.experienceScore ?? 75}%` }} />
                </div>
              </div>
            </div>

            {/* Extracted Entity Tags */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                  Extracted Skills ({(analysis.parsedResume?.skills || []).length})
                </h4>
                {analysis.parsedResume?.categorizedSkills && analysis.parsedResume.categorizedSkills.length > 0 && (
                  <span className="text-[10px] text-indigo-300/80 font-mono">
                    {analysis.parsedResume.categorizedSkills.length} categories
                  </span>
                )}
              </div>

              {analysis.parsedResume?.categorizedSkills && analysis.parsedResume.categorizedSkills.length > 0 ? (
                <div className="space-y-2.5">
                  {analysis.parsedResume.categorizedSkills.map((cat, cIdx) => {
                    const style = getSkillCategoryStyle(cat.category);
                    return (
                      <div key={cIdx} className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-medium">
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          <span>{cat.category}</span>
                          <span className="text-zinc-600 font-mono text-[9px]">({cat.skills.length})</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className={`text-[10px] px-2.5 py-0.5 rounded-md ${style.bg} ${style.text} border ${style.border} font-mono`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {(analysis.parsedResume?.skills || []).map((skill, idx) => (
                    <span key={idx} className="text-[10px] px-3 py-1 rounded-full bg-white/10 text-indigo-300 border border-white/10 font-mono">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <FileText className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white">No Resume Analyzed Yet</h3>
              <p className="text-xs text-zinc-400 mt-2 max-w-sm leading-relaxed">
                Paste your resume text or click "Load Sample Resume" on the left to generate ATS scores and RAG grounded grammar fixes.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Detailed Analysis Output Sections */}
      {analysis && (
        <div className="space-y-8">
          
          {/* Section 1: Standardized Scores Matrix (Reason, Confidence, Recommendation for ALL 8 Metrics) */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-400" /> Standardized Audit Scores & AI Rationale
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Every score includes transparent reason justification, AI confidence rating, and target recommendations.
                </p>
              </div>
              <span className="text-[10px] px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
                JSON Standardized Output
              </span>
            </div>

            {analysis.detailedScores && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Overall ATS Score', data: analysis.detailedScores.atsScore, icon: FileCheck, color: 'text-indigo-400' },
                  { label: 'Formatting Score', data: analysis.detailedScores.formattingScore, icon: Layers, color: 'text-emerald-400' },
                  { label: 'Readability Score', data: analysis.detailedScores.readabilityScore, icon: BookOpen, color: 'text-indigo-400' },
                  { label: 'Keyword Density', data: analysis.detailedScores.keywordDensityScore, icon: Zap, color: 'text-indigo-400' },
                  { label: 'Grammar & Mechanics', data: analysis.detailedScores.grammarScore, icon: Sparkles, color: 'text-emerald-400' },
                  { label: 'Action Verbs Impact', data: analysis.detailedScores.actionVerbsScore, icon: Wand2, color: 'text-indigo-400' },
                  { label: 'Duplicate Detection', data: analysis.detailedScores.duplicateDetectionScore, icon: Copy, color: 'text-emerald-400' },
                  { label: 'Quantified Achievements', data: analysis.detailedScores.achievementScore, icon: Award, color: 'text-indigo-400' },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  const sd = item.data;
                  if (!sd) return null;

                  return (
                    <div key={idx} className="bg-black/40 border border-white/10 p-5 rounded-2xl flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                            <Icon className={`w-3.5 h-3.5 ${item.color}`} /> {item.label}
                          </span>
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-indigo-300 font-mono font-bold">
                            {Math.round((sd.confidence || 0.95) * 100)}% Conf
                          </span>
                        </div>

                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-3xl font-black text-white">{sd.score}</span>
                          <span className="text-xs text-zinc-500 font-mono">/ 100</span>
                        </div>

                        <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                          <strong className="text-white">Reason:</strong> {sd.reason}
                        </p>

                        {sd.evidence && (
                          <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed italic border-l border-indigo-500/30 pl-2">
                            <strong className="text-zinc-300 font-medium not-italic">Evidence:</strong> "{sd.evidence}"
                          </p>
                        )}
                      </div>

                      <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[11px] text-indigo-200 mt-2 leading-tight">
                        <strong className="text-indigo-300 font-bold uppercase text-[9px] block mb-0.5">Recommendation:</strong>
                        {sd.recommendation}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Action Verbs, Keyword Density, Duplicate Detection & Achievement Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Action Verbs Analysis */}
            {analysis.actionVerbs && (
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-indigo-400" /> Action Verbs Impact
                  </h3>
                  <span className="text-[10px] px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full font-mono font-bold">
                    Score: {analysis.actionVerbs.scoreDetail?.score || 85}/100
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  {analysis.actionVerbs.scoreDetail?.reason}
                </p>

                <div className="space-y-3 pt-1">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1.5">✓ Strong Verbs Detected:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.actionVerbs.detectedVerbs.map((verb, idx) => (
                        <span key={idx} className="text-[10px] px-2.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-lg font-mono">
                          {verb}
                        </span>
                      ))}
                    </div>
                  </div>

                  {analysis.actionVerbs.weakVerbsFound.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block mb-1.5">⚠ Weak / Passive Verbs Found:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.actionVerbs.weakVerbsFound.map((verb, idx) => (
                          <span key={idx} className="text-[10px] px-2.5 py-1 bg-red-500/10 text-red-300 border border-red-500/20 rounded-lg font-mono line-through">
                            {verb}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block mb-1.5">💡 Suggested Power Verbs to Use:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.actionVerbs.suggestedActionVerbs.map((verb, idx) => (
                        <span key={idx} className="text-[10px] px-2.5 py-1 bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 rounded-lg font-mono">
                          + {verb}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Keyword Density Analysis */}
            {analysis.keywordDensity && (
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" /> Keyword Density & Word Counts
                  </h3>
                  <span className="text-[10px] px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full font-mono font-bold">
                    {analysis.keywordDensity.densityPercentage}% Density
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-black/40 p-3 rounded-2xl border border-white/10">
                    <span className="text-2xl font-black text-white">{analysis.keywordDensity.totalWordCount}</span>
                    <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">Total Words</span>
                  </div>
                  <div className="bg-black/40 p-3 rounded-2xl border border-white/10">
                    <span className="text-2xl font-black text-emerald-400">{analysis.keywordDensity.densityPercentage}%</span>
                    <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">Keyword Density</span>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300 block">Top Technical Keywords Found:</span>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(analysis.keywordDensity.keywordsFound || {}).map(([kw, count], idx) => (
                      <span key={idx} className="text-[10px] px-3 py-1 bg-black/40 text-indigo-300 border border-white/10 rounded-full font-mono flex items-center gap-1.5">
                        {kw} <span className="px-1.5 py-0.2 bg-indigo-500/30 text-white rounded-full text-[9px]">{count}x</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Section 3: Achievement Detection & Duplicate Detection Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Achievement & Metrics Detection */}
            {analysis.achievementDetection && (
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-400" /> Achievement Detection
                  </h3>
                  <span className="text-[10px] px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full font-mono font-bold">
                    Score: {analysis.achievementDetection.scoreDetail?.score || 80}/100
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  {analysis.achievementDetection.scoreDetail?.reason}
                </p>

                <div className="space-y-3 pt-1">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1.5">✓ Quantified Accomplishments Found:</span>
                    <ul className="space-y-1.5 text-xs text-emerald-200">
                      {analysis.achievementDetection.quantifiedAchievements.map((item, idx) => (
                        <li key={idx} className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {analysis.achievementDetection.unquantifiedBulletPoints.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1.5">⚠ Bullet Points Needing Metrics:</span>
                      <ul className="space-y-1.5 text-xs text-amber-200">
                        {analysis.achievementDetection.unquantifiedBulletPoints.map((item, idx) => (
                          <li key={idx} className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span className="leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Duplicate Detection */}
            {analysis.duplicateDetection && (
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                    <Copy className="w-4 h-4 text-emerald-400" /> Duplicate Content Detection
                  </h3>
                  <span className="text-[10px] px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full font-mono font-bold">
                    Score: {analysis.duplicateDetection.scoreDetail?.score || 95}/100
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  {analysis.duplicateDetection.scoreDetail?.reason}
                </p>

                {analysis.duplicateDetection.duplicateBulletPoints.length === 0 && analysis.duplicateDetection.repeatedPhrases.length === 0 ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-300 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>No duplicate bullet points or repetitive phrases detected across sections.</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {analysis.duplicateDetection.duplicateBulletPoints.map((item, idx) => (
                      <div key={idx} className="p-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-xs">
                        <strong>Duplicate Bullet:</strong> {item}
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-3 bg-black/40 rounded-xl border border-white/10 text-xs text-zinc-300">
                  <strong className="text-indigo-300 uppercase text-[9px] block mb-0.5">Recommendation:</strong>
                  {analysis.duplicateDetection.scoreDetail?.recommendation}
                </div>
              </div>
            )}

          </div>

          {/* Section 4: Parsed Entities (Categorized Skills, Education, Experience, Projects, Certifications Extractions) */}
          {analysis.parsedResume && (
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" /> Parsed Resume Entities
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Structured entity extraction and skill taxonomy normalization.</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
                  <span>{analysis.parsedResume?.candidateName || 'Candidate'}</span>
                  <span>•</span>
                  <span>{analysis.parsedResume?.email || 'No email detected'}</span>
                </div>
              </div>

              {/* Categorized Technical Skills */}
              {analysis.parsedResume?.categorizedSkills && analysis.parsedResume.categorizedSkills.length > 0 && (
                <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-indigo-400" />
                      Categorized Technical Skills ({analysis.parsedResume.skills.length})
                    </h4>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {analysis.parsedResume.categorizedSkills.length} categories • Normalized
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {analysis.parsedResume.categorizedSkills.map((cat, idx) => {
                      const style = getSkillCategoryStyle(cat.category);
                      return (
                        <div key={idx} className="p-3 bg-white/[0.02] border border-white/10 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                              {cat.category}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono">{cat.skills.length}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {cat.skills.map((skill, sIdx) => (
                              <span
                                key={sIdx}
                                className={`text-[10px] px-2 py-0.5 rounded-md ${style.bg} ${style.text} border ${style.border} font-mono`}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Education Extraction */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                    Education ({(analysis.parsedResume?.education || []).length})
                  </h4>
                  {(analysis.parsedResume?.education || []).length > 0 ? (
                    (analysis.parsedResume?.education || []).map((edu, idx) => (
                      <div key={idx} className="p-3.5 bg-black/40 border border-white/10 rounded-2xl text-xs space-y-1">
                        <p className="font-bold text-white">{edu.degree || 'Degree'}</p>
                        <p className="text-zinc-400">{edu.institution}</p>
                        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-1">
                          <span>{edu.year}</span>
                          {edu.gpa && <span>GPA: {edu.gpa}</span>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-dashed border-white/10 text-center">
                      <p className="text-xs text-zinc-500">No education entries detected in document</p>
                    </div>
                  )}
                </div>

                {/* Experience Extraction */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                    Experience ({(analysis.parsedResume?.experience || []).length})
                  </h4>
                  {(analysis.parsedResume?.experience || []).length > 0 ? (
                    (analysis.parsedResume?.experience || []).map((exp, idx) => (
                      <div key={idx} className="p-3.5 bg-black/40 border border-white/10 rounded-2xl text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-white">{exp.role}</p>
                          <span className="text-[9px] text-zinc-500 font-mono">{exp.duration}</span>
                        </div>
                        <p className="text-zinc-400 text-[11px]">{exp.company}</p>
                        {exp.highlights && exp.highlights.length > 0 && (
                          <ul className="list-disc list-inside text-[10px] text-zinc-300 space-y-0.5 pt-1">
                            {exp.highlights.map((h, i) => (
                              <li key={i} className="truncate">{h}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-dashed border-white/10 text-center">
                      <p className="text-xs text-zinc-500">No work experience entries detected</p>
                    </div>
                  )}
                </div>

                {/* Projects Extraction */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                    <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
                    Projects ({(analysis.parsedResume?.projects || []).length})
                  </h4>
                  {(analysis.parsedResume?.projects || []).length > 0 ? (
                    (analysis.parsedResume?.projects || []).map((proj, idx) => (
                      <div key={idx} className="p-3.5 bg-black/40 border border-white/10 rounded-2xl text-xs space-y-1.5">
                        <p className="font-bold text-white">{proj.title}</p>
                        <p className="text-zinc-400 text-[11px] leading-snug">{proj.description}</p>
                        {proj.technologies && proj.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {proj.technologies.map((t, i) => (
                              <span key={i} className="text-[9px] px-2 py-0.5 bg-white/10 rounded-md text-indigo-300 font-mono">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-dashed border-white/10 text-center">
                      <p className="text-xs text-zinc-500">No projects detected in document</p>
                    </div>
                  )}
                </div>

              </div>

              {/* Certifications & Achievements Row if present */}
              {((analysis.parsedResume?.certifications && analysis.parsedResume.certifications.length > 0) ||
                (analysis.parsedResume?.achievements && analysis.parsedResume.achievements.length > 0)) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                  {analysis.parsedResume.certifications && analysis.parsedResume.certifications.length > 0 && (
                    <div className="p-3.5 bg-black/30 border border-white/10 rounded-2xl space-y-2">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-400" /> Certifications ({analysis.parsedResume.certifications.length})
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.parsedResume.certifications.map((cert, idx) => (
                          <span key={idx} className="text-[10px] px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-200 border border-amber-500/20">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.parsedResume.achievements && analysis.parsedResume.achievements.length > 0 && (
                    <div className="p-3.5 bg-black/30 border border-white/10 rounded-2xl space-y-2">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Key Honors & Achievements ({analysis.parsedResume.achievements.length})
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.parsedResume.achievements.map((ach, idx) => (
                          <span key={idx} className="text-[10px] px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-200 border border-purple-500/20">
                            {ach}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* Strengths & Weaknesses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Strengths */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Key Resume Strengths
              </h3>
              <ul className="space-y-2 text-xs text-zinc-300">
                {analysis.strengths.map((str, idx) => (
                  <li key={idx} className="p-3 bg-black/40 rounded-2xl border border-white/10 flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-indigo-400" /> Areas Needing Improvement
              </h3>
              <ul className="space-y-2 text-xs text-zinc-300">
                {analysis.weaknesses.map((weak, idx) => (
                  <li key={idx} className="p-3 bg-black/40 rounded-2xl border border-white/10 flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{weak}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Line-by-Line Grammar & Impact Bullet Point Fixes */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-indigo-400" /> Line-by-Line Impact & Grammar Fixes
                </h3>
                <p className="text-xs text-zinc-400 mt-1">Transform weak passive duties into quantified STAR achievement statements.</p>
              </div>
              <span className="text-[10px] px-3 py-1 rounded-full bg-white/10 text-indigo-300 font-mono">
                {analysis.grammarSuggestions.length} Fixes Found
              </span>
            </div>

            <div className="space-y-3">
              {analysis.grammarSuggestions.map((fix, idx) => (
                <div key={idx} className="p-4 bg-black/40 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-red-400 font-bold uppercase tracking-wider text-[10px]">Original Text:</span>
                    <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-400 font-bold uppercase tracking-wider">
                      {fix.type || 'impact'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-mono bg-white/5 p-3 rounded-xl line-through">
                    "{fix.originalText}"
                  </p>

                  <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider pt-1">Suggested Optimized Text:</div>
                  <p className="text-xs text-emerald-200 font-mono bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 leading-relaxed">
                    "{fix.suggestedText}"
                  </p>

                  <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                    <span className="text-xs">💡 Reason: {fix.reason}</span>
                    <button
                      onClick={() => handleApplyFix(idx, fix.suggestedText)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
                        appliedFixes[idx]
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-white text-black hover:bg-zinc-200 shadow-md'
                      }`}
                    >
                      {appliedFixes[idx] ? <Check className="w-3.5 h-3.5" /> : null}
                      {appliedFixes[idx] ? 'Applied' : 'Copy Bullet'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Keywords & Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Missing High-Impact ATS Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.missingKeywords.map((kw, idx) => (
                  <span key={idx} className="text-xs px-3 py-1 rounded-full bg-black/40 text-indigo-300 border border-white/10 font-mono">
                    + {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Missing Industry Skill Competencies</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSkills.map((sk, idx) => (
                  <span key={idx} className="text-xs px-3 py-1 rounded-full bg-black/40 text-emerald-300 border border-white/10 font-mono">
                    + {sk}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* RAG Grounded Sources */}
          {analysis.ragSourcesUsed && analysis.ragSourcesUsed.length > 0 && (
            <div className="p-4 bg-black/40 rounded-2xl border border-white/10 text-xs text-zinc-400 space-y-1">
              <span className="font-bold uppercase tracking-widest text-zinc-300 text-[10px]">RAG Knowledge Citations Used for Audit:</span>
              <ul className="list-disc list-inside text-[11px] text-indigo-300 pt-1 space-y-0.5">
                {analysis.ragSourcesUsed.map((source, i) => (
                  <li key={i}>{source}</li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
