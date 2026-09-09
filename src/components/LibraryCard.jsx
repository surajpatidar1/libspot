import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  Download,
  Copy,
  Check,
  Bookmark,
  Scale,
  ArrowUpRight,
  Sparkles,
  Radio,
} from 'lucide-react';
import { formatInstallCommand } from '../utils/formatCommand';

export default function LibraryCard({
  library,
  viewMode = 'grid',
  isSaved = false,
  isCompared = false,
  onToggleSave,
  onToggleCompare,
  onSelectLibrary,
  onCopyCommand,
  packageManager = 'npm',
}) {
  const [copied, setCopied] = useState(false);

  const activeInstallCommand = formatInstallCommand(library.installCommand, packageManager);

  const handleCopy = (e) => {
    e.stopPropagation();

    navigator.clipboard.writeText(activeInstallCommand);

    setCopied(true);

    onCopyCommand?.(activeInstallCommand);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    onToggleSave?.(library.id);
  };

  const handleCompare = (e) => {
    e.stopPropagation();
    onToggleCompare?.(library.id);
  };

  const isLight =
    String(library.bundleSize || '').toLowerCase().includes('zero') ||
    (library.bundleSizeBytes && library.bundleSizeBytes < 5000);

  /* =========================
     LIST VIEW
  ========================= */

  if (viewMode === 'list') {
    return (
      <motion.article
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        whileHover={{ y: -1 }}
        transition={{ duration: 0.18 }}
        onClick={() => onSelectLibrary(library)}
        className="
          group
          bg-white dark:bg-[#111d32]

          border border-slate-200/80
          dark:border-slate-600/30

          hover:border-slate-300
          dark:hover:border-slate-500/50

          rounded-2xl
          p-5

          cursor-pointer
          transition-all

          hover:shadow-lg
          dark:hover:shadow-black/20
        "
      >
        <div className="
          flex flex-col
          xl:flex-row
          xl:items-center
          gap-5
        ">

          {/* Main */}
          <div className="flex-1 min-w-0">

            <div className="flex items-center gap-2 flex-wrap">

              <h3 className="
                text-[17px]
                font-semibold
                tracking-tight
                text-slate-950
                dark:text-white

                group-hover:text-teal-600
                dark:group-hover:text-teal-400

                transition-colors
              ">
                {library.name}
              </h3>

              <span className="
                text-xs
                font-mono
                text-slate-400
                dark:text-slate-500
              ">
                {library.version ? (library.version.startsWith('v') ? library.version : `v${library.version}`) : ''}
              </span>

              <span className="
                px-2 py-0.5
                rounded-md

                text-[11px]
                font-medium

                bg-slate-100
                text-slate-600

                dark:bg-[#182840]
                dark:text-slate-400
              ">
                {library.category}
              </span>

              {library.tsSupport === 'Built-in' && (
                <span className="
                  px-2 py-0.5
                  rounded-md

                  text-[10px]
                  font-semibold

                   bg-blue-50
                   text-blue-600

                   dark:bg-blue-900/30
                   dark:text-blue-400
                ">
                  TypeScript
                </span>
              )}

              {library.aiRecommendation && (
                <span className="
                  px-2 py-0.5
                  rounded-md
                  text-[10px]
                  font-semibold
                  bg-teal-50
                  text-teal-700
                  border border-teal-200/60
                  dark:bg-teal-950/40
                  dark:text-teal-300
                  dark:border-teal-800/40
                  flex items-center gap-1
                ">
                  <Sparkles className="w-2.5 h-2.5" />
                  AI Recommended
                </span>
              )}

            </div>

            <p className="
              mt-2
              text-sm
              leading-6
              text-slate-500
              dark:text-slate-400

              max-w-3xl
              line-clamp-2
            ">
              {library.tagline}
            </p>

            {/* Frameworks */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {library.frameworks?.slice(0, 4).map((fw, idx) => (
                <span
                  key={`${fw}-${idx}`}
                  className="
                    px-2 py-1
                    rounded-md

                    text-[10px]
                    font-medium

                    bg-slate-50
                    border border-slate-200

                    text-slate-500

                    dark:bg-[#182840]/70
                    dark:border-slate-600/30
                    dark:text-slate-400
                  "
                >
                  {fw}
                </span>
              ))}
            </div>

          </div>

          {/* Right */}
          <div className="
            flex items-center
            justify-between
            xl:justify-end
            gap-5
            shrink-0
          ">

            <div className="flex items-center gap-4">

              <div className="
                flex items-center gap-1.5
                text-xs
                text-slate-500
                dark:text-slate-400
              ">
                <Star className="
                  w-3.5 h-3.5
                  fill-amber-400
                  text-amber-400
                " />
                {library.stars}
              </div>

              <div className="
                flex items-center gap-1.5
                text-xs
                text-slate-500
                dark:text-slate-400
              ">
                <Download className="w-3.5 h-3.5" />
                {library.weeklyDownloads}/wk
              </div>

              <span className={`
                text-xs font-medium
                ${isLight
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-500 dark:text-slate-400'
                }
              `}>
                {library.bundleSize}
              </span>

            </div>

            <div
              className="flex items-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >

              <button
                onClick={handleCopy}
                title="Copy install command"
                className="
                  flex items-center gap-1.5

                  px-3 py-2
                  rounded-lg

                  border
                  border-slate-200
                  dark:border-slate-600/30

                  bg-white
                  dark:bg-[#182840]

                  text-xs
                  text-slate-600
                  dark:text-slate-300

                  hover:border-slate-300
                  dark:hover:border-slate-500/50

                  transition-colors
                "
              >
                {copied
                  ? <Check className="w-3.5 h-3.5 text-emerald-500" />
                  : <Copy className="w-3.5 h-3.5" />
                }

                <span className="hidden sm:block">
                  {copied ? 'Copied' : 'Install'}
                </span>
              </button>

              <button
                onClick={handleCompare}
                title="Compare"
                className={`
                  p-2
                  rounded-lg
                  border
                  transition-colors

                  ${isCompared
                    ? `
                        bg-[#1F4959]
                        border-[#1F4959]
                        text-white
                      `
                    : `
                        bg-white
                        dark:bg-[#182840]

                        border-slate-200
                        dark:border-slate-600/30

                        text-slate-500
                        hover:text-slate-900
                        dark:hover:text-white
                      `
                  }
                `}
              >
                <Scale className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleSave}
                title={isSaved ? 'Remove from stack' : 'Save'}
                className="
                  p-2
                  rounded-lg
                  border

                  bg-white
                  dark:bg-[#182840]

                  border-slate-200
                  dark:border-slate-600/30

                  text-slate-500
                  hover:text-slate-900
                  dark:hover:text-white

                  transition-colors
                "
              >
                <Bookmark
                  className={`
                    w-3.5 h-3.5
                    ${isSaved
                      ? 'fill-teal-500 text-teal-500'
                      : ''
                    }
                  `}
                />
              </button>

            </div>

          </div>

        </div>
      </motion.article>
    );
  }

  /* =========================
     GRID VIEW
  ========================= */

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18 }}
      onClick={() => onSelectLibrary(library)}
      className="
        group

        h-full
        min-h-[320px]

        bg-white
        dark:bg-[#111d32]

        border border-slate-200/80
        dark:border-slate-600/30

        hover:border-slate-300
        dark:hover:border-slate-500/50

        rounded-2xl
        p-5

        flex flex-col justify-between

        cursor-pointer
        transition-all

        hover:shadow-xl
        hover:shadow-slate-200/40

        dark:hover:shadow-black/30
      "
    >

      {/* Header */}
      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">

          <div className="flex items-center gap-2">

            <h3 className="
              text-[17px]
              font-semibold
              tracking-tight

              text-slate-950
              dark:text-white

              truncate

              group-hover:text-teal-600
              dark:group-hover:text-teal-400

              transition-colors
            ">
              {library.name}
            </h3>

            <span className="
              text-[11px]
              font-mono
              text-slate-400
              dark:text-slate-500
              shrink-0
            ">
              {library.version ? (library.version.startsWith('v') ? library.version : `v${library.version}`) : ''}
            </span>

          </div>

          <div className="flex items-center gap-2 mt-2 flex-wrap">

            <span className="
              px-2 py-1
              rounded-md

              bg-slate-100
              dark:bg-[#182840]

              text-[10px]
              font-medium

              text-slate-600
              dark:text-slate-400
            ">
              {library.category}
            </span>

            {library.tsSupport === 'Built-in' && (
              <span className="
                px-2 py-1
                rounded-md

                bg-blue-50
                dark:bg-blue-900/30

                text-[10px]
                font-semibold

                text-blue-600
                dark:text-blue-400
              ">
                TypeScript
              </span>
            )}

            {library.aiRecommendation && (
              <span className="
                px-2 py-1
                rounded-md
                text-[10px]
                font-semibold
                bg-teal-50
                text-teal-700
                border border-teal-200/60
                dark:bg-teal-950/40
                dark:text-teal-300
                dark:border-teal-800/40
                flex items-center gap-1
              ">
                <Sparkles className="w-2.5 h-2.5" />
                AI Choice
              </span>
            )}

          </div>

        </div>

        {/* Stars */}
        <div className="
          flex items-center gap-1.5
          shrink-0

          px-2.5 py-1.5

          rounded-lg

          bg-slate-50
          dark:bg-[#182840]

          border border-slate-200
          dark:border-slate-600/30

          text-xs
          font-semibold

          text-slate-800
          dark:text-white
        ">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{library.stars}</span>
        </div>

      </div>

      {/* Tagline */}
      <p className="
        text-xs
        text-slate-600
        dark:text-slate-400

        leading-relaxed
        line-clamp-2

        mt-3
      ">
        {library.tagline}
      </p>

      {/* AI Recommendation Banner */}
      {library.aiRecommendation && (
        <div className="
          mt-3
          p-2.5
          rounded-xl

          bg-teal-50/60
          dark:bg-teal-950/20

          border
          border-teal-200/50
          dark:border-teal-800/30

          text-[11px]
          leading-relaxed

          text-teal-900
          dark:text-teal-300

          line-clamp-2
        ">
          <div className="flex items-center gap-1.5 font-semibold text-teal-800 dark:text-teal-200 mb-1">
            <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" />
            <span>AI Verdict</span>
          </div>
          {library.aiRecommendation}
        </div>
      )}

      {/* Framework Badges */}
      <div className="flex flex-wrap items-center gap-1.5 mt-3">

        {library.frameworks?.slice(0, 3).map((fw, idx) => (
          <span
            key={`${fw}-${idx}`}
            className="
              px-2 py-0.5
              rounded-md

              text-[10px]
              font-medium

              bg-slate-100
              dark:bg-[#182840]

              text-slate-600
              dark:text-slate-400
            "
          >
            {fw}
          </span>
        ))}

        {library.frameworks?.length > 3 && (
          <span className="
            px-2 py-1
            text-[10px]
            text-slate-400
          ">
            +{library.frameworks.length - 3}
          </span>
        )}

      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Metrics */}
      <div className="
        flex items-center justify-between

        pt-4
        mt-5

        border-t
        border-slate-100
        dark:border-slate-600/30
      ">

        <div className="
          flex items-center gap-1.5

          text-xs
          text-slate-500
          dark:text-slate-400
        ">
          <Download className="w-3.5 h-3.5" />
          <span>{library.weeklyDownloads}</span>
          <span className="text-slate-400">/wk</span>
        </div>

        <span className={`
          text-xs
          font-medium
          ${isLight
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-slate-500 dark:text-slate-400'
          }
        `}>
          {library.bundleSize}
        </span>

      </div>

      {/* Actions */}
      <div
        className="flex items-center gap-2 mt-3"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Install */}
        <button
          onClick={handleCopy}
          title="Copy install command"
          className={`
            flex-1

            min-w-0

            flex items-center
            justify-between
            gap-2

            px-3 py-2.5

            rounded-xl

            border

            text-left

            transition-all

            ${copied
              ? `
                  bg-emerald-50
                  dark:bg-emerald-950/30

                  border-emerald-200
                  dark:border-emerald-900

                  text-emerald-700
                  dark:text-emerald-400
                `
              : `
                  bg-slate-50
                  dark:bg-[#182840]

                  border-slate-200
                  dark:border-slate-600/30

                  hover:border-slate-300
                  dark:hover:border-slate-500/50
                `
            }
          `}
        >

          <span className="
            truncate
            text-[11px]
            font-mono
            text-slate-600
            dark:text-slate-300
          ">
            {activeInstallCommand}
          </span>

          {copied ? (
            <Check className="
              w-4 h-4
              shrink-0
              text-emerald-500
            " />
          ) : (
            <Copy className="
              w-4 h-4
              shrink-0
              text-slate-400
            " />
          )}

        </button>

        {/* Compare */}
        <button
          onClick={handleCompare}
          title={isCompared ? 'Remove compare' : 'Compare'}
          className={`
            p-2.5
            rounded-xl

            border

            transition-all

            ${isCompared
              ? `
                  bg-[#1F4959]
                  border-[#1F4959]
                  text-white
                `
              : `
                  bg-white
                  dark:bg-[#182840]

                  border-slate-200
                  dark:border-slate-600/30

                  text-slate-500

                  hover:text-slate-900
                  dark:hover:text-white
                `
            }
          `}
        >
          <Scale className="w-4 h-4" />
        </button>

        {/* Save */}
        <button
          onClick={handleSave}
          title={isSaved ? 'Remove from stack' : 'Save'}
          className="
            p-2.5
            rounded-xl

            border

            bg-white
            dark:bg-[#182840]

            border-slate-200
            dark:border-slate-600/30

            text-slate-500

            hover:text-slate-900
            dark:hover:text-white

            transition-all
          "
        >
          <Bookmark
            className={`
              w-4 h-4

              ${isSaved
                ? 'fill-teal-500 text-teal-500'
                : ''
              }
            `}
          />
        </button>

      </div>

    </motion.article>
  );
}