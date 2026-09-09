import React from 'react';

export default function LibSpotLogo({ size = 36, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        {/* Background rounded gradient */}
        <linearGradient id="ls-bg-cmp" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1F4959" />
          <stop offset="100%" stopColor="#0a1922" />
        </linearGradient>

        {/* Vibrant teal accent gradient */}
        <linearGradient id="ls-teal-cmp" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="50%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>

        {/* Top package plane highlight */}
        <linearGradient id="ls-top-cmp" x1="20" y1="12" x2="44" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>

        {/* Drop shadow filter */}
        <filter id="ls-glow-cmp" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor="#14b8a6" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* Base Rounded Hex / Squircle Container */}
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="16"
        fill="url(#ls-bg-cmp)"
        stroke="#14b8a6"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />

      {/* Isometric Library Nodes (Interconnected packages converging into a central Spot) */}
      <g filter="url(#ls-glow-cmp)">
        {/* Top Package Plane */}
        <path d="M32 12L48 21.2L32 30.4L16 21.2L32 12Z" fill="url(#ls-top-cmp)" />

        {/* Left Package Pillar (Isometric 'L') */}
        <path
          d="M16 24.5L30 32.5V47.5L16 39.5V24.5Z"
          fill="#1F4959"
          stroke="#2dd4bf"
          strokeWidth="0.8"
          strokeOpacity="0.65"
        />

        {/* Right Package Pillar (Isometric 'S' shape) */}
        <path
          d="M34 32.5L48 24.5V39.5L34 47.5V32.5Z"
          fill="#133542"
          stroke="#2dd4bf"
          strokeWidth="0.8"
          strokeOpacity="0.65"
        />

        {/* Central Radiant Spot Node */}
        <circle cx="32" cy="30.4" r="4" fill="#ffffff" />
        <circle cx="32" cy="30.4" r="2.2" fill="#14b8a6" />

        {/* Interconnecting Framework Struts */}
        <path
          d="M32 18V27M22 24.5L28.5 28.5M42 24.5L35.5 28.5"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path d="M32 34V42" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Radiant Spot Ring Accents */}
      <circle cx="23" cy="43.5" r="1.5" fill="#2dd4bf" />
      <circle cx="41" cy="43.5" r="1.5" fill="#2dd4bf" />
    </svg>
  );
}
