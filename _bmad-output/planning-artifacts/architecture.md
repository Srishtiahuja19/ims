---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7]
inputDocuments: 
  - c:/Users/Srishti/OneDrive/Documents/Desktop/ims/_bmad-output/planning-artifacts/prd.md
  - c:/Users/Srishti/OneDrive/Documents/Desktop/ims/_bmad-output/planning-artifacts/product-brief-ims-2026-01-23.md
  - c:/Users/Srishti/OneDrive/Documents/Desktop/ims/_bmad/bmm/data/project-context-template.md
  - c:/Users/Srishti/OneDrive/Documents/Desktop/ims/_bmad-output/planning-artifacts/ux-design-specification.md
workflowType: 'architecture'
project_name: 'ims'
user_name: 'Wissen'
date: '2026-01-24'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements (Architectural Implications):**
*   **High-Volume Data Grid:** The Admin Dashboard requires rendering and filtering 1000+ rows instantly. This dictates a **Client-Side Data Model** (fetching all relevant data upfront) rather than server-side pagination for the active drive view.
*   **Dual-Persona Workflows:** The extreme difference between Student (Mobile/Form Focus) and Admin (Desktop/Data Focus) suggests a clear separation of concerns in the frontend architecture (e.g., distinct layouts/routes).
*   **Resilient Submission:** Student forms must handle network flakiness. The architecture needs **Local Persistence** (saving form state to localStorage/IDB) before submission.

**Non-Functional Requirements:**
*   **Performance:** <200ms interaction time for Admin actions ("Bulk Sweep"). This requires **Optimistic UI** updates (updating local state immediately).
*   **Reliability:** Student uploads cannot fail silently. We need a robust **Background Upload** mechanism with retry logic.
*   **Security:** Admin actions (Reject/Pass) require strict Role-Based Access Control (RBAC) at the API level, unrelated to the UI speed.

**Scale & Complexity:**
*   **Primary domain:** Full-Stack Web Application (Heavy Frontend Logic).
*   **Complexity level:** Medium-High (High Interactivity).
*   **Estimated components:** ~25 Core Components (Grid, Form, ActionIsland, etc).

### Technical Constraints & Dependencies
*   **Client-Side Heavy:** The UX requirements effectively ban a "Classically Rendered" (PHP/Rails-style) approach for the Admin Dashboard. We need React/Next.js interactivity.
*   **Mobile Block:** We are technically constrained to *block* mobile viewports for the Admin routes to preserve data integrity.

### Cross-Cutting Concerns Identified
1.  **Optimistic State Management:** How we handle the "Update -> UI Change -> Server Sync -> Rollback on Error" loop across all Admin actions.
2.  **Authentication Borders:** ensuring Students cannot accidentally hit Admin API endpoints, and handling session expiry gracefully without losing form data.
3.  **Toasting/Feedback:** A centralized system for notifications is critical for the "Trust" emotional goal.

## Starter Template Evaluation

### Primary Technology Domain
**Full-Stack Monorepo (MERN)**

### Selected Architecture: Turbo-MERN (Custom Scaffold)

**Rationale for Selection:**
*   **Type Safety:** Using a Monorepo allows us to share Zod validation schemas between the React Frontend and Express Backend, preventing data-shape bugs.
*   **Performance:** `Vite` provides the build speed required for a "Thick Client" dashboard.
*   **Familiarity:** Retains the classic Express/Mongoose patterns while adding modern tooling.

**Initialization Approach:**
We will scaffold the project using `npx create-turbo@latest` and structure it manually:
*   `apps/web`: Vite + React + Tailwind + shadcn/ui
*   `apps/api`: Express + Mongoose + cors
*   `packages/types`: Shared Zod schemas (Student, User, Auth)
*   `packages/ui`: Shared UI components (optional future proofing)

