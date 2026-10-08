import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Users,
  Database,
  Terminal,
  FileQuestion,
  Search,
  CheckCircle2,
  RefreshCw,
  Layers,
  Activity,
  UserCheck,
  Server,
  Lock,
  ArrowUpDown,
  Filter,
  Check,
  Cpu
} from 'lucide-react';
import { INITIAL_DATASETS, INITIAL_SYSTEM_LOGS, MOCK_INTERVIEW_BANK } from '../data/knowledgeBase';
import { DatasetItem, QuestionItem, SystemLog, User } from '../types';

interface AdminPanelViewProps {
  currentUser: User | null;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'datasets' | 'users' | 'questions' | 'logs'>('datasets');
  const [datasets, setDatasets] = useState<DatasetItem[]>(INITIAL_DATASETS);
  const [logs, setLogs] = useState<SystemLog[]>(INITIAL_SYSTEM_LOGS);
  const [questions, setQuestions] = useState<QuestionItem[]>(MOCK_INTERVIEW_BANK);
  const [searchTerm, setSearchTerm] = useState('');
  const [logFilter, setLogFilter] = useState<'ALL' | 'INFO' | 'WARNING' | 'ERROR'>('ALL');
  const [reindexingId, setReindexingId] = useState<string | null>(null);

  const [usersList, setUsersList] = useState<User[]>([
    { id: 'u-101', name: 'Alex Johnson', email: 'alex.johnson@example.com', role: 'admin', targetRole: 'AI & Full Stack Engineer', experienceLevel: 'Entry Level', createdAt: '2026-08-01' },
    { id: 'u-102', name: 'Sarah Jenkins', email: 'sarah.j@example.com', role: 'user', targetRole: 'Backend Developer', experienceLevel: 'Mid Level', createdAt: '2026-08-03' },
    { id: 'u-103', name: 'Alex Rivera', email: 'arivera@example.com', role: 'user', targetRole: 'Data Scientist', experienceLevel: 'Student', createdAt: '2026-08-05' },
    { id: 'u-104', name: 'David Kim', email: 'dkim@example.com', role: 'user', targetRole: 'Cloud Architect', experienceLevel: 'Senior', createdAt: '2026-08-07' },
  ]);

