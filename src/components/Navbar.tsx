import React from 'react';
import { User } from '../types';
import {
  Shield,
  UserCheck,
  LogOut,
  LogIn,
  Sparkles,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';

interface NavbarProps {
  user: User | null;
  activeView: string;
  onSelectView: (view: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onToggleRole: () => void;
  isMobileNavOpen?: boolean;
  onToggleMobileNav?: () => void;
  onCloseMobileNav?: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeView,
  onSelectView,
  onOpenAuth,
  onLogout,
  onToggleRole,
  isMobileNavOpen = false,
  onToggleMobileNav,
  onCloseMobileNav,
  theme = 'light',
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#09090b]/90 backdrop-blur-xl border-b border-zinc-200/90 dark:border-zinc-800/80 text-zinc-900 dark:text-zinc-100 shadow-2xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Left Side: Mobile Menu Button + Brand Logo & Title */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {user && onToggleMobileNav && (
            <button
              type="button"
              onClick={onToggleMobileNav}
              className="md:hidden p-2 -ml-1 rounded-xl text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label={isMobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
              title="Toggle sidebar options"
            >
              {isMobileNavOpen ? (
                <X className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              ) : (
                <Menu className="w-5 h-5 text-zinc-700 dark:text-zinc-200" />
              )}
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hidden xs:inline">
                Menu
              </span>
            </button>
          )}

          <div 
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group" 
            onClick={() => {
              onSelectView('dashboard');
              if (onCloseMobileNav) onCloseMobileNav();
            }}
          >
            <img 
              src="/favicon.jpg" 
              alt="Career.AI Logo" 
              className="w-9 h-9 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform border border-indigo-500/20 dark:border-indigo-500/30" 
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black tracking-tight text-zinc-900 dark:text-white uppercase font-sans">
                  Career.AI
                </span>
                <span className="px-2 py-0.5 text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-500/20 rounded-full flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-indigo-600 dark:text-indigo-400" /> RAG Grounded
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider hidden sm:block">
                Autonomous Career Intelligence Platform
              </p>
            </div>
          </div>
        </div>

        {/* Right User Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Visual Theme Switcher */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/80 transition-all flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle visual theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
              <span className="text-[10px] font-bold uppercase tracking-wider hidden md:inline text-zinc-700 dark:text-zinc-300">
                {theme === 'dark' ? 'Dark' : 'Light'}
              </span>
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Active Agent Status */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Multi-Agent Active</span>
              </div>

              {/* Role Status Badge */}
              <div
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  user.role === 'admin'
                    ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30'
                    : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700/80'
                }`}
              >
                {user.role === 'admin' ? (
                  <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                )}
                <span>Role: {user.role === 'admin' ? 'Admin' : 'Job Seeker'}</span>
              </div>

              {/* User Profile Info Card */}
              <div className="flex items-center gap-2.5 bg-zinc-100/80 dark:bg-zinc-800/60 pl-2 pr-2.5 sm:pl-2.5 sm:pr-3.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700/60 shadow-2xs">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-emerald-500 border border-white dark:border-zinc-700 flex items-center justify-center font-bold text-xs text-white shadow-2xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 leading-none">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                    {user.targetRole || 'Software Engineer'}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                title="Logout"
                className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 hover:bg-red-50 dark:hover:bg-red-500/10 text-zinc-600 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 border border-zinc-200 dark:border-zinc-700/80 hover:border-red-300 dark:hover:border-red-500/30 transition-all flex items-center justify-center"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-widest transition-all rounded-xl flex items-center gap-2 shadow-sm"
            >
              <LogIn className="w-4 h-4" /> Sign In / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
