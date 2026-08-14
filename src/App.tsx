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
import { CollegeDocsView } from './views/CollegeDocsView';
import { api } from './services/api';
import { CareerRoadmap, InterviewSession, ResumeAnalysis, User } from './types';
import { Lock, LogIn, Shield, Sparkles, FileText, Compass, Mic, CheckCircle2 } from 'lucide-react';

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

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
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [careerRoadmap, setCareerRoadmap] = useState<CareerRoadmap | null>(null);
  const [interviewSessions, setInterviewSessions] = useState<InterviewSession[]>([]);

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

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans antialiased selection:bg-indigo-600 selection:text-white">
      
      {/* Navbar */}
      <Navbar
        user={user}
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onToggleRole={handleToggleRole}
      />

      {!user ? (
        /* Mandatory Sign-In / Authentication Gate Page */
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-[#09090b]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
          
          <div className="max-w-xl w-full text-center z-10 space-y-6 bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl">
            <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl flex items-center justify-center mx-auto text-indigo-400 shadow-sm">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full inline-flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Authentication Mandatory
              </span>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                Sign In Required
              </h1>
              <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                To protect user data and maintain candidate privacy, please sign in or create an account to view your resume analysis, job matcher, and career roadmaps.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setIsAuthOpen(true)}
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all rounded-full shadow-lg flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Sign In / Create Account
              </button>
            </div>

            {/* Platform Feature Lock Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-zinc-800 text-left">
              <div className="bg-zinc-800/50 p-3 rounded-2xl border border-zinc-700/50">
                <FileText className="w-4 h-4 text-indigo-400 mb-1" />
                <p className="text-[11px] font-bold text-zinc-200 uppercase tracking-wider">ATS Resume</p>
                <p className="text-[9px] text-zinc-400">RAG Grounded Audit</p>
              </div>
              <div className="bg-zinc-800/50 p-3 rounded-2xl border border-zinc-700/50">
                <Sparkles className="w-4 h-4 text-emerald-400 mb-1" />
                <p className="text-[11px] font-bold text-zinc-200 uppercase tracking-wider">JD Matcher</p>
                <p className="text-[9px] text-zinc-400">Skill Gap Score</p>
              </div>
              <div className="bg-zinc-800/50 p-3 rounded-2xl border border-zinc-700/50">
                <Compass className="w-4 h-4 text-indigo-400 mb-1" />
                <p className="text-[11px] font-bold text-zinc-200 uppercase tracking-wider">Roadmaps</p>
                <p className="text-[9px] text-zinc-400">AI Tech Strategy</p>
              </div>
              <div className="bg-zinc-800/50 p-3 rounded-2xl border border-zinc-700/50">
                <Mic className="w-4 h-4 text-indigo-400 mb-1" />
                <p className="text-[11px] font-bold text-zinc-200 uppercase tracking-wider">STAR Coach</p>
                <p className="text-[9px] text-zinc-400">Live Interview Eval</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 max-w-7xl w-full mx-auto flex">
          
          {/* Sidebar Navigation */}
          <Sidebar
            activeView={activeView}
            onSelectView={setActiveView}
            userRole={user?.role}
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

            {activeView === 'college-docs' && (
              <CollegeDocsView />
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