**Architectural Patterns:**
*   **Language:** TypeScript (Strict Mode) across the board.
*   **Styling:** Tailwind CSS (via shadcn/ui) in `apps/web`.
*   **Build Tooling:** TurboRepo for efficient caching and parallel builds.
*   **State Management:** TanStack Query (React Query) in `apps/web` to handle server state, replacing Redux for API caching.

**Architectural Patterns:**
*   **Language:** TypeScript (Strict Mode) across the board.
*   **Styling:** Tailwind CSS (via shadcn/ui) in `apps/web`.
*   **Build Tooling:** TurboRepo for efficient caching and parallel builds.
*   **State Management:** TanStack Query (React Query) in `apps/web` to handle server state, replacing Redux for API caching.

**Note:** This custom setup mimics the best parts of frameworks like Next.js but keeps the Backend explicitly separate as a standalone Express service, giving you full control over the API runtime.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
1.  **No Student Login:** The Student portal is a public, write-only interface. There is no session management for students.
2.  **Client-Side Grid Strategy:** We will load ALL active student data into the Admin browser memory to enable instant 0ms filtering.
3.  **Monorepo Structure:** We will use TurboRepo to share Zod validation schemas between Express and React.

### Data Architecture

*   **Database:** **MongoDB (Mongoose).**
    *   *Rationale:* Flexible schema fits the evolving "Student Profile" (needs to hold diverse metadata). Mongoose "Strict Mode" will enforce the Zod shapes.
*   **Admin Grid Strategy:** **Client-Side Data Model.**
    *   *Mechanism:* On dashboard load, fetch `GET /api/students/active`. This returns a compressed JSON array of all candidates (approx 300KB for 1000 students).
    *   *Performance:* Filtering/Sorting happens instantly in memory using `TanStack Table`.
    *   *Virtualization:* We MUST use `TanStack Virtual` to render only the visible 20 rows, preventing the DOM from crashing with 1000 rows.

### Authentication & Security

*   **Student Security (Public Access):**
    *   *Pattern:* Write-Only Form.
    *   *Abuse Prevention:* IP-based Rate Limiting (Express Middleware).
    *   *Duplication Logic:* Unique Constraint on `RollNumber`. If a student tries to register again, Backend returns `409 Conflict`, Frontend shows "You have already registered.".
*   **Admin Security:**
    *   *Pattern:* JWT (JSON Web Token) stored in `HttpOnly` Cookie.
    *   *RBAC:* Middleware `verifyAdmin` ensures only authenticated admins can access `GET /api/students` or perform mutations.

### API & Communication Patterns

*   **Contract:** **Type-Safe REST.**
    *   *Implementation:* We define a Zod schema `createStudentSchema`.
    *   *Frontend:* `zodResolver` ensures form matches schema.
    *   *Backend:* `validateRequest(createStudentSchema)` middleware guarantees API receives valid data.
*   **Error Handling:** Localized Toast notifications ("Roll Number already exists") rather than generic 500 errors.

### Frontend Architecture

*   **State Management:** **TanStack Query (React Query).**
    *   *Usage:* Manages the "Server State" (the list of students). It handles the caching, refetching, and optimistic updates for the Admin Grid.
*   **Forms:** **React Hook Form**.
    *   *Optimization:* Uncontrolled inputs for performance. Re-renders only happen on Submit or Validation Error, essential for mobile low-end devices.

### Infrastructure & Deployment

*   **Deployment Strategy:**
    *   **Frontend (`apps/web`):** Vercel (Static/SPA hosting).
    *   **Backend (`apps/api`):** Railway or Render (Node.js runtime).
    *   **Database:** MongoDB Atlas (Managed Cloud).
*   **CI/CD:** GitHub Actions to run `turbo build` and type-check before merge.

### Visual & Analytics Architecture

*   **Data Visualization:** **Recharts**.
    *   *Rationale:* Composable, reliable React library for rendering the required statistical data (graphs/charts) in the Admin Dashboard.
