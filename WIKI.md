# Project Wiki: faranaiki.id

Welcome to the comprehensive technical documentation for **webaiki** (faranaiki.id). This project is a high-performance, AI-orchestrated technical portfolio and personal ecosystem built with Next.js 15.

---

## 📋 Table of Contents
1. [Introduction](#introduction)
2. [Architecture & Tech Stack](#architecture--tech-stack)
3. [Internationalization (i18n)](#internationalization-i18n)
4. [DevOps & CI/CD](#devops--ci-cd)
5. [Development Standards](#development-standards)

---

## 1. Introduction
**webaiki** serves as a unified platform for showcasing professional experiences, technical projects, literary works, and interactive experiments. It is designed with a focus on **Mechanical Sympathy**—optimizing software to work in harmony with the underlying hardware and browser rendering engines.

### Key Features
- **Presentation Mode**: Cinematic slide deck transformation with multiple layouts (Modern, Cinematic, Editorial).
- **Global Reach**: 14+ languages with RTL and CJK optimizations.
- **AI Integration**: Orchestrated with Gemini for interactive features.

---

## 2. Architecture & Tech Stack
The project follows a modern "App Router" architecture designed for speed and SEO.

### 🛠 Tech Stack
- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **State Management**: Zustand & React Context
- **Deployment**: Vercel (Production) & Docker (Portability)

### 📁 Directory Structure
- `src/app/`: Next.js App Router pages and API routes.
- `src/components/`:
  - `interactive/`: Complex client-side components (MusicDisplay).
  - `layout/`: Global layout components (Header, Background).
  - `providers/`: Context providers (Settings, Presentation).
- `src/lib/`: Core logic, data structures, and SEO utilities.
- `public/locales/`: JSON translation files for i18n.

---

## 3. Internationalization (i18n)
The project supports a global audience with localized content for over 12 languages.

### 🌍 Implementation
- **Dictionary Logic**: `getDictionary` utility loads JSON from `public/locales/`.
- **RTL Support**: Layouts automatically adjust for Arabic and Hebrew based on the `lang` parameter.
- **CJK Optimization**: The `formatCJK` utility handles specific line-height and typography requirements for Asian characters.

---

## 4. DevOps & CI/CD
Professional engineering standards are enforced through automated workflows.

### 🤖 Automation
- **CI Pipeline**: `ci.yml` runs linting, type-checking, and build validation on every PR.
- **Docker Check**: `docker-check.yml` verifies container builds.
- **Dependabot**: Weekly scans for dependency updates.

### 🐳 Containerization
A multi-stage `Dockerfile` is provided for environment parity, allowing the exact production build to run locally or on any VPS.

---

## 5. Development Standards
To maintain the high quality of the codebase:
- **Conventional Commits**: Use `feat:`, `fix:`, `docs:`, etc.
- **EditorConfig**: Follow the indent and spacing rules defined in `.editorconfig`.
- **Testing**: Ensure all UI changes are verified in both "Normal" and "Presentation" modes.
- **Accessibility**: Maintain high contrast and keyboard navigation support.

---

*Last Updated: June 2026*
