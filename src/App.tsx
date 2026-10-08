import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { DashboardView } from './views/DashboardView';
import { ResumeAnalyzerView } from './views/ResumeAnalyzerView';
import { ResumeBuilderView } from './views/ResumeBuilderView';
import { CoverLetterView } from './views/CoverLetterView';
import { JobMatcherView } from './views/JobMatcherView';
import { CareerAdvisorView } from './views/CareerAdvisorView';
import { InterviewCoachView } from './views/InterviewCoachView';
import { AIMemoryView } from './views/AIMemoryView';
import { AgentChatView } from './views/AgentChatView';
import { AdminPanelView } from './views/AdminPanelView';
import { api } from './services/api';
import { CareerRoadmap, InterviewSession, ResumeAnalysis, User } from './types';
import { 
  Lock, 
  LogIn, 
  Shield, 
  Sparkles, 
  FileText, 
  Compass, 
  Mic, 
  CheckCircle2,
  LayoutDashboard,
  Mail,
  Briefcase,
  Brain,
  Bot,
  ShieldAlert,
  Menu
} from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('career_ai_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'light'; // Light Mode is the primary visual experience
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('career_ai_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [user, setUser] = useState<User | null>({
    id: 'u-101',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    role: 'user',
    targetRole: 'AI & Full Stack Engineer',
    experienceLevel: 'Entry Level',
    createdAt: new Date().toISOString(),
  });

  const [activeView, setActiveView] = useState<string>('dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [careerRoadmap, setCareerRoadmap] = useState<CareerRoadmap | null>(null);
  const [interviewSessions, setInterviewSessions] = useState<InterviewSession[]>([]);

  const handleSelectView = (view: string) => {
    setActiveView(view);
    setIsMobileNavOpen(false);
  };

  const handleToggleRole = () => {
    if (!user) return;
    setUser({
      ...user,
      role: user.role === 'admin' ? 'user' : 'admin',
    });
  };

  const handleLogin = async (email: string, pass: string, role?: string) => {
    try {
      const res = await api.login(email, pass, role);
      setUser(res.user);
      setIsAuthOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRegister = async (name: string, email: string, pass: string, role?: string, targetRole?: string) => {
    try {
      const res = await api.register(name, email, pass, role, targetRole);
      setUser(res.user);
      setIsAuthOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setResumeAnalysis(null);
    setCareerRoadmap(null);
    setInterviewSessions([]);
    setIsAuthOpen(true);
  };

  const handleAddInterviewSession = (sess: InterviewSession) => {
    setInterviewSessions((prev) => [sess, ...prev.filter((s) => s.id !== sess.id)]);
  };

  const mobileQuickLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'resume-builder', label: 'Resume Builder', icon: Sparkles },
    { id: 'cover-letter', label: 'Cover Letter', icon: Mail },
    { id: 'resume', label: 'Resume Analyzer', icon: FileText },
    { id: 'job-matcher', label: 'JD Matcher', icon: Briefcase },
    { id: 'career', label: 'Career Advisor', icon: Compass },
    { id: 'interview', label: 'Interview Coach', icon: Mic },
    { id: 'memory', label: 'AI Memory', icon: Brain },
    { id: 'agent-chat', label: 'AI Orchestrator', icon: Bot },
    { id: 'admin', label: 'Admin', icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans antialiased selection:bg-indigo-600 selection:text-white transition-colors duration-150">
      
      {/* Navbar */}
      <Navbar
        user={user}
        activeView={activeView}
        onSelectView={handleSelectView}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onToggleRole={handleToggleRole}
        isMobileNavOpen={isMobileNavOpen}
        onToggleMobileNav={() => setIsMobileNavOpen((prev) => !prev)}
        onCloseMobileNav={() => setIsMobileNavOpen(false)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Mobile Sticky Quick Navigation Bar */}
      {user && (
        <div className="md:hidden sticky top-16 z-30 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 px-3 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar shadow-xs">
          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-500/40 shrink-0 hover:bg-indigo-100 dark:hover:bg-indigo-600/30 transition-all active:scale-95"
            title="Open all sidebar options"
          >
            <Menu className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>All Options</span>
          </button>
          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 shrink-0" />
          {mobileQuickLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectView(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                    : 'bg-zinc-100 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-800/80 font-medium'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {!user ? (
        /* Mandatory Sign-In / Authentication Gate Page */
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-[#F7F8FA] dark:bg-[#09090b]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
          
          <div className="max-w-xl w-full text-center z-10 space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-2xl">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200/80 dark:border-indigo-500/20 rounded-3xl flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 shadow-xs">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-500/20 rounded-full inline-flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Authentication Mandatory
              </span>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                Sign In Required
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                To protect user data and maintain candidate privacy, please sign in or create an account to view your resume analysis, job matcher, and career roadmaps.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setIsAuthOpen(true)}
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all rounded-full shadow-md flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Sign In / Create Account
              </button>
            </div>

            {/* Platform Feature Lock Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-left">
              <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-700/50">
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mb-1" />
                <p className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">ATS Resume</p>
                <p className="text-[9px] text-zinc-500 dark:text-zinc-400">RAG Grounded Audit</p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-700/50">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mb-1" />
                <p className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">JD Matcher</p>
                <p className="text-[9px] text-zinc-500 dark:text-zinc-400">Skill Gap Score</p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-700/50">
                <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mb-1" />
                <p className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">Roadmaps</p>
                <p className="text-[9px] text-zinc-500 dark:text-zinc-400">AI Tech Strategy</p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-700/50">
                <Mic className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mb-1" />
                <p className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">STAR Coach</p>
                <p className="text-[9px] text-zinc-500 dark:text-zinc-400">Live Interview Eval</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 max-w-7xl w-full mx-auto flex">
          
          {/* Sidebar Navigation */}
          <Sidebar
            activeView={activeView}
            onSelectView={handleSelectView}
            userRole={user?.role}
            isOpenMobile={isMobileNavOpen}
            onCloseMobile={() => setIsMobileNavOpen(false)}
          />

          {/* Main Workspace Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-hidden">
            {activeView === 'dashboard' && (
              <DashboardView
                user={user}
                resumeAnalysis={resumeAnalysis}
                careerRoadmap={careerRoadmap}
                interviewSessions={interviewSessions}
                onNavigate={setActiveView}
              />
            )}

            {activeView === 'resume-builder' && (
              <ResumeBuilderView />
            )}

            {activeView === 'cover-letter' && (
              <CoverLetterView
                initialResumeAnalysis={resumeAnalysis}
                onNavigate={setActiveView}
              />
            )}

            {activeView === 'resume' && (
              <ResumeAnalyzerView
                onAnalysisComplete={setResumeAnalysis}
                existingAnalysis={resumeAnalysis}
              />
            )}

            {activeView === 'job-matcher' && (
              <JobMatcherView currentResume={resumeAnalysis} />
            )}

            {activeView === 'career' && (
              <CareerAdvisorView
                roadmap={careerRoadmap}
                onUpdateRoadmap={setCareerRoadmap}
                initialResumeAnalysis={resumeAnalysis}
              />
            )}

            {activeView === 'interview' && (
              <InterviewCoachView
                currentResume={resumeAnalysis}
                onAddSession={handleAddInterviewSession}
              />
            )}

            {activeView === 'memory' && (
              <AIMemoryView />
            )}

            {activeView === 'agent-chat' && (
              <AgentChatView />
            )}

            {activeView === 'admin' && (
              <AdminPanelView currentUser={user} />
            )}
          </main>
        </div>
      )}

      {/* Footer */}
      <Footer />

      {/* Auth Dialog */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLogin}
        onRegisterSuccess={handleRegister}
      />

    </div>
  );
}
