import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Compass,
  Mic,
  ShieldAlert,
  GraduationCap,
  Sparkles,
  Search,
  BookMarked,
  Mail,
  Brain,
  Bot
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  activeView: string;
  onSelectView: (view: string) => void;
  userRole?: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onSelectView, userRole }) => {
  const mainNav = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, badge: 'Stats' },
    { id: 'resume-builder', label: 'AI Resume Builder', icon: Sparkles, badge: 'PDF Export' },
    { id: 'cover-letter', label: 'Cover Letter AI', icon: Mail, badge: '5 Styles' },
    { id: 'resume', label: 'Resume Analyzer', icon: FileText, badge: 'ATS 0-100' },
    { id: 'job-matcher', label: 'JD Matcher & Gap', icon: Briefcase, badge: 'Match %' },
    { id: 'career', label: 'Career Advisor', icon: Compass, badge: 'Roadmaps' },
    { id: 'interview', label: 'AI Interview Coach', icon: Mic, badge: 'Live STAR' },
    { id: 'memory', label: 'AI Long-Term Memory', icon: Brain, badge: 'Context' },
    { id: 'agent-chat', label: 'AI Orchestrator', icon: Bot, badge: 'Tools' },
  ];

  const adminNav = [
    { id: 'admin', label: 'Admin Control Center', icon: ShieldAlert, badge: 'System' },
  ];

  const docsNav = [
    { id: 'college-docs', label: 'Academic Submission', icon: GraduationCap, badge: '17 Specs' },
  ];

  return (
    <aside className="w-64 bg-[#fafaf9] dark:bg-[#0c0a0e] border-r border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 flex flex-col justify-between shrink-0 hidden md:flex min-h-[calc(100vh-4rem)] transition-colors duration-200">
      <div className="p-4 space-y-6">
        
        {/* Main Modules */}
        <div>
          <p className="px-3 text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-3">
            Main Platform Modules
          </p>
          <nav className="space-y-1.5">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50 font-bold shadow-sm'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white font-medium border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        isActive 
                          ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200 border border-indigo-200/50 dark:border-indigo-700/50' 
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Admin Navigation */}
        <div>
          <p className="px-3 text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-3">
            System Administration
          </p>
          <nav className="space-y-1.5">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50 font-bold'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white font-medium border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50">
                    {userRole === 'admin' ? 'Active' : 'Admin'}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Documentation Hub */}
        <div>
          <p className="px-3 text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-3">
            Submission & Architecture
          </p>
          <nav className="space-y-1.5">
            {docsNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/50 font-bold'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white font-medium border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/50">
                    SRS
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

      </div>

      {/* RAG Engine Status Box */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-transparent">
        <div className="bg-zinc-100/50 dark:bg-zinc-800/40 p-3.5 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/50 text-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-widest text-[10px] text-zinc-600 dark:text-zinc-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Grounded Vector Index
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight">
            Knowledge Vector Index active. Grounded against O*NET 2026 & ESCO taxonomies.
          </p>
        </div>
      </div>
    </aside>
  );
};
