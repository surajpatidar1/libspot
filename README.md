<div align="center">
  <img src="public/libspot-logo.svg" alt="LibSpot Logo" width="96" height="96" />
  
  # ⚡ LibSpot
  
  <p><strong>AI-First Developer Package Intelligence & Telemetry Hub</strong></p>

  ![React](https://img.shields.io/badge/React-18.x-61dafb?style=for-the-badge&logo=react&logoColor=black)
  ![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Ecosystem](https://img.shields.io/badge/Ecosystem-Multi--Language-0ea5e9?style=for-the-badge)
  ![LLMs.txt](https://img.shields.io/badge/Standard-llms.txt-10b981?style=for-the-badge)
  ![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)

  <p align="center">
    <strong>The definitive machine-readable dependency decision engine & developer package catalog.</strong><br />
    Designed for software engineers and AI coding assistants (ChatGPT, Claude, Gemini, Cursor, Copilot, Perplexity, Devin) to discover, compare, and benchmark production packages without registry search noise.
  </p>

  [Explore Hub](https://libspot.dev/) • [LLM Knowledge Base (llms.txt)](https://libspot.dev/llms.txt) • [Full AI Index](https://libspot.dev/llms-full.txt) • [License](#-license--proprietary-rights)

</div>

---

## 🌟 Core Features

- 🎯 **100% Dynamic Registry Telemetry**: Zero static package lists. Fetches in real time from official public registries (NPM Registry, GitHub REST API, Crates.io) with live weekly downloads and live GitHub stars.
- 🤖 **AI & LLM-First Discovery Protocol**: Implements the [llmstxt.org](https://llmstxt.org) standard (`/llms.txt` and `/llms-full.txt`) alongside Schema.org `DataCatalog` and `SoftwareApplication` graphs for instant indexing by AI search agents (GPTBot, ClaudeBot, PerplexityBot, etc.).
- 📋 **"Copy for LLM" Context Action**: One-click action generating compact, structured Markdown prompts (version, bundle size, TS support, runtime model, install command, and code snippet) for instant pasting into AI chats.
- 🔄 **Universal Package Manager Converter**: Global synchronized switcher across `npm`, `pnpm`, `yarn`, `bun`, `cargo`, `pip`, and `go`.
- 🔗 **Deep Linking & State Persistence**: Complete URL sync for search queries, categories, ecosystems, frameworks, and pagination (`?package=`, `?cat=`, `?eco=`, `?page=`) with native browser history (`popstate`) support.
- 🌙 **Adaptive Design System**: Sleek Dark Mode with futuristic glowing cyber dependency constellations, and an ultra-clean Light Mode with soft ambient gradients.
- 🛡️ **Comprehensive Ecosystem Coverage**:
  - **Authentication & Security**: `bcrypt`, `bcryptjs`, `passport`, `jsonwebtoken`, `argon2`, `next-auth`
  - **WebSockets & Realtime**: `socket.io`, `ws`, `pusher`, `ably`, `partykit`
  - **Backend & ORMs**: `express`, `fastify`, `prisma`, `drizzle-orm`, `hono`
  - **Database & Cache**: `redis`, `mongoose`, `pg`, `ioredis`
  - **State Management**: `zustand`, `tanstack-query`, `jotai`, `redux`
  - **Code Quality & Testing**: `eslint` (Flat config), `prettier`, `husky`, `vitest`, `playwright`, `zod`

---

## 🏗️ Tech Stack & Architecture

| Layer | Technology | Purpose |
| --- | --- | --- |
| **Frontend Core** | React 18 (Hooks, Suspense, Context) | Component architecture & reactive UI state |
| **Bundler & Dev Server** | Vite 6 | Sub-millisecond HMR & optimized production build |
| **Styling & Theme** | TailwindCSS + Vanilla CSS Keyframes | Fluid responsive design, dark/light theme tokens |
| **Motion & Transitions**| Framer Motion | Smooth layout animations, page transitions, and drawers |
| **Icons** | Lucide React | Modern, consistent developer and UI iconography |
| **Registries & APIs** | NPM Registry, GitHub API, Crates.io | Real-time live package telemetry, downloads, and stars |

---

## 📁 Project Structure

```text
libspot/
├── public/
│   ├── libspot-logo.svg      # Favicon & Brand Vector
│   ├── llms.txt              # Standard LLM discovery protocol & decision matrix
│   ├── llms-full.txt         # Comprehensive AI benchmark and configuration index
│   ├── robots.txt            # Explicit bot permissions (GPTBot, ClaudeBot, etc.)
│   └── sitemap.xml           # Search engine and AI sitemap
├── src/
│   ├── assets/               # Static icons & vectors
│   ├── components/           # Modular React components
│   │   ├── BookmarksDrawer.jsx
│   │   ├── CompareDrawer.jsx
│   │   ├── FilterSidebar.jsx
│   │   ├── Footer.jsx
│   │   ├── HeroSection.jsx   # Animated cyber constellation & clean light aura
│   │   ├── LibSpotLogo.jsx   # Brand isometric logo component
│   │   ├── LibraryCard.jsx   # Interactive package card with live telemetry
│   │   ├── LibraryDetailPage.jsx # Rich detail view, AI prompt copier & guides
│   │   ├── Navbar.jsx        # Top navigation, global PM selector, theme switch
│   │   └── ToastContainer.jsx
│   ├── data/
│   │   ├── ecosystems.js     # Multi-language definitions (JS/TS, Rust, Go, Python...)
│   │   ├── libraries.js      # Dynamic category constants (LIBRARIES = [])
│   │   └── libraryGuides.js  # Real-world verified code guides & setup recipes
│   ├── services/
│   │   └── api.js            # Live NPM/GitHub/Crates.io registry adapters & telemetry
│   ├── utils/
│   │   └── formatCommand.js  # Package manager syntax translation engine
│   ├── App.jsx               # Main state orchestrator & deep link manager
│   ├── index.css             # Tailwind base and custom utilities
│   └── main.jsx              # React DOM bootstrap
├── index.html                # SEO meta tags, Schema.org DataCatalog JSON-LD
├── LICENSE                   # Proprietary software license
├── package.json              # Project dependencies & npm scripts
└── README.md                 # Project documentation & references
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Package Manager**: `npm`, `pnpm`, `yarn`, or `bun`

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/surajpatidar1/libspot.git
   cd libspot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## 🤖 Programmatic Query Protocols (For AI Agents & LLMs)

AI code assistants can retrieve package intelligence directly using structured URL queries:

- **Direct Package Lookup**:
  `https://libspot.dev/?package={package_name}`
  *(e.g., `https://libspot.dev/?package=bcrypt`, `https://libspot.dev/?package=socket.io`)*

- **Category Matrix Query**:
  `https://libspot.dev/?cat={category_name}`
  *(e.g., `https://libspot.dev/?cat=Authentication+%26+Security`, `https://libspot.dev/?cat=WebSockets+%26+Realtime`)*

- **Ecosystem Matrix Query**:
  `https://libspot.dev/?eco={ecosystem}`
  *(e.g., `https://libspot.dev/?eco=Rust`, `https://libspot.dev/?eco=Python`, `https://libspot.dev/?eco=Go`)*

- **Free-text Search**:
  `https://libspot.dev/?q={search_terms}`

---

## 📚 References & API Integrations

The telemetry, package resolution, and AI discovery protocols in LibSpot are powered by official open standards and public registries:

1. **NPM Registry Search API**:
   - Endpoint: [`https://registry.npmjs.org/-/v1/search`](https://registry.npmjs.org/-/v1/search)
   - Documentation: [npm Registry API Reference](https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md)
2. **NPM Point Downloads Telemetry API**:
   - Endpoint: [`https://api.npmjs.org/downloads/point/last-week/`](https://api.npmjs.org/downloads/point/last-week/)
   - Documentation: [npm Downloads API](https://github.com/npm/download-counts)
3. **GitHub REST API v3**:
   - Endpoint: [`https://api.github.com/repos/`](https://api.github.com/repos/)
   - Documentation: [GitHub REST API Documentation](https://docs.github.com/en/rest)
4. **Crates.io API**:
   - Endpoint: [`https://crates.io/api/v1/crates`](https://crates.io/api/v1/crates)
   - Documentation: [Crates.io API Guide](https://crates.io/data-access)
5. **LLMs.txt Standard**:
   - Specification: [The /llms.txt File Format Specification](https://llmstxt.org/)
6. **Schema.org Structured Data**:
   - Specifications: [SoftwareApplication](https://schema.org/SoftwareApplication) & [DataCatalog](https://schema.org/DataCatalog)

---

## 📜 License & Proprietary Rights

**Proprietary License & Terms of Use**

```text
Copyright (c) 2026 Suraj Patidar. All Rights Reserved.

Created and Maintained exclusively by Suraj Patidar.

1. OWNERSHIP & PROPRIETARY RIGHTS:
This software, application code, designs, architectures, and associated assets (the "Software")
are the exclusive intellectual property of Suraj Patidar.

2. RESTRICTIONS ON USE & MODIFICATION:
- No person, organization, entity, or third party is permitted to copy, clone, distribute,
  resell, sublicense, modify, alter, tamper with, or create derivative works of this Software
  without prior written permission from the copyright owner (Suraj Patidar).
- Unauthorized modifications, redistribution, re-hosting, or claiming ownership of this
  codebase in whole or in part are strictly prohibited.
```

---

<div align="center">
  <sub>Crafted with passion for developers seeking clarity over noise. Created & Maintained by <strong>Suraj Patidar</strong>.</sub>
</div>
