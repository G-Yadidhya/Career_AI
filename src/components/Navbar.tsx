import React from 'react';
import { User } from '../types';
import {
  Shield,
  UserCheck,
  LogOut,
  LogIn,
  Sparkles,
  Bot
} from 'lucide-react';

interface NavbarProps {
  user: User | null;
  activeView: string;
  onSelectView: (view: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onToggleRole: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeView,
  onSelectView,
  onOpenAuth,
  onLogout,
  onToggleRole,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#09090b]/90 backdrop-blur-xl border-b border-zinc-800/80 text-zinc-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Brand Logo & Title */}
        <div 
          className="flex items-center gap-3.5 cursor-pointer group" 
          onClick={() => onSelectView('dashboard')}
        >
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            C
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xl font-black tracking-tight text-white uppercase font-sans">
                Career.AI
              </span>
              <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-2.5 h-2.5 text-indigo-400" /> RAG Grounded
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider hidden sm:block">
              Autonomous Career Intelligence Platform
            </p>
          </div>
        </div>

        {/* Right User Controls */}
        <div className="flex items-center gap-4">
          
          {user ? (
            <div className="flex items-center gap-3">
              {/* Active Agent Status */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Multi-Agent Active</span>
              </div>

              {/* Role Status Badge */}
              <button
                onClick={onToggleRole}
                title="Click to toggle user role"
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all hover:scale-105 ${
                  user.role === 'admin'
                    ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/25'
                    : 'bg-zinc-800/80 text-zinc-300 border-zinc-700/80 hover:bg-zinc-700/80'
                }`}
              >
                {user.role === 'admin' ? (
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                ) : (
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>Role: {user.role === 'admin' ? 'Admin' : 'Job Seeker'}</span>
              </button>

              {/* User Profile Info Card */}
              <div className="flex items-center gap-2.5 bg-zinc-800/60 pl-2.5 pr-3.5 py-1 rounded-full border border-zinc-700/60 shadow-inner">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-400 border border-zinc-700 flex items-center justify-center font-bold text-xs text-white shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-100 leading-none">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-zinc-400 font-mono">
                    {user.targetRole || 'Software Engineer'}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                title="Logout"
                className="p-2 rounded-xl bg-zinc-800/80 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 border border-zinc-700/80 hover:border-red-500/30 transition-all flex items-center justify-center"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-widest transition-all rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <LogIn className="w-4 h-4" /> Sign In / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
