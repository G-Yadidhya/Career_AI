import React, { useState, useMemo } from 'react';
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
  AlertCircle,
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
    sampleResume: `Aditya Sharma | Senior Full-Stack Developer
Email: aditya@example.com | Phone: +1 (555) 019-2834 | San Francisco, CA

Executive Summary:
Software Engineer with 5+ years of experience building scalable web applications with React, TypeScript, Express, and PostgreSQL. Proven track record in optimizing API latency by 40% and deploying high-concurrency cloud services.

Key Skills:
React 19, TypeScript, Node.js, Express, PostgreSQL, Redis, Docker, Tailwind CSS, REST APIs, Git, Jest.

Experience:
Full-Stack Engineer - TechCorp Solutions (2022 - Present)
- Architected microservices serving 100k+ daily users.
- Reduced frontend bundle size by 35% through code splitting and tree shaking.
- Engineered automated CI/CD deployment pipelines on GCP.`,
  },
  {
    role: 'AI / Machine Learning Engineer',
    company: 'OpenAI',
    jobDescription: `Seeking an AI/ML Engineer to build low-latency LLM inference pipelines, fine-tune domain models, and engineer RAG vector retrieval systems. Expertise in Python, PyTorch, CUDA, ChromaDB, FastAPI, and Docker is required. Experience with prompt engineering and safety evaluations is a major plus.`,
    sampleResume: `Dr. Elena Rostova | Senior AI / ML Specialist
Email: elena.rostova@example.com | San Francisco, CA

Summary:
AI Engineer specializing in Retrieval-Augmented Generation (RAG), vector embeddings, and PyTorch model fine-tuning. Engineered enterprise vector search engine handling 2M+ document embeddings with 15ms retrieval latency.

Skills:
Python, PyTorch, RAG, ChromaDB, HuggingFace, FastAPI, Docker, CUDA, Scikit-Learn, Prompt Optimization.`,
  },
  {
    role: 'Technical Product Manager',
    company: 'Datadog',
    jobDescription: `Datadog is hiring a Technical Product Manager to oversee developer observability tools. Responsibilities: Define product roadmap, write detailed PRDs, collaborate with engineering squads, and analyze telemetry metrics. Requirements: 3+ years in B2B SaaS product management, technical background in software development or data engineering.`,
    sampleResume: `Samantha Sterling | Technical Product Manager
Email: samantha@example.com | Seattle, WA

Summary:
Technical PM with 4+ years guiding SaaS products from 0-to-1 launch. Scaled active user retention by 28% and managed cross-functional squads of 12 engineers. Deep background in API product management and SQL analytics.`,
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

  // Initial synthesized cover letter so user is greeted with a complete, beautiful preview
  const defaultInitialResult: CoverLetterResult = useMemo(() => {
    const candidateName = 'Aditya Sharma';
    const targetRole = 'Senior Full-Stack Engineer';
    const compName = 'Stripe';
    const opening = `I am writing to express my enthusiastic application for the ${targetRole} position at ${compName}. With over 5 years of professional engineering experience building resilient web applications using React, TypeScript, and distributed Node.js services, I have long admired Stripe's gold-standard developer tooling, accessible APIs, and mission to increase the GDP of the internet.`;
    const body1 = `In my current role at TechCorp Solutions, I spearheaded the core frontend and API architecture for applications serving over 100,000 daily users. I reduced frontend initial bundle size by 35% through aggressive code splitting and optimized database queries in PostgreSQL, achieving a 40% reduction in high-traffic endpoint response times. My engineering focus on type safety, responsive UX, and scalable microservices directly matches the technical priorities outlined in your job requirements.`;
    const body2 = `Additionally, I have instituted automated CI/CD deployment pipelines and comprehensive test coverage across our cross-functional squads. I take deep pride in translating complex distributed requirements into clean, self-documenting code and reliable user workflows. I welcome the opportunity to bring this commitment to excellence to Stripe's engineering culture.`;
    const closing = `Thank you for considering my application. I look forward to the possibility of discussing how my technical background, architectural discipline, and dedication to craftsmanship can contribute to Stripe's payment platforms.`;
    const fullMarkdown = `**${candidateName}**\n${candidateName.toLowerCase().replace(' ', '.')}@example.com | San Francisco, CA | (555) 019-2834\n\n**Date:** ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}\n**To:** Hiring Team & Engineering Leadership\n**Company:** ${compName}\n**Re:** Application for ${targetRole}\n\nDear Stripe Hiring Team,\n\n${opening}\n\n${body1}\n\n${body2}\n\n${closing}\n\nSincerely,\n\n**${candidateName}**`;

    return {
      candidateName,
      targetRole,
      companyName: compName,
      writingStyle: 'Professional & Confident',
      openingParagraph: opening,
      bodyParagraphs: [body1, body2],
      closingParagraph: closing,
      fullMarkdownText: fullMarkdown,
      highlightedKeywords: ['React 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'REST APIs', 'CI/CD Pipelines', 'Distributed Microservices'],
      matchAlignmentScore: 94
    };
  }, []);

  // Outputs & UI states
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<CoverLetterResult | null>(defaultInitialResult);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'edit'>('preview');

  // Editable text state
  const [editableMarkdown, setEditableMarkdown] = useState(defaultInitialResult.fullMarkdownText || '');

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
    <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
      
      {/* Top Header Banner */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-7 border border-zinc-200/80 dark:border-zinc-800 shadow-xs transition-colors">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2.5 border border-indigo-200/80 dark:border-indigo-800/60">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> AI Cover Letter Studio
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Role-Tailored, ATS-Friendly Cover Letters
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Generate an executive, personalized cover letter linking your background directly to target job requirements. Tailor writing tone, highlight ATS keywords, and export to PDF.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {initialResumeAnalysis && (
              <button
                onClick={handlePrefillResume}
                className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/80 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5" /> Load Parsed Resume
              </button>
            )}
            {onNavigate && (
              <button
                onClick={() => onNavigate('job-matcher')}
                className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <Target className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Match JD First
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs vs Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Presets */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-5 border border-zinc-200/80 dark:border-zinc-800 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <Zap className="w-3.5 h-3.5" /> Quick Role Presets
              </span>
              <span className="text-[11px] font-normal text-zinc-400">Click to auto-fill</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_TEMPLATES.map((tpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickTemplate(tpl)}
                  className="p-2.5 bg-zinc-50 hover:bg-indigo-50/70 dark:bg-zinc-950 dark:hover:bg-zinc-800 text-left rounded-xl border border-zinc-200/80 dark:border-zinc-800 transition-all text-xs group shadow-2xs"
                >
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tpl.role}
                  </p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                    {tpl.company}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Letter Parameters
              </h2>
              <span className="text-xs text-zinc-400">Tailoring Configuration</span>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Role & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> Target Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Full-Stack Engineer"
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> Target Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Stripe, OpenAI, Datadog"
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Writing Style Selection */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> Writing Tone & Delivery Style
                </span>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">5 ATS Tone Presets</span>
              </label>

              <div className="space-y-2">
                {WRITING_STYLES.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSelectedStyle(style.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      selectedStyle === style.id
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/70 border-indigo-400/80 dark:border-indigo-600 text-zinc-900 dark:text-white shadow-xs ring-1 ring-indigo-500/30'
                        : 'bg-zinc-50/70 dark:bg-zinc-950 border-zinc-200/80 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-base leading-none mt-0.5">{style.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                          {style.label}
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                              selectedStyle === style.id
                                ? 'bg-indigo-600 text-white'
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700'
                            }`}
                          >
                            {style.badge}
                          </span>
                        </p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{style.desc}</p>
                      </div>
                    </div>
                    {selectedStyle === style.id && (
                      <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Description Text */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> Target Job Description <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-zinc-400">{jobDescription.length} chars</span>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={4}
                placeholder="Paste key responsibilities and requirements from the target job posting..."
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-sans leading-relaxed shadow-2xs"
              />
            </div>

            {/* Candidate Resume Context */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> Candidate Resume Context <span className="text-red-500">*</span>
                </label>
                {initialResumeAnalysis && (
                  <button
                    type="button"
                    onClick={handlePrefillResume}
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-semibold"
                  >
                    Use parsed resume
                  </button>
                )}
              </div>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={5}
                placeholder="Paste your candidate resume summary, work experience bullets, or key projects..."
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-sans leading-relaxed shadow-2xs"
              />
            </div>

            {/* Generate Action Button */}
            <button
              type="button"
              onClick={() => handleGenerate()}
              disabled={isGenerating}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating ATS Cover Letter...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  Generate Tailored Cover Letter
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Output & Live Preview */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Header controls for output */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Mode:</span>
              <div className="bg-zinc-100/90 dark:bg-zinc-950 p-1 rounded-xl flex items-center gap-1 border border-zinc-200/80 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'preview'
                      ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-2xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> Letter Preview
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('edit')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'edit'
                      ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-2xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" /> Raw Editor
                </button>
              </div>
            </div>

            {result && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleGenerate()}
                  disabled={isGenerating}
                  className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-700 transition-all flex items-center gap-1.5 shadow-2xs"
                  title="Regenerate with current inputs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 ${isGenerating ? 'animate-spin' : ''}`} />
                  Regenerate
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/80 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Copy Text
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handlePrintPDF}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/80 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Print / Export PDF
                </button>
              </div>
            )}
          </div>

          {/* Generating Indicator */}
          {isGenerating && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-12 text-center space-y-5 shadow-xs">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/80 rounded-2xl border border-indigo-200/80 dark:border-indigo-800 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">Writing Role-Tailored Cover Letter...</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                  Aligning candidate background with <strong>{company}</strong> requirements using the <strong>{selectedStyle}</strong> tone.
                </p>
              </div>
              <div className="max-w-xs mx-auto bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-indigo-600 h-full w-2/3 animate-pulse rounded-full" />
              </div>
            </div>
          )}

          {/* Result Content area */}
          {!result && !isGenerating && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-12 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/80 rounded-2xl border border-indigo-200/80 dark:border-indigo-800 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 shadow-2xs">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">No Cover Letter Generated Yet</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Fill in your target job role, company name, job description, and candidate resume on the left, then click <strong>Generate Tailored Cover Letter</strong> to synthesize an ATS-grounded document.
                </p>
                <button
                  type="button"
                  onClick={() => handleGenerate()}
                  className="mt-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 text-xs font-semibold rounded-xl transition-all inline-flex items-center gap-1.5"
                >
                  <Wand2 className="w-3.5 h-3.5" /> Try With Sample Preset
                </button>
              </div>
            </div>
          )}

          {result && !isGenerating && (
            <div className="space-y-6">
              
              {/* ATS Health & Keyword Banner */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-5 space-y-3 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200/80 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-sm shadow-2xs">
                      {result.matchAlignmentScore}%
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> ATS Match Alignment
                      </p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        Tailored for {result.targetRole} at {result.companyName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-200/80 dark:border-indigo-800/80">
                      Tone: {result.writingStyle || selectedStyle}
                    </span>
                  </div>
                </div>

                {/* Highlighted Keywords Tag Bar */}
                {result.highlightedKeywords && result.highlightedKeywords.length > 0 && (
                  <div className="pt-2.5 border-t border-zinc-100 dark:border-zinc-800">
                    <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Target className="w-3 h-3 text-indigo-600 dark:text-indigo-400" /> Integrated ATS Key Terms:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.highlightedKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50/80 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-800 dark:text-indigo-300 text-[11px] font-medium"
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
                <div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-2xl p-8 sm:p-12 shadow-sm border border-zinc-200/90 dark:border-zinc-800 print:shadow-none print:p-0 print:border-none space-y-6 font-sans leading-relaxed">
                  
                  {/* Header / Recipient block */}
                  <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4 flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                        {result.candidateName || 'Alex Johnson'}
                      </h2>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                        Applicant for {result.targetRole}
                      </p>
                    </div>
                    <div className="text-right text-xs text-zinc-500 dark:text-zinc-400">
                      <p>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>

                  {/* Company & Salutation */}
                  <div className="text-xs text-zinc-700 dark:text-zinc-300 space-y-1">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-200">Hiring Team / Engineering Leadership</p>
                    <p className="font-bold text-indigo-600 dark:text-indigo-400">{result.companyName}</p>
                  </div>

                  {/* Salutation */}
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Dear Hiring Team at {result.companyName},
                  </p>

                  {/* Opening Paragraph */}
                  <p className="text-xs sm:text-sm text-zinc-750 dark:text-zinc-300 leading-relaxed font-normal">
                    {result.openingParagraph}
                  </p>

                  {/* Body Paragraphs */}
                  {result.bodyParagraphs && result.bodyParagraphs.map((para, i) => (
                    <p key={i} className="text-xs sm:text-sm text-zinc-750 dark:text-zinc-300 leading-relaxed font-normal">
                      {para}
                    </p>
                  ))}

                  {/* Closing Paragraph */}
                  <p className="text-xs sm:text-sm text-zinc-750 dark:text-zinc-300 leading-relaxed font-normal">
                    {result.closingParagraph}
                  </p>

                  {/* Sign off */}
                  <div className="pt-4 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 space-y-4">
                    <p className="text-zinc-700 dark:text-zinc-300">Sincerely,</p>
                    <div className="font-bold text-zinc-900 dark:text-white text-base">
                      {result.candidateName || 'Alex Johnson'}
                    </div>
                  </div>
                </div>
              )}

              {/* View 2: Raw Text Editor */}
              {activeTab === 'edit' && (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">Direct Markdown Text Editor</span>
                    <span>{editableMarkdown.length} characters</span>
                  </div>
                  <textarea
                    value={editableMarkdown}
                    onChange={(e) => setEditableMarkdown(e.target.value)}
                    rows={18}
                    className="w-full bg-zinc-50/70 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 leading-relaxed shadow-2xs"
                  />
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Edits made here update the text used for copying and printing.
                  </p>
                </div>
              )}

              {/* Tone Switcher Quick Bar */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-5 space-y-3 shadow-xs">
                <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Switch Tone & Regenerate Letter:
                </p>
                <div className="flex flex-wrap gap-2">
                  {WRITING_STYLES.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        setSelectedStyle(st.id);
                        handleGenerate(st.id);
                      }}
                      disabled={isGenerating}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                        selectedStyle === st.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-zinc-800 dark:hover:bg-zinc-800'
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
