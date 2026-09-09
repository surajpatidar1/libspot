import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  Download,
  Copy,
  Check,
  Bookmark,
  Scale,
  ExternalLink,
  Terminal,
  Package,
  GitBranch,
  Boxes,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Radio,
  GitFork,
  Bug
} from 'lucide-react';
import { getGuideForLibrary } from '../data/libraryGuides';
import { fetchLiveGitHubTelemetry, fetchLiveNpmTelemetry, getLibraryById } from '../services/api';
import { formatInstallCommand } from '../utils/formatCommand';

export default function LibraryDetailPage({
  library,
  onBack,
  isSaved,
  isCompared,
  onToggleSave,
  onToggleCompare,
  onSelectAlternative,
  allLibraries = [],
  packageManager = 'npm'
}) {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedAiPrompt, setCopiedAiPrompt] = useState(false);
  const [liveStats, setLiveStats] = useState({
    stars: library?.stars,
    weeklyDownloads: library?.weeklyDownloads,
    forks: null,
    openIssues: null,
    isLive: false
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [library?.id]);

  // Dynamic Schema.org JSON-LD injection for AI crawlers & LLM agents
  useEffect(() => {
    if (!library) return;
    const scriptId = 'library-jsonld-schema';
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": library.name,
      "description": library.description || library.tagline,
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Cross-platform",
      "softwareVersion": library.version || "latest",
      "license": library.license || "MIT",
      "url": library.docsUrl || library.npmUrl || window.location.href,
      "downloadUrl": library.npmUrl,
      "codeRepository": library.githubUrl,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": String(liveStats.stars || library.stars || 1000).replace(/[^0-9]/g, '') || "1000"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    };

    script.text = JSON.stringify(schemaData);

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    };
  }, [library, liveStats]);

  useEffect(() => {
    let isMounted = true;

    async function loadLiveData() {
      if (!library) return;

      try {
        const [gh, npm] = await Promise.allSettled([
          library.githubUrl ? fetchLiveGitHubTelemetry(library.githubUrl) : null,
          library.ecosystem === 'JS / TS' ? fetchLiveNpmTelemetry(library.id || library.name) : null
        ]);

        if (!isMounted) return;

        const updates = {};
        if (gh.status === 'fulfilled' && gh.value) {
          if (gh.value.stars) updates.stars = gh.value.stars;
          if (gh.value.forks) updates.forks = gh.value.forks;
          if (gh.value.openIssues != null) updates.openIssues = gh.value.openIssues;
          updates.isLive = true;
        }
        if (npm.status === 'fulfilled' && npm.value) {
          if (npm.value.downloads) updates.weeklyDownloads = npm.value.downloads;
          updates.isLive = true;
        }

        if (Object.keys(updates).length > 0) {
          setLiveStats((prev) => ({ ...prev, ...updates }));
        }
      } catch (err) {
        console.debug('Telemetry enrichment skipped:', err);
      }
    }

    loadLiveData();
    return () => {
      isMounted = false;
    };
  }, [library]);

  if (!library) return null;

  const guide = getGuideForLibrary(library);

  const rawInstallCommand = library.installCommand || `npm i ${library.name.toLowerCase()}`;
  const installCommand = formatInstallCommand(rawInstallCommand, packageManager);

  const handleCopyCommand = async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 2000);
    } catch (error) {
      console.error('Failed to copy installation command:', error);
    }
  };

  const handleCopyCode = async () => {
    if (!guide?.code) return;
    try {
      await navigator.clipboard.writeText(guide.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const handleCopyAiPrompt = () => {
    const prosBlock = library.pros?.length > 0 ? `\n- **Pros**:\n${library.pros.map((p) => `  • ${p}`).join('\n')}` : '';
    const consBlock = library.cons?.length > 0 ? `\n- **Tradeoffs**:\n${library.cons.map((c) => `  • ${c}`).join('\n')}` : '';

    const md = `### Dependency Intelligence: ${library.name} (${library.version || 'latest'})
- **Ecosystem**: ${library.ecosystem || 'JS / TS'} | **Category**: ${library.category}
- **Installation**: \`${installCommand}\`
- **Weekly Downloads**: ${liveStats.weeklyDownloads || library.weeklyDownloads} | **Stars**: ${liveStats.stars || library.stars}
- **Runtime Model**: ${library.bundleSize || 'Universal'}
- **TypeScript**: ${library.tsSupport || 'Built-in'} | **SSR Status**: ${library.ssrReady ? 'Supported' : 'Client Only'}
- **AI Recommendation**: ${library.aiRecommendation || library.tagline}
- **Best For**: ${library.bestFor || 'Modern production engineering'}${prosBlock}${consBlock}
- **Documentation**: ${library.docsUrl || library.npmUrl || library.githubUrl}`;

    try {
      navigator.clipboard.writeText(md);
      setCopiedAiPrompt(true);
      setTimeout(() => setCopiedAiPrompt(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen bg-[#f1f5f9] dark:bg-[#0a1628] text-slate-900 dark:text-slate-200 pb-16 transition-colors"
    >
      <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-[#0c1728]/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700/60 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Libraries</span>
          </button>
          
          <div className="flex items-center gap-2">
            {/* Copy for AI / LLM Button */}
            <button
              onClick={handleCopyAiPrompt}
              className={`h-9 flex items-center gap-1.5 px-3.5 rounded-xl border text-xs font-semibold font-mono transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${copiedAiPrompt
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/80 text-teal-600 dark:text-teal-400 hover:border-teal-500/60 shadow-2xs'
                }`}
              title="Copy structured Markdown context for AI prompts (ChatGPT, Claude, Cursor, Copilot, Perplexity)"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{copiedAiPrompt ? 'Copied for AI!' : 'Copy for LLM'}</span>
            </button>

            {/* Compare Button */}
            <button
              onClick={() => onToggleCompare(library.id)}
              className={`h-9 flex items-center gap-2 px-3.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${isCompared
                ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs'
                }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isCompared ? 'Comparing' : 'Compare'}</span>
            </button>

            {/* Save / Stack Button */}
            <button
              onClick={() => onToggleSave(library.id)}
              className={`h-9 w-9 flex items-center justify-center rounded-xl border transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${isSaved
                ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/80 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs'
                }`}
              title={isSaved ? 'Remove from stack' : 'Save to stack'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-7">
        <section className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-600/30 bg-white dark:bg-[#111d32] shadow-sm">
          <div className="absolute inset-0 pointer-events-none bg-tech-grid opacity-30 dark:opacity-20" />
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-ocean/10 dark:bg-teal-950/50 border border-ocean/20 dark:border-teal-500/30 text-ocean dark:text-teal-300 text-xs font-semibold">
                    <Boxes className="w-3 h-3" />
                    {library.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-midnight border border-slate-200 dark:border-slateTeal/25 text-xs font-mono text-slate-600 dark:text-slate-400">
                    {library.version ? (library.version.startsWith('v') ? library.version : `v${library.version}`) : ''}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-950 dark:text-white">
                  {library.name}
                </h1>
                <p className="mt-3 max-w-2xl text-base sm:text-lg leading-7 text-slate-600 dark:text-slate-400">
                  {library.tagline}
                </p>
                <div className="flex flex-wrap items-center gap-5 mt-5 text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                      {liveStats.stars || library.stars}
                    </span>
                    <span className="text-slate-400">stars</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                      {liveStats.weeklyDownloads || library.weeklyDownloads}
                    </span>
                    <span className="text-slate-400">weekly downloads</span>
                  </div>

                  {liveStats.forks && (
                    <div className="flex items-center gap-2">
                      <GitFork className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                        {liveStats.forks}
                      </span>
                      <span className="text-slate-400">forks</span>
                    </div>
                  )}

                  {liveStats.openIssues != null && (
                    <div className="flex items-center gap-2">
                      <Bug className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                        {liveStats.openIssues}
                      </span>
                      <span className="text-slate-400">issues</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
                {library.npmUrl && (
                  <a
                    href={library.npmUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-ocean hover:bg-ocean/90 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-sm font-semibold transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    npm
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {library.githubUrl && (
                  <a
                    href={library.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slateTeal/30 bg-white dark:bg-midnight text-slate-700 dark:text-slate-300 text-sm font-semibold hover:border-slate-300 dark:hover:border-teal-400 transition-colors"
                  >
                    <GitBranch className="w-4 h-4" />
                    GitHub
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {library.docsUrl && (
                  <a
                    href={library.docsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slateTeal/30 bg-white dark:bg-midnight text-slate-700 dark:text-slate-300 text-sm font-semibold hover:border-slate-300 dark:hover:border-teal-400 transition-colors"
                  >
                    Documentation
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
          <div className="lg:col-span-2 space-y-5">
            <section className="nestjs-card p-6 sm:p-7 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-4 h-4 text-ocean dark:text-teal-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-ocean dark:text-teal-400">
                  Overview
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
                About {library.name}
              </h2>
              <p className="mt-3 text-sm sm:text-[15px] leading-7 text-slate-600 dark:text-slate-400">
                {library.description}
              </p>
            </section>

            {/* AI Recommendation & Decision Intelligence */}
            {(library.aiRecommendation || library.whyChoose?.length > 0) && (
              <section className="nestjs-card p-6 sm:p-7 rounded-2xl border-teal-500/30 bg-teal-500/5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 font-mono">
                    AI Decision Intelligence
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
                  Why AI & Engineers Recommend {library.name}
                </h2>
                {library.aiRecommendation && (
                  <p className="mt-3 text-sm sm:text-[15px] leading-7 text-slate-700 dark:text-slate-300 font-medium">
                    {library.aiRecommendation}
                  </p>
                )}
                {library.bestFor && (
                  <div className="mt-4 p-3.5 rounded-xl bg-white dark:bg-[#182840] border border-slate-200 dark:border-slate-700/60 text-xs">
                    <span className="font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider text-[10px] block mb-1">
                      Primary Use Case
                    </span>
                    <span className="text-slate-700 dark:text-slate-200">{library.bestFor}</span>
                  </div>
                )}
                {library.whyChoose?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Key Architectural Decision Factors
                    </h4>
                    <ul className="space-y-2">
                      {library.whyChoose.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {(library.pros?.length > 0 || library.cons?.length > 0) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/50">
                    {library.pros?.length > 0 && (
                      <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mb-1.5">
                          Advantages
                        </span>
                        <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                          {library.pros.map((p, i) => (
                            <li key={i}>• {p}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {library.cons?.length > 0 && (
                      <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block mb-1.5">
                          Tradeoffs & Considerations
                        </span>
                        <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                          {library.cons.map((c, i) => (
                            <li key={i}>• {c}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}

            <section className="nestjs-card p-6 sm:p-7 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="w-4 h-4 text-ocean dark:text-teal-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-ocean dark:text-teal-400">
                  Installation
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
                Installation
              </h2>
              <p className="mt-2 mb-4 text-sm text-slate-500 dark:text-slate-400">
                Run this command in your project terminal to install {library.name}.
              </p>
              <div className="flex items-center gap-3 rounded-xl bg-[#020b14] border border-slateTeal/30 p-3.5">
                <code className="flex-1 min-w-0 truncate text-sm font-mono text-teal-300">
                  $ {installCommand}
                </code>
                <button
                  onClick={handleCopyCommand}
                  className={`shrink-0 p-2 rounded-lg border transition-colors cursor-pointer ${copiedCmd
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-white/5 border-slateTeal/30 text-slate-300 hover:text-white hover:border-teal-400'
                    }`}
                  title="Copy installation command"
                >
                  {copiedCmd ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </section>

            {guide && (guide.code || guide.steps?.length > 0) && (
              <section className="nestjs-card p-6 sm:p-7 rounded-2xl">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Terminal className="w-4 h-4 text-ocean dark:text-teal-400" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-ocean dark:text-teal-400">
                        Quick Start
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
                      How to use {library.name}
                    </h2>
                  </div>
                  {guide?.code && (
                    <button
                      onClick={handleCopyCode}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slateTeal/30 bg-white dark:bg-midnight text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedCode ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedCode ? 'Copied' : 'Copy code'}</span>
                    </button>
                  )}
                </div>

                {guide?.steps?.length > 0 && (
                  <div className="space-y-3 mb-5">
                    {guide.steps.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-midnight/70 border border-slate-200 dark:border-slateTeal/20"
                      >
                        <div className="w-7 h-7 shrink-0 rounded-lg bg-ocean/10 dark:bg-teal-950 border border-ocean/20 dark:border-teal-500/30 text-ocean dark:text-teal-300 text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                            {step.title}
                          </h3>
                          <p className="mt-1 text-xs sm:text-sm leading-6 text-slate-500 dark:text-slate-400">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {guide?.code && (
                  <div className="overflow-hidden rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-[#07131f] border-b border-slate-800">
                      <span className="text-xs font-mono text-slate-400">
                        {guide.fileName || 'example.js'}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider font-mono text-teal-400">
                        {guide.language || 'JavaScript'}
                      </span>
                    </div>
                    <div className="p-4 sm:p-5 overflow-x-auto bg-[#020b14]">
                      <pre className="font-mono text-xs sm:text-sm text-slate-200 leading-6">
                        <code>{guide.code}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-20 h-fit space-y-5">
            <section className="nestjs-card p-5 rounded-2xl">
              <h3 className="text-base font-bold text-slate-950 dark:text-white mb-4">
                Package Information
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slateTeal/15">
                <InfoRow label="Version" value={library.version} />
                <InfoRow label="Category" value={library.category} />
                <InfoRow label="Weekly downloads" value={library.weeklyDownloads} />
                <InfoRow label="GitHub stars" value={library.stars} />
                <InfoRow label="Bundle size" value={library.bundleSize} />
                <InfoRow label="TypeScript" value={library.tsSupport} />
                <InfoRow
                  label="SSR / Edge"
                  value={library.ssrReady ? 'Supported' : 'Client only'}
                />
                <InfoRow label="License" value={library.license} />
              </div>
            </section>

            {library.frameworks?.length > 0 && (
              <section className="nestjs-card p-5 rounded-2xl">
                <h3 className="text-base font-bold text-slate-950 dark:text-white mb-4">
                  Works With
                </h3>
                <div className="flex flex-wrap gap-2">
                  {library.frameworks.map((framework) => (
                    <span
                      key={framework}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#182840] border border-slate-200 dark:border-slate-600/30 text-xs font-medium text-slate-600 dark:text-slate-300"
                    >
                      {framework}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Alternatives & Similar Packages */}
            {library.alternatives?.length > 0 && (
              <section className="nestjs-card p-5 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-teal-500" />
                  <h3 className="text-base font-bold text-slate-950 dark:text-white">
                    Alternatives
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  Similar packages in {library.ecosystem || 'this category'}:
                </p>
                <div className="space-y-2">
                  {library.alternatives.map((altName) => {
                    const match = allLibraries.find(
                      (l) => l.id.toLowerCase() === altName.toLowerCase() || l.name.toLowerCase() === altName.toLowerCase()
                    );
                    const handleSelect = async () => {
                      if (match) {
                        onSelectAlternative?.(match);
                      } else {
                        const fetched = await getLibraryById(altName);
                        if (fetched) onSelectAlternative?.(fetched);
                      }
                    };
                    return (
                      <div
                        key={altName}
                        onClick={handleSelect}
                        className="p-2.5 rounded-xl border transition-all flex items-center justify-between bg-slate-50 dark:bg-[#182840] border-slate-200 dark:border-slate-700 hover:border-teal-500 cursor-pointer group"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors block truncate">
                            {match ? match.name : altName}
                          </span>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {match?.tagline || `Explore ${altName} documentation & metrics`}
                          </p>
                        </div>
                        <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 shrink-0 ml-2 font-semibold">
                          View →
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            <button
              onClick={() => onToggleCompare(library.id)}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${isCompared
                ? 'bg-ocean border-ocean text-white dark:bg-teal-600 dark:border-teal-600'
                : 'bg-white dark:bg-charcoal/70 border-slate-200 dark:border-slateTeal/30 text-slate-700 dark:text-slate-300 hover:border-ocean dark:hover:border-teal-400 hover:text-ocean dark:hover:text-teal-300'
                }`}
            >
              <Scale className="w-4 h-4" />
              {isCompared ? 'Added to Compare' : 'Add to Compare'}
            </button>
          </aside>
        </div>
      </div>
    </motion.div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-xs text-slate-500 dark:text-slate-500">
        {label}
      </span>
      <span className="text-xs font-semibold text-right text-slate-800 dark:text-slate-300">
        {value || '—'}
      </span>
    </div>
  );
}