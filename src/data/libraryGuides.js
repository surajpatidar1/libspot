export const LIBRARY_GUIDES = {
  "socket.io": {
    fileName: "server/socket.js",
    language: "javascript",
    code: `import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join a room for targeted broadcast
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user_joined', { userId: socket.id });
  });

  // Handle incoming chat messages
  socket.on('send_message', ({ roomId, message }) => {
    io.to(roomId).emit('receive_message', {
      sender: socket.id,
      message,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

httpServer.listen(3000, () => {
  console.log('Socket.io server listening on port 3000');
});`,
    steps: [
      {
        title: "1. Install Socket.io",
        desc: "Run npm i socket.io on the server and npm i socket.io-client on the frontend."
      },
      {
        title: "2. Initialize Server Instance",
        desc: "Attach Server to an existing Node.js HTTP/HTTPS server with CORS configuration."
      },
      {
        title: "3. Listen for events and join rooms",
        desc: "Use socket.on() for bi-directional event emission and socket.join() for channel segregation."
      }
    ],
    features: [
      "Real-time bi-directional event-based communication",
      "Automatic fallbacks from WebSocket to HTTP long-polling",
      "Built-in connection management, heartbeats, and auto-reconnection",
      "Room and namespace isolation for granular broadcasting",
      "Scalable horizontally with Redis / Postgres cluster adapters"
    ]
  },

  ws: {
    fileName: "server/ws-server.js",
    language: "javascript",
    code: `import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');

  ws.on('message', (data) => {
    const payload = JSON.parse(data.toString());
    console.log('Received:', payload);

    // Broadcast to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ type: 'BROADCAST', payload }));
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server active on ws://localhost:8080');`,
    steps: [
      {
        title: "1. Install ws",
        desc: "Run npm i ws in your backend project."
      },
      {
        title: "2. Create WebSocketServer",
        desc: "Instantiate WebSocketServer({ port: 8080 }) or attach to existing server."
      },
      {
        title: "3. Broadcast messages",
        desc: "Iterate wss.clients to broadcast real-time messages with zero overhead."
      }
    ],
    features: [
      "Blazing fast, ultra-minimal WebSocket implementation for Node.js",
      "Zero client bundle dependencies (uses native browser WebSocket API)",
      "Low memory overhead suitable for millions of concurrent connections",
      "Direct binary and UTF-8 streaming frame support"
    ]
  },

  bcrypt: {
    fileName: "auth/password.js",
    language: "javascript",
    code: `import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

// Hash a plain-text password securely
export async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return await bcrypt.hash(plainPassword, salt);
}

// Compare user login input against stored password hash
export async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}`,
    steps: [
      {
        title: "1. Install bcrypt",
        desc: "Run npm i bcrypt in your Node.js or backend project."
      },
      {
        title: "2. Hash passwords before database write",
        desc: "Always hash with a minimum cost factor of 10–12 salt rounds before persisting."
      },
      {
        title: "3. Verify passwords securely",
        desc: "Use bcrypt.compare() to safely verify passwords using constant-time string comparison."
      }
    ],
    features: [
      "Industry gold-standard password hashing based on the Blowfish cipher",
      "Adaptive work factor (cost) prevents brute-force GPU attacks",
      "Automatic cryptographic salting defends against rainbow table attacks",
      "Constant-time string comparison protects against side-channel timing leaks",
      "Universal backend support in Node.js, Express, Fastify, and NestJS"
    ]
  },

  bcryptjs: {
    fileName: "auth/password.js",
    language: "javascript",
    code: `import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}`,
    steps: [
      {
        title: "1. Install bcryptjs",
        desc: "Run npm i bcryptjs in any JavaScript, Node, or serverless environment."
      },
      {
        title: "2. Zero native build dependencies",
        desc: "Works everywhere without requiring node-gyp or C++ compilation tools."
      },
      {
        title: "3. Compare & verify",
        desc: "Compatible with standard bcrypt hashes generated by other backends."
      }
    ],
    features: [
      "Pure JavaScript implementation of bcrypt with zero native binary compilation",
      "Compatible with AWS Lambda, Vercel Serverless, and Cloudflare Workers",
      "100% compatible with existing bcrypt hashes"
    ]
  },

  passport: {
    fileName: "middleware/passport.js",
    language: "javascript",
    code: `import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { verifyPassword } from './password.js';
import { findUserByEmail, findUserById } from './db.js';

// Configure Local Email/Password Strategy
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await findUserByEmail(email);
    if (!user) return done(null, false, { message: 'User not found' });
    
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) return done(null, false, { message: 'Invalid password' });
    
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await findUserById(id);
  done(null, user);
});

export default passport;`,
    steps: [
      {
        title: "1. Install Passport & Strategy",
        desc: "Run npm i passport passport-local express-session in your Express or Node backend."
      },
      {
        title: "2. Initialize in Express Server",
        desc: "Add app.use(passport.initialize()) and app.use(passport.session()) to your middleware pipeline."
      },
      {
        title: "3. Protect Routes",
        desc: "Use passport.authenticate('local') or passport.authenticate('jwt') to guard private endpoints."
      }
    ],
    features: [
      "Pluggable authentication middleware with 500+ community strategies (OAuth, Local, JWT, Google, GitHub)",
      "Unobtrusive architecture cleanly separates auth logic from route handlers",
      "Built-in session management with serialize/deserialize hooks",
      "Seamless integration with Express, NestJS, and Connect middlewares"
    ]
  },

  jsonwebtoken: {
    fileName: "utils/jwt.js",
    language: "javascript",
    code: `import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-replace-in-production';
const JWT_EXPIRES_IN = '7d';

// Sign access token
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify incoming bearer token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null; // Expired or invalid token
  }
}`,
    steps: [
      {
        title: "1. Install jsonwebtoken",
        desc: "Run npm i jsonwebtoken in your project."
      },
      {
        title: "2. Issue Token on Login",
        desc: "Generate a signed JWT token containing the user's ID and role upon successful authentication."
      },
      {
        title: "3. Guard Endpoints with Bearer Headers",
        desc: "Verify token validity and extract user payload in your API auth middleware."
      }
    ],
    features: [
      "Standard RFC 7519 JSON Web Token implementation",
      "Stateless session management without server-side memory stores",
      "Supports symmetric (HS256) and asymmetric (RS256, ES256) cryptographic signatures",
      "Over 18 million weekly downloads across the Node.js ecosystem"
    ]
  },

  eslint: {
    fileName: "eslint.config.mjs",
    language: "javascript",
    code: `import js from '@eslint/js';
import tseslint from 'typescript-eslint';

// Modern ESLint v9 Flat Config
export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  }
);`,
    steps: [
      {
        title: "1. Install ESLint & Plugins",
        desc: "Run npm i -D eslint @eslint/js typescript-eslint in your project root."
      },
      {
        title: "2. Create eslint.config.mjs",
        desc: "Use the new v9 Flat Config format to compose rules from JS and TypeScript presets."
      },
      {
        title: "3. Run the linter",
        desc: "Add 'lint': 'eslint .' to your package.json scripts and run npm run lint."
      }
    ],
    features: [
      "Industry standard static code analysis for JS & TypeScript",
      "Official v9 Flat Configuration architecture",
      "Over 10,000 community plugins for React, Vue, Next.js, and Node",
      "Auto-fixes standard syntax errors with --fix flag",
      "Full IDE integration in VS Code, WebStorm, and Cursor"
    ]
  },

  husky: {
    fileName: ".husky/pre-commit",
    language: "bash",
    code: `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run staged linters before git commit completes
npx lint-staged

# Run quick test suite
npm run test:quick`,
    steps: [
      {
        title: "1. Initialize Husky",
        desc: "Run 'npx husky init' in your repository to create the .husky/ directory."
      },
      {
        title: "2. Add pre-commit hook",
        desc: "Put commands in .husky/pre-commit to run before every commit (e.g., npx lint-staged)."
      },
      {
        title: "3. Commit safely",
        desc: "Git commits will now automatically abort if linting fails or tests break."
      }
    ],
    features: [
      "Zero-dependency native git hooks execution",
      "Guarantees broken code and bad commits never reach CI/CD",
      "Works on macOS, Linux, and Windows seamlessly",
      "Automates commit message validation with Commitlint",
      "One-command onboarding for all contributors"
    ]
  },

  commitlint: {
    fileName: "commitlint.config.js",
    language: "javascript",
    code: `export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation changes
        'style',    // Formatting, missing semi colons, etc
        'refactor', // Code change that neither fixes a bug nor adds a feature
        'perf',     // Performance improvement
        'test',     // Adding missing tests
        'build',    // Build system or external dependencies
        'ci',       // CI configuration files and scripts
        'chore',    // Other changes that don't modify src or test
        'revert'    // Reverts a previous commit
      ]
    ],
    'subject-case': [0]
  }
};`,
    steps: [
      {
        title: "1. Install Commitlint & Config",
        desc: "Run npm i -D @commitlint/cli @commitlint/config-conventional."
      },
      {
        title: "2. Create commitlint.config.js",
        desc: "Extend '@commitlint/config-conventional' to enforce Conventional Commits rules."
      },
      {
        title: "3. Bind to Husky commit-msg",
        desc: "Run echo 'npx --no -- commitlint --edit \"$1\"' > .husky/commit-msg."
      }
    ],
    features: [
      "Enforces Conventional Commits standard (feat: fix: chore:)",
      "Enables automated changelogs and semantic release tags",
      "Clean, readable Git history for team pull requests",
      "Easily parsed by AI for release note summaries"
    ]
  },

  prettier: {
    fileName: ".prettierrc",
    language: "json",
    code: `{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always",
  "bracketSpacing": true,
  "endOfLine": "lf"
}`,
    steps: [
      {
        title: "1. Install Prettier",
        desc: "Run npm i -D prettier in your project."
      },
      {
        title: "2. Configure .prettierrc",
        desc: "Set your preferred quote style, line width, and semicolon preferences."
      },
      {
        title: "3. Enable format on save",
        desc: "Turn on editor formatOnSave or run 'npx prettier --write .' before pushing."
      }
    ],
    features: [
      "Zero debate on code style during PR code reviews",
      "Supports JS, TS, HTML, CSS, JSON, Markdown, YAML",
      "Seamless integration with ESLint via eslint-config-prettier",
      "Sub-second formatting performance across entire repos"
    ]
  },

  "lint-staged": {
    fileName: ".lintstagedrc.json",
    language: "json",
    code: `{
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,md,css,scss}": [
    "prettier --write"
  ]
}`,
    steps: [
      {
        title: "1. Install lint-staged",
        desc: "Run npm i -D lint-staged."
      },
      {
        title: "2. Define .lintstagedrc.json",
        desc: "Specify file glob patterns and the exact format/lint commands to run on each."
      },
      {
        title: "3. Run in Husky pre-commit",
        desc: "Add 'npx lint-staged' into .husky/pre-commit."
      }
    ],
    features: [
      "Runs linters only on staged files for sub-200ms pre-commit speed",
      "Automatically adds fixes back to the Git staging index",
      "Prevents slow commits in huge monorepos"
    ]
  },

  biome: {
    fileName: "biome.json",
    language: "json",
    code: `{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  }
}`,
    steps: [
      {
        title: "1. Install Biome",
        desc: "Run npm i -D @biomejs/biome."
      },
      {
        title: "2. Initialize config",
        desc: "Run npx @biomejs/biome init to create biome.json."
      },
      {
        title: "3. Format and check",
        desc: "Run npx @biomejs/biome check --write . to format, lint, and sort imports all at once."
      }
    ],
    features: [
      "Written in Rust: 20-35x faster than ESLint + Prettier",
      "Unified toolchain: formatting, linting, and import sorting in one command",
      "Winner of the official Prettier 2023 challenge bounty",
      "Zero configuration needed to get started"
    ]
  },

  zod: {
    fileName: "schema.ts",
    language: "typescript",
    code: `import { z } from 'zod';

// 1. Declare schema once
export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(20),
  email: z.string().email("Please enter a valid email"),
  role: z.enum(['admin', 'member', 'guest']).default('member'),
  website: z.string().url().optional()
});

// 2. Automatically infer static TypeScript type
export type UserProfile = z.infer<typeof UserProfileSchema>;

// 3. Validate at runtime
export function validateProfile(input: unknown): UserProfile {
  return UserProfileSchema.parse(input); // Throws readable error if invalid
}`,
    steps: [
      {
        title: "1. Install Zod",
        desc: "Run npm i zod in your application."
      },
      {
        title: "2. Define schemas",
        desc: "Chain z.string(), z.number(), z.object() to create strict runtime validation rules."
      },
      {
        title: "3. Infer types & parse",
        desc: "Use z.infer<typeof Schema> for zero-duplicate TypeScript types, and schema.parse() at runtime."
      }
    ],
    features: [
      "Zero dependencies with tiny footprint",
      "Eliminates duplicate type declarations in TypeScript",
      "Seamless integration with tRPC, React Hook Form, and Next.js Actions",
      "Rich built-in validators for emails, UUIDs, URLs, and regexes"
    ]
  },

  vitest: {
    fileName: "math.test.ts",
    language: "typescript",
    code: `import { describe, it, expect } from 'vitest';

export function calculateTotal(price: number, taxRate: number) {
  return price + (price * taxRate);
}

describe('calculateTotal() test suite', () => {
  it('calculates 10% tax accurately', () => {
    expect(calculateTotal(100, 0.1)).toBe(110);
  });

  it('handles zero tax rate correctly', () => {
    expect(calculateTotal(50, 0)).toBe(50);
  });
});`,
    steps: [
      {
        title: "1. Install Vitest",
        desc: "Run npm i -D vitest."
      },
      {
        title: "2. Add test script",
        desc: "Add 'test': 'vitest' to your package.json scripts."
      },
      {
        title: "3. Run in watch mode",
        desc: "Execute 'npm test' for instant sub-second hot module reload test execution."
      }
    ],
    features: [
      "Powered by Vite: uses identical plugins and build pipeline",
      "Jest compatible API (describe, it, expect, vi.fn)",
      "Out-of-the-box TypeScript and ESM support without ts-jest overhead",
      "Multi-threaded execution with tinypool"
    ]
  },

  zustand: {
    fileName: "useStore.js",
    language: "javascript",
    code: `import { create } from 'zustand';

// 1. Define your store with state and actions
export const useCounterStore = create((set) => ({
  count: 0,
  inc: () => set((state) => ({ count: state.count + 1 })),
  dec: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// 2. Consume store inside any React component (no Provider needed!)
export function Counter() {
  const { count, inc, dec, reset } = useCounterStore();
  
  return (
    <div className="counter-card">
      <h2>Count: {count}</h2>
      <button onClick={inc}>+ Increment</button>
      <button onClick={dec}>- Decrement</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}`,
    steps: [
      {
        title: "1. Install package",
        desc: "Run npm i zustand in your project directory."
      },
      {
        title: "2. Create the store",
        desc: "Use create() to define reactive state and setter functions. No context providers or boilerplate needed."
      },
      {
        title: "3. Bind to component",
        desc: "Call useCounterStore() anywhere in your component tree. Re-renders only trigger when subscribed state changes."
      }
    ],
    features: [
      "Zero boilerplate — no Redux actions, reducers, or dispatchers",
      "Only 1.2 kB minified + gzipped footprint",
      "Transient updates without re-renders",
      "Built-in middleware for devtools, persist (localStorage), and immer",
      "Works seamlessly across React and Vanilla JS"
    ]
  },

  "tanstack-query": {
    fileName: "usePostsQuery.js",
    language: "javascript",
    code: `import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 1. Setup Query Client once in your App root
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes fresh cache
      retry: 2,
    },
  },
});

// 2. Fetcher function
async function fetchPosts() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  if (!res.ok) throw new Error('Network error');
  return res.json();
}

// 3. Use useQuery hook inside components
export function PostsList() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  if (isLoading) return <p>Loading cached data...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.slice(0, 5).map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}`,
    steps: [
      {
        title: "1. Wrap App with QueryClientProvider",
        desc: "Provide the client instance to the root of your application."
      },
      {
        title: "2. Declare Query Hook",
        desc: "Pass a unique queryKey array and an async queryFn function."
      },
      {
        title: "3. Automatic Caching & Sync",
        desc: "TanStack handles background revalidation, window focus refetching, and deduping automatically."
      }
    ],
    features: [
      "Auto-caching, garbage collection, and stale-while-revalidate",
      "Window focus refetching & network reconnect recovery",
      "Optimistic UI updates for snappy mutations",
      "Infinite scroll & pagination query helpers",
      "Dedicated official Devtools extension"
    ]
  },

  "framer-motion": {
    fileName: "AnimatedCard.jsx",
    language: "javascript",
    code: `import { motion } from 'framer-motion';

export function AnimatedCard({ title, subtitle }) {
  return (
    <motion.div
      // Initial mount state
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      // Animate to visible state
      animate={{ opacity: 1, y: 0, scale: 1 }}
      // Spring physics transition
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      // Micro-interactions
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="card-container"
    >
      <h3>{title}</h3>
      <p>{subtitle}</p>
    </motion.div>
  );
}`,
    steps: [
      {
        title: "1. Convert element to motion.<tag>",
        desc: "Replace standard HTML tags (div, button, li) with motion equivalents like motion.div."
      },
      {
        title: "2. Define initial and animate props",
        desc: "Pass animation targets directly as clean declarative objects."
      },
      {
        title: "3. Add gestures and transitions",
        desc: "Use whileHover, whileTap, and whileInView for interactive micro-animations."
      }
    ],
    features: [
      "Declarative physics-based springs and ease curves",
      "Layout animations without layout shift bugs",
      "Exit animations via <AnimatePresence>",
      "SVG path drawing and morphing animations",
      "Full drag, pan, and hover gesture detection"
    ]
  },

  "shadcn-ui": {
    fileName: "components/ui/button.jsx",
    language: "javascript",
    code: `// 1. Initialize shadcn in your project:
// npx shadcn@latest init

// 2. Add any accessible component:
// npx shadcn@latest add button

// 3. Use in your React / Next.js views:
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function ActionHero() {
  return (
    <div className="flex gap-4">
      <Button variant="default" size="lg">
        <Sparkles className="mr-2 h-4 w-4" /> Get Started
      </Button>
      <Button variant="outline" size="lg">
        Documentation <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}`,
    steps: [
      {
        title: "1. Initialize CLI",
        desc: "Run npx shadcn@latest init to configure your tailwind.config and utils path."
      },
      {
        title: "2. Add desired components",
        desc: "Execute npx shadcn@latest add <component> (e.g. dialog, dropdown, button)."
      },
      {
        title: "3. Direct code ownership",
        desc: "The source code lives directly in your project folder, allowing 100% custom styling."
      }
    ],
    features: [
      "Zero node_modules bloat — you own the source code",
      "Built on Radix Primitives for bulletproof ARIA accessibility",
      "Pre-styled with Tailwind CSS variables for easy dark mode",
      "Full keyboard navigation and focus management",
      "Extensible with custom variants via cva (class-variance-authority)"
    ]
  },

  "tailwind-css": {
    fileName: "src/index.css",
    language: "css",
    code: `/* Tailwind CSS v4 Setup */
@import "tailwindcss";

@theme {
  --color-brand-primary: #1F4959;
  --color-brand-midnight: #011425;
}

/* Use directly in your React JSX: */
export function Badge() {
  return (
    <div className="flex items-center gap-3 p-4 bg-brand-midnight rounded-2xl shadow-xl hover:scale-105 transition-transform">
      <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
      <p className="text-sm font-semibold text-white">Utility-First CSS</p>
    </div>
  );
}`,
    steps: [
      {
        title: "1. Install Tailwind & Vite plugin",
        desc: "npm i tailwindcss @tailwindcss/vite"
      },
      {
        title: "2. Import in CSS",
        desc: "Add @import 'tailwindcss'; to your main stylesheet."
      },
      {
        title: "3. Compose markup with utilities",
        desc: "Write responsive, dark-mode ready designs directly in your JSX."
      }
    ],
    features: [
      "Lightning-fast build performance with oxide rust compiler",
      "Zero unused CSS shipped to production",
      "Built-in container queries, 3D transforms, and CSS variables",
      "Automatic dark mode with .dark class or system preference",
      "Native IntelliSense autocomplete in VS Code"
    ]
  },

  zod: {
    fileName: "schema.ts",
    language: "typescript",
    code: `import { z } from 'zod';

// 1. Declare Schema
export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3, "Username must be at least 3 chars").max(20),
  email: z.string().email("Invalid email address"),
  age: z.number().int().min(18),
  role: z.enum(['admin', 'member', 'guest']).default('member'),
});

// 2. Infer TypeScript Type automatically!
export type User = z.infer<typeof UserSchema>;

// 3. Parse and Validate unknown data
export function validateUserInput(input: unknown) {
  const result = UserSchema.safeParse(input);
  if (!result.success) {
    console.error("Validation failed:", result.error.flatten());
    return null;
  }
  // result.data is guaranteed strongly typed!
  return result.data;
}`,
    steps: [
      {
        title: "1. Define schema rules",
        desc: "Chain validator methods like .string().email().min(3)."
      },
      {
        title: "2. Infer TypeScript types",
        desc: "Use z.infer<typeof Schema> to avoid repeating type definitions."
      },
      {
        title: "3. Use safeParse()",
        desc: "Safely validate API requests or form inputs without throwing exceptions."
      }
    ],
    features: [
      "Zero runtime dependencies",
      "Automatic TypeScript static type inference",
      "Composability with transforms, refinements, and defaults",
      "Seamless integration with React Hook Form and tRPC",
      "Human-readable error formatting"
    ]
  },

  "react-hook-form": {
    fileName: "LoginForm.jsx",
    language: "javascript",
    code: `import { useForm } from 'react-hook-form';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Form values:", data);
    await new Promise((r) => setTimeout(r, 1000));
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Email</label>
        <input
          {...register("email", { required: "Email is required" })}
          className="input-field"
        />
        {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Sign In"}
      </button>
    </form>
  );
}`,
    steps: [
      {
        title: "1. Call useForm()",
        desc: "Destructure register, handleSubmit, and formState."
      },
      {
        title: "2. Spread register to inputs",
        desc: "Connect inputs with {...register('fieldName', rules)}."
      },
      {
        title: "3. Handle submit",
        desc: "Pass your handler to handleSubmit(onSubmit)."
      }
    ],
    features: [
      "Isolated re-renders for blazing speed with large forms",
      "Zero external UI dependencies",
      "Native HTML validation or external schema resolvers (Zod, Yup)",
      "Uncontrolled components architecture for performance",
      "Under 9 kB minified bundle footprint"
    ]
  },

  "drizzle-orm": {
    fileName: "db/schema.ts",
    language: "typescript",
    code: `import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { Pool } from 'pg';

// 1. Declare database schema
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. Initialize client
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);

// 3. Typesafe query execution
export async function getActiveUsers() {
  return await db.select().from(users).where(eq(users.name, 'Alice'));
}`,
    steps: [
      {
        title: "1. Define schema in TypeScript",
        desc: "Define tables, columns, and relations with pure TS functions."
      },
      {
        title: "2. Generate SQL migrations",
        desc: "Run drizzle-kit generate to produce lightweight migration SQL files."
      },
      {
        title: "3. Query with SQL-like syntax",
        desc: "Enjoy zero runtime overhead and direct SQL control with full type safety."
      }
    ],
    features: [
      "Zero dependencies and zero codegen runtime latency",
      "Feels like writing SQL, but with 100% type safety",
      "Under 9 kB bundle size — perfect for Cloudflare Workers & Serverless",
      "Automatic migration generator via drizzle-kit",
      "Supports Postgres, MySQL, and SQLite"
    ]
  },

  hono: {
    fileName: "server.ts",
    language: "typescript",
    code: `import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// Global Middleware
app.use('*', cors());

// Route Handlers
app.get('/', (c) => {
  return c.json({ status: 'ok', engine: 'Hono Edge Framework' });
});

app.get('/api/users/:id', (c) => {
  const userId = c.req.param('id');
  return c.json({ id: userId, name: 'Developer User' });
});

export default app;`,
    steps: [
      {
        title: "1. Initialize Hono app",
        desc: "const app = new Hono() sets up a web-standards compliant router."
      },
      {
        title: "2. Define REST routes",
        desc: "Use app.get, app.post with context helper c.json() and c.text()."
      },
      {
        title: "3. Deploy to any runtime",
        desc: "Runs with zero alterations on Cloudflare Workers, Node.js, Deno, Bun, or Vercel."
      }
    ],
    features: [
      "Ultra-fast RegexpRouter matching algorithms",
      "Built on standard Request/Response Fetch API",
      "Runs on any JavaScript runtime (Node, Deno, Bun, Cloudflare)",
      "Built-in middleware for Auth, CORS, JWT, and ETag",
      "Zero dependencies and under 15 kB footprint"
    ]
  },

  zustand: {
    fileName: "useStore.ts",
    language: "typescript",
    code: `import { create } from 'zustand';

interface BearState {
  bears: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
}

export const useStore = create<BearState>((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));

// In your component:
// const bears = useStore((state) => state.bears);`,
    steps: [
      {
        title: "1. Install Zustand",
        desc: "Run 'npm i zustand' in your project directory."
      },
      {
        title: "2. Create a reactive store",
        desc: "Define state interfaces and updater actions using create()."
      },
      {
        title: "3. Subscribe in components",
        desc: "Use selective hooks (state => state.property) to eliminate unnecessary re-renders."
      }
    ],
    features: [
      "Tiny 1.2 kB bundle with zero React Context provider wrappers",
      "Selective reactivity prevents whole-tree re-rendering",
      "Built-in persist middleware for localStorage synchronization",
      "Full TypeScript type inference out-of-the-box"
    ]
  },

  fastapi: {
    fileName: "main.py",
    language: "python",
    code: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Production API", version="1.0.0")

class Item(BaseModel):
    name: str
    price: float
    is_offer: bool = None

@app.get("/")
def read_root():
    return {"status": "online", "framework": "FastAPI"}

@app.post("/items/")
def create_item(item: Item):
    return {"item_name": item.name, "tax_price": item.price * 1.15}

# Run with: uvicorn main:app --reload`,
    steps: [
      {
        title: "1. Install FastAPI & Uvicorn",
        desc: "Run 'pip install fastapi uvicorn[standard] pydantic' in your virtualenv."
      },
      {
        title: "2. Define endpoints and Pydantic models",
        desc: "Create main.py with typed request/response models for automatic validation."
      },
      {
        title: "3. Start ASGI server",
        desc: "Run 'uvicorn main:app --reload' and visit http://127.0.0.1:8000/docs for Swagger UI."
      }
    ],
    features: [
      "Automatic OpenAPI and Swagger documentation UI at /docs",
      "High-throughput asynchronous I/O based on Starlette and Pydantic",
      "Type-hint driven validation catches runtime payload errors automatically",
      "Native Python async/await concurrency"
    ]
  },

  gin: {
    fileName: "main.go",
    language: "go",
    code: `package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
			"status":  "healthy",
		})
	})

	r.Run(":8080") // listens on 0.0.0.0:8080
}`,
    steps: [
      {
        title: "1. Install Gin",
        desc: "Run 'go get -u github.com/gin-gonic/gin' in your Go module directory."
      },
      {
        title: "2. Create route handlers",
        desc: "Initialize gin.Default() with logger and recovery middleware."
      },
      {
        title: "3. Build and execute",
        desc: "Execute 'go run main.go' to start the high-performance HTTP microservice."
      }
    ],
    features: [
      "Radix tree HTTP router with zero dynamic memory allocations",
      "Crash-free recovery middleware catches panics and protects uptime",
      "Built-in JSON validation, XML binding, and static file serving",
      "Ultra-low latency microservice benchmarks"
    ]
  },

  axum: {
    fileName: "src/main.rs",
    language: "rust",
    code: `use axum::{routing::get, Json, Router};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct Status {
    status: String,
    version: String,
}

async fn health_check() -> Json<Status> {
    Json(Status {
        status: "ok".to_string(),
        version: "v0.8.0".to_string(),
    })
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/health", get(health_check));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    println!("Listening on port 3000...");
    axum::serve(listener, app).await.unwrap();
}`,
    steps: [
      {
        title: "1. Add Axum & Tokio dependencies",
        desc: "Run 'cargo add axum tokio --features tokio/full && cargo add serde --features serde/derive'."
      },
      {
        title: "2. Define typed extractors and routes",
        desc: "Create route handlers that return compile-time guaranteed JSON responses."
      },
      {
        title: "3. Run Tokio async runtime",
        desc: "Execute 'cargo run' for sub-millisecond async response latency."
      }
    ],
    features: [
      "Official web framework of the Tokio project",
      "Macro-free design with type-safe request extractors",
      "Direct integration with Tower and Hyper middleware ecosystem",
      "Guaranteed compile-time memory and concurrency safety"
    ]
  },

  docker: {
    fileName: "compose.yaml",
    language: "yaml",
    code: `services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://user:secret@db:5432/production
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: production
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:`,
    steps: [
      {
        title: "1. Create compose.yaml",
        desc: "Define your application container, database, and persistent storage volumes."
      },
      {
        title: "2. Start services in background",
        desc: "Run 'docker compose up -d' to pull images and start isolated networking."
      },
      {
        title: "3. Monitor logs & status",
        desc: "Use 'docker compose logs -f' and 'docker compose ps' to verify healthy service startup."
      }
    ],
    features: [
      "Declarative multi-container development environment",
      "Isolated networking prevents host port and version conflicts",
      "One-command onboarding across entire engineering teams",
      "Direct alignment between local development and cloud production"
    ]
  },

  pytorch: {
    fileName: "train.py",
    language: "python",
    code: `import torch
import torch.nn as nn

# Check GPU availability
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

# Simple Neural Network
class SimpleNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc = nn.Linear(10, 2)

    def forward(self, x):
        return self.fc(x)

model = SimpleNet().to(device)
sample_input = torch.randn(4, 10).to(device)
output = model(sample_input)
print(f"Output shape: {output.shape}")`,
    steps: [
      {
        title: "1. Install PyTorch with CUDA or CPU",
        desc: "Run 'pip install torch torchvision' with appropriate CUDA drivers."
      },
      {
        title: "2. Define model architecture",
        desc: "Subclass torch.nn.Module and implement the forward pass computation."
      },
      {
        title: "3. Accelerate on GPU",
        desc: "Call model.to(device) to utilize NVIDIA CUDA or Apple Silicon MPS tensor acceleration."
      }
    ],
    features: [
      "Dynamic computational graphs enable intuitive Pythonic debugging",
      "Native CUDA and Apple MPS GPU hardware acceleration",
      "The global foundation for LLMs, Transformers, and Computer Vision",
      "TorchDynamo for optimized production compilation"
    ]
  }
};

// Fetch guide for library if available; otherwise returns null without static fallback data
export function getGuideForLibrary(library) {
  if (!library) return null;
  const cleanId = (library.id || '').toLowerCase();
  const cleanName = (library.name || '').toLowerCase();

  if (LIBRARY_GUIDES[cleanId]) return LIBRARY_GUIDES[cleanId];
  if (LIBRARY_GUIDES[cleanName]) return LIBRARY_GUIDES[cleanName];

  return null;
}