*   **Animation Engine:** **Framer Motion**.
    *   *Rationale:* Industry standard for React animations. Enables "layoutId" shared element transitions and complex FLIP animations for the "High Premium" feel requested.
*   **Stats Strategy:** **Aggregated Endpoint**.
    *   *Implementation:* `GET /api/stats/overview` runs a MongoDB Aggregation Pipeline to return counts (Passed/Failed/Pending) and daily trend data in a single request.
    *   *Caching:* Cached for 1 minute via `TanStack Query` to prevent DB thrashing.

### Detailed User Interactions

*   **Student Detail View:** **"Context-Free" Sheet**.
    *   *Pattern:* Clicking a student name opens a Shadcn `Sheet` (Right Overlay) that overlays *whatever* list is currently active.
    *   *Data Strategy:* Takes the full `Student` object from the row click (no extra fetch needed usually, or a fast `useQuery` fetch by ID if data is partial).
    *   *Visual Component:* `<RoundProgressStepper />` - A custom component using **Framer Motion** to animate a timeline of rounds (e.g., "Registered" -> "Round 1" -> "Round 2").
    *   *Independence:* This view is decoupled from the specific filter/list, satisfying the "irrespective of any list" requirement.

### Resume Processing & Data Extraction

*   **Extraction Engine:** **pdf-parse** (Node.js).
*   **Workflow:**
    1.  **Upload:** Student uploads PDF. Server saves file to storage (e.g., GridFS/S3) and keeps a reference.
    2.  **Parsing:** `pdf-parse` extracts raw text content from the buffer.
    3.  **Link Extraction:** Regex-based heuristic scan to find URLs matching `github.com` and `linkedin.com`.
    4.  **Storage:** Extracted links are stored in a structured format (`socialLinks` object) in the MongoDB document, NOT just as raw text.
    5.  **Display:** The Student Detail Sheet renders these as clickable `<a>` tags under dedicated "GitHub" and "LinkedIn" headers.

## Implementation Patterns & Consistency Rules

### Naming Patterns
*   **Source of Truth:** All Data Shapes (Student, User) are defined in `packages/types/src/*.ts` as Zod Schemas.
    *   *Convention:* Schema = `studentSchema`. TypeScript Type = `Student`.
*   **Enums:** NO "Magic Strings". Use exported enums for all status fields.
    *   *Bad:* `status === "PASS"`
    *   *Good:* `status === ApplicationStatus.PASS`

### API & Communication
*   **Response Envelope:** `JSend` Standard. All API responses must follow:
    ```ts
    type ApiResponse<T> =
      | { status: "success"; data: T }
      | { status: "fail"; message: string; code?: string } // Client error (400)
      | { status: "error"; message: string }; // Server error (500)
    ```
*   **Error Handling:** Global Error Middleware in Express must catch `ZodError` and auto-convert it to `400 Bad Request` with `status: "fail"`.

### Process Patterns
*   **Strict Imports:**
    *   `apps/web` can import from `packages/*`.
    *   `apps/api` can import from `packages/*`.
    *   `packages/*` CANNOT import from apps (Circular Dependency Forbidden).
*   **Environment Variables:** All env vars must be validated by `t3-env` (or similar Zod-based validator) at build time to prevent "undefined" secrets in production.

## Project Structure & Boundaries

