import React from 'react';
import {
  Filter,
  X,
  RotateCcw,
  Check,
  LayoutGrid,
  ChevronDown,
} from 'lucide-react';

import {
  CATEGORIES,
  BUNDLE_SIZE_RANGES,
} from '../data/libraries';

import { ECOSYSTEM_METADATA } from '../data/ecosystems';

const CATEGORY_ICONS = {
  'All': LayoutGrid,
};

export default function FilterSidebar({
  selectedEcosystem = 'All',
  selectedCategory,
  onSelectCategory,
  selectedBundleSize,
  onSelectBundleSize,
  onResetFilters,
  activeFilterCount = 0,
  categoryCounts = {},
  isMobileOpen = false,
  onCloseMobile,
}) {
  const meta =
    ECOSYSTEM_METADATA[selectedEcosystem] ||
    ECOSYSTEM_METADATA['All'];

  const activeCategories = (selectedEcosystem === 'All' || !meta.categories)
    ? CATEGORIES
    : meta.categories;

  const content = (
    <div className="space-y-7">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg
            bg-slate-100 dark:bg-[#182840]">
            <Filter className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Filters
            </h2>

            {activeFilterCount > 0 && (
              <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-0.5">
                {activeFilterCount} active
              </p>
            )}
          </div>
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={onResetFilters}
            className="
              text-xs font-medium
              text-slate-500 hover:text-slate-900
              dark:text-slate-400 dark:hover:text-white
              transition-colors cursor-pointer
            "
          >
            Reset
          </button>
        )}
      </div>

      {/* Categories */}
      <section>
        <h3 className="
          text-[11px] font-semibold uppercase tracking-wider
          text-slate-500 dark:text-slate-500 mb-3
        ">
          Category
        </h3>

        <div className="space-y-1">
          {activeCategories.map((cat) => {
            const selected = selectedCategory === cat;
            const count = categoryCounts[cat] || 0;

            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(selected ? 'All' : cat)}
                className={`
                  w-full
                  flex items-center justify-between
                  px-3 py-2
                  rounded-lg
                  text-sm
                  transition-all
                  cursor-pointer

                  ${selected
                    ? `
                        bg-slate-100
                        text-slate-900
                        dark:bg-[#182840]
                        dark:text-white
                      `
                    : `
                        text-slate-600
                        hover:bg-slate-50
                        hover:text-slate-900

                        dark:text-slate-400
                        dark:hover:bg-[#182840]/70
                        dark:hover:text-white
                      `
                  }
                `}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {selected && (
                    <span className="
                      w-1.5 h-1.5 rounded-full
                      bg-teal-500 shrink-0
                    " />
                  )}

                  <span className="truncate">
                    {cat}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Bundle Size */}
      <section>
        <h3 className="
          text-[11px] font-semibold uppercase tracking-wider
          text-slate-500 dark:text-slate-500 mb-3
        ">
          Bundle size
        </h3>

        <div className="space-y-1">
          {BUNDLE_SIZE_RANGES.map((range, index) => {
            const selected = selectedBundleSize === index;

            return (
              <button
                key={range.label}
                onClick={() => onSelectBundleSize(index)}
                className={`
                  w-full
                  flex items-center justify-between
                  px-3 py-2
                  rounded-lg
                  text-sm
                  transition-all
                  cursor-pointer

                  ${selected
                    ? `
                        bg-slate-100
                        text-slate-900
                        dark:bg-slate-900
                        dark:text-white
                      `
                    : `
                        text-slate-600
                        hover:bg-slate-50
                        hover:text-slate-900

                        dark:text-slate-400
                        dark:hover:bg-slate-900/70
                        dark:hover:text-white
                      `
                  }
                `}
              >
                <span>{range.label}</span>

                {selected && (
                  <Check className="
                    w-4 h-4
                    text-teal-600
                    dark:text-teal-400
                  " />
                )}
              </button>
            );
          })}
        </div>
      </section>

    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="
        hidden lg:block
        w-[260px]
        shrink-0
        sticky top-24
        h-fit

        bg-white
        dark:bg-[#111d32]

        border border-slate-200
        dark:border-slate-600/30

        rounded-2xl
        p-5

        shadow-sm
      ">
        {content}
      </aside>

      {/* Mobile */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">

          <div
            onClick={onCloseMobile}
            className="
              absolute inset-0
              bg-black/50
              backdrop-blur-sm
            "
          />

          <aside className="
            absolute right-0 top-0
            h-full
            w-[320px]
            max-w-[90vw]

            bg-white
            dark:bg-[#111d32]

            border-l
            border-slate-200
            dark:border-slate-600/30

            p-5
            overflow-y-auto
            shadow-2xl
          ">

            <div className="
              flex items-center justify-between
              mb-6 pb-4
              border-b
              border-slate-200
              dark:border-slate-800
            ">
              <div>
                <h2 className="
                  text-sm font-semibold
                  text-slate-900 dark:text-white
                ">
                  Filters
                </h2>

                {activeFilterCount > 0 && (
                  <p className="
                    text-xs text-slate-500
                    dark:text-slate-500 mt-1
                  ">
                    {activeFilterCount} active
                  </p>
                )}
              </div>

              <button
                onClick={onCloseMobile}
                className="
                  p-2 rounded-lg
                  text-slate-500
                  hover:bg-slate-100
                  dark:hover:bg-slate-900
                  dark:text-slate-400
                "
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {content}
          </aside>
        </div>
      )}
    </>
  );
}