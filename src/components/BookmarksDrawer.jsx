import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, X, Copy, Check, Trash2, Package } from 'lucide-react';
import { formatInstallCommand } from '../utils/formatCommand';

export default function BookmarksDrawer({
  isOpen = false,
  onClose,
  savedIds = [],
  allLibraries = [],
  onRemoveFromSaved,
  onClearSaved,
  onSelectLibrary,
  packageManager = 'npm'
}) {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  if (!isOpen) return null;

  const savedLibs = allLibraries.filter((l) => savedIds.includes(l.id));

  // Build combined install command e.g. "pnpm add zustand framer-motion zod"
  const getCombinedInstallCommand = () => {
    if (savedLibs.length === 0) return '';
    const pkgNames = savedLibs
      .map((l) => {
        const parts = (l.installCommand || '').split(' ');
        return parts.slice(2).join(' ') || l.name;
      })
      .filter(Boolean);
    const rawCmd = `npm i ${pkgNames.join(' ')}`;
    return formatInstallCommand(rawCmd, packageManager);
  };

  const handleCopyAll = () => {
    const cmd = getCombinedInstallCommand();
    if (!cmd) return;
    navigator.clipboard.writeText(cmd);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopySingle = (e, lib) => {
    e.stopPropagation();
    const cmd = formatInstallCommand(lib.installCommand, packageManager);
    navigator.clipboard.writeText(cmd);
    setCopiedId(lib.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 dark:bg-midnight/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md bg-white dark:bg-[#041b2e] border-l border-slate-200 dark:border-slateTeal/30 h-full p-6 flex flex-col justify-between shadow-2xl z-10"
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slateTeal/20">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-ocean dark:text-teal-400 fill-ocean dark:fill-teal-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono">Saved Stack</h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-ocean text-white font-mono font-semibold">
                {savedLibs.length}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick "Copy All Packages" Banner */}
          {savedLibs.length > 0 && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-midnight border border-slate-200 dark:border-slateTeal/30 shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-semibold text-ocean dark:text-teal-300">
                  Bulk Stack Command
                </span>
                <button
                  onClick={handleCopyAll}
                  className="text-xs flex items-center gap-1 font-mono font-semibold text-white bg-ocean hover:bg-ocean-light px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-xs"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAll ? 'Copied' : 'Copy All'}</span>
                </button>
              </div>
              <code className="text-[11px] font-mono text-slate-700 dark:text-slate-300 block truncate select-all">
                $ {getCombinedInstallCommand()}
              </code>
            </div>
          )}
        </div>

        {/* List of saved libraries */}
        <div className="flex-1 overflow-y-auto my-4 space-y-2.5 pr-1">
          {savedLibs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Package className="w-12 h-12 text-slate-300 dark:text-slate-500 mb-3 stroke-[1.5]" />
              <p className="text-sm font-medium text-slate-800 dark:text-white mb-1 font-mono">No libraries saved yet</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                Click the bookmark icon on any library card to build your stack and generate a 1-line bulk install command.
              </p>
            </div>
          ) : (
            savedLibs.map((lib) => (
              <div
                key={lib.id}
                onClick={() => {
                  onSelectLibrary(lib);
                  onClose();
                }}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-midnight/70 border border-slate-200 dark:border-slateTeal/20 hover:border-ocean dark:hover:border-teal-400/50 transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-ocean dark:group-hover:text-teal-300 transition-colors">
                      {lib.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-white dark:bg-charcoal border border-slate-200 dark:border-slateTeal/20 text-slate-500 dark:text-slate-400 font-mono">
                      {lib.bundleSize}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{lib.tagline}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => handleCopySingle(e, lib)}
                    className="p-1.5 rounded-lg bg-white dark:bg-charcoal border border-slate-200 dark:border-slateTeal/20 text-slate-600 dark:text-slate-300 hover:text-ocean dark:hover:text-white hover:border-ocean dark:hover:border-teal-400"
                    title="Copy install command"
                  >
                    {copiedId === lib.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromSaved(lib.id);
                    }}
                    className="p-1.5 rounded-lg bg-white dark:bg-charcoal border border-slate-200 dark:border-slateTeal/20 text-slate-400 hover:text-red-500"
                    title="Remove from stack"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedLibs.length > 0 && (
          <div className="pt-3 border-t border-slate-200 dark:border-slateTeal/20 flex items-center justify-between">
            <button
              onClick={onClearSaved}
              className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors font-mono cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Stack</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-ocean dark:bg-white text-white dark:text-midnight hover:scale-[0.98] text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