### Complete Project Directory Structure
```text
ims/
├── apps/
│   ├── web/ (Vite + React + Tailwind + shadcn/ui)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── action-island/ (Floating Toolbar)
│   │   │   │   ├── ui/ (Shadcn primitives)
│   │   │   │   └── candidate-row/ (Custom Row)
│   │   │   ├── features/
│   │   │   │   └── admin-grid/ (TanStack Table + Virtual)
│   │   │   ├── hooks/
│   │   │   │   └── use-students.ts (React Query hooks)
│   │   │   ├── lib/
│   │   │   │   └── api-client.ts (Axios + JSend)
│   │   │   └── pages/ (React Router)
│   │   │       ├── admin/
│   │   │       └── student/
│   └── api/ (Express + Mongoose)
│       ├── src/
│       │   ├── app.ts (Entry point)
│       │   ├── controllers/
│       │   ├── middleware/
│       │   │   ├── error-handler.ts
│       │   │   └── validate-request.ts
│       │   ├── models/ (Mongoose Schemas)
│       │   └── routes/
│       └── package.json
└── packages/
    ├── types/ (SHARED TRUTH)
    │   ├── package.json
    │   └── src/
    │       ├── student.schema.ts
    │       ├── user.schema.ts
    │       └── enums.ts
    ├── config/
    │   ├── eslint-preset.js
    │   └── tsconfig.base.json
    └── ui/ (Optional future shared components)
```

### Architectural Boundaries
*   **The Shared Boundary (`packages/types`):** This is the **only** permitted dependency for both Apps. `apps/web` consumes `Student` type. `apps/api` consumes `studentSchema` Zod object.
*   **The API Wall:** `apps/web` treats `apps/api` as a black box. It only knows the REST endpoints defined in the "JSend" contract.

### Requirements to Structure Mapping
*   **"Bulk Sweep" Action:** Lives in `apps/web/src/components/action-island` and `apps/web/src/features/admin-grid`.
*   **"Instant Filter":** Implemented in `apps/web/src/features/admin-grid` using client-side logic.
*   **"Student Registration":** Lives in `apps/web/src/pages/student/register.tsx` (Form) and `apps/api/src/controllers/student.controller.ts` (Persistence).

### Development Patterns
*   **Port Separation:**
    *   Web: `http://localhost:5173`
    *   API: `http://localhost:3000`
*   **Proxy:** Vite config proxies `/api` requests to `localhost:3000` to avoid CORS issues during development.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
The selection of **MERN (Turbo)** acts as a strong foundation. The **Client-Side Data Model** for the admin grid pairs perfectly with **Vite's** performance and **Zod's** shared validation, ensuring type safety from DB to UI. No conflicting decisions found.

**Pattern Consistency:**
**Strict Imports** and **JSend envelopes** ensure the "API Wall" is respected. The use of **TanStack Query** effectively manages the client-side heavy data requirements.

**Structure Alignment:**
The `apps/web` vs `apps/api` split, bridged by `packages/types`, directly supports the "Shared Truth" pattern.

### Requirements Coverage Validation ✅

**Epic/Feature Coverage:**
- **Student Flash Apply:** Supported by Public API, Optimistic UI hooks, and Mobile-blocked Admin routes.
- **Admin Power Filter:** Supported by `TanStack Table` + Client-Side fetching strategy.
- **Detailed Student View:** Supported by "Context-Free" Sheet and `RoundProgressStepper`.

**Non-Functional Requirements Coverage:**
- **Performance:** Addressed via Virtualization, Client-side memory strategy, and `Recharts` for stats.
- **Security:** Supported by strictly separate Auth flows (Public vs JWT/RBAC).
- **Visuals:** `Framer Motion` explicitly selected for required animations.

### Implementation Readiness Validation ✅

**Decision Completeness:**
Critical decisions (Grid Strategy, Auth Separation, Resume Parsing, Stats) are documented.

**Structure Completeness:**
Full directory tree and file responsibilities are mapped.

**Pattern Completeness:**
Naming and Communication patterns are explicit.

### Gap Analysis Results

**Status:** No Critical Blockers.
- *Addressed:* Added specific strategies for Stats (Aggregation) and PDF Parsing (`pdf-parse`) and Animations (`framer-motion`).

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:** Strong Type Safety, Performance-first Admin handling, Clear Boundaries, Specific Visual Strategies.

### Implementation Handoff

**First Implementation Priority:**
Run `npx create-turbo@latest` to scaffold the monorepo structure.

