import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Shield, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string, password: string, role?: string) => void;
  onRegisterSuccess: (name: string, email: string, password: string, role?: string, targetRole?: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onRegisterSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<UserRole>('user');
  const [targetRole, setTargetRole] = useState('AI & Full Stack Software Engineer');
  const [forgotSent, setForgotSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      onLoginSuccess(email, password, role);
    } else if (mode === 'register') {
      onRegisterSuccess(name || 'Alex Johnson', email, password, role, targetRole);
    } else {
      setForgotSent(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#050505] border border-white/10 rounded-3xl w-full max-w-md p-8 text-white shadow-2xl relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-3 border border-indigo-500/30">
            <Shield className="w-3.5 h-3.5" /> Module 1 • User Auth & RBAC
          </div>
          <h2 className="text-2xl font-light italic tracking-tight text-white">
            {mode === 'login' ? 'Sign In to Account' : mode === 'register' ? 'Create New Account' : 'Reset Password'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            {mode === 'login'
              ? 'Access your resume analysis, career roadmaps, and mock interview logs.'
              : mode === 'register'
              ? 'Start building ATS-optimized resumes and AI interview confidence.'
              : 'Enter your account email to receive a password reset link.'}
          </p>
        </div>

        {/* Quick Demo Accounts Banner */}
        {mode === 'login' && (
          <div className="mb-5 p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Quick Demo Login
              </span>
              <span className="text-[9px] text-zinc-400">Pre-coded Account</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('demo@example.com');
                  setPassword('password123');
                  setRole('user');
                  onLoginSuccess('demo@example.com', 'password123', 'user');
                }}
                className="py-2 px-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-all"
              >
                <p className="text-xs font-bold text-white">Candidate Account</p>
                <p className="text-[9.5px] text-zinc-400 font-mono mt-0.5">demo@example.com</p>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@example.com');
                  setPassword('password123');
                  setRole('admin');
                  onLoginSuccess('admin@example.com', 'password123', 'admin');
                }}
                className="py-2 px-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl text-left transition-all"
              >
                <p className="text-xs font-bold text-amber-300">Admin Account</p>
                <p className="text-[9.5px] text-zinc-400 font-mono mt-0.5">admin@example.com</p>
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'register' && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          )}

          {mode !== 'forgot' && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Target Role / Career Goal</label>
              <input
                type="text"
                placeholder="e.g. AI Engineer, Full Stack Developer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Role selection pill */}
          {mode !== 'forgot' && (
            <div className="mb-3">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">Select Login / Account Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRole('user');
                    if (email === 'admin@example.com') setEmail('demo@example.com');
                  }}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-bold uppercase tracking-wider border flex items-center justify-center gap-2 transition-all ${
                    role === 'user'
                      ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50 shadow-md'
                      : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5" /> Job Seeker
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole('admin');
                    if (email === 'demo@example.com') setEmail('admin@example.com');
                  }}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-bold uppercase tracking-wider border flex items-center justify-center gap-2 transition-all ${
                    role === 'admin'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md'
                      : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" /> Administrator
                </button>
              </div>
            </div>
          )}

          {mode === 'forgot' && forgotSent && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Password reset instructions have been dispatched to {email}.</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-4 py-3 px-4 rounded-full bg-white text-black hover:bg-zinc-200 font-bold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all"
          >
            <span>
              {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Register Account' : 'Send Reset Link'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-6 text-center text-xs text-zinc-400 space-x-2">
          {mode === 'login' ? (
            <>
              <span>Don't have an account?</span>
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-indigo-400 hover:underline font-bold uppercase tracking-wider"
              >
                Register
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-zinc-400 hover:text-white"
              >
                Forgot Password?
              </button>
            </>
          ) : (
            <>
              <span>Already registered?</span>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-indigo-400 hover:underline font-bold uppercase tracking-wider"
              >
                Back to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
