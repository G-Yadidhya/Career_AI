import React, { useEffect } from 'react';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Compass,
  Mic,
  ShieldAlert,
  Sparkles,
  Mail,
  Brain,
  Bot,
  X
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  activeView: string;
  onSelectView: (view: string) => void;
  userRole?: UserRole;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  userRole,
  isOpenMobile = false,
  onCloseMobile,
}) => {
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

  // Lock body scroll and listen for Escape key on mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpenMobile && onCloseMobile) {
        onCloseMobile();
      }
    };

    if (isOpenMobile) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpenMobile, onCloseMobile]);

  const handleItemClick = (id: string, isMobile: boolean) => {
    onSelectView(id);
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  const renderNavContent = (isMobile = false) => (
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
                onClick={() => handleItemClick(item.id, isMobile)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/50 font-bold shadow-2xs'
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-medium border border-transparent'
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
                onClick={() => handleItemClick(item.id, isMobile)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/50 font-bold shadow-2xs'
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-medium border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
                  <span>{item.label}</span>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/50">
                  {userRole === 'admin' ? 'Active' : 'Admin'}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );

  const renderFooter = () => (
    <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-transparent">
      <div className="bg-zinc-50 dark:bg-zinc-800/40 p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/50 text-xs space-y-2">
        <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-widest text-[10px] text-zinc-700 dark:text-zinc-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Grounded Vector Index
          </span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
        </div>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight">
          Knowledge Vector Index active. Grounded against O*NET 2026 & ESCO taxonomies.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="w-64 bg-white dark:bg-[#0c0a0e] border-r border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 flex-col justify-between shrink-0 hidden md:flex min-h-[calc(100vh-4rem)] transition-colors duration-200">
        <div className="flex-1 overflow-y-auto">
          {renderNavContent(false)}
        </div>
        {renderFooter()}
      </aside>

      {/* Mobile Responsive Slide-Over Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex" role="dialog" aria-modal="true" aria-label="Navigation Sidebar">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
            aria-label="Close navigation overlay"
          />

          {/* Slide-out Menu Panel */}
          <aside className="relative w-80 max-w-[85vw] bg-white dark:bg-[#0c0a0e] text-zinc-800 dark:text-zinc-300 border-r border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col justify-between z-10 h-full overflow-hidden animate-in slide-in-from-left duration-200">
            {/* Mobile Drawer Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/70 shrink-0">
              <div className="flex items-center gap-2.5">
                <img 
                  src="/favicon.jpg" 
                  alt="Career.AI Logo" 
                  className="w-8 h-8 rounded-xl object-cover border border-indigo-500/20 dark:border-indigo-500/30" 
                />
                <div>
                  <span className="text-sm font-black tracking-tight text-zinc-900 dark:text-white uppercase block">
                    Career.AI
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider block">
                    Platform Sidebar
                  </span>
                </div>
              </div>

              <button
                onClick={onCloseMobile}
                className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800/60 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation links scroll area */}
            <div className="flex-1 overflow-y-auto">
              {renderNavContent(true)}
            </div>

            {/* RAG status footer */}
            <div className="shrink-0">
              {renderFooter()}
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
