import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Building2,
  Briefcase,
  Wand2,
  Copy,
  Check,
  Printer,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Zap,
  Target,
  Edit3,
  Eye,
  Download,
  AlertCircle,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api';
import { CoverLetterResult, WritingStyleType, ResumeAnalysis } from '../types';

interface CoverLetterViewProps {
  initialResumeAnalysis?: ResumeAnalysis | null;
  onNavigate?: (view: string) => void;
}

const WRITING_STYLES: {
  id: WritingStyleType;
  label: string;
  badge: string;
  desc: string;
  icon: string;
}[] = [
  {
    id: 'Professional & Confident',
    label: 'Professional & Confident',
    badge: 'Recommended',
    desc: 'Executive, balanced tone highlighting leadership & proven track record.',
    icon: '👔',
  },
  {
    id: 'Technical & Direct',
    label: 'Technical & Direct',
    badge: 'High ATS',
    desc: 'Focuses heavily on precise architecture, frameworks, & metric numbers.',
    icon: '⚙️',
  },
  {
    id: 'Persuasive & Storytelling',
    label: 'Persuasive & Storytelling',
    badge: 'High Impact',
    desc: 'Compelling career narrative linking personal ethos with company vision.',
    icon: '📖',
  },
  {
    id: 'Executive & Strategic',
    label: 'Executive & Strategic',
    badge: 'Leadership',
    desc: 'Emphasizes business ROI, team mentorship, and organizational growth.',
    icon: '📊',
  },
  {
    id: 'Creative & Enthusiastic',
    label: 'Creative & Enthusiastic',
    badge: 'Startup Fit',
    desc: 'Energetic and passionate approach tailored for modern product culture.',
    icon: '🚀',
  },
];

const SAMPLE_TEMPLATES = [
  {
    role: 'Full-Stack Software Engineer',
    company: 'Stripe',
    jobDescription: `We are looking for a Senior Full-Stack Engineer with experience in React 19, TypeScript, Node.js microservices, and PostgreSQL. You will build high-concurrency payment APIs, optimize database queries, and craft accessible user interfaces. Requirements: 4+ years software development experience, REST API design, CI/CD pipelines, unit testing, and cloud infrastructure knowledge.`,
    sampleResume: `Aditya Sharma | Senior Full-Stack Developer\nEmail: aditya@example.com | Phone: +1 (555) 019-2834 | San Francisco, CA\n\nExecutive Summary:\nSoftware Engineer with 5+ years of experience building scalable web applications with React, TypeScript, Express, and PostgreSQL. Proven track record in optimizing API latency by 40% and deploying high-concurrency cloud services.\n\nKey Skills:\nReact 19, TypeScript, Node.js, Express, PostgreSQL, Redis, Docker, Tailwind CSS, REST APIs, Git, Jest.\n\nExperience:\nFull-Stack Engineer - TechCorp Solutions (2022 - Present)\n- Architected microservices serving 100k+ daily users.\n- Reduced frontend bundle size by 35% through code splitting and tree shaking.\n- Engineered automated CI/CD deployment pipelines on GCP.`,
  },
  {
    role: 'AI / Machine Learning Engineer',
    company: 'OpenAI',
    jobDescription: `Seeking an AI/ML Engineer to build low-latency LLM inference pipelines, fine-tune domain models, and engineer RAG vector retrieval systems. Expertise in Python, PyTorch, CUDA, ChromaDB, FastAPI, and Docker is required. Experience with prompt engineering and safety evaluations is a major plus.`,
    sampleResume: `Dr. Elena Rostova | Senior AI / ML Specialist\nEmail: elena.rostova@example.com | San Francisco, CA\n\nSummary:\nAI Engineer specializing in Retrieval-Augmented Generation (RAG), vector embeddings, and PyTorch model fine-tuning. Engineered enterprise vector search engine handling 2M+ document embeddings with 15ms retrieval latency.\n\nSkills:\nPython, PyTorch, RAG, ChromaDB, HuggingFace, FastAPI, Docker, CUDA, Scikit-Learn, Prompt Optimization.`,
  },
  {
    role: 'Technical Product Manager',
    company: 'Datadog',
    jobDescription: `Datadog is hiring a Technical Product Manager to oversee developer observability tools. Responsibilities: Define product roadmap, write detailed PRDs, collaborate with engineering squads, and analyze telemetry metrics. Requirements: 3+ years in B2B SaaS product management, technical background in software development or data engineering.`,
    sampleResume: `Samantha Sterling | Technical Product Manager\nEmail: samantha@example.com | Seattle, WA\n\nSummary:\nTechnical PM with 4+ years guiding SaaS products from 0-to-1 launch. Scaled active user retention by 28% and managed cross-functional squads of 12 engineers. Deep background in API product management and SQL analytics.`,
  },
];

