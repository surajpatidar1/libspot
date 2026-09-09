import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Copy, Check, ArrowRight, Star, ShieldCheck, Zap, Layers, Sparkles } from 'lucide-react';

export default function HeroSection({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  totalCount,
  filteredCount,
  onScrollToLibraries
}) {
  const [copiedCli, setCopiedCli] = useState(false);
  const [activeTab, setActiveTab] = useState('npm');

  const cliCommands = {
    npm: 'npm i zustand @tanstack/react-query',
    pnpm: 'pnpm add zustand @tanstack/react-query',
    yarn: 'yarn add zustand @tanstack/react-query',
    bun: 'bun add zustand @tanstack/react-query'
  };

  const handleCopyCli = () => {
    navigator.clipboard.writeText(cliCommands[activeTab]);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <section className="relative px-4 sm:px-6 lg:px-8 pt-8 pb-12">
      {/* Modern Developer Hero Container */}
      <div className="relative max-w-7xl mx-auto rounded-3xl overflow-hidden bg-white dark:bg-[#0c1728] border border-slate-200/90 dark:border-slate-700/60 shadow-sm dark:shadow-2xl p-6 sm:p-12 lg:p-16 text-center transition-colors">

        {/* Background Layer: Clean in Light Mode, Cyber Constellation in Dark Mode */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
          
          {/* ================= LIGHT MODE: 100% Clean Subtle Soft Glow (Zero SVG/Lines) ================= */}
          <div className="dark:hidden absolute inset-0">
            <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[550px] h-[300px] bg-gradient-to-b from-teal-100/40 via-cyan-50/30 to-transparent rounded-full blur-[80px]" />
          </div>

          {/* ================= DARK MODE: Cyber Matrix & Interconnected Dependency Graph ================= */}
          <div className="hidden dark:block absolute inset-0">
            {/* Deep Cyber Radial Glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[650px] h-[400px] bg-gradient-to-b from-teal-500/20 via-cyan-500/10 to-transparent rounded-full blur-[110px] opacity-80 animate-pulse pointer-events-none" />
            <div className="absolute -bottom-20 right-10 w-[350px] h-[350px] bg-teal-600/15 rounded-full blur-[90px] pointer-events-none" />

            {/* Matrix Constellation SVG */}
            <svg className="absolute inset-0 w-full h-full opacity-45" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hero-tech-grid-dark" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-slate-700/60" />
                  <circle cx="40" cy="40" r="1" className="fill-teal-400/40" />
                </pattern>

                <linearGradient id="ray-dark-1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity="0" />
                  <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                </linearGradient>

                <linearGradient id="ray-dark-2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
                  <stop offset="60%" stopColor="#14b8a6" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>

              <rect width="100%" height="100%" fill="url(#hero-tech-grid-dark)" />

              {/* Connected Dependency Constellation */}
              <g className="animate-[pulse_6s_ease-in-out_infinite]">
                <path d="M 80 120 L 190 70 L 310 140 L 220 220 Z" fill="none" stroke="url(#ray-dark-1)" strokeWidth="1.2" strokeDasharray="4 4" />
                <circle cx="80" cy="120" r="3.5" className="fill-teal-500 animate-ping" opacity="0.4" />
                <circle cx="80" cy="120" r="2.5" className="fill-teal-500" />
                <circle cx="190" cy="70" r="3" className="fill-cyan-400" />
                <circle cx="310" cy="140" r="4" className="fill-teal-400" />
                <circle cx="220" cy="220" r="2.5" className="fill-emerald-400" />

                <path d="M 950 80 L 1100 130 L 1020 230 L 880 170 Z" fill="none" stroke="url(#ray-dark-2)" strokeWidth="1.2" strokeDasharray="5 3" />
                <circle cx="950" cy="80" r="3" className="fill-teal-400" />
                <circle cx="1100" cy="130" r="4" className="fill-cyan-400 animate-ping" opacity="0.3" />
                <circle cx="1100" cy="130" r="2.5" className="fill-cyan-400" />
                <circle cx="1020" cy="230" r="3.5" className="fill-teal-500" />
                <circle cx="880" cy="170" r="2" className="fill-emerald-400" />

                <path d="M 310 140 Q 600 50 880 170" fill="none" stroke="url(#ray-dark-1)" strokeWidth="1" strokeDasharray="6 4" opacity="0.6" />
                <path d="M 220 220 Q 600 320 1020 230" fill="none" stroke="url(#ray-dark-2)" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
              </g>

              <circle cx="50%" cy="18%" r="60" fill="#14b8a6" fillOpacity="0.04" />
            </svg>
          </div>

        </div>

        {/* Massive Impact Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.08] max-w-4xl mx-auto"
        >
          Discover & Benchmark <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 dark:from-teal-300 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Modern Libraries.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-5 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          The universal developer catalog across 10 modern ecosystems — JS/TS, Python, Go, Rust, Java, C#, Mobile, AI/ML, and DevOps. Filter frameworks, benchmark packages, and copy verified setup commands in seconds.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3.5"
        >
          {/* Primary Action Button */}
          <button
            onClick={onScrollToLibraries}
            className="px-7 py-3 rounded-xl bg-[#1F4959] hover:bg-[#193a47] text-white font-bold text-sm hover:scale-[0.98] active:scale-[0.95] transition-all shadow-md shadow-[#1F4959]/25 flex items-center gap-2 group cursor-pointer"
          >
            <span>Explore Libraries</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Secondary Action Button */}
          <button
            onClick={onScrollToLibraries}
            className="px-7 py-3 rounded-xl bg-slate-100 dark:bg-[#182840] hover:bg-slate-200 dark:hover:bg-[#1e3350] border border-slate-200 dark:border-slate-600/30 text-slate-800 dark:text-slate-200 font-semibold text-sm hover:scale-[0.98] active:scale-[0.95] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{totalCount}+ Verified Packages</span>
          </button>
        </motion.div>

        {/* Interactive Terminal CLI Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 max-w-lg mx-auto terminal-box rounded-2xl overflow-hidden text-left"
        >
          {/* Terminal Window Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#020912] border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
              <span className="text-[11px] font-mono text-slate-400 ml-2">quick-install.sh</span>
            </div>

            {/* PM Tabs */}
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              {['npm', 'pnpm', 'yarn', 'bun'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors cursor-pointer ${activeTab === tab
                    ? 'bg-[#1F4959] text-white'
                    : 'text-slate-400 hover:text-white'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal Command Content */}
          <div className="p-4 flex items-center justify-between gap-4 font-mono text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 truncate">
              <span className="text-teal-400 select-none">$</span>
              <span className="text-slate-100 truncate">{cliCommands[activeTab]}</span>
            </div>

            <button
              onClick={handleCopyCli}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${copiedCli
                ? 'bg-emerald-900 border border-emerald-500 text-emerald-200'
                : 'bg-slate-900 border border-slate-700 hover:border-teal-400 text-slate-300 hover:text-white'
                }`}
            >
              {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCli ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </motion.div>

        {/* Live Metrics Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-left"
        >
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-mono uppercase tracking-wider font-semibold">Speed</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">0-Bloat</p>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Curated lean utilities</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-mono uppercase tracking-wider font-semibold">TypeScript</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">100% Verified</p>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Full type inference</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 mb-1">
              <Layers className="w-4 h-4" />
              <span className="text-xs font-mono uppercase tracking-wider font-semibold">Categories</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">10 Domains</p>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">UI, State, ORM, Testing</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0d1b2e] border border-slate-200/60 dark:border-slate-600/30">
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-mono uppercase tracking-wider font-semibold">Telemetry</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Live Sizes</p>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Minified + Gzipped</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
