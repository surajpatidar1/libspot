export const CATEGORIES = [
  "All",
  "Authentication & Security",
  "WebSockets & Realtime",
  "Backend & ORM",
  "Database & Cache",
  "Code Quality & Linting",
  "Git & Workflow",
  "Build & Tooling",
  "Testing",
  "Form & Validation",
  "State Management",
  "UI & Components",
  "Styling & CSS",
  "Data Fetching & APIs",
  "Animation & 3D",
  "Utilities & Helpers"
];


export const FRAMEWORKS = ["All", "React", "Vue", "Svelte", "Next.js", "Node.js", "Vanilla"];

export const BUNDLE_SIZE_RANGES = [
  { label: "Any Size", max: Infinity },
  { label: "Ultra-Light (< 3 kB)", max: 3 },
  { label: "Lightweight (< 10 kB)", max: 10 },
  { label: "Medium (< 30 kB)", max: 30 },
  { label: "Zero-runtime", zeroRuntime: true }
];

/**
 * Pure Dynamic Data Architecture:
 * All libraries and developer packages are fetched live in real time
 * from official registries (NPM Registry, Crates.io, GitHub REST API).
 * Zero static libraries hardcoded.
 */
export const LIBRARIES = [];
