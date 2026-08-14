import React from 'react';
import { ShieldCheck, Cpu, Database, CheckCircle, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-100 dark:bg-[#050505] border-t border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 text-xs py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="space-y-2">
            <h3 className="font-bold text-zinc-900 dark:text-white text-xs uppercase tracking-widest">AI Career Vector</h3>
            <p className="text-zinc-500 dark:text-zinc-500 leading-relaxed text-[11px]">
              Retrieval Augmented Generation (RAG) powered platform for resume ATS auditing, job matching, personalized career roadmaps, and STAR interview coaching.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-zinc-800 dark:text-zinc-300 text-xs uppercase tracking-widest">Ground Truth Datasets</h4>
            <ul className="space-y-1 text-[11px]">
              <li className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400"><CheckCircle className="w-3 h-3 text-indigo-600 dark:text-indigo-400" /> O*NET Competency Model (2026)</li>
              <li className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400"><CheckCircle className="w-3 h-3 text-indigo-600 dark:text-indigo-400" /> ESCO Skill Taxonomies Matrix</li>
              <li className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400"><CheckCircle className="w-3 h-3 text-indigo-600 dark:text-indigo-400" /> Harvard ATS Formatting Standards</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-zinc-800 dark:text-zinc-300 text-xs uppercase tracking-widest">Safety & Compliance</h4>
            <ul className="space-y-1 text-[11px]">
              <li className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400"><ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> JWT Token & Password Hash</li>
              <li className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400"><ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Hallucination Mitigation active</li>
              <li className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400"><ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Server-side Gemini proxy</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-zinc-800 dark:text-zinc-300 text-xs uppercase tracking-widest">Runtime Specs</h4>
            <div className="bg-white dark:bg-white/5 p-3 rounded-2xl border border-zinc-200 dark:border-white/10 space-y-1 font-mono text-[10px]">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>LLM Engine:</span> <span className="text-indigo-600 dark:text-indigo-400 font-bold">Gemini 3.7 Flash</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>TTS Model:</span> <span className="text-indigo-600 dark:text-indigo-400 font-bold">Gemini Speech API</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Vector Index:</span> <span className="text-indigo-600 dark:text-indigo-400 font-bold">RAG Grounded</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-4 border-t border-zinc-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
          <p>© 2026 AI Resume & Career Advisor with Intelligent Interview Coach. Production Ready.</p>
          <div className="flex items-center gap-4 text-zinc-500">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>College Submission Specs</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
