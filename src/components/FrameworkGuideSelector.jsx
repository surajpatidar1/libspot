import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Terminal, ExternalLink, Sparkles } from 'lucide-react';
import { ECOSYSTEMS } from '../data/ecosystems';

// Full SVG Icons matching shadcn's installation directory style
const ICONS = {
  Nextjs: (
    <svg className="w-10 h-10 fill-current" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
      <path d="M90 0C40.294 0 0 40.294 0 90s40.294 90 90 90 90-40.294 90-90S139.706 0 90 0zM77.4 135V45h18v64.8l38.25-64.8H147l-48.6 82.35L77.4 135z" />
    </svg>
  ),
  Vite: (
    <svg className="w-10 h-10" viewBox="0 0 410 404" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M399.641 59.5246L215.643 388.545C211.844 395.338 202.074 395.378 198.22 388.618L10.7202 59.5978C6.68081 52.4975 12.2502 43.8345 20.3708 44.5249L205.202 60.2335C206.052 60.3057 206.905 60.3023 207.755 60.2233L389.967 43.2758C398.128 42.5167 403.748 51.1969 399.641 59.5246Z" fill="url(#vite-a)" />
      <path d="M285.506 12.0016L129.412 85.3406C125.753 87.0596 124.636 91.5646 127.108 94.6766L201.218 188.002C203.208 190.508 206.942 190.648 209.117 188.298L288.756 102.164C291.134 99.5916 289.878 95.3486 286.377 94.4926L285.506 12.0016Z" fill="url(#vite-b)" />
      <defs>
        <linearGradient id="vite-a" x1="205.183" y1="44.2546" x2="205.183" y2="394.887" gradientUnits="userSpaceOnUse">
          <stop stopColor="#41D1FF" />
          <stop offset="1" stopColor="#BD34FE" />
        </linearGradient>
        <linearGradient id="vite-b" x1="208.57" y1="12" x2="208.57" y2="190.648" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFEA83" />
          <stop offset="0.0833333" stopColor="#FFDD35" />
          <stop offset="1" stopColor="#FFA800" />
        </linearGradient>
      </defs>
    </svg>
  ),
  React: (
    <svg className="w-10 h-10 fill-current text-[#149eca]" viewBox="0 0 115.3 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="57.65" cy="50" rx="14.8" ry="49" transform="rotate(30 57.65 50)" fill="none" stroke="currentColor" strokeWidth="6" />
      <ellipse cx="57.65" cy="50" rx="14.8" ry="49" transform="rotate(90 57.65 50)" fill="none" stroke="currentColor" strokeWidth="6" />
      <ellipse cx="57.65" cy="50" rx="14.8" ry="49" transform="rotate(150 57.65 50)" fill="none" stroke="currentColor" strokeWidth="6" />
      <circle cx="57.65" cy="50" r="8" fill="currentColor" />
    </svg>
  ),
  Vue: (
    <svg className="w-10 h-10" viewBox="0 0 261.76 226.69" xmlns="http://www.w3.org/2000/svg">
      <path d="M161.096.001l-30.225 52.351L100.647.001H0l130.877 226.688L261.749.001z" fill="#41B883" />
      <path d="M161.096.001l-30.225 52.351L100.647.001H52.246l78.626 136.181L209.503.001z" fill="#34495E" />
    </svg>
  ),
  Astro: (
    <svg className="w-10 h-10 fill-current" viewBox="0 0 256 364" xmlns="http://www.w3.org/2000/svg">
      <path d="M208 0L96 160h80L48 364l160-204h-80L208 0z" fill="url(#astro-grad)" />
      <defs>
        <linearGradient id="astro-grad" x1="0" y1="0" x2="256" y2="364" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF5D01" />
          <stop offset="1" stopColor="#D83333" />
        </linearGradient>
      </defs>
    </svg>
  ),
  FastAPI: (
    <svg className="w-10 h-10" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#059669" />
      <path d="M48 20L28 52h20l-6 28 26-36H48l8-24z" fill="#ffffff" />
    </svg>
  ),
  Django: (
    <svg className="w-10 h-10" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#092E20" />
      <text x="50" y="68" fill="#44B78B" fontSize="56" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">dj</text>
    </svg>
  ),
  Gin: (
    <svg className="w-10 h-10" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#0284c7" />
      <path d="M30 30h40l-20 22v22h12v6H38v-6h12V52L30 30z" fill="#ffffff" />
    </svg>
  ),
  Axum: (
    <svg className="w-10 h-10" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#CE422B" />
      <path d="M50 22L24 78h16l6-14h18l6 14h16L60 22H50zm5 28h-10l5-12 5 12z" fill="#ffffff" />
    </svg>
  ),
  SpringBoot: (
    <svg className="w-10 h-10" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#6DB33F" />
      <path d="M30 65c12-30 40-35 40-35s-5 28-30 38c-3 1-8 0-10-3z" fill="#ffffff" />
    </svg>
  ),
  AspNetCore: (
    <svg className="w-10 h-10" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#512BD4" />
      <text x="50" y="62" fill="#ffffff" fontSize="28" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">.NET</text>
    </svg>
  ),
  Flutter: (
    <svg className="w-10 h-10" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M58 10L18 50l14 14L76 20H58z" fill="#54C5F8" />
      <path d="M58 50L36 72l14 14 36-36H58z" fill="#01579B" />
      <path d="M50 86l14-14 12 12-14 14H50z" fill="#29B6F6" />
    </svg>
  ),
  PyTorch: (
    <svg className="w-10 h-10" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 12a38 38 0 100 76 38 38 0 000-76zm0 14a24 24 0 110 48 24 24 0 010-48z" fill="#EE4C2C" />
      <circle cx="68" cy="32" r="5" fill="#EE4C2C" />
    </svg>
  ),
  Docker: (
    <svg className="w-10 h-10" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#2496ED" />
      <path d="M22 55h8v8h-8zm11 0h8v8h-8zm11 0h8v8h-8zm11 0h8v8h-8zm-22-10h8v8h-8zm11 0h8v8h-8zm11 0h8v8h-8zm11-10h8v8h-8z" fill="#ffffff" />
      <path d="M78 52c-2-6-8-8-12-8v4c14 1 12 18 0 20H15c2 12 14 18 30 18s36-8 38-24c1-3 0-7-5-10z" fill="#ffffff" />
    </svg>
  ),
  Kubernetes: (
    <svg className="w-10 h-10" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#326CE5" />
      <polygon points="50,22 75,36 75,64 50,78 25,64 25,36" fill="none" stroke="#ffffff" strokeWidth="5" />
      <circle cx="50" cy="50" r="10" fill="#ffffff" />
    </svg>
  ),
  Terraform: (
    <svg className="w-10 h-10" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 18h26v26H20z" fill="#844FBA" />
      <path d="M50 33h26v26H50z" fill="#623CE4" />
      <path d="M20 48h26v26H20z" fill="#5C4EE5" />
      <path d="M50 63h26v26H50z" fill="#844FBA" />
    </svg>
  )
};

// Curated framework cards list organized by ecosystem
const ALL_FRAMEWORK_CARDS = [
  // Top Featured Across All
  { id: 'Next.js', name: 'Next.js', eco: 'JS / TS', icon: ICONS.Nextjs, cmd: 'npx create-next-app@latest' },
  { id: 'Vite', name: 'Vite', eco: 'JS / TS', icon: ICONS.Vite, cmd: 'npm create vite@latest' },
  { id: 'FastAPI', name: 'FastAPI', eco: 'Python', icon: ICONS.FastAPI, cmd: 'pip install fastapi uvicorn' },
  { id: 'Django', name: 'Django', eco: 'Python', icon: ICONS.Django, cmd: 'pip install django' },
  { id: 'Gin', name: 'Gin', eco: 'Go', icon: ICONS.Gin, cmd: 'go get -u github.com/gin-gonic/gin' },
  { id: 'Axum', name: 'Axum', eco: 'Rust', icon: ICONS.Axum, cmd: 'cargo add axum tokio' },
  { id: 'Flutter', name: 'Flutter', eco: 'Mobile', icon: ICONS.Flutter, cmd: 'flutter create my_app' },
  { id: 'PyTorch', name: 'PyTorch', eco: 'AI / ML', icon: ICONS.PyTorch, cmd: 'pip install torch torchvision' },
  { id: 'Docker', name: 'Docker', eco: 'DevOps', icon: ICONS.Docker, cmd: 'docker compose up -d' },
  { id: 'Spring Boot', name: 'Spring Boot', eco: 'Java', icon: ICONS.SpringBoot, cmd: 'mvn spring-boot:run' },
  { id: 'ASP.NET Core', name: 'ASP.NET Core', eco: 'C#', icon: ICONS.AspNetCore, cmd: 'dotnet new webapi' },
  { id: 'Kubernetes', name: 'Kubernetes', eco: 'DevOps', icon: ICONS.Kubernetes, cmd: 'kubectl apply -f deployment.yaml' },

  // JS/TS specifics
  { id: 'React', name: 'React', eco: 'JS / TS', icon: ICONS.React, cmd: 'npm i react react-dom' },
  { id: 'Vue', name: 'Vue.js', eco: 'JS / TS', icon: ICONS.Vue, cmd: 'npm create vue@latest' },
  { id: 'Astro', name: 'Astro', eco: 'JS / TS', icon: ICONS.Astro, cmd: 'npm create astro@latest' },

  // DevOps specifics
  { id: 'Terraform', name: 'Terraform', eco: 'DevOps', icon: ICONS.Terraform, cmd: 'terraform init && terraform apply' }
];

export default function FrameworkGuideSelector({
  selectedEcosystem = 'All',
  onSelectEcosystem,
  selectedFramework = 'All',
  onSelectFramework,
  filteredCount = 0,
  onCopyCommand
}) {
  const [copied, setCopied] = useState(false);

  // Filter framework cards based on selected ecosystem
  const visibleCards = selectedEcosystem === 'All'
    ? ALL_FRAMEWORK_CARDS
    : ALL_FRAMEWORK_CARDS.filter((c) => c.eco === selectedEcosystem || selectedEcosystem === 'All');

  const activeCard = ALL_FRAMEWORK_CARDS.find((c) => c.id === selectedFramework);

  const handleCopy = (cmd) => {
    if (!cmd) return;
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    if (onCopyCommand) onCopyCommand(cmd);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-10">
      {/* Header (shadcn-style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Framework & Stack Guide
            </h2>
            {selectedFramework !== 'All' && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                Filtered: {selectedFramework}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Select a framework to view starter templates, verified packages, and daily developer tools.
          </p>
        </div>

        {selectedFramework !== 'All' && (
          <button
            onClick={() => onSelectFramework('All')}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111d32] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#182840] transition-colors cursor-pointer"
          >
            Clear Framework Filter
          </button>
        )}
      </div>

      {/* Primary Ecosystem Tabs [ All ] [ JS / TS ] [ Python ] [ Go ] [ Rust ] [ Java ] [ C# ] [ Mobile ] [ AI / ML ] [ DevOps ] */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 scrollbar-none mb-6 border-b border-slate-200 dark:border-slate-800">
        {ECOSYSTEMS.map((eco) => {
          const isSelected = selectedEcosystem === eco;
          return (
            <button
              key={eco}
              onClick={() => {
                onSelectEcosystem(eco);
                onSelectFramework('All');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              {eco}
            </button>
          );
        })}
      </div>

      {/* shadcn-style Big Framework Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4">
        {visibleCards.map((fw) => {
          const isSelected = selectedFramework === fw.id;
          return (
            <button
              key={fw.id}
              onClick={() => {
                if (isSelected) {
                  onSelectFramework('All'); // toggle off
                } else {
                  onSelectFramework(fw.id);
                }
              }}
              className={`h-36 sm:h-40 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group relative ${
                isSelected
                  ? 'bg-slate-100/90 dark:bg-[#182840] border-teal-500 dark:border-teal-400 shadow-sm ring-1 ring-teal-500/50'
                  : 'bg-white dark:bg-[#111d32] border-slate-200/90 dark:border-slate-600/30 hover:border-slate-400 dark:hover:border-slate-500/50 hover:bg-slate-50/50 dark:hover:bg-[#182840]/60'
              }`}
            >
              {/* Selected Check Indicator */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs shadow-xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              {/* Centered Large SVG Icon */}
              <div className="w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-110">
                {fw.icon}
              </div>

              {/* Framework Name */}
              <div className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white text-center leading-snug">
                {fw.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Framework Quick Setup Banner (Appears when a framework is selected) */}
      <AnimatePresence>
        {selectedFramework !== 'All' && activeCard && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="mt-5 p-4 rounded-xl bg-white dark:bg-[#111d32] border border-slate-200/90 dark:border-slate-600/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#182840] flex items-center justify-center">
                {activeCard.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {activeCard.name} Quick Starter
                  </h4>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    Showing {filteredCount} compatible libraries
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Click the button to copy the starter install command or explore packages below.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs border border-slate-800">
                <span className="text-teal-400 select-none">$</span>
                <span className="truncate max-w-xs">{activeCard.cmd}</span>
              </div>
              <button
                onClick={() => handleCopy(activeCard.cmd)}
                className={`p-2 rounded-lg border text-xs font-mono flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
                  copied
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-white hover:bg-slate-900'
                }`}
                title="Copy command"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
