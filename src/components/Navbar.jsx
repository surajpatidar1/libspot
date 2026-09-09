import React from 'react';
import { Bookmark, Scale, Search, Sun, Moon } from 'lucide-react';
import LibSpotLogo from './LibSpotLogo';

export default function Navbar({
  savedCount = 0,
  compareCount = 0,
  onOpenSaved,
  onOpenCompare,
  searchQuery = '',
  onSearchChange,
  searchInputRef,
  onResetFilters,
  isDark = true,
  onToggleTheme,
  packageManager = 'npm',
  onPackageManagerChange
}) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#0d1b2e]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-700/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onResetFilters}
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
          >
            <div className="group-hover:scale-105 transition-transform duration-200 rounded-2xl shadow-md shadow-teal-500/15">
              <LibSpotLogo size={36} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-[#1F4959] dark:group-hover:text-teal-400 transition-colors font-sans">
                  Lib<span className="text-[#1F4959] dark:text-teal-400">Spot</span>
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Center Search Input */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search packages, frameworks, or tags... ( / )"
              className="w-full pl-10 pr-12 py-2 text-xs sm:text-sm bg-slate-100/70 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-mono"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 select-none shadow-2xs">
              /
            </kbd>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Package Manager Selector */}
          <div className="hidden lg:flex items-center bg-slate-100/80 dark:bg-slate-900/80 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700/80 text-[11px] font-mono shadow-2xs">
            {['npm', 'pnpm', 'yarn', 'bun'].map((pm) => (
              <button
                key={pm}
                onClick={() => onPackageManagerChange?.(pm)}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  packageManager === pm
                    ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-2xs font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={`Switch active package manager to ${pm}`}
              >
                {pm}
              </button>
            ))}
          </div>
          {/* Compare Button */}
          <button
            onClick={onOpenCompare}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${compareCount > 0
                ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30 hover:bg-teal-500'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            title="Compare selected libraries"
          >
            <Scale className="w-4 h-4" />
            <span className="hidden sm:inline">Compare</span>
            {compareCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-teal-700 font-bold text-[11px] flex items-center justify-center shadow-xs">
                {compareCount}
              </span>
            )}
          </button>

          {/* Bookmarks / Saved Stack Button */}
          <button
            onClick={onOpenSaved}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${savedCount > 0
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 hover:border-teal-500'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            title="Saved stack"
          >
            <Bookmark className={`w-4 h-4 ${savedCount > 0 ? 'fill-teal-500 text-teal-500' : 'text-slate-400 dark:text-slate-500'}`} />
            <span className="hidden sm:inline">Stack</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-md bg-teal-600 text-white text-[11px] font-mono font-semibold">
                {savedCount}
              </span>
            )}
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
