import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Scale,
  X,
  Check,
  Copy,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Layers,
  Zap,
  ShieldCheck,
  Terminal,
  ExternalLink,
  Target,
  ArrowRight,
  PlusCircle
} from 'lucide-react';
import { extractFeatureProfile } from '../services/api';

export default function CompareDrawer({
  comparedIds = [],
  allLibraries = [],
  isOpen = false,
  onClose,
  onRemoveFromCompare,
  onClearCompare,
  onSelectLibrary
}) {
  const [copiedId, setCopiedId] = useState(null);

  const comparedLibs = allLibraries.filter((l) => comparedIds.includes(l.id));

  if (comparedLibs.length === 0) return null;

  const handleCopy = (lib) => {
    navigator.clipboard.writeText(lib.installCommand || `npm i ${lib.name}`);
    setCopiedId(lib.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Resolve rich features defensively even if library object had old cache
  const resolvedLibs = comparedLibs.map((lib) => {
    const profile = extractFeatureProfile(
      lib.name,
      lib.description || lib.tagline,
      lib.tags,
      lib.category
    );

    const hasStaleAi = !lib.aiRecommendation || lib.aiRecommendation.includes('NPM Quality Score');
    const aiRecommendation = hasStaleAi ? profile.aiRecommendation : lib.aiRecommendation;

    const hasGenericBestFor = !lib.bestFor || lib.bestFor.includes('requiring @') || lib.bestFor.includes('requiring ');
    const bestFor = (hasGenericBestFor && profile.bestFor) ? profile.bestFor : (lib.bestFor || profile.bestFor);

    const hasBotPros = Array.isArray(lib.pros) && lib.pros.some((p) => p.toLowerCase().includes('github actions'));
    const pros = (!Array.isArray(lib.pros) || lib.pros.length === 0 || hasBotPros)
      ? profile.pros
      : lib.pros;

    const cons = (!Array.isArray(lib.cons) || lib.cons.length === 0)
      ? profile.cons
      : lib.cons;

    const tags = (Array.isArray(lib.tags) && lib.tags.length > 0)
      ? lib.tags
      : profile.keyFeatures;

    return {
      ...lib,
      aiRecommendation,
      bestFor,
      pros,
      cons,
      tags,
      runtimeModel: lib.runtimeModel || profile.runtimeModel
    };
  });

  return (
    <>
      {/* Floating Bottom Bar (When Modal is Closed) */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 dark:bg-[#071b2c]/95 backdrop-blur-xl border border-slate-200 dark:border-teal-500/30 px-4 py-2.5 rounded-[22px] shadow-2xl flex items-center gap-3"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Scale className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
              {resolvedLibs.length} selected for feature comparison
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto max-w-[200px] sm:max-w-xs">
            {resolvedLibs.map((lib) => (
              <span
                key={lib.id}
                className="text-[11px] font-mono bg-slate-100 dark:bg-[#0b2438] px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-teal-200 flex items-center gap-1 shrink-0"
              >
                {lib.name}
                <button
                  onClick={() => onRemoveFromCompare(lib.id)}
                  className="text-slate-400 hover:text-red-500 ml-0.5 cursor-pointer"
                  title="Remove"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-ocean dark:bg-teal-400 text-white dark:text-slate-950 hover:scale-[0.98] text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5 font-mono"
          >
            <span>Compare View</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </motion.div>
      )}

      {/* Full Feature Comparison Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/60 dark:bg-[#020b14]/90 backdrop-blur-md transition-opacity"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-6xl bg-white dark:bg-[#041726] border border-slate-200 dark:border-teal-500/30 rounded-[28px] shadow-2xl overflow-hidden z-10 my-auto max-h-[92vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/90 dark:bg-[#061c2e] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/15 border border-teal-400/30 flex items-center justify-center text-teal-600 dark:text-teal-300 shadow-sm">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono">
                      Feature & Architecture Matrix
                    </h3>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-300 border border-teal-500/30 font-semibold">
                      <Sparkles className="w-2.5 h-2.5" /> Feature-based Analysis
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Side-by-side technical capabilities, architectural trade-offs & AI decision guide
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClearCompare}
                  className="px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-red-500 flex items-center gap-1.5 transition-colors font-mono cursor-pointer rounded-lg hover:bg-red-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear All</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Matrix Table with Horizontal Scroll & Sticky Labels */}
            <div className="overflow-x-auto overflow-y-auto p-2 sm:p-5 flex-1">
              <table className="text-left text-xs border-collapse w-full min-w-[650px] table-fixed">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    {/* Sticky Attribute Column Header */}
                    <th className="p-3.5 text-slate-500 dark:text-slate-400 font-mono font-semibold w-48 sm:w-56 sticky left-0 bg-white/95 dark:bg-[#041726]/95 backdrop-blur z-20">
                      Technical Dimensions
                    </th>

                    {resolvedLibs.map((lib) => (
                      <th
                        key={lib.id}
                        className="p-3.5 align-top text-left"
                        style={{ width: resolvedLibs.length === 1 ? '360px' : `${Math.max(280, 100 / (resolvedLibs.length + 1))}%` }}
                      >
                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#082236] border border-slate-200 dark:border-teal-500/30 relative group shadow-sm">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-mono truncate max-w-[200px] sm:max-w-[240px]">
                                  {lib.name}
                                </span>
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-700 dark:text-teal-300 font-semibold shrink-0">
                                  {lib.version || 'latest'}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mt-0.5">
                                {lib.category}
                              </span>
                            </div>

                            <button
                              onClick={() => onRemoveFromCompare(lib.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                              title="Remove"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-2">
                            <button
                              onClick={() => {
                                if (onSelectLibrary) onSelectLibrary(lib);
                              }}
                              className="text-[11px] font-semibold text-ocean dark:text-teal-300 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <span>View Full Profile</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </button>

                            <button
                              onClick={() => handleCopy(lib)}
                              className="text-[10px] font-mono px-2 py-1 rounded bg-slate-200/80 dark:bg-[#051624] text-slate-800 dark:text-slate-200 hover:text-ocean dark:hover:text-teal-300 flex items-center gap-1 transition-colors cursor-pointer border border-slate-300/60 dark:border-slate-700/60"
                              title="Copy install command"
                            >
                              {copiedId === lib.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-500" />
                                  <span className="text-emerald-500 font-semibold">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-2.5 h-2.5" />
                                  <span>Install</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </th>
                    ))}

                    {/* Placeholder Slot when only 1 library is compared */}
                    {resolvedLibs.length === 1 && (
                      <th className="p-3.5 align-top text-left" style={{ width: '320px' }}>
                        <div className="p-5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 h-[108px]">
                          <PlusCircle className="w-5 h-5 mb-1 text-slate-400 dark:text-slate-600" />
                          <span className="text-xs font-medium">Add another package</span>
                          <span className="text-[10px]">Select a 2nd package to benchmark side-by-side</span>
                        </div>
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {/* SECTION 1: PURPOSE & POSITIONING */}
                  <tr className="bg-slate-100/70 dark:bg-[#061826]">
                    <td
                      colSpan={resolvedLibs.length + (resolvedLibs.length === 1 ? 2 : 1)}
                      className="p-2.5 px-3.5 text-[11px] font-mono font-bold uppercase tracking-wider text-ocean dark:text-teal-400 flex items-center gap-1.5 sticky left-0"
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span>Purpose & Positioning</span>
                    </td>
                  </tr>

                  {/* Primary Role / What it Does */}
                  <tr>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 font-mono font-medium sticky left-0 bg-white/95 dark:bg-[#041726]/95 backdrop-blur z-10">
                      Primary Purpose
                    </td>
                    {resolvedLibs.map((lib) => (
                      <td key={lib.id} className="p-3.5 text-slate-800 dark:text-slate-200 text-xs leading-relaxed">
                        {lib.tagline || lib.description || 'Public NPM package'}
                      </td>
                    ))}
                    {resolvedLibs.length === 1 && <td className="p-3.5 text-slate-400 text-xs">—</td>}
                  </tr>

                  {/* Best For / Primary Use Case */}
                  <tr>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 font-mono font-medium sticky left-0 bg-white/95 dark:bg-[#041726]/95 backdrop-blur z-10">
                      Best Used For
                    </td>
                    {resolvedLibs.map((lib) => (
                      <td key={lib.id} className="p-3.5">
                        <div className="p-3 rounded-xl bg-teal-500/10 dark:bg-[#082236] border border-teal-500/20 dark:border-teal-500/30 text-teal-950 dark:text-teal-100 text-xs leading-relaxed font-medium">
                          {lib.bestFor}
                        </div>
                      </td>
                    ))}
                    {resolvedLibs.length === 1 && <td className="p-3.5 text-slate-400 text-xs">—</td>}
                  </tr>

                  {/* AI Recommendation / Selection Verdict */}
                  <tr>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 font-mono font-medium sticky left-0 bg-white/95 dark:bg-[#041726]/95 backdrop-blur z-10">
                      <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Decision Guide</span>
                      </div>
                    </td>
                    {resolvedLibs.map((lib) => (
                      <td key={lib.id} className="p-3.5">
                        <div className="p-3 rounded-xl bg-teal-50 dark:bg-[#052133] border border-teal-200 dark:border-teal-500/40 text-slate-800 dark:text-teal-100 text-xs leading-relaxed font-medium">
                          {lib.aiRecommendation}
                        </div>
                      </td>
                    ))}
                    {resolvedLibs.length === 1 && <td className="p-3.5 text-slate-400 text-xs">—</td>}
                  </tr>

                  {/* SECTION 2: CAPABILITIES & FEATURE BREAKDOWN */}
                  <tr className="bg-slate-100/70 dark:bg-[#061826]">
                    <td
                      colSpan={resolvedLibs.length + (resolvedLibs.length === 1 ? 2 : 1)}
                      className="p-2.5 px-3.5 text-[11px] font-mono font-bold uppercase tracking-wider text-ocean dark:text-teal-400 flex items-center gap-1.5 sticky left-0"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Capabilities & Feature Breakdown</span>
                    </td>
                  </tr>

                  {/* Core Capabilities / Tags */}
                  <tr>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 font-mono font-medium sticky left-0 bg-white/95 dark:bg-[#041726]/95 backdrop-blur z-10">
                      Core Features
                    </td>
                    {resolvedLibs.map((lib) => (
                      <td key={lib.id} className="p-3.5">
                        <div className="flex flex-wrap gap-1.5">
                          {lib.tags.slice(0, 6).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 dark:bg-[#051726] border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-teal-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                    {resolvedLibs.length === 1 && <td className="p-3.5 text-slate-400 text-xs">—</td>}
                  </tr>

                  {/* Key Advantages (Pros) */}
                  <tr>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 font-mono font-medium sticky left-0 bg-white/95 dark:bg-[#041726]/95 backdrop-blur z-10">
                      Key Strengths (Pros)
                    </td>
                    {resolvedLibs.map((lib) => (
                      <td key={lib.id} className="p-3.5 align-top">
                        <ul className="space-y-1.5">
                          {lib.pros.map((pro, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                    {resolvedLibs.length === 1 && <td className="p-3.5 text-slate-400 text-xs">—</td>}
                  </tr>

                  {/* Trade-offs & Caveats (Cons) */}
                  <tr>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 font-mono font-medium sticky left-0 bg-white/95 dark:bg-[#041726]/95 backdrop-blur z-10">
                      Trade-offs (Cons)
                    </td>
                    {resolvedLibs.map((lib) => (
                      <td key={lib.id} className="p-3.5 align-top">
                        <ul className="space-y-1.5">
                          {lib.cons.map((con, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                    {resolvedLibs.length === 1 && <td className="p-3.5 text-slate-400 text-xs">—</td>}
                  </tr>

                  {/* SECTION 3: RUNTIME & ARCHITECTURE */}
                  <tr className="bg-slate-100/70 dark:bg-[#061826]">
                    <td
                      colSpan={resolvedLibs.length + (resolvedLibs.length === 1 ? 2 : 1)}
                      className="p-2.5 px-3.5 text-[11px] font-mono font-bold uppercase tracking-wider text-ocean dark:text-teal-400 flex items-center gap-1.5 sticky left-0"
                    >
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Runtime & Architecture</span>
                    </td>
                  </tr>

                  {/* Runtime Footprint / Bundle Size */}
                  <tr>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 font-mono font-medium sticky left-0 bg-white/95 dark:bg-[#041726]/95 backdrop-blur z-10">
                      Runtime Footprint
                    </td>
                    {resolvedLibs.map((lib) => {
                      const sizeStr = String(lib.bundleSize || lib.runtimeModel || '');
                      const isZero = sizeStr.toLowerCase().includes('zero') || sizeStr.includes('0 KB') || sizeStr.toLowerCase().includes('0 kb');
                      return (
                        <td key={lib.id} className="p-3.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono text-xs font-semibold ${
                              isZero
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-100 dark:bg-[#061e30] text-slate-800 dark:text-teal-300 border border-slate-200 dark:border-slate-700/60'
                            }`}
                          >
                            {isZero && <Zap className="w-3 h-3 text-emerald-500" />}
                            {lib.runtimeModel || lib.bundleSize || 'Standard footprint'}
                          </span>
                        </td>
                      );
                    })}
                    {resolvedLibs.length === 1 && <td className="p-3.5 text-slate-400 text-xs">—</td>}
                  </tr>

                  {/* TypeScript Support */}
                  <tr>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 font-mono font-medium sticky left-0 bg-white/95 dark:bg-[#041726]/95 backdrop-blur z-10">
                      TypeScript Safety
                    </td>
                    {resolvedLibs.map((lib) => {
                      const isBuiltIn = lib.tsSupport === 'Built-in';
                      return (
                        <td key={lib.id} className="p-3.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono text-xs font-semibold ${
                              isBuiltIn
                                ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                                : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            <ShieldCheck className="w-3 h-3" />
                            {isBuiltIn ? 'Built-in First-Class' : 'Community (@types)'}
                          </span>
                        </td>
                      );
                    })}
                    {resolvedLibs.length === 1 && <td className="p-3.5 text-slate-400 text-xs">—</td>}
                  </tr>

                  {/* SSR & Edge Execution */}
                  <tr>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 font-mono font-medium sticky left-0 bg-white/95 dark:bg-[#041726]/95 backdrop-blur z-10">
                      SSR & Edge Ready
                    </td>
                    {resolvedLibs.map((lib) => (
                      <td key={lib.id} className="p-3.5">
                        {lib.ssrReady ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold font-mono text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Edge & SSR Ready
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono text-xs">Client-only Execution</span>
                        )}
                      </td>
                    ))}
                    {resolvedLibs.length === 1 && <td className="p-3.5 text-slate-400 text-xs">—</td>}
                  </tr>

                  {/* Framework Support */}
                  <tr>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 font-mono font-medium sticky left-0 bg-white/95 dark:bg-[#041726]/95 backdrop-blur z-10">
                      Ecosystem Compatibility
                    </td>
                    {resolvedLibs.map((lib) => {
                      const fws = Array.isArray(lib.frameworks) ? lib.frameworks : ['Universal'];
                      return (
                        <td key={lib.id} className="p-3.5 text-slate-700 dark:text-slate-300 font-mono text-xs">
                          {fws.join(', ')}
                        </td>
                      );
                    })}
                    {resolvedLibs.length === 1 && <td className="p-3.5 text-slate-400 text-xs">—</td>}
                  </tr>

                  {/* License */}
                  <tr>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 font-mono font-medium sticky left-0 bg-white/95 dark:bg-[#041726]/95 backdrop-blur z-10">
                      Open Source License
                    </td>
                    {resolvedLibs.map((lib) => (
                      <td key={lib.id} className="p-3.5 text-slate-700 dark:text-slate-300 font-mono text-xs">
                        {lib.license || 'MIT'}
                      </td>
                    ))}
                    {resolvedLibs.length === 1 && <td className="p-3.5 text-slate-400 text-xs">—</td>}
                  </tr>

                  {/* SECTION 4: INSTALLATION */}
                  <tr className="bg-slate-100/70 dark:bg-[#061826]">
                    <td
                      colSpan={resolvedLibs.length + (resolvedLibs.length === 1 ? 2 : 1)}
                      className="p-2.5 px-3.5 text-[11px] font-mono font-bold uppercase tracking-wider text-ocean dark:text-teal-400 flex items-center gap-1.5 sticky left-0"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>One-Click Installation</span>
                    </td>
                  </tr>

                  {/* Install Command */}
                  <tr>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 font-mono font-medium sticky left-0 bg-white/95 dark:bg-[#041726]/95 backdrop-blur z-10">
                      Install Command
                    </td>
                    {resolvedLibs.map((lib) => (
                      <td key={lib.id} className="p-3.5">
                        <button
                          onClick={() => handleCopy(lib)}
                          className="w-full text-left font-mono text-[11px] p-2.5 rounded-xl bg-slate-100 dark:bg-[#051726] border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 hover:text-ocean dark:hover:text-white hover:border-ocean dark:hover:border-teal-400 flex items-center justify-between group cursor-pointer transition-all shadow-sm"
                          title="Click to copy"
                        >
                          <span className="truncate">{lib.installCommand || `npm i ${lib.name}`}</span>
                          {copiedId === lib.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1.5" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1.5 group-hover:text-ocean dark:group-hover:text-teal-300" />
                          )}
                        </button>
                      </td>
                    ))}
                    {resolvedLibs.length === 1 && <td className="p-3.5 text-slate-400 text-xs">—</td>}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50/90 dark:bg-[#061c2e] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Comparing <span className="text-slate-900 dark:text-white font-bold">{resolvedLibs.length}</span> {resolvedLibs.length === 1 ? 'package' : 'packages'} by technical capabilities
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-ocean dark:bg-teal-400 text-white dark:text-slate-950 text-xs font-bold hover:scale-[0.98] transition-all cursor-pointer font-mono shadow-md"
              >
                Close Comparison
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
