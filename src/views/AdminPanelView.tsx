import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Database,
  Terminal,
  FileQuestion,
  Search,
  Plus,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Sparkles,
  Layers,
  Activity
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

  const [usersList, setUsersList] = useState<User[]>([
    { id: 'u-101', name: 'Alex Johnson', email: 'alex.johnson@example.com', role: 'admin', targetRole: 'AI & Full Stack Engineer', experienceLevel: 'Entry Level', createdAt: '2026-08-01' },
    { id: 'u-102', name: 'Sarah Jenkins', email: 'sarah.j@example.com', role: 'user', targetRole: 'Backend Developer', experienceLevel: 'Mid Level', createdAt: '2026-08-03' },
    { id: 'u-103', name: 'Alex Rivera', email: 'arivera@example.com', role: 'user', targetRole: 'Data Scientist', experienceLevel: 'Student', createdAt: '2026-08-05' },
  ]);

  const handleToggleUserRole = (userId: string) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u));
  };

  const handleReindexDataset = (id: string) => {
    setDatasets(prev => prev.map(d => d.id === id ? { ...d, status: 'Indexed', lastUpdated: new Date().toISOString().split('T')[0] } : d));
  };

  const filteredLogs = logs.filter(l => logFilter === 'ALL' || l.level === logFilter);

  return (
    <div className="space-y-6 animate-fade-in text-white">
      
      {/* Module Title Banner */}
      <div className="bg-slate-900/90 p-6 rounded-2xl border border-purple-900/40 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950 text-purple-300 text-xs font-semibold mb-2 border border-purple-800">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400" /> Module 7: Admin Control Panel & RAG Vector Management
            </div>
            <h1 className="text-2xl font-bold tracking-tight">System Admin & Datasets Dashboard</h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage preprocessed knowledge datasets (O*NET, ESCO), user roles (RBAC), interview question banks, and system audit logs.
            </p>
          </div>
          <span className="text-xs px-3 py-1 bg-purple-950 text-purple-300 font-mono rounded-full border border-purple-800 hidden sm:inline-block">
            Role: {currentUser?.role === 'admin' ? 'Administrator' : 'Standard User (Demo Mode)'}
          </span>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('datasets')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'datasets' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" /> Datasets & Vectors ({datasets.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'users' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" /> Users & RBAC ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'questions' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileQuestion className="w-4 h-4" /> Interview Question Repository ({questions.length})
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'logs' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4" /> System Audit Logs
        </button>
      </div>

      {/* Tab 1: Datasets Management */}
      {activeTab === 'datasets' && (
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" /> Preprocessed RAG Knowledge Sources & Vector Indices
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Embedding Model: all-MiniLM-L6-v2 (384-dim)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                  <th className="p-3">Dataset Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Record Count</th>
                  <th className="p-3">Last Indexing</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {datasets.map((ds) => (
                  <tr key={ds.id} className="hover:bg-slate-950/40">
                    <td className="p-3 font-semibold text-slate-200">{ds.name}</td>
                    <td className="p-3 text-slate-400">{ds.category}</td>
                    <td className="p-3 font-mono text-cyan-400">{ds.recordCount.toLocaleString()}</td>
                    <td className="p-3 text-slate-400">{ds.lastUpdated}</td>
                    <td className="p-3">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                        {ds.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleReindexDataset(ds.id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs flex items-center gap-1 ml-auto"
                      >
                        <RefreshCw className="w-3 h-3" /> Re-index Vector
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
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" /> User Directory & Role Based Access Control (RBAC)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                  <th className="p-3">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Target Career Role</th>
                  <th className="p-3">Current Role (RBAC)</th>
                  <th className="p-3 text-right">Role Switch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {usersList.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-950/40">
                    <td className="p-3 font-semibold text-slate-200">{usr.name}</td>
                    <td className="p-3 text-slate-400">{usr.email}</td>
                    <td className="p-3 text-cyan-400">{usr.targetRole}</td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          usr.role === 'admin'
                            ? 'bg-purple-950 text-purple-300 border border-purple-800'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {usr.role}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleUserRole(usr.id)}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors ml-auto"
                      >
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
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FileQuestion className="w-4 h-4 text-purple-400" /> Interview Question Repository Bank
            </h3>
          </div>

          <div className="space-y-3">
            {questions.map((q) => (
              <div key={q.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 font-bold">{q.category} Question #{q.id}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono">
                    Difficulty: {q.difficulty}
                  </span>
                </div>
                <p className="text-slate-200 font-semibold">{q.question}</p>
                <p className="text-[11px] text-slate-400">Target Skill: {q.targetSkill}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: System Audit Logs */}
      {activeTab === 'logs' && (
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-400" /> Real-Time System Audit Logs
            </h3>
            
            <div className="flex items-center gap-2 text-xs">
              {(['ALL', 'INFO', 'WARNING', 'ERROR'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLogFilter(lvl)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] ${
                    logFilter === lvl ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2 max-h-96 overflow-y-auto">
            {filteredLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 border-b border-slate-900/80 pb-1.5">
                <span className="text-slate-500 shrink-0 text-[10px]">{log.timestamp.slice(11, 19)}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-bold shrink-0 ${
                    log.level === 'ERROR'
                      ? 'bg-red-950 text-red-400'
                      : log.level === 'WARNING'
                      ? 'bg-amber-950 text-amber-400'
                      : 'bg-cyan-950 text-cyan-400'
                  }`}
                >
                  [{log.level}]
                </span>
                <span className="text-purple-300 shrink-0">[{log.module}]</span>
                <span className="text-slate-300">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