  const handleToggleUserRole = (userId: string) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u));
  };

  const handleReindexDataset = (id: string) => {
    setReindexingId(id);
    setTimeout(() => {
      setDatasets(prev => prev.map(d => d.id === id ? { ...d, status: 'Indexed', lastUpdated: new Date().toISOString().split('T')[0] } : d));
      setReindexingId(null);
    }, 600);
  };

  const filteredLogs = logs.filter(l => logFilter === 'ALL' || l.level === logFilter);

  const filteredQuestions = useMemo(() => {
    if (!searchTerm.trim()) return questions;
    const term = searchTerm.toLowerCase();
    return questions.filter(q =>
      q.question.toLowerCase().includes(term) ||
      q.category.toLowerCase().includes(term) ||
      q.targetSkill.toLowerCase().includes(term)
    );
  }, [questions, searchTerm]);

  // Quick stats computed directly from state
  const totalRecords = useMemo(() => datasets.reduce((acc, d) => acc + d.recordCount, 0), [datasets]);
  const adminCount = useMemo(() => usersList.filter(u => u.role === 'admin').length, [usersList]);

  return (
    <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100 pb-12">
      
      {/* Module Title Banner */}
      <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200/80 dark:border-indigo-800/60">
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Module 7: Admin Control & RAG Vector Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
              System Admin & Datasets Dashboard
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              Manage preprocessed knowledge datasets (O*NET, ESCO), user roles (RBAC), interview question banks, and system audit logs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-xs border border-zinc-200 dark:border-zinc-700 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Role: <span className="font-bold text-zinc-900 dark:text-white">{currentUser?.role === 'admin' ? 'Administrator' : 'Standard User (Demo Mode)'}</span>
            </div>
          </div>
        </div>

        {/* Quick KPI Cards Bar */}
        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-zinc-50/80 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-medium mb-1">
              <Database className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Knowledge Datasets
            </div>
            <div className="text-xl font-bold text-zinc-900 dark:text-white">{datasets.length} Active</div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{totalRecords.toLocaleString()} vectors indexed</div>
          </div>

          <div className="bg-zinc-50/80 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-medium mb-1">
              <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Registered Users
            </div>
            <div className="text-xl font-bold text-zinc-900 dark:text-white">{usersList.length} Accounts</div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{adminCount} Administrators</div>
          </div>

          <div className="bg-zinc-50/80 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-medium mb-1">
              <FileQuestion className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Interview Bank
            </div>
            <div className="text-xl font-bold text-zinc-900 dark:text-white">{questions.length} Questions</div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">STAR-rated criteria</div>
          </div>

          <div className="bg-zinc-50/80 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-medium mb-1">
              <Activity className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              System Status
            </div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Healthy
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{logs.length} audit logs</div>
          </div>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-1.5 bg-zinc-100/90 dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 text-xs font-semibold overflow-x-auto shadow-xs">
        <button
          onClick={() => setActiveTab('datasets')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'datasets'
              ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-white shadow-xs font-bold'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-zinc-800/60'
          }`}
        >
          <Database className="w-4 h-4 text-indigo-500" /> Datasets & Vectors ({datasets.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'users'
              ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-white shadow-xs font-bold'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-zinc-800/60'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-500" /> Users & RBAC ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'questions'
              ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-white shadow-xs font-bold'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-zinc-800/60'
          }`}
        >
          <FileQuestion className="w-4 h-4 text-indigo-500" /> Question Repository ({questions.length})
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'logs'
              ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-white shadow-xs font-bold'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-zinc-800/60'
          }`}
        >
          <Terminal className="w-4 h-4 text-indigo-500" /> System Audit Logs ({logs.length})
        </button>
      </div>

      {/* Tab 1: Datasets Management */}
      {activeTab === 'datasets' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Preprocessed RAG Knowledge Sources & Vector Indices
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Multi-dimensional embedding indexes powering role recommendations and skill gap algorithms.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-mono rounded-lg border border-zinc-200/80 dark:border-zinc-700">
                <Cpu className="w-3 h-3 inline mr-1 text-indigo-500" />
                Model: all-MiniLM-L6-v2 (384-dim)
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 bg-zinc-50/90 dark:bg-zinc-800/60 font-semibold">
                  <th className="p-3.5 sm:px-4">Dataset Name</th>
                  <th className="p-3.5 sm:px-4">Category</th>
                  <th className="p-3.5 sm:px-4">Record Count</th>
                  <th className="p-3.5 sm:px-4">Last Indexing</th>
                  <th className="p-3.5 sm:px-4">Status</th>
                  <th className="p-3.5 sm:px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
                {datasets.map((ds) => (
                  <tr key={ds.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="p-3.5 sm:px-4">
                      <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                        {ds.name}
                      </div>
                    </td>
                    <td className="p-3.5 sm:px-4 text-zinc-600 dark:text-zinc-400 font-medium">{ds.category}</td>
                    <td className="p-3.5 sm:px-4 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                      {ds.recordCount.toLocaleString()}
                    </td>
                    <td className="p-3.5 sm:px-4 text-zinc-500 dark:text-zinc-400">{ds.lastUpdated}</td>
                    <td className="p-3.5 sm:px-4">
                      <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 font-semibold">
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        {ds.status}
                      </span>
                    </td>
                    <td className="p-3.5 sm:px-4 text-right">
                      <button
                        onClick={() => handleReindexDataset(ds.id)}
                        disabled={reindexingId === ds.id}
                        className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-zinc-700 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-300 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-200 text-xs font-semibold flex items-center gap-1.5 ml-auto transition-colors disabled:opacity-60 shadow-xs cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 text-indigo-500 ${reindexingId === ds.id ? 'animate-spin' : ''}`} />
                        {reindexingId === ds.id ? 'Indexing...' : 'Re-index Vector'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Users List */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                User Directory & Role Based Access Control (RBAC)
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Enforce permission tiers for candidates, mentors, and platform system administrators.
              </p>
            </div>
            <span className="text-xs px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-semibold rounded-lg border border-zinc-200/80 dark:border-zinc-700 self-start sm:self-auto">
              Total Users: {usersList.length}
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 bg-zinc-50/90 dark:bg-zinc-800/60 font-semibold">
                  <th className="p-3.5 sm:px-4">User</th>
                  <th className="p-3.5 sm:px-4">Email</th>
                  <th className="p-3.5 sm:px-4">Target Career Role</th>
                  <th className="p-3.5 sm:px-4">Current Role (RBAC)</th>
                  <th className="p-3.5 sm:px-4 text-right">Role Switch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
                {usersList.map((usr) => (
                  <tr key={usr.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="p-3.5 sm:px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                          {usr.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-zinc-900 dark:text-white block">{usr.name}</span>
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{usr.experienceLevel}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 sm:px-4 text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">{usr.email}</td>
                    <td className="p-3.5 sm:px-4 font-semibold text-zinc-800 dark:text-zinc-200">{usr.targetRole}</td>
                    <td className="p-3.5 sm:px-4">
                      <span
                        className={`text-[11px] px-3 py-1 rounded-full font-bold uppercase inline-flex items-center gap-1.5 ${
                          usr.role === 'admin'
                            ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
                        }`}
                      >
                        <Lock className="w-3 h-3" />
                        {usr.role}
                      </span>
                    </td>
                    <td className="p-3.5 sm:px-4 text-right">
                      <button
                        onClick={() => handleToggleUserRole(usr.id)}
                        className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-300 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-200 text-xs font-semibold transition-colors ml-auto shadow-xs cursor-pointer flex items-center gap-1"
                      >
                        <ArrowUpDown className="w-3 h-3 text-indigo-500" />
                        Toggle Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Interview Question Repository */}
      {activeTab === 'questions' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <FileQuestion className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Interview Question Repository Bank
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Curated bank of behavioral and technical assessment questions used by Mock Interview Studio.
              </p>
            </div>

            {/* Search filter input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search questions or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="p-5 bg-zinc-50/70 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80 space-y-3 hover:border-indigo-300 dark:hover:border-zinc-600 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    {q.category} Question #{q.id}
                  </span>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      q.difficulty === 'Easy'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : q.difficulty === 'Hard'
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    {q.difficulty}
                  </span>
                </div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white leading-relaxed">
                  "{q.question}"
                </p>
                <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                  <span>Target Competency: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{q.targetSkill}</span></span>
                  <span className="font-mono text-[10px] text-zinc-400">STAR Evaluated</span>
                </div>
              </div>
            ))}
          </div>

          {filteredQuestions.length === 0 && (
            <div className="p-8 text-center text-zinc-500 dark:text-zinc-400 text-xs">
              No interview questions match "{searchTerm}". Try a different term.
            </div>
          )}
        </div>
      )}

      {/* Tab 4: System Audit Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Real-Time System Audit Logs
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Audit trail for vector embeddings, model inference latency, and authentication security events.
              </p>
            </div>
            
            <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200/80 dark:border-zinc-700 text-xs font-semibold self-start sm:self-auto">
              {(['ALL', 'INFO', 'WARNING', 'ERROR'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLogFilter(lvl)}
                  className={`px-3 py-1 rounded-lg font-mono text-[11px] transition-all cursor-pointer ${
                    logFilter === lvl
                      ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-white shadow-xs font-bold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Clean Terminal-Style Log Console with Light & Dark Compatibility */}
          <div className="bg-zinc-900 dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-800 font-mono text-xs space-y-2.5 max-h-96 overflow-y-auto shadow-inner">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80 text-[11px] text-zinc-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Stream: /var/log/career_ai/audit.log
              </span>
              <span>Showing {filteredLogs.length} events</span>
            </div>

            {filteredLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 border-b border-zinc-800/40 pb-2 hover:bg-zinc-800/30 px-2 py-1 rounded transition-colors">
                <span className="text-zinc-500 shrink-0 text-[10px] font-mono mt-0.5">{log.timestamp.slice(11, 19)}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold shrink-0 ${
                    log.level === 'ERROR'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : log.level === 'WARNING'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  [{log.level}]
                </span>
                <span className="text-indigo-400 shrink-0 font-semibold">[{log.module}]</span>
                <span className="text-zinc-300 leading-relaxed">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
