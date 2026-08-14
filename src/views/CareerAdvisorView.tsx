import React, { useState, useMemo } from 'react';
import {
  Compass,
  Sparkles,
  BookOpen,
  Award,
  Layers,
  ArrowRight,
  CheckCircle2,
  Clock,
  Wand2,
  RefreshCw,
  TrendingUp,
  ExternalLink,
  Target,
  Video,
  Book,
  FileText,
  Calendar,
  Filter,
  Search,
  CheckSquare,
  Square,
  Copy,
  Check,
  Zap,
  BarChart2,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { CareerRoadmap, ResumeAnalysis } from '../types';

interface CareerAdvisorViewProps {
  roadmap: CareerRoadmap | null;
  onUpdateRoadmap: (roadmap: CareerRoadmap) => void;
  initialResumeAnalysis?: ResumeAnalysis | null;
}

type TabType = 'weekly' | 'projects' | 'courses' | 'books' | 'videos' | 'certifications';

export const CareerAdvisorView: React.FC<CareerAdvisorViewProps> = ({
  roadmap,
  onUpdateRoadmap,
  initialResumeAnalysis,
}) => {
  const [targetRole, setTargetRole] = useState(roadmap?.targetRole || 'AI & Full Stack Engineer');
  const [timelineWeeks, setTimelineWeeks] = useState<number>(roadmap?.timelineWeeks || 8);
  const [skillsInput, setSkillsInput] = useState(
    roadmap?.currentSkills ? roadmap.currentSkills.join(', ') : 'TypeScript, React, Node.js, Express, HTML, CSS'
  );
  const [resumeText, setResumeText] = useState(
    initialResumeAnalysis && initialResumeAnalysis.parsedResume?.skills 
      ? `Experience: ${initialResumeAnalysis.parsedResume.skills.slice(0, 10).join(', ')}` 
      : ''
  );
  const [showResumeInput, setShowResumeInput] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [activeRoadmap, setActiveRoadmap] = useState<CareerRoadmap | null>(roadmap);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search states
  const [activeTab, setActiveTab] = useState<TabType>('weekly');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [completedWeeks, setCompletedWeeks] = useState<Record<number, boolean>>({});
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  const handleGenerate = async () => {
    if (!targetRole.trim()) {
      setError('Please specify a target role goal.');
      return;
    }
    setError(null);
    setIsGenerating(true);
    try {
      const skillsArray = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);
      const generated = await api.generateCareerRoadmap(
        targetRole,
        skillsArray,
        timelineWeeks,
        resumeText
      );
      setActiveRoadmap(generated);
      onUpdateRoadmap(generated);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate career roadmap');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAutoFillResume = () => {
    if (initialResumeAnalysis) {
      const skills = initialResumeAnalysis.parsedResume?.skills || [];
      const tips = initialResumeAnalysis.resumeOptimizationTips || [];
      const parsedText = `Skills: ${skills.join(', ')}\nExperience Summary: ${tips.join(' ')}`;
      setResumeText(parsedText);
      setSkillsInput(skills.join(', '));
    }
  };

  const toggleWeekCompletion = (weekNumber: number) => {
    setCompletedWeeks((prev) => ({
      ...prev,
      [weekNumber]: !prev[weekNumber],
    }));
  };

  const completedCount = useMemo(() => {
    if (!activeRoadmap?.weeklyRoadmap) return 0;
    return activeRoadmap.weeklyRoadmap.filter((w) => completedWeeks[w.weekNumber]).length;
  }, [activeRoadmap, completedWeeks]);

  const totalWeeksCount = activeRoadmap?.weeklyRoadmap?.length || 0;
  const progressPercent = totalWeeksCount > 0 ? Math.round((completedCount / totalWeeksCount) * 100) : 0;

  // Filter items based on Difficulty and Search Query
  const filteredWeekly = useMemo(() => {
    if (!activeRoadmap?.weeklyRoadmap) return [];
    return activeRoadmap.weeklyRoadmap.filter((week) => {
      const matchesDiff = difficultyFilter === 'All' || week.difficulty === difficultyFilter;
      const matchesSearch =
        !searchQuery ||
        week.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        week.focusTopics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        week.phaseName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDiff && matchesSearch;
    });
  }, [activeRoadmap, difficultyFilter, searchQuery]);

  const filteredProjects = useMemo(() => {
    if (!activeRoadmap?.recommendedProjects) return [];
    return activeRoadmap.recommendedProjects.filter((proj) => {
      const matchesDiff = difficultyFilter === 'All' || proj.difficulty === difficultyFilter;
      const matchesSearch =
        !searchQuery ||
        proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        proj.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDiff && matchesSearch;
    });
  }, [activeRoadmap, difficultyFilter, searchQuery]);

  const filteredCourses = useMemo(() => {
    if (!activeRoadmap?.courses) return [];
    return activeRoadmap.courses.filter((course) => {
      const matchesDiff = difficultyFilter === 'All' || !course.difficulty || course.difficulty === difficultyFilter;
      const matchesSearch =
        !searchQuery ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.provider.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDiff && matchesSearch;
    });
  }, [activeRoadmap, difficultyFilter, searchQuery]);

  const filteredBooks = useMemo(() => {
    if (!activeRoadmap?.books) return [];
    return activeRoadmap.books.filter((book) => {
      const matchesDiff = difficultyFilter === 'All' || !book.difficulty || book.difficulty === difficultyFilter;
      const matchesSearch =
        !searchQuery ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.focusArea.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDiff && matchesSearch;
    });
  }, [activeRoadmap, difficultyFilter, searchQuery]);

  const filteredVideos = useMemo(() => {
    if (!activeRoadmap?.videos) return [];
    return activeRoadmap.videos.filter((video) => {
      const matchesSearch =
        !searchQuery ||
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.channelOrSpeaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.topic.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [activeRoadmap, searchQuery]);

  const filteredCertifications = useMemo(() => {
    if (!activeRoadmap?.certifications) return [];
    return activeRoadmap.certifications.filter((cert) => {
      const matchesDiff = difficultyFilter === 'All' || cert.difficulty === difficultyFilter;
      const matchesSearch =
        !searchQuery ||
        cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDiff && matchesSearch;
    });
  }, [activeRoadmap, difficultyFilter, searchQuery]);

  const handleCopyMarkdown = () => {
    if (!activeRoadmap) return;
    let md = `# Career Roadmap: ${activeRoadmap.targetRole}\n`;
    md += `**Timeline:** ${activeRoadmap.timelineWeeks} Weeks | **Overall Level:** ${activeRoadmap.difficultyLevel}\n\n`;
    md += `## Personal Summary\n${activeRoadmap.personalizedSummary}\n\n`;

    md += `## Existing Strengths\n${(activeRoadmap.existingStrengths || []).map((s) => `- ${s}`).join('\n')}\n\n`;
    md += `## Skill Gaps to Bridge\n${(activeRoadmap.skillGapsToBridge || []).map((g) => `- ${g}`).join('\n')}\n\n`;

    md += `## Weekly Roadmap\n`;
    (activeRoadmap.weeklyRoadmap || []).forEach((w) => {
      md += `### ${w.title} (${w.difficulty} - ${w.estimatedHours} hrs)\n`;
      md += `*Phase:* ${w.phaseName}\n`;
      md += `*Objectives:*\n${w.weeklyObjectives.map((o) => `  - ${o}`).join('\n')}\n`;
      if (w.handsOnProject) {
        md += `*Project:* **${w.handsOnProject.title}** - ${w.handsOnProject.description}\n`;
      }
      md += `\n`;
    });

    md += `## High-Impact Projects\n`;
    (activeRoadmap.recommendedProjects || []).forEach((p) => {
      md += `- **${p.title}** [${p.difficulty}]: ${p.description} (Tech Stack: ${p.techStack.join(', ')})\n`;
    });

    md += `\n## Curated Courses\n`;
    (activeRoadmap.courses || []).forEach((c) => {
      md += `- **${c.title}** (${c.provider}) - ${c.duration || 'Self-paced'}\n`;
    });

    md += `\n## Recommended Books\n`;
    (activeRoadmap.books || []).forEach((b) => {
      md += `- **${b.title}** by ${b.author} (Focus: ${b.focusArea})\n`;
    });

    md += `\n## Videos & Talks\n`;
    (activeRoadmap.videos || []).forEach((v) => {
      md += `- **${v.title}** (${v.channelOrSpeaker} - ${v.platform})\n`;
    });

    md += `\n## Target Certifications\n`;
    (activeRoadmap.certifications || []).forEach((cert) => {
      md += `- **${cert.name}** (${cert.issuer}) [${cert.difficulty}]\n`;
    });

    navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in text-white">
      
      {/* Module Banner */}
      <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 text-xs font-semibold mb-2 border border-cyan-800">
          <Compass className="w-3.5 h-3.5" /> Module 4: Career Strategist & Personalized Weekly Roadmap
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Personalized Weekly Career Roadmap</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Synthesize your target role goal, timeline, and resume background to generate weekly milestones, portfolio project blueprints, curated courses, books, tech talk videos, and industry certifications.
            </p>
          </div>
          {activeRoadmap && (
            <button
              onClick={handleCopyMarkdown}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 self-start shrink-0 transition-all"
            >
              {copiedMarkdown ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedMarkdown ? 'Roadmap Copied!' : 'Export Markdown'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Goal & Personalization Setup Form */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" /> Define Career Goal & Timeline Settings
          </h3>
          {initialResumeAnalysis && (
            <button
              type="button"
              onClick={handleAutoFillResume}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> Auto-Fill Parsed Resume
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Target Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Role Goal</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. AI & Full Stack Engineer, Cloud Architect, DevOps Leader"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Timeline Weeks Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-purple-400" /> Timeline Duration
            </label>
            <select
              value={timelineWeeks}
              onChange={(e) => setTimelineWeeks(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value={4}>4 Weeks (Accelerated Sprint)</option>
              <option value={8}>8 Weeks (2 Months Standard)</option>
              <option value={12}>12 Weeks (3 Months Intensive)</option>
              <option value={16}>16 Weeks (4 Months Comprehensive)</option>
              <option value={24}>24 Weeks (6 Months Deep Mastery)</option>
            </select>
          </div>

          {/* Known Skills */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Current Known Stack</label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="React, TypeScript, Node.js, Python, SQL"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        {/* Resume Optional Toggle */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowResumeInput(!showResumeInput)}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-medium transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>{showResumeInput ? 'Hide Resume Context' : '+ Add Candidate Resume Text for Deep Personalization'}</span>
          </button>

          {showResumeInput && (
            <div className="mt-2">
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste candidate resume text or experience highlights here..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Generating Weekly Roadmap, Projects, Courses & Books...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>Generate Weekly Roadmap & Learning Suite ({timelineWeeks} Weeks)</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Active Roadmap View */}
      {activeRoadmap && (
        <div className="space-y-6">

          {/* Resume Personalization & Skill Match Overview Card */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-800 px-2.5 py-0.5 rounded-full">
                  Resume Skill Match: {activeRoadmap.resumeMatchScore || 82}%
                </span>
                <h2 className="text-lg font-bold text-slate-100 mt-1">
                  Personalized Strategy: {activeRoadmap.targetRole}
                </h2>
                <p className="text-xs text-slate-300 mt-0.5 max-w-3xl">
                  {activeRoadmap.personalizedSummary ||
                    `Strategic roadmap calibrated to transition your current capabilities into ${activeRoadmap.targetRole} expertise.`}
                </p>
              </div>

              {/* Completion Progress Gauge */}
              {totalWeeksCount > 0 && (
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3 shrink-0">
                  <div className="relative w-12 h-12 flex items-center justify-center font-bold text-xs text-cyan-400">
                    <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-800"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-cyan-400 transition-all duration-500"
                        strokeDasharray={`${progressPercent}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span>{progressPercent}%</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Weekly Progress</span>
                    <span className="text-[11px] text-slate-400">
                      {completedCount} / {totalWeeksCount} Weeks Completed
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Strengths vs Skill Gaps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Strengths */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Existing Strengths ({activeRoadmap.existingStrengths?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(activeRoadmap.existingStrengths || []).map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-medium text-[11px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skill Gaps to Bridge */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2">
                <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  Target Skill Gaps to Bridge ({activeRoadmap.skillGapsToBridge?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(activeRoadmap.skillGapsToBridge || []).map((g, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-amber-950/80 text-amber-300 border border-amber-800/60 font-medium text-[11px]">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs & Filter Bar */}
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              {/* Tab Selector */}
              <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveTab('weekly')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'weekly'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Weekly Roadmap ({activeRoadmap.weeklyRoadmap?.length || 0})</span>
                </button>

                <button
                  onClick={() => setActiveTab('projects')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'projects'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Projects ({activeRoadmap.recommendedProjects?.length || 0})</span>
                </button>

                <button
                  onClick={() => setActiveTab('courses')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'courses'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Courses ({activeRoadmap.courses?.length || 0})</span>
                </button>

                <button
                  onClick={() => setActiveTab('books')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'books'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Book className="w-3.5 h-3.5" />
                  <span>Books ({activeRoadmap.books?.length || 0})</span>
                </button>

                <button
                  onClick={() => setActiveTab('videos')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'videos'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Videos ({activeRoadmap.videos?.length || 0})</span>
                </button>

                <button
                  onClick={() => setActiveTab('certifications')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'certifications'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Certifications ({activeRoadmap.certifications?.length || 0})</span>
                </button>
              </div>

              {/* Difficulty & Search Filter Controls */}
              <div className="flex items-center gap-2">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search keywords..."
                    className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 w-36 sm:w-48"
                  />
                </div>

                {/* Difficulty Filter */}
                {activeTab !== 'videos' && (
                  <div className="flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                    <select
                      value={difficultyFilter}
                      onChange={(e) => setDifficultyFilter(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="All">All Levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* TAB CONTENT 1: WEEKLY ROADMAP */}
            {activeTab === 'weekly' && (
              <div className="space-y-4 pt-1">
                {filteredWeekly.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 bg-slate-950 rounded-xl border border-slate-800">
                    No weekly modules found matching the selected filter criteria.
                  </div>
                ) : (
                  filteredWeekly.map((week) => {
                    const isDone = completedWeeks[week.weekNumber];
                    return (
                      <div
                        key={week.weekNumber}
                        className={`p-4 rounded-xl border transition-all ${
                          isDone
                            ? 'bg-emerald-950/20 border-emerald-800/80'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-900 pb-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleWeekCompletion(week.weekNumber)}
                              className="text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
                              title={isDone ? 'Mark as pending' : 'Mark as completed'}
                            >
                              {isDone ? (
                                <CheckSquare className="w-5 h-5 text-emerald-400" />
                              ) : (
                                <Square className="w-5 h-5 text-slate-600" />
                              )}
                            </button>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-800">
                                  Week {week.weekNumber}
                                </span>
                                <span className="text-xs font-semibold text-slate-300">{week.title}</span>
                              </div>
                              <span className="text-[11px] text-slate-400 mt-0.5 block">{week.phaseName}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/80 font-semibold">
                              {week.difficulty}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3 text-cyan-400" /> ~{week.estimatedHours} Hours
                            </span>
                          </div>
                        </div>

                        {/* Objectives & Focus Topics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                          <div className="space-y-1.5">
                            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                              Weekly Core Objectives:
                            </span>
                            <ul className="space-y-1 text-xs text-slate-300">
                              {week.weeklyObjectives.map((obj, i) => (
                                <li key={i} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                                  <span>{obj}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                              Key Topics & Concepts:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {week.focusTopics.map((topic, i) => (
                                <span key={i} className="text-[10px] px-2.5 py-1 bg-slate-900 text-slate-300 rounded-md border border-slate-800/80 font-mono">
                                  {topic}
                                </span>
                              ))}
                            </div>

                            {/* Mini Project Spec */}
                            {week.handsOnProject && (
                              <div className="mt-2 p-2.5 bg-slate-900/80 rounded-lg border border-cyan-900/40 space-y-1">
                                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                                  Mini-Project Challenge:
                                </span>
                                <p className="text-xs font-semibold text-slate-200">{week.handsOnProject.title}</p>
                                <p className="text-[11px] text-slate-400">{week.handsOnProject.description}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB CONTENT 2: PROJECTS */}
            {activeTab === 'projects' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {filteredProjects.length === 0 ? (
                  <div className="col-span-2 p-8 text-center text-xs text-slate-400 bg-slate-950 rounded-xl border border-slate-800">
                    No project blueprints found matching criteria.
                  </div>
                ) : (
                  filteredProjects.map((proj, idx) => (
                    <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                            <Layers className="w-4 h-4 text-cyan-400" /> {proj.title}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-semibold">
                            {proj.difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">{proj.description}</p>

                        {/* Tech Stack Badges */}
                        <div className="flex flex-wrap gap-1">
                          {proj.techStack.map((tech, tIdx) => (
                            <span key={tIdx} className="text-[10px] px-2 py-0.5 bg-slate-900 text-slate-300 rounded font-mono border border-slate-800">
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Key Features */}
                        {proj.keyFeatures && proj.keyFeatures.length > 0 && (
                          <div className="pt-2 border-t border-slate-900 space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Key Deliverables:</span>
                            <ul className="space-y-0.5 text-[11px] text-slate-300">
                              {proj.keyFeatures.map((feat, fIdx) => (
                                <li key={fIdx} className="flex items-center gap-1.5">
                                  <span className="w-1 h-1 rounded-full bg-cyan-400 shrink-0" />
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Portfolio Impact:</span>
                        <span className="text-emerald-400 font-bold">{proj.portfolioImpact || 'Very High'}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB CONTENT 3: COURSES */}
            {activeTab === 'courses' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {filteredCourses.length === 0 ? (
                  <div className="col-span-2 p-8 text-center text-xs text-slate-400 bg-slate-950 rounded-xl border border-slate-800">
                    No curated courses found matching criteria.
                  </div>
                ) : (
                  filteredCourses.map((course, idx) => (
                    <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4 text-purple-400 shrink-0" /> {course.title}
                          </h4>
                          {course.difficulty && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 shrink-0">
                              {course.difficulty}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium">Provider: <strong className="text-slate-200">{course.provider}</strong></p>
                        {course.duration && (
                          <span className="text-[10px] text-slate-400 block font-mono">Duration: {course.duration}</span>
                        )}
                      </div>

                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(course.title + ' ' + course.provider)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition-colors"
                      >
                        <span>Explore Course</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB CONTENT 4: BOOKS */}
            {activeTab === 'books' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {filteredBooks.length === 0 ? (
                  <div className="col-span-2 p-8 text-center text-xs text-slate-400 bg-slate-950 rounded-xl border border-slate-800">
                    No recommended books found matching criteria.
                  </div>
                ) : (
                  filteredBooks.map((book, idx) => (
                    <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                            <Book className="w-4 h-4 text-amber-400 shrink-0" /> {book.title}
                          </h4>
                          {book.difficulty && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 shrink-0">
                              {book.difficulty}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">Author: <strong className="text-slate-200">{book.author}</strong></p>
                        <p className="text-xs text-slate-300 bg-slate-900 p-2 rounded-lg border border-slate-800">
                          Focus Area: {book.focusArea}
                        </p>
                      </div>

                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(book.title + ' ' + book.author + ' book')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition-colors"
                      >
                        <span>Find Book</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB CONTENT 5: VIDEOS */}
            {activeTab === 'videos' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {filteredVideos.length === 0 ? (
                  <div className="col-span-2 p-8 text-center text-xs text-slate-400 bg-slate-950 rounded-xl border border-slate-800">
                    No video lectures found matching criteria.
                  </div>
                ) : (
                  filteredVideos.map((video, idx) => (
                    <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                            <Video className="w-4 h-4 text-red-400 shrink-0" /> {video.title}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 shrink-0 font-semibold">
                            {video.platform}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">Speaker / Channel: <strong className="text-slate-200">{video.channelOrSpeaker}</strong></p>
                        <p className="text-xs text-slate-300 bg-slate-900 p-2 rounded-lg border border-slate-800">
                          Topic: {video.topic}
                        </p>
                      </div>

                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(video.title + ' ' + video.channelOrSpeaker)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold transition-colors"
                      >
                        <span>Watch Video on YouTube</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB CONTENT 6: CERTIFICATIONS */}
            {activeTab === 'certifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {filteredCertifications.length === 0 ? (
                  <div className="col-span-2 p-8 text-center text-xs text-slate-400 bg-slate-950 rounded-xl border border-slate-800">
                    No target certifications found matching criteria.
                  </div>
                ) : (
                  filteredCertifications.map((cert, idx) => (
                    <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-purple-400" /> {cert.name}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-semibold">
                            {cert.difficulty}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">Issuing Body: <strong className="text-slate-200">{cert.issuer}</strong></p>
                        {cert.prepTimeWeeks && (
                          <span className="text-[11px] text-slate-400 block font-mono">Estimated Prep: ~{cert.prepTimeWeeks} Weeks</span>
                        )}
                        <p className="text-xs text-slate-300 bg-slate-900 p-2 rounded-lg border border-slate-800">
                          {cert.careerImpact}
                        </p>
                      </div>

                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(cert.name + ' ' + cert.issuer)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold transition-colors"
                      >
                        <span>Official Certification Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>

          {/* High-Growth Alternative Paths */}
          {activeRoadmap.careerPaths && activeRoadmap.careerPaths.length > 0 && (
            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> High-Growth Career Market Trends
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeRoadmap.careerPaths.map((path, idx) => (
                  <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-cyan-300">{path.title}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                        {path.matchScore}% Profile Alignment
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{path.description}</p>
                    <div className="pt-2 flex items-center justify-between text-[11px] border-t border-slate-900 text-slate-400">
                      <span>Est. Salary: <strong className="text-slate-200">{path.avgSalaryRange}</strong></span>
                      <span className="text-emerald-400 font-semibold">{path.growthDemand}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
