import React from 'react';
import { Terminal, Sparkles, Activity } from 'lucide-react';
import LibSpotLogo from './LibSpotLogo';

export default function Footer({ onResetFilters }) {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a1628] mt-24 text-slate-600 dark:text-slate-400 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800/80">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="shadow-md shadow-teal-500/15 rounded-2xl">
              <LibSpotLogo size={38} />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight font-sans">
                Lib<span className="text-[#1F4959] dark:text-teal-400">Spot</span>
              </span>
              <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Universal Developer Intelligence & Instant Framework Discovery
              </p>
            </div>
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-700 dark:text-slate-300 font-mono">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-ocean dark:text-teal-400" />
              <span>AI-Ready Architecture</span>
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 dark:text-slate-400 text-[11px] font-mono">
          <p>
            © 2026 Suraj Patidar. All Rights Reserved. Created & Maintained by Suraj Patidar.
          </p>
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <span>Crafted for developers & AI coding agents.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
