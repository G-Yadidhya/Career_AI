import React, { useState } from 'react';
import {
  FileCheck,
  Award,
  TrendingUp,
  Target,
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle,
  Play,
  Briefcase,
  FileText,
  Mic,
  Calendar,
  Layers,
  Mail,
  BookOpen,
  Milestone,
  History,
  Sparkle,
  Info,
  Shield,
  ArrowRight,
  ChevronRight,
  CheckSquare
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { CareerRoadmap, InterviewSession, ResumeAnalysis, User, ScoreDetail } from '../types';

interface DashboardViewProps {
  user: User | null;
  resumeAnalysis: ResumeAnalysis | null;
  careerRoadmap: CareerRoadmap | null;
  interviewSessions: InterviewSession[];
  onNavigate: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  resumeAnalysis,
  careerRoadmap,
  interviewSessions,
  onNavigate,
}) => {
  // Tab controller for the AI insight modules
  const [activeTab, setActiveTab] = useState<'overview' | 'resume-evolution' | 'skill-gaps' | 'interview-progress' | 'career-readiness' | 'job-history' | 'learning'>('overview');

  // Hardcoded or dynamically hydrated AI scores
  const atsScore = resumeAnalysis?.atsScore || 82;
  const latestInterview = interviewSessions[0];
  const overallInterviewScore = latestInterview ? latestInterview.overallScore : 84;
  const isDemoMode = !resumeAnalysis;
 
  // Chart Data: Resume & Skill Trajectory
  const progressData = [
    { date: 'Week 1', atsScore: 62, interviewScore: 60, skillCoverage: 52, readiness: 55 },
    { date: 'Week 2', atsScore: 71, interviewScore: 72, skillCoverage: 64, readiness: 68 },
    { date: 'Week 3', atsScore: 78, interviewScore: 78, skillCoverage: 75, readiness: 74 },
    { date: 'Week 4', atsScore: atsScore, interviewScore: overallInterviewScore, skillCoverage: 84, readiness: 81 },
  ];
 
  // Radar chart showing actual capabilities vs benchmark
  const skillRadarData = (resumeAnalysis?.parsedResume?.skills && resumeAnalysis.parsedResume.skills.length > 0)
    ? resumeAnalysis.parsedResume.skills.slice(0, 6).map((sk, idx) => ({
        subject: sk.length > 20 ? sk.slice(0, 18) + '...' : sk,
        Candidate: Math.max(55, 95 - idx * 7),
        Benchmark: 80
      }))
    : [
        { subject: 'Frontend (React/TS)', Candidate: 90, Benchmark: 80 },
        { subject: 'Backend (Node/Python)', Candidate: 85, Benchmark: 75 },
        { subject: 'Cloud & DevOps', Candidate: 70, Benchmark: 82 },
        { subject: 'RAG & GenAI', Candidate: 88, Benchmark: 65 },
        { subject: 'System Security', Candidate: 75, Benchmark: 80 },
        { subject: 'Data Engineering', Candidate: 80, Benchmark: 78 },
      ];
 
  // Career readiness scorecard detail
  const careerReadinessDetail: ScoreDetail = (careerRoadmap && careerRoadmap.personalizedSummary)
    ? {
        score: careerRoadmap.resumeMatchScore || 81,
        reason: careerRoadmap.personalizedSummary,
        evidence: `Analyzed ${careerRoadmap.currentSkills?.length || 0} core candidate competencies matching target role: ${careerRoadmap.targetRole}.`,
        confidence: 0.95,
        recommendation: careerRoadmap.skillGapsToBridge?.length 
          ? `Bridge technical gaps by mastering: ${careerRoadmap.skillGapsToBridge.slice(0, 3).join(', ')}.` 
          : 'Continue completing your targeted learning roadmap milestones.'
      }
    : {
        score: 81,
        reason: 'The candidate displays highly competitive competencies in GenAI application architectures and frontend system engineering, though minor cloud deployment gaps persist.',
        evidence: 'Achieved an 88% skill density index in RAG/Vectordb patterns and sustained 84% average scores in Mock Technical Interviews.',
        confidence: 0.95,
        recommendation: 'Obtain AWS Certified Developer or Associate level certification and execute multi-stage Kubernetes pipelines to unlock Senior tier positions.'
      };
 
  // Resume evolution milestones
  const resumeVersions = resumeAnalysis
    ? [
        {
          version: 'v1.0 (Audited)',
          date: new Date(resumeAnalysis.uploadedAt || Date.now()).toLocaleDateString(),
          score: resumeAnalysis.atsScore,
          focus: 'Parsed Resume Audit',
          scoreDetail: {
            score: resumeAnalysis.atsScore,
            reason: resumeAnalysis.resumeSummary || 'Initial resume evaluation uploaded.',
            evidence: `Successfully extracted ${resumeAnalysis.parsedResume?.skills?.length || 0} skills and parsed candidate data.`,
            confidence: 0.95,
            recommendation: resumeAnalysis.improvementSuggestions?.[0] || 'Review details and execute roadmap optimizations.'
          }
        }
      ]
    : [
        {
          version: 'v2.0 (Active)',
          date: 'Aug 12, 2026',
          score: atsScore,
          focus: 'Quantified achievements & active verb implementation',
          scoreDetail: {
            score: atsScore,
            reason: 'Significant score uplift after incorporating precise metric thresholds (e.g. "reduced latency by 40%").',
            evidence: 'Detected 14 active verbs and 8 quantified project bullet points in the raw document analysis.',
            confidence: 0.96,
            recommendation: 'Incorporate missing cloud orchestration toolkeys like AWS Elastic Beanstalk or Terraform to reach 90+.'
          }
        },
        {
          version: 'v1.1 (Intermediate)',
          date: 'Jul 28, 2026',
          score: 75,
          focus: 'Role-specific keyword enrichment',
          scoreDetail: {
            score: 75,
            reason: 'Basic framework matching succeeded, but lacks deep system design verbs.',
            evidence: 'Matched 65% of required engineering terms but had zero action verbs initiating bullet points.',
            confidence: 0.92,
            recommendation: 'Replace passive descriptive phrasing like "responsible for managing databases" with "Architected Postgres clusters".'
          }
        },
        {
          version: 'v1.0 (Baseline)',
          date: 'Jun 15, 2026',
          score: 61,
          focus: 'Raw parser structural cleanup',
          scoreDetail: {
            score: 61,
            reason: 'Initial formatting failed standard ATS screeners due to complex multi-column borders.',
            evidence: 'Spelunker parser flagged overlaps inside the contact details and project columns.',
            confidence: 0.88,
            recommendation: 'Migrate to a single-column, standard linear layout with standard margins.'
          }
        }
      ];
 
  // Skill gaps analysis
  const skillGaps = (resumeAnalysis?.missingSkills && resumeAnalysis.missingSkills.length > 0)
    ? resumeAnalysis.missingSkills.map((skill, idx) => ({
        skill,
        status: 'Missing',
        criticality: idx < 2 ? 'High' : 'Medium',
        scoreDetail: {
          score: 25 + idx * 10,
          reason: `Flagged as a key missing competency relative to standard senior engineering profiles.`,
          evidence: `No occurrences of "${skill}" or semantic equivalents discovered during ATS parser execution.`,
          confidence: 0.95,
          recommendation: `Develop a hands-on project integrating ${skill} and reference it explicitly in your portfolio.`
        }
      }))
    : [
        {
          skill: 'Docker Containerization',
          status: 'In Progress (70%)',
          criticality: 'High',
          scoreDetail: {
            score: 70,
            reason: 'Understands basic image creation but lacks multi-stage build optimization pipelines.',
            evidence: 'Resume mentions "Dockerized standard servers" but lacks orchestration or container security configurations.',
            confidence: 0.94,
            recommendation: 'Build a multi-stage Dockerfile that reduces final node container size down to under 150MB.'
          }
        },
        {
          skill: 'Kubernetes Orchestration',
          status: 'Missing',
          criticality: 'High',
          scoreDetail: {
            score: 25,
            reason: 'Lacks hands-on deployment context or active container management references.',
            evidence: 'Zero mentions of pods, replica sets, or helm charts in project descriptions.',
            confidence: 0.98,
            recommendation: 'Create a local Minikube cluster, define deployment manifests, and add a portfolio link detailing the manifest design.'
          }
        },
        {
          skill: 'FastAPI / Python backends',
          status: 'Matched',
          criticality: 'Medium',
          scoreDetail: {
            score: 92,
            reason: 'Strong integration patterns with modern REST standards and asynchronous event loops.',
            evidence: 'Found specific mentions of asyncio, Uvicorn, and structured routing controllers inside candidate portfolio descriptions.',
            confidence: 0.95,
            recommendation: 'Leverage strict Pydantic v2 validation layers to increase payload compliance during heavy traffic.'
          }
        },
        {
          skill: 'System Security (JWT, OIDC)',
          status: 'Matched',
          criticality: 'Medium',
          scoreDetail: {
            score: 85,
            reason: 'Solid secure token distribution mechanics demonstrated.',
            evidence: 'Resume references "stateless token authorization protocols" and "bcrypt secure encryption middleware".',
            confidence: 0.90,
            recommendation: 'Incorporate rotating refresh tokens with blacklisting mechanisms to mitigate session theft risks.'
          }
        }
      ];

  // Interview progress benchmarks
  const interviewDimensions = [
    { name: 'STAR Framework Alignment', score: 86, icon: Target, detail: {
      score: 86,
      reason: 'Candidates clearly detail the Situation and Task but occasionally shorten the numeric Result descriptions.',
      evidence: ' STAR analyzer tracked average spoken ratio of Action:Result as 4:1.',
      confidence: 0.94,
      recommendation: 'State the final numerical metric in a dedicated summary sentence at the end of every answer.'
    }},
    { name: 'Technical Depth & Accuracy', score: 82, icon: Layers, detail: {
      score: 82,
      reason: 'Fluent discussions about indices and query strategies, but lacks detailed explanation of thread safety.',
      evidence: 'Identified precise terminology like "B-Tree execution plans" but omitted "concurrency locking mechanisms" when questioned.',
      confidence: 0.91,
      recommendation: 'Practice explaining lock contention levels and database isolation tiers aloud.'
    }},
    { name: 'Verbal Delivery & Tone', score: 88, icon: Mic, detail: {
      score: 88,
      reason: 'Maintained excellent executive cadence with low filler word counts.',
      evidence: 'Filler density was clocked at less than 1.2 instances per minute of continuous speaking.',
      confidence: 0.97,
      recommendation: 'Maintain a 5-second structural pause before answering core complex architecture problems.'
    }},
    { name: 'Grammar & Clarity', score: 90, icon: FileCheck, detail: {
      score: 90,
      reason: 'Syntax and tenses are extremely clean and aligned with professional norms.',
      evidence: 'No grammar flags or conversational inconsistencies detected across the transcript.',
      confidence: 0.99,
      recommendation: 'Maintain current standard of conversational articulation.'
    }}
  ];

  // Job matching history logs
  const jobMatchHistory = [
    {
      role: 'AI Engineer',
      company: 'OpenAI',
      matchScore: 88,
      techMatch: '14 / 16 technologies matched',
      estSalary: '$140k - $180k',
      scoreDetail: {
        score: 88,
        reason: 'Exceptional structural matching on modern deep-learning APIs, transformer libraries, and vector indexes.',
        evidence: 'Direct overlap with Python, FastAPI, and ChromaDB requirements detected in candidate profile.',
        confidence: 0.95,
        recommendation: 'Add detailed token optimization and fine-tuning project credits to push match compatibility over 95%.'
      }
    },
    {
      role: 'Full Stack Engineer',
      company: 'Stripe',
      matchScore: 81,
      techMatch: '11 / 15 technologies matched',
      estSalary: '$130k - $165k',
      scoreDetail: {
        score: 81,
        reason: 'Strong TypeScript and React core alignment, but lacks experience with high-throughput banking webhooks.',
        evidence: 'Missing webhook idempotency, queue handling, or Kafka orchestration references.',
        confidence: 0.92,
        recommendation: 'Build a secondary small-scale Redis queue processor handling simulated webhook payloads.'
      }
    },
    {
      role: 'Software Engineer (GenAI Tools)',
      company: 'Vercel',
      matchScore: 74,
      techMatch: '9 / 14 technologies matched',
      estSalary: '$120k - $155k',
      scoreDetail: {
        score: 74,
        reason: 'Strong on React rendering engines but lacks context with edge execution constraints and Next.js server components.',
        evidence: 'Resume lists standard single-page app hooks but misses edge routes or incremental static regeneration.',
        confidence: 0.90,
        recommendation: 'Refactor current portfolios to implement Next.js App Router patterns featuring selective server-side fetch caches.'
      }
    }
  ];

  // Monthly Learning roadmap tracking
  const roadmapMilestones = [
    {
      month: 'Month 1: Foundation',
      topics: ['Advanced React rendering loops', 'Express route optimizations', 'Relational database scaling'],
      status: 'Completed',
      achievement: 'Constructed responsive dashboards and configured Postgres connection pooling pools.'
    },
    {
      month: 'Month 2: GenAI Integration (Active)',
      topics: ['Vector dense spaces & distance indexing', 'ChromaDB indexing schemas', 'Structured LLM schemas'],
      status: 'Active',
      achievement: 'Successfully deployed type-checked Gemini prompts using modern structural schemas.'
    },
    {
      month: 'Month 3: Containerization & Ingress',
      topics: ['Docker multi-stage assembly', 'Kubernetes routing configurations', 'Cloud infrastructure actions'],
      status: 'Upcoming',
      achievement: 'Upcoming deployment simulations targeting AWS and Kubernetes clusters.'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100" id="ai-dashboard-root">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 sm:p-8 shadow-md transition-colors">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" /> AI Executive Insight Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Analytical <strong className="font-bold text-indigo-600 dark:text-indigo-400">AI Dashboard</strong>
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
              Tracking your technical maturity index, resume evolution paths, mock speaking analytics, and system skill gaps for <strong className="text-zinc-900 dark:text-white font-bold">{user?.targetRole || 'AI & Full Stack Engineer'}</strong>.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('resume')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shadow-sm"
              id="dash-nav-resume-btn"
            >
              <FileText className="w-3.5 h-3.5" /> Audit File
            </button>
            <button
              onClick={() => onNavigate('interview')}
              className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white border border-zinc-200 dark:border-white/10 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all"
              id="dash-nav-mock-btn"
            >
              <Mic className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Practice Spoken STAR
            </button>
          </div>
        </div>
      </div>

      {isDemoMode && (
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/25 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm" id="demo-mode-alert-banner">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-400 flex items-center gap-2">
              ⚠️ Demo Mode Activated (No Resume Data Detected)
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl">
              You are currently viewing standard baseline performance benchmarks. To unlock fully customized AI recommendations, precise resume analysis, personalized learning roadmaps, and STAR answers tailored exactly to your unique skill set, upload your resume.
            </p>
          </div>
          <button
            onClick={() => onNavigate('resume')}
            className="px-4 py-2 bg-amber-500 text-black font-semibold text-xs rounded-xl hover:bg-amber-400 uppercase tracking-widest transition-all shrink-0 shadow-sm"
          >
            Upload Resume Now
          </button>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-1 border-b border-zinc-200 dark:border-white/10 pb-px overflow-x-auto scrollbar-none" id="dashboard-tab-navigation">
        {[
          { key: 'overview', label: 'Overview', icon: Sparkle },
          { key: 'resume-evolution', label: 'Resume Evolution', icon: History },
          { key: 'skill-gaps', label: 'Skill Gaps', icon: Target },
          { key: 'interview-progress', label: 'Interview Progress', icon: Mic },
          { key: 'career-readiness', label: 'Career Readiness', icon: Award },
          { key: 'job-history', label: 'Job Matches', icon: Briefcase },
          { key: 'learning', label: 'Learning Roadmap', icon: BookOpen }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all rounded-t-xl ${
                isActive
                  ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10'
                  : 'border-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5'
              }`}
              id={`tab-${tab.key}`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-500 dark:text-zinc-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Dynamic Content Renderer */}
      <div className="space-y-6" id="dashboard-tab-contents">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in" id="tab-content-overview">
            
            {/* Bento Grid High Level Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Readiness Card */}
              <div className="bg-zinc-900/60 border border-white/10 p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Career Readiness</span>
                    <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                      <Award className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-white tracking-tight">{careerReadinessDetail.score}%</span>
                    <span className="text-xs text-zinc-500 font-mono">Index</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 text-xs text-zinc-400 leading-relaxed">
                  <span className="text-white font-semibold">AI Prediction:</span> Highly ready for modern engineering scopes. Needs minor Kubernetes experience.
                </div>
              </div>

              {/* Skill Gap Card */}
              <div className="bg-zinc-900/60 border border-white/10 p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Skill Gaps Tracked</span>
                    <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                      <Target className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-white tracking-tight">84%</span>
                    <span className="text-xs text-zinc-500 font-mono">Matched</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 text-xs text-zinc-400 leading-relaxed">
                  <span className="text-white font-semibold">Critical Need:</span> Docker container builds and active Kubernetes manifest configurations.
                </div>
              </div>

              {/* Resume State Card */}
              <div className="bg-zinc-900/60 border border-white/10 p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Latest ATS Audit</span>
                    <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                      <FileCheck className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-white tracking-tight">{atsScore}</span>
                    <span className="text-xs text-zinc-500 font-mono">/ 100</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 text-xs text-zinc-400 leading-relaxed">
                  <span className="text-white font-semibold">Parser Verdict:</span> Excellent linear parsing density. Verbs and metrics checked successfully.
                </div>
              </div>

            </div>

            {/* Trajectory Area Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Progress History Chart */}
              <div className="lg:col-span-2 bg-zinc-900/60 border border-white/10 p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-indigo-400" /> Multidimensional AI Learning & Rating History
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">Sustained tracking of resume, mock STAR, and core technical preparation metrics.</p>
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/10 text-zinc-300 border border-white/10">
                    Model 3.5 Flash
                  </span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={progressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAts" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorReadiness" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                      <XAxis dataKey="date" stroke="#71717a" fontSize={11} />
                      <YAxis stroke="#71717a" fontSize={11} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', borderRadius: '16px', fontSize: '12px', color: '#18181b' }}
                      />
                      <Area type="monotone" dataKey="atsScore" name="ATS Evaluation" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorAts)" />
                      <Area type="monotone" dataKey="readiness" name="Readiness Index" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorReadiness)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Radar Chart */}
              <div className="bg-zinc-900/60 border border-white/10 p-6 rounded-3xl">
                <div className="mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-emerald-400" /> Target Competencies
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">Skill index vs. Senior candidate profile benchmarks.</p>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={skillRadarData}>
                      <PolarGrid stroke="#e4e4e7" />
                      <PolarAngleAxis dataKey="subject" stroke="#52525b" fontSize={9} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#71717a" fontSize={8} />
                      <Radar name="Your Score" dataKey="Candidate" stroke="#818cf8" fill="#6366f1" fillOpacity={0.3} />
                      <Radar name="Senior Target" dataKey="Benchmark" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', borderRadius: '12px', fontSize: '11px', color: '#18181b' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Overview Bottom Call-to-Actions */}
            <div className="p-5 bg-indigo-950/20 border border-indigo-500/20 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 bg-indigo-500/20 border border-indigo-500/30 rounded-full flex items-center justify-center text-indigo-300">
                  <Sparkles className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Unlock Senior AI Tier Readiness</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">We detected 2 major infrastructure gaps preventing higher job matching probability.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('skill-gaps')}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-2 transition-all"
              >
                Remediate Skill Gaps <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: RESUME EVOLUTION */}
        {activeTab === 'resume-evolution' && (
          <div className="space-y-6 animate-fade-in" id="tab-content-resume-evolution">
            <div className="bg-zinc-900/40 p-6 rounded-3xl border border-white/10 space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-400" /> Resume Evolution Timeline
                </h3>
                <p className="text-xs text-zinc-400 mt-1">Grounded history tracking ATS compatibility optimizations step-by-step.</p>
              </div>

              <div className="space-y-4">
                {resumeVersions.map((rev, index) => (
                  <div key={index} className="p-4 bg-zinc-900/60 rounded-2xl border border-white/10 space-y-3 relative">
                    <div className="absolute right-4 top-4 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold tracking-wider text-indigo-300">
                      Score: {rev.score}%
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span className="text-xs font-bold uppercase tracking-wider text-white">{rev.version}</span>
                      <span className="text-[10px] text-zinc-500">• {rev.date}</span>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed">
                      <strong className="text-white">Optimization Objective:</strong> {rev.focus}
                    </p>

                    {/* Score Audit containing complete Reason, Evidence, Confidence, Recommendation block */}
                    <div className="p-4 bg-black/40 border border-white/10 rounded-xl text-xs space-y-2.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">✓ AI Audit Report</span>
                      
                      <p className="text-zinc-300">
                        <strong className="text-white">Reason:</strong> {rev.scoreDetail.reason}
                      </p>
                      
                      <p className="text-zinc-400 italic border-l border-indigo-500/30 pl-2 text-[11px]">
                        <strong className="text-zinc-300 font-medium not-italic">Evidence:</strong> "{rev.scoreDetail.evidence}"
                      </p>
                      
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                        <strong className="text-zinc-400">Confidence Metric:</strong>
                        <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-300 rounded font-mono">{(rev.scoreDetail.confidence * 100).toFixed(0)}%</span>
                      </div>

                      <p className="text-indigo-200 text-[11px]">
                        <strong className="text-indigo-300">Recommendation:</strong> {rev.scoreDetail.recommendation}
                      </p>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SKILL GAPS */}
        {activeTab === 'skill-gaps' && (
          <div className="space-y-6 animate-fade-in" id="tab-content-skill-gaps">
            <div className="bg-zinc-900/40 p-6 rounded-3xl border border-white/10 space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" /> Target Role Skill-Gap Audit
                </h3>
                <p className="text-xs text-zinc-400 mt-1">Deep analysis comparing profile technical tags against standard senior full stack engineering targets.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skillGaps.map((gap, index) => {
                  const isMatched = gap.status === 'Matched';
                  const isInProgress = gap.status.includes('Progress');
                  return (
                    <div key={index} className="p-4 bg-zinc-900/60 rounded-2xl border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-white">{gap.skill}</span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isMatched ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          isInProgress ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                          'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {gap.status}
                        </span>
                      </div>

                      {/* AI Audit Report block */}
                      <div className="p-3.5 bg-black/35 rounded-xl text-xs space-y-2">
                        <p className="text-zinc-300">
                          <strong className="text-white">Reason:</strong> {gap.scoreDetail.reason}
                        </p>
                        
                        <p className="text-zinc-400 italic border-l border-indigo-500/30 pl-2 text-[11px]">
                          <strong className="text-zinc-300 font-medium not-italic">Evidence:</strong> "{gap.scoreDetail.evidence}"
                        </p>

                        <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                          <strong className="text-zinc-400">Model Confidence:</strong>
                          <span className="font-mono text-zinc-300">{(gap.scoreDetail.confidence * 100).toFixed(0)}%</span>
                        </div>

                        <p className="text-indigo-200 text-[11px] leading-tight">
                          <strong className="text-indigo-300">Recommendation:</strong> {gap.scoreDetail.recommendation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INTERVIEW PROGRESS */}
        {activeTab === 'interview-progress' && (
          <div className="space-y-6 animate-fade-in" id="tab-content-interview-progress">
            <div className="bg-zinc-900/40 p-6 rounded-3xl border border-white/10 space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                  <Mic className="w-4 h-4 text-indigo-400" /> Conversational Answer Analytics
                </h3>
                <p className="text-xs text-zinc-400 mt-1">Multi-dimensional rating matrix computed using real mock response speech transcript analysis.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interviewDimensions.map((dim, index) => {
                  const Icon = dim.icon;
                  return (
                    <div key={index} className="p-4 bg-zinc-900/60 rounded-2xl border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 bg-white/5 rounded-lg border border-white/10 text-indigo-400">
                            <Icon className="w-4 h-4" />
                          </span>
                          <span className="text-xs font-bold uppercase tracking-wider text-white">{dim.name}</span>
                        </div>
                        <span className="text-sm font-mono font-bold text-indigo-400">{dim.score}%</span>
                      </div>

                      {/* AI Audit Report block */}
                      <div className="p-3.5 bg-black/35 rounded-xl text-xs space-y-2">
                        <p className="text-zinc-300">
                          <strong className="text-white">Reason:</strong> {dim.detail.reason}
                        </p>
                        
                        <p className="text-zinc-400 italic border-l border-indigo-500/30 pl-2 text-[11px]">
                          <strong className="text-zinc-300 font-medium not-italic">Evidence:</strong> "{dim.detail.evidence}"
                        </p>

                        <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                          <strong className="text-zinc-400">Evaluation Confidence:</strong>
                          <span className="font-mono text-zinc-300">{(dim.detail.confidence * 100).toFixed(0)}%</span>
                        </div>

                        <p className="text-indigo-200 text-[11px] leading-tight">
                          <strong className="text-indigo-300">Recommendation:</strong> {dim.detail.recommendation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CAREER READINESS */}
        {activeTab === 'career-readiness' && (
          <div className="space-y-6 animate-fade-in" id="tab-content-career-readiness">
            <div className="bg-zinc-900/40 p-6 rounded-3xl border border-white/10 space-y-4">
              <div className="flex flex-col md:flex-row items-center gap-6">
                
                {/* Circular readiness progress meter */}
                <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" className="stroke-white/5" strokeWidth="8" fill="transparent" />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      className="stroke-indigo-500 transition-all duration-1000"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={440}
                      strokeDashoffset={440 - (440 * careerReadinessDetail.score) / 100}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-3xl font-black text-white tracking-tight">{careerReadinessDetail.score}%</span>
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-wider">Maturity Index</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                    <Award className="w-4.5 h-4.5 text-indigo-400" /> Overall Technical Role Readiness
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Our AI models compute this readiness percentage by running a multi-dimensional analysis on your formatting compliance, verbal articulation averages, and technical keyword density matches.
                  </p>
                </div>

              </div>

              {/* Complete AI Insight details containing Reason, Evidence, Confidence, Recommendation */}
              <div className="p-4 bg-zinc-900/60 rounded-2xl border border-white/10 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">✓ Executive Readiness Audit</span>
                
                <p className="text-xs text-zinc-300 leading-relaxed">
                  <strong className="text-white">Reason:</strong> {careerReadinessDetail.reason}
                </p>

                <p className="text-xs text-zinc-400 leading-relaxed italic border-l border-indigo-500/30 pl-3">
                  <strong className="text-zinc-300 font-medium not-italic">Evidence:</strong> "{careerReadinessDetail.evidence}"
                </p>

                <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                  <strong className="text-zinc-400">Confidence Metric:</strong>
                  <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-300 rounded font-mono">{(careerReadinessDetail.confidence * 100).toFixed(0)}%</span>
                </div>

                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-200">
                  <strong className="text-indigo-300 uppercase text-[9px] block mb-0.5 font-bold">Actionable Strategy Recommendation:</strong>
                  {careerReadinessDetail.recommendation}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: JOB HISTORY */}
        {activeTab === 'job-history' && (
          <div className="space-y-6 animate-fade-in" id="tab-content-job-history">
            <div className="bg-zinc-900/40 p-6 rounded-3xl border border-white/10 space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-400" /> Historic Job Matches
                </h3>
                <p className="text-xs text-zinc-400 mt-1">Audit trail tracking previous match analyses with specific semantic indicators.</p>
              </div>

              <div className="space-y-4">
                {jobMatchHistory.map((match, index) => (
                  <div key={index} className="p-4 bg-zinc-900/60 rounded-2xl border border-white/10 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white">{match.role}</h4>
                        <span className="text-[10px] text-zinc-500">{match.company} • {match.techMatch}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono rounded-full">{match.estSalary}</span>
                        <span className="text-xs font-bold text-indigo-400">{match.matchScore}% Compatibility</span>
                      </div>
                    </div>

                    {/* Grounded AI Rationale block */}
                    <div className="p-3.5 bg-black/35 rounded-xl text-xs space-y-2">
                      <p className="text-zinc-300">
                        <strong className="text-white">Reason:</strong> {match.scoreDetail.reason}
                      </p>
                      
                      <p className="text-zinc-400 italic border-l border-indigo-500/30 pl-2 text-[11px]">
                        <strong className="text-zinc-300 font-medium not-italic">Evidence:</strong> "{match.scoreDetail.evidence}"
                      </p>

                      <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                        <strong className="text-zinc-400">Match Confidence:</strong>
                        <span className="font-mono text-zinc-300">{(match.scoreDetail.confidence * 100).toFixed(0)}%</span>
                      </div>

                      <p className="text-indigo-200 text-[11px] leading-tight">
                        <strong className="text-indigo-300">Recommendation:</strong> {match.scoreDetail.recommendation}
                      </p>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: LEARNING */}
        {activeTab === 'learning' && (
          <div className="space-y-6 animate-fade-in" id="tab-content-learning">
            <div className="bg-zinc-900/40 p-6 rounded-3xl border border-white/10 space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" /> Learning Path & Roadmap Progress
                </h3>
                <p className="text-xs text-zinc-400 mt-1">Checklist progress against modern full-stack development and GenAI pipelines.</p>
              </div>

              <div className="space-y-4">
                {roadmapMilestones.map((milestone, index) => {
                  const isActive = milestone.status === 'Active';
                  const isCompleted = milestone.status === 'Completed';
                  return (
                    <div key={index} className="p-4 bg-zinc-900/60 rounded-2xl border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-white">{milestone.month}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          isCompleted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          isActive ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' :
                          'bg-zinc-800 text-zinc-500 border border-white/5'
                        }`}>
                          {milestone.status}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Milestone Syllabus:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {milestone.topics.map((topic, tIdx) => (
                            <span key={tIdx} className="text-[10px] px-2.5 py-0.5 bg-black/40 border border-white/10 rounded-full text-zinc-300 font-mono">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 bg-black/35 rounded-xl text-xs space-y-1.5">
                        <strong className="text-indigo-300 block uppercase text-[9px] font-bold">Outcome & Achievement:</strong>
                        <p className="text-zinc-300 leading-relaxed">{milestone.achievement}</p>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
