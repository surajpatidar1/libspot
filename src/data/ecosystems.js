// Unified 10 Ecosystems requested by the user:
// [ All ]  [ JS / TS ]  [ Python ]  [ Go ]  [ Rust ]  [ Java ]  [ C# ]  [ Mobile ]  [ AI / ML ]  [ DevOps ]

export const ECOSYSTEMS = [
  'All',
  'JS / TS',
  'Python',
  'Go',
  'Rust',
  'Java',
  'C#',
  'Mobile',
  'AI / ML',
  'DevOps'
];

export const ECOSYSTEM_METADATA = {
  'All': {
    name: 'All Ecosystems',
    tagline: 'Universal developer catalog across all languages & domains',
    starterCommand: 'npm i zustand @tanstack/react-query',
    starterTitle: 'Universal Multi-Language Stack',
    starterDesc: 'Explore battle-tested packages, frameworks, ORMs, and AI tools across 10 major ecosystems.',
    frameworks: ['All', 'Next.js', 'FastAPI', 'Gin', 'Axum', 'Spring Boot', 'Flutter', 'PyTorch', 'Docker'],
    categories: [
      'All',
      'Code Quality & Linting',
      'Git & Workflow',
      'Build & Tooling',
      'Testing',
      'Form & Validation',
      'State Management',
      'UI & Components',
      'Styling & CSS',
      'Data Fetching & APIs',
      'Backend & ORM',
      'Animation & 3D',
      'Utilities & Helpers'
    ]
  },
  'JS / TS': {
    name: 'JavaScript / TypeScript',
    tagline: 'Modern reactive web, fullstack & Node.js',
    starterCommand: 'npm i @tanstack/react-query zustand tailwindcss zod',
    starterTitle: 'TypeScript Production Web Toolchain',
    starterDesc: 'Optimized for modern fullstack applications with type safety, caching, and lean bundle size.',
    frameworks: ['All', 'Next.js', 'React', 'Vue', 'Nuxt', 'Svelte', 'NestJS', 'Express', 'Astro', 'Hono'],
    categories: [
      'All',
      'Code Quality & Linting',
      'Git & Workflow',
      'Build & Tooling',
      'Testing',
      'Form & Validation',
      'State Management',
      'UI & Components',
      'Styling & CSS',
      'Data Fetching & APIs',
      'Backend & ORM',
      'Animation & 3D',
      'Utilities & Helpers'
    ]
  },
  'Python': {
    name: 'Python',
    tagline: 'High-performance APIs, data engineering & microservices',
    starterCommand: 'pip install fastapi uvicorn pydantic sqlalchemy',
    starterTitle: 'Modern Async Python API Stack',
    starterDesc: 'Type-hinted asynchronous API server with automatic OpenAPI docs and high-speed validation.',
    frameworks: ['All', 'FastAPI', 'Django', 'Flask', 'Litestar', 'Sanic'],
    categories: ['All', 'Web Frameworks', 'Data & ORM', 'APIs & Microservices', 'Validation & Core', 'Task Queues']
  },
  'Go': {
    name: 'Go (Golang)',
    tagline: 'Concurrent microservices, networking & cloud tooling',
    starterCommand: 'go get -u github.com/gin-gonic/gin gorm.io/gorm',
    starterTitle: 'High-Throughput Go Microservice Stack',
    starterDesc: 'Ultra-low latency HTTP engine with minimal memory footprint and production-grade ORM.',
    frameworks: ['All', 'Gin', 'Fiber', 'Echo', 'Chi'],
    categories: ['All', 'Web Frameworks', 'Data & ORM', 'CLI & Tooling', 'Networking & Cache']
  },
  'Rust': {
    name: 'Rust',
    tagline: 'Memory safety, systems programming & zero-cost abstractions',
    starterCommand: 'cargo add axum tokio serde --features full',
    starterTitle: 'Safe & Fast Rust Async Web Stack',
    starterDesc: 'Compile-time memory safety with hyper-threaded Tokio asynchronous runtime and modular routing.',
    frameworks: ['All', 'Axum', 'Actix Web', 'Rocket', 'Tauri'],
    categories: ['All', 'Web Frameworks', 'Async Runtimes', 'Desktop & App', 'Data & Serialization']
  },
  'Java': {
    name: 'Java / JVM',
    tagline: 'Enterprise architectures, Spring ecosystem & microservices',
    starterCommand: 'mvn spring-boot:run',
    starterTitle: 'Modern Enterprise Spring Boot & Cloud Stack',
    starterDesc: 'Battle-tested enterprise dependency injection, persistence, and reactive microservices.',
    frameworks: ['All', 'Spring Boot', 'Quarkus', 'Micronaut', 'Vert.x'],
    categories: ['All', 'Web Frameworks', 'Data & ORM', 'Microservices', 'Enterprise Tooling']
  },
  'C#': {
    name: 'C# / .NET',
    tagline: 'High-performance ASP.NET Core, cross-platform & cloud',
    starterCommand: 'dotnet add package Microsoft.EntityFrameworkCore',
    starterTitle: 'ASP.NET Core & Modern C# Web Stack',
    starterDesc: 'Blazing-fast Kestrel server with unified web APIs, Blazor components, and Entity Framework.',
    frameworks: ['All', 'ASP.NET Core', 'Blazor', '.NET MAUI'],
    categories: ['All', 'Web Frameworks', 'Data & ORM', 'Fullstack Web', 'Desktop & Mobile']
  },
  'Mobile': {
    name: 'Mobile Development',
    tagline: 'Cross-platform native iOS & Android applications',
    starterCommand: 'npx create-expo-app@latest',
    starterTitle: 'Cross-Platform Mobile Toolchain',
    starterDesc: 'Universal native application development targeting both App Store and Google Play.',
    frameworks: ['All', 'Flutter', 'React Native', 'Expo', 'SwiftUI', 'Jetpack Compose'],
    categories: ['All', 'Mobile Frameworks', 'State & Navigation', 'Native Runtimes', 'UI Toolkits']
  },
  'AI / ML': {
    name: 'AI & Machine Learning',
    tagline: 'LLMs, PyTorch, generative AI & deep learning',
    starterCommand: 'pip install torch langchain transformers llama-index',
    starterTitle: 'Production Generative AI & LLM Stack',
    starterDesc: 'End-to-end framework for training neural networks, orchestration with LLMs, and RAG pipelines.',
    frameworks: ['All', 'PyTorch', 'LangChain', 'Hugging Face', 'LlamaIndex', 'TensorFlow'],
    categories: ['All', 'LLM Frameworks', 'Deep Learning', 'Data & RAG', 'Classical ML & Vision']
  },
  'DevOps': {
    name: 'Cloud & DevOps',
    tagline: 'Containers, Kubernetes, IaC & CI/CD pipelines',
    starterCommand: 'docker compose up -d',
    starterTitle: 'Cloud Native & Infrastructure Toolchain',
    starterDesc: 'Reproducible container orchestration, declarative infrastructure as code, and automated delivery.',
    frameworks: ['All', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Helm'],
    categories: ['All', 'Containers & Runtimes', 'Orchestration', 'Infrastructure as Code', 'CI/CD & GitOps']
  }
};