export const CoverLetterView: React.FC<CoverLetterViewProps> = ({
  initialResumeAnalysis,
  onNavigate,
}) => {
  // Inputs
  const [role, setRole] = useState('Senior Full-Stack Engineer');
  const [company, setCompany] = useState('Stripe');
  const [jobDescription, setJobDescription] = useState(SAMPLE_TEMPLATES[0].jobDescription);
  const [resumeText, setResumeText] = useState(
    initialResumeAnalysis?.parsedResume?.rawText || SAMPLE_TEMPLATES[0].sampleResume
  );
  const [selectedStyle, setSelectedStyle] = useState<WritingStyleType>('Professional & Confident');

  // Outputs & UI states
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<CoverLetterResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'edit' | 'markdown'>('preview');

  // Editable text state
  const [editableMarkdown, setEditableMarkdown] = useState('');

  const handleQuickTemplate = (tpl: typeof SAMPLE_TEMPLATES[0]) => {
    setRole(tpl.role);
    setCompany(tpl.company);
    setJobDescription(tpl.jobDescription);
    setResumeText(tpl.sampleResume);
  };

  const handlePrefillResume = () => {
    if (initialResumeAnalysis?.parsedResume?.rawText) {
      setResumeText(initialResumeAnalysis.parsedResume.rawText);
    }
  };

  const handleGenerate = async (styleToUse?: WritingStyleType) => {
    const style = styleToUse || selectedStyle;
    if (!role.trim()) {
      setErrorMsg('Please enter a target Job Role.');
      return;
    }
    if (!company.trim()) {
      setErrorMsg('Please enter the Target Company Name.');
      return;
    }
    if (!jobDescription.trim()) {
      setErrorMsg('Please enter the Job Description text.');
      return;
    }
    if (!resumeText.trim()) {
      setErrorMsg('Please enter or pre-fill your Resume content.');
      return;
    }

    setErrorMsg(null);
    setIsGenerating(true);

    try {
      const data = await api.generateCoverLetter({
        jobTitle: role,
        companyName: company,
        jobDescriptionText: jobDescription,
        resumeText: resumeText,
        writingStyle: style,
      });

      setResult(data);
      setEditableMarkdown(data.fullMarkdownText || '');
    } catch (err: any) {
      console.error('Error generating cover letter:', err);
      setErrorMsg(err.message || 'Failed to generate cover letter. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = editableMarkdown || result?.fullMarkdownText || '';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 border border-indigo-500/20 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> AI Cover Letter Generator
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Role-Tailored, ATS-Friendly Cover Letters
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Generate a personalized cover letter linking your resume background directly to the target job description. Tailor writing tone, highlight ATS keywords, and export to PDF.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {initialResumeAnalysis && (
              <button
                onClick={handlePrefillResume}
                className="px-4 py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg border border-indigo-400/30 transition-all flex items-center gap-2 shadow-sm"
              >
                <FileText className="w-4 h-4" /> Load Uploaded Resume
              </button>
            )}
            {onNavigate && (
              <button
                onClick={() => onNavigate('job-matcher')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-all flex items-center gap-2"
              >
                <Target className="w-4 h-4 text-emerald-400" /> Match JD First
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs vs Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Presets */}
          <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5 text-indigo-400">
                <Zap className="w-3.5 h-3.5" /> Quick Input Presets
              </span>
              <span>Select one to auto-fill</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_TEMPLATES.map((tpl, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickTemplate(tpl)}
                  className="p-2 bg-slate-800/80 hover:bg-slate-800 text-left rounded-lg border border-slate-700/60 transition-all text-xs text-slate-300 hover:text-white group"
                >
                  <p className="font-medium truncate group-hover:text-indigo-300">{tpl.role}</p>
                  <p className="text-[10px] text-slate-500 truncate">{tpl.company}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 sm:p-6 space-y-5 shadow-lg">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-400" /> Cover Letter Inputs
              </h2>
              <span className="text-xs text-slate-400">Step 1 of 2</span>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-lg text-red-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Role & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Target Role / Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Full-Stack Engineer"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Target Company <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Stripe, Google, Datadog"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Writing Style Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Select Writing Tone / Style
                </span>
                <span className="text-[11px] text-indigo-400 font-normal">5 ATS Styles Available</span>
              </label>

              <div className="space-y-2">
                {WRITING_STYLES.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSelectedStyle(style.id)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-start justify-between gap-3 ${
                      selectedStyle === style.id
                        ? 'bg-indigo-950/70 border-indigo-500/80 text-white shadow-sm ring-1 ring-indigo-500/40'
                        : 'bg-slate-800/50 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-base leading-none mt-0.5">{style.icon}</span>
                      <div>
                        <p className="text-xs font-semibold flex items-center gap-2">
                          {style.label}
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                              selectedStyle === style.id
                                ? 'bg-indigo-500 text-white'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {style.badge}
                          </span>
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{style.desc}</p>
                      </div>
                    </div>
                    {selectedStyle === style.id && (
                      <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Description Text */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Target Job Description <span className="text-red-400">*</span>
                </label>
                <span className="text-[10px] text-slate-500">{jobDescription.length} chars</span>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={4}
                placeholder="Paste the key responsibilities and requirements from the job posting..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
              />
            </div>

            {/* Candidate Resume Context */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" /> Candidate Resume Context <span className="text-red-400">*</span>
                </label>
                {initialResumeAnalysis && (
                  <button
                    onClick={handlePrefillResume}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 underline"
                  >
                    Use parsed resume
                  </button>
                )}
              </div>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={5}
                placeholder="Paste your resume summary, work experience, or key technical achievements here..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
              />
            </div>

            {/* Generate Action Button */}
            <button
              onClick={() => handleGenerate()}
              disabled={isGenerating}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating ATS Cover Letter...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  Generate Cover Letter Now
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Output & Live Preview */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header controls for output */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-200">View Mode:</span>
              <div className="bg-slate-800 p-1 rounded-lg flex items-center gap-1 border border-slate-700">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === 'preview'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> Letter Preview
                </button>
                <button
                  onClick={() => setActiveTab('edit')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === 'edit'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" /> Raw Editor
                </button>
              </div>
            </div>

            {result && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleGenerate()}
                  disabled={isGenerating}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-all flex items-center gap-1.5"
                  title="Regenerate with current inputs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isGenerating ? 'animate-spin' : ''}`} />
                  Regenerate
                </button>

                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 border border-indigo-500/40 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-indigo-400" /> Copy Text
                    </>
                  )}
                </button>

                <button
                  onClick={handlePrintPDF}
                  className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-500/40 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-400" /> Export PDF
                </button>
              </div>
            )}
          </div>

          {/* Result Content area */}
          {!result && !isGenerating && (
            <div className="bg-slate-900/60 rounded-2xl border-2 border-dashed border-slate-800 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-indigo-950/80 rounded-full border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-base font-bold text-white">No Cover Letter Generated Yet</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Fill in your target job role, company name, job description, and candidate resume above, then click <strong>Generate Cover Letter</strong> to craft an ATS-tailored letter.
                </p>
              </div>
            </div>
          )}

          {isGenerating && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center space-y-6 shadow-xl">
              <div className="w-16 h-16 bg-indigo-600/20 rounded-full border border-indigo-500/40 flex items-center justify-center mx-auto text-indigo-400">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Writing Role-Tailored Cover Letter...</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Aligning candidate background with <strong>{company}</strong>'s requirements using the <strong>{selectedStyle}</strong> tone.
                </p>
              </div>
              <div className="max-w-xs mx-auto bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                <div className="bg-indigo-500 h-full w-2/3 animate-pulse rounded-full" />
              </div>
            </div>
          )}

          {result && !isGenerating && (
            <div className="space-y-6">
              {/* ATS Health & Keyword Banner */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm">
                      {result.matchAlignmentScore}%
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" /> ATS Match Alignment
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Tailored for {result.targetRole} at {result.companyName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                      Tone: {result.writingStyle || selectedStyle}
                    </span>
                  </div>
                </div>

                {/* Highlighted Keywords Tag Bar */}
                {result.highlightedKeywords && result.highlightedKeywords.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Target className="w-3 h-3 text-indigo-400" /> Integrated ATS Key Terms:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.highlightedKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/30 text-indigo-200 text-[11px] font-medium"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* View 1: Letter Preview (Document View) */}
              {activeTab === 'preview' && (
                <div className="bg-white text-slate-900 rounded-xl p-8 sm:p-12 shadow-2xl border border-slate-200 print:shadow-none print:p-0 print:border-none space-y-6 font-sans leading-relaxed">
                  {/* Header / Recipient block */}
                  <div className="border-b border-slate-200 pb-4 flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {result.candidateName || 'Alex Johnson'}
                      </h2>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Applicant for {result.targetRole}
                      </p>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      <p>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>

                  {/* Company & Salutation */}
                  <div className="text-xs text-slate-700 space-y-1">
                    <p className="font-semibold text-slate-900">Hiring Team / Engineering Manager</p>
                    <p className="font-bold text-indigo-950">{result.companyName}</p>
                  </div>

                  {/* Salutation */}
                  <p className="text-sm font-semibold text-slate-900">
                    Dear Hiring Team at {result.companyName},
                  </p>

                  {/* Opening Paragraph */}
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                    {result.openingParagraph}
                  </p>

                  {/* Body Paragraphs */}
                  {result.bodyParagraphs && result.bodyParagraphs.map((para, i) => (
                    <p key={i} className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                      {para}
                    </p>
                  ))}

                  {/* Closing Paragraph */}
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                    {result.closingParagraph}
                  </p>

                  {/* Sign off */}
                  <div className="pt-4 text-xs sm:text-sm text-slate-900 space-y-6">
                    <p>Sincerely,</p>
                    <div className="font-bold text-slate-900 text-base">
                      {result.candidateName || 'Alex Johnson'}
                    </div>
                  </div>
                </div>
              )}

              {/* View 2: Raw Text Editor */}
              {activeTab === 'edit' && (
                <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Direct Markdown Text Editor</span>
                    <span>{editableMarkdown.length} characters</span>
                  </div>
                  <textarea
                    value={editableMarkdown}
                    onChange={(e) => setEditableMarkdown(e.target.value)}
                    rows={18}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-500">
                    Edits made here update the text used for copying and exporting.
                  </p>
                </div>
              )}

              {/* Tone Switcher Quick Bar */}
              <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 space-y-3">
                <p className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-400" /> Regenerate Cover Letter in a Different Writing Tone:
                </p>
                <div className="flex flex-wrap gap-2">
                  {WRITING_STYLES.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => {
                        setSelectedStyle(st.id);
                        handleGenerate(st.id);
                      }}
                      disabled={isGenerating}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                        selectedStyle === st.id
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                          : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <span>{st.icon}</span>
                      <span>{st.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
