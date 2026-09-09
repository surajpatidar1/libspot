import React from 'react';

export default function LibraryCardSkeleton({ viewMode = 'grid' }) {
  if (viewMode === 'list') {
    return (
      <div className="
        w-full
        bg-white dark:bg-[#111d32]
        border border-slate-200/80 dark:border-slate-600/30
        rounded-2xl
        p-5
        animate-pulse
      ">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
          <div className="flex-1 min-w-0 space-y-3">
            {/* Title & Badges */}
            <div className="flex items-center gap-2.5">
              <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700/60 rounded-md" />
              <div className="h-4 w-12 bg-slate-100 dark:bg-slate-800 rounded-md" />
              <div className="h-4 w-20 bg-slate-100 dark:bg-slate-800 rounded-md" />
            </div>

            {/* Description lines */}
            <div className="space-y-1.5 max-w-2xl">
              <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800/80 rounded" />
              <div className="h-3.5 w-3/4 bg-slate-100 dark:bg-slate-800/80 rounded" />
            </div>

            {/* Framework pills */}
            <div className="flex items-center gap-2 pt-1">
              <div className="h-5 w-12 bg-slate-100 dark:bg-slate-800 rounded" />
              <div className="h-5 w-14 bg-slate-100 dark:bg-slate-800 rounded" />
              <div className="h-5 w-12 bg-slate-100 dark:bg-slate-800 rounded" />
            </div>
          </div>

          {/* Metrics & Action placeholders */}
          <div className="flex items-center gap-6 shrink-0 pt-2 xl:pt-0 border-t xl:border-t-0 border-slate-100 dark:border-slate-800">
            <div className="h-4 w-14 bg-slate-100 dark:bg-slate-800 rounded" />
            <div className="h-4 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
            <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700/50 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Grid View Skeleton
  return (
    <div className="
      h-full
      min-h-[320px]
      bg-white dark:bg-[#111d32]
      border border-slate-200/80 dark:border-slate-600/30
      rounded-2xl
      p-5
      flex flex-col justify-between
      animate-pulse
    ">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <div className="h-5 w-28 bg-slate-200 dark:bg-slate-700/60 rounded-md" />
              <div className="h-3.5 w-10 bg-slate-100 dark:bg-slate-800 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
              <div className="h-4 w-14 bg-slate-100 dark:bg-slate-800 rounded" />
            </div>
          </div>

          {/* Stars Pill */}
          <div className="h-6 w-14 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0" />
        </div>

        {/* Tagline */}
        <div className="space-y-2 mt-4">
          <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800/80 rounded" />
          <div className="h-3.5 w-4/5 bg-slate-100 dark:bg-slate-800/80 rounded" />
        </div>

        {/* AI Choice Banner Placeholder */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 space-y-1.5">
          <div className="h-3 w-16 bg-teal-200/40 dark:bg-teal-800/30 rounded" />
          <div className="h-2.5 w-full bg-slate-200/50 dark:bg-slate-700/40 rounded" />
        </div>

        {/* Frameworks */}
        <div className="flex items-center gap-1.5 mt-3">
          <div className="h-4 w-11 bg-slate-100 dark:bg-slate-800 rounded" />
          <div className="h-4 w-12 bg-slate-100 dark:bg-slate-800 rounded" />
          <div className="h-4 w-10 bg-slate-100 dark:bg-slate-800 rounded" />
        </div>
      </div>

      {/* Footer Metrics & Actions */}
      <div className="pt-4 mt-5 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-3.5 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
          <div className="h-3.5 w-12 bg-slate-100 dark:bg-slate-800 rounded" />
        </div>

        <div className="flex items-center gap-2">
          <div className="h-9 flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          <div className="h-9 w-9 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0" />
          <div className="h-9 w-9 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0" />
        </div>
      </div>
    </div>
  );
}
