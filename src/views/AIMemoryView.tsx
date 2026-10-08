import React, { useState, useEffect } from 'react';
import {
  Brain,
  FileText,
  Target,
  Mic,
  MessageSquare,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Plus,
  Sparkles,
  Zap,
  TrendingUp,
  Award,
  BookOpen,
  Info,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { AIMemoryProfile, MemoryResumeRecord, MemoryInterviewRecord, MemoryFeedbackRecord } from '../types';
import { api } from '../services/api';

export const AIMemoryView: React.FC = () => {
  const [memory, setMemory] = useState<AIMemoryProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'resumes' | 'goals' | 'interviews' | 'feedback' | 'learning'>('overview');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState<boolean>(false);

  // Form states for manual editing
  const [editRole, setEditRole] = useState<string>('');
  const [editTimeline, setEditTimeline] = useState<number>(8);
  const [newSkillGap, setNewSkillGap] = useState<string>('');
  const [newMasteredSkill, setNewMasteredSkill] = useState<string>('');

  const fetchMemory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAIMemory();
      setMemory(data);
      setEditRole(data.careerGoals.primaryTargetRole || '');
      setEditTimeline(data.careerGoals.targetTimelineWeeks || 8);
    } catch (err: any) {
      setError('Failed to load AI Memory profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemory();
  }, []);

  const handleSaveGoals = async () => {
    if (!memory) return;
    setIsUpdating(true);
    try {
      const updated = await api.updateAIMemory({
        careerGoals: {
          primaryTargetRole: editRole,
          targetTimelineWeeks: editTimeline,
          keySkillsToDevelop: memory.careerGoals.keySkillsToDevelop,
        },
      });
      setMemory(updated);
      setSaveSuccess('Career goals updated in AI memory!');
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (e) {
      setError('Failed to update goals');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddSkillGap = async () => {
    if (!newSkillGap.trim() || !memory) return;
    const updatedSkills = [...new Set([...memory.careerGoals.keySkillsToDevelop, newSkillGap.trim()])];
    setIsUpdating(true);
    try {
      const updated = await api.updateAIMemory({
        careerGoals: { ...memory.careerGoals, keySkillsToDevelop: updatedSkills },
      });
      setMemory(updated);
      setNewSkillGap('');
    } catch (e) {
      setError('Failed to add skill gap');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveSkillGap = async (skillToRemove: string) => {
    if (!memory) return;
    const updatedSkills = memory.careerGoals.keySkillsToDevelop.filter((s) => s !== skillToRemove);
    setIsUpdating(true);
    try {
      const updated = await api.updateAIMemory({
        careerGoals: { ...memory.careerGoals, keySkillsToDevelop: updatedSkills },
      });
      setMemory(updated);
    } catch (e) {
      setError('Failed to remove skill gap');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddMasteredSkill = async () => {
    if (!newMasteredSkill.trim() || !memory) return;
    const updatedSkills = [...new Set([...memory.learningProgress.masteredSkills, newMasteredSkill.trim()])];
    setIsUpdating(true);
    try {
      const updated = await api.updateAIMemory({
        learningProgress: { ...memory.learningProgress, masteredSkills: updatedSkills },
      });
      setMemory(updated);
      setNewMasteredSkill('');
    } catch (e) {
      setError('Failed to add mastered skill');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveMasteredSkill = async (skillToRemove: string) => {
    if (!memory) return;
    const updatedSkills = memory.learningProgress.masteredSkills.filter((s) => s !== skillToRemove);
    setIsUpdating(true);
    try {
      const updated = await api.updateAIMemory({
        learningProgress: { ...memory.learningProgress, masteredSkills: updatedSkills },
      });
      setMemory(updated);
    } catch (e) {
      setError('Failed to remove mastered skill');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteItem = async (category: string, itemId: string) => {
    try {
      const res = await api.deleteAIMemoryItem(category, itemId);
      setMemory(res.memory);
    } catch (e) {
      setError('Failed to delete item from memory');
    }
  };

  const handleClearAllMemory = () => {
    setShowClearModal(true);
  };

  const confirmClearAllMemory = async () => {
    setShowClearModal(false);
    try {
      const res = await api.clearAIMemory();
      setMemory(res.memory);
      setSaveSuccess('AI memory completely reset');
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (e) {
      setError('Failed to clear memory');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-zinc-400">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-500 mb-4" />
        <p className="text-sm font-semibold">Loading AI Long-Term Memory Profile...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-zinc-900/80 p-6 md:p-8 rounded-3xl border border-zinc-200 dark:border-white/10 shadow-md relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="space-y-3 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-400/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">AI Long-Term Memory</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                  Active & Personalizing
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                Remembers past resumes, career goals, interview performance, previous feedback, and learning progress to tailor future responses.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <button
            onClick={fetchMemory}
            className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white border border-zinc-200 dark:border-white/10 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>

          <button
            onClick={handleClearAllMemory}
            className="px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Memory
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-800 dark:text-red-300 text-xs font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-200 dark:border-white/10">
        {[
          { id: 'overview', label: 'Memory Dashboard', icon: Brain },
          { id: 'resumes', label: 'Past Resumes', icon: FileText, count: memory?.pastResumes.length },
          { id: 'goals', label: 'Career Goals', icon: Target },
          { id: 'interviews', label: 'Interview History', icon: Mic, count: memory?.interviewHistory.length },
          { id: 'feedback', label: 'Previous Feedback', icon: MessageSquare, count: memory?.previousFeedback.length },
          { id: 'learning', label: 'Learning Progress', icon: BookOpen, count: memory?.learningProgress.masteredSkills.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 border border-indigo-500'
                  : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white border border-zinc-200 dark:border-white/5'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-zinc-500 dark:text-zinc-400'}`} />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-zinc-200 dark:bg-white/10 text-zinc-700 dark:text-zinc-400'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === 'overview' && memory && (
        <div className="space-y-8">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200/80 dark:border-white/10 shadow-xs flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Past Resumes</p>
                <p className="text-xl font-bold text-zinc-900 dark:text-white mt-0.5">{memory.pastResumes.length} Snapshots</p>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200/80 dark:border-white/10 shadow-xs flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-500/20">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Target Goal</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-white mt-0.5 truncate max-w-[150px]">
                  {memory.careerGoals.primaryTargetRole || 'Not Set'}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200/80 dark:border-white/10 shadow-xs flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200/80 dark:border-purple-500/20">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Interviews Tracked</p>
                <p className="text-xl font-bold text-zinc-900 dark:text-white mt-0.5">{memory.interviewHistory.length} Mock Sessions</p>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200/80 dark:border-white/10 shadow-xs flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-500/20">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Mastered Skills</p>
                <p className="text-xl font-bold text-zinc-900 dark:text-white mt-0.5">{memory.learningProgress.masteredSkills.length} Skills</p>
              </div>
            </div>
          </div>

          {/* AI Memory Personalization Rule Info Box */}
          <div className="p-6 rounded-3xl bg-indigo-50/80 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-500/30 flex flex-col md:flex-row items-start gap-4">
            <div className="p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <span>Non-Bloated Personalization Guarantee</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-[10px] uppercase tracking-widest font-bold">
                  Strict Scope
                </span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                The AI Memory engine strictly bounds stored context to essential career signals (5 most recent resumes, top 10 interview logs, and relevant action items). Unnecessary conversational clutter is omitted automatically to keep model prompts fast, sharp, and focused.
              </p>
            </div>
          </div>

          {/* Quick Overview Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Goal & Skills Box */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-white/10 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Target Role & Active Gaps</span>
                </h3>
                <button
                  onClick={() => setActiveTab('goals')}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold cursor-pointer"
                >
                  Edit Goals →
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 space-y-2">
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">Primary Role Goal</p>
                <p className="text-base font-bold text-zinc-900 dark:text-white">{memory.careerGoals.primaryTargetRole || 'Not specified yet'}</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Target Skill Gaps to Bridge:</p>
                <div className="flex flex-wrap gap-2">
                  {memory.careerGoals.keySkillsToDevelop.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-500/20 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {memory.careerGoals.keySkillsToDevelop.length === 0 && (
                    <p className="text-xs text-zinc-500 italic">No skill gaps tracked yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Coaching Feedback */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-white/10 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  <span>Latest Coaching Feedback</span>
                </h3>
                <button
                  onClick={() => setActiveTab('feedback')}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold cursor-pointer"
                >
                  View All ({memory.previousFeedback.length}) →
                </button>
              </div>

              <div className="space-y-3">
                {memory.previousFeedback.slice(0, 3).map((f) => (
                  <div key={f.id} className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900 dark:text-white">{f.title}</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-zinc-200/80 dark:bg-white/10 text-zinc-700 dark:text-zinc-300">
                        {f.category}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">{f.summary}</p>
                  </div>
                ))}
                {memory.previousFeedback.length === 0 && (
                  <p className="text-xs text-zinc-500 italic p-4">No past feedback logged yet. Generate cover letters or evaluate interview answers to build memory context.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Resumes */}
      {activeTab === 'resumes' && memory && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Past Resume Snapshots ({memory.pastResumes.length}/5)</h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Stores historical versions of parsed resumes to compare growth over time.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {memory.pastResumes.map((rec) => (
              <div key={rec.id} className="p-6 rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 shadow-xs space-y-4 relative group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200/80 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{rec.title}</h3>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Added: {new Date(rec.uploadDate || (rec as any).timestamp || Date.now()).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-500/30 text-xs font-bold">
                      ATS {rec.atsScoreSnapshot}/100
                    </span>
                    <button
                      onClick={() => handleDeleteItem('pastResumes', rec.id)}
                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 text-xs opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      title="Delete snapshot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {rec.summary && (
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-white/5 p-3 rounded-xl border border-zinc-200/60 dark:border-white/5 line-clamp-2">
                    "{rec.summary}"
                  </p>
                )}

                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Top Detected Skills:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {rec.topSkills.map((s, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 text-[11px] text-zinc-700 dark:text-zinc-300 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {memory.pastResumes.length === 0 && (
              <div className="col-span-full p-12 text-center rounded-3xl bg-zinc-50/80 dark:bg-zinc-900/30 border border-dashed border-zinc-200 dark:border-white/10 text-zinc-500 space-y-2">
                <FileText className="w-8 h-8 mx-auto text-zinc-400 dark:text-zinc-600" />
                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-400">No past resume records in AI memory.</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-600">Upload and analyze a resume in the Resume Analyzer module to auto-save a snapshot.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Goals */}
      {activeTab === 'goals' && memory && (
        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Career Goals & Role Targets</span>
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Configure your primary target role and focus skills so agents align recommendations automatically.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Primary Target Role:</label>
                <input
                  type="text"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  placeholder="e.g. AI & Full Stack Engineer"
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Target Preparation Timeline (Weeks):</label>
                <input
                  type="number"
                  min={1}
                  max={52}
                  value={editTimeline}
                  onChange={(e) => setEditTimeline(parseInt(e.target.value, 10) || 8)}
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSaveGoals}
                disabled={isUpdating}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isUpdating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Save Career Goals</span>
              </button>
            </div>

            {/* Skill Gaps Section */}
            <div className="pt-6 border-t border-zinc-100 dark:border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Tracked Skill Gaps to Bridge:</h3>
              <div className="flex flex-wrap gap-2">
                {memory.careerGoals.keySkillsToDevelop.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200/80 dark:border-indigo-500/30 text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-2"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkillGap(skill)}
                      className="hover:text-red-500 transition-colors cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 max-w-md">
                <input
                  type="text"
                  value={newSkillGap}
                  onChange={(e) => setNewSkillGap(e.target.value)}
                  placeholder="Add custom skill gap (e.g. Kubernetes)"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <button
                  onClick={handleAddSkillGap}
                  className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-white/10 dark:hover:bg-white/20 text-zinc-700 dark:text-white text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer border border-zinc-200 dark:border-transparent"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Interview History */}
      {activeTab === 'interviews' && memory && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Past Interview Evaluations ({memory.interviewHistory.length}/10)</h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Stores historical performance logs to help agents track improvement over time.</p>
            </div>
          </div>

          <div className="space-y-4">
            {memory.interviewHistory.map((session) => (
              <div key={session.id} className="p-6 rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 shadow-xs space-y-4 group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200/80 dark:border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <Mic className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{session.role} Interview Evaluation</h3>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{new Date(session.date || (session as any).timestamp || Date.now()).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-500/30 text-xs font-bold">
                      Score {session.overallScore}/100
                    </span>
                    <button
                      onClick={() => handleDeleteItem('interviewHistory', session.id)}
                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 text-xs opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-500/5 border border-emerald-200/80 dark:border-emerald-500/20 space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Noted Strengths</p>
                    <p className="text-xs text-zinc-800 dark:text-zinc-300">{session.strengths.join('; ') || 'Good structure'}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-500/5 border border-amber-200/80 dark:border-amber-500/20 space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">Areas to Improve</p>
                    <p className="text-xs text-zinc-800 dark:text-zinc-300">{session.weaknesses.join('; ') || 'Quantify metrics'}</p>
                  </div>
                </div>

                {session.topSTARFeedback && (
                  <p className="text-xs text-zinc-700 dark:text-zinc-400 bg-zinc-50 dark:bg-white/5 p-3 rounded-xl border border-zinc-200/60 dark:border-white/5 italic">
                    Coaching Feedback: "{session.topSTARFeedback}"
                  </p>
                )}
              </div>
            ))}

            {memory.interviewHistory.length === 0 && (
              <div className="p-12 text-center rounded-3xl bg-zinc-50/80 dark:bg-zinc-900/30 border border-dashed border-zinc-200 dark:border-white/10 text-zinc-500 space-y-2">
                <Mic className="w-8 h-8 mx-auto text-zinc-400 dark:text-zinc-600" />
                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-400">No past interview records in AI memory.</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-600">Practice mock interview questions in the AI Interview Coach tab to build feedback history.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Feedback */}
      {activeTab === 'feedback' && memory && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Previous Feedback & Action Items ({memory.previousFeedback.length})</h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">AI memories accumulated from past resume reviews, interview evaluations, and cover letter generations.</p>
            </div>
          </div>

          <div className="space-y-4">
            {memory.previousFeedback.map((fb) => (
              <div key={fb.id} className="p-6 rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 shadow-xs space-y-4 group">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{fb.title}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-500/30">
                        {fb.category}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{fb.summary}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteItem('previousFeedback', fb.id)}
                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 text-xs opacity-0 group-hover:opacity-100 transition-all shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {fb.actionItems && fb.actionItems.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-white/5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Action Items:</p>
                    <div className="space-y-1.5">
                      {fb.actionItems.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {memory.previousFeedback.length === 0 && (
              <div className="p-12 text-center rounded-3xl bg-zinc-50/80 dark:bg-zinc-900/30 border border-dashed border-zinc-200 dark:border-white/10 text-zinc-500 space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto text-zinc-400 dark:text-zinc-600" />
                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-400">No feedback records found in memory.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Learning Progress */}
      {activeTab === 'learning' && memory && (
        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Learning Progress & Mastered Skills</span>
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Skills you have already mastered so agents build roadmaps without repeating basic topics.</p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {memory.learningProgress.masteredSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200/80 dark:border-emerald-500/30 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveMasteredSkill(skill)}
                      className="hover:text-red-500 transition-colors cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 max-w-md">
                <input
                  type="text"
                  value={newMasteredSkill}
                  onChange={(e) => setNewMasteredSkill(e.target.value)}
                  placeholder="Add mastered skill (e.g. React 19)"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <button
                  onClick={handleAddMasteredSkill}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Clearing Memory */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/15 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center gap-3 text-red-500 dark:text-red-400">
              <div className="p-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Reset Long-Term AI Memory?</h3>
            </div>
            
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              This will clear all past resume snapshots, interview transcripts, tailored feedback records, and personalized skill learning states across all AI agents.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmClearAllMemory}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-md shadow-red-600/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Reset All Memory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};