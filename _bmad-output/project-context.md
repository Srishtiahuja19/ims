---
project_name: 'ims'
user_name: 'Wissen'
date: '2026-01-25'
sections_completed: ['technology_stack', 'rules', 'versions']
status: 'complete'
rule_count: 22
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- **Monorepo:** TurboRepo (Manage `apps/web` and `apps/api`)
- **Frontend:** React 18+, Vite 5+, Tailwind CSS 3+, shadcn/ui
- **State Management:** TanStack Query v5 (Server State), React Context (Client State)
- **Visuals:** Framer Motion (Animations), Recharts (Data Viz)
- **Backend:** Node.js 20+, Express 4+, Mongoose 8+
- **Validation:** Zod 3.x (Shared across FE/BE in `packages/types`)
- **PDF & Email:** pdf-lib (Template Filling), pdf-parse (Extraction), Nodemailer (Sending)
- **Utilities:** t3-env (Env Validation)

## Critical Implementation Rules

### Language-Specific Rules

- **Strict Types:** `strict: true` is MANDATORY. No `any` allowed.
- **Shared Schemas:** Types MUST be derived from Zod schemas in `packages/types`. Do not duplicate.
- **Enums:** Use `enums.ts` for all status constants. No magic strings (e.g., `StudentStatus.OFFER_SENT`).

### Framework-Specific Rules

- **API Communication:** All endpoints return `JSend` format `{ status: "success", data: ... }`.
- **Optimistic UI:** Admin actions (sweep/reject) MUST use `onMutate` to update UI immediately.
- **Context-Free Sheets:** Student Details are rendered in a global Overlay/Sheet.
- **Offer Generation:** Offer Letters are created by filling an existing PDF template using `pdf-lib` on the SERVER.

### Code Quality & Style Rules

- **Strict Imports:**
  - `apps/web` -> `packages/*` (OK)
  - `apps/api` -> `packages/*` (OK)
  - `packages/*` -> `apps/*` (FORBIDDEN)
- **Environment:** All env vars must be validated via `t3-env`.

### Critical Don't-Miss Rules

- **No Student Login:** Students identify via Roll Number + DOB. No JWT.
- **Mobile Blocking:** Admin Dashboard is explicitly BLOCKED on mobile viewports.
- **Resume Parsing:** Links (GitHub/LinkedIn) must be extracted to `socialLinks`.
- **Security:** Admin Routes require `verifyAdmin` middleware (JWT in HttpOnly Cookie).

---

## Usage Guidelines

**For AI Agents:**
- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge

**For Humans:**
- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

Last Updated: 2026-01-25
