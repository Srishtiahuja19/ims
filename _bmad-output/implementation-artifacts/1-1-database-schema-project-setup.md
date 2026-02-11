# Story 1.1: Database Schema & Project Setup

Status: review

## Story

As a Developer,
I want to initialize the project structure and database schema,
so that I have a foundation to build the onboarding logic.

## Acceptance Criteria

1.  **Given** a clean environment, **When** I run the initialization script, **Then** a TurboRepo monorepo with `apps/web`, `apps/api`, and `packages/types` is created.
2.  **Given** the database setup, **When** checked, **Then** the `Student` schema in Mongoose includes `email`, `passwordHash`, `role` (Admin/Student), and `onboardingStatus` (Hired/Pending/Verified).
3.  **Given** the shared package, **When** checked, **Then** `packages/types` exports a shared Zod schema `studentSchema` matching the DB.

## Tasks / Subtasks

- [x] Task 1: Initialize TurboRepo Monorepo Structure (AC: 1)
  - [x] Scaffold project using `npx create-turbo@latest` (or manual structure if preferred for control).
  - [x] Create `apps/web` (Vite + React + TS).
  - [x] Create `apps/api` (Express + TS).
  - [x] Create `packages/types` (Shared TS library).
  - [x] Configure `turbo.json` for build pipelines.

- [x] Task 2: Implement Shared Zod Schemas (AC: 3)
  - [x] Install `zod` in `packages/types`.
  - [x] Define `StudentStatus` Enum (`Hired`, `Pending`, `Verified`, `Rejected`).
  - [x] Define `UserRole` Enum (`Admin`, `Student`).
  - [x] Create `studentSchema` Zod object with fields: `email`, `passwordHash` (string), `role` (UserRole), `onboardingStatus` (StudentStatus).
  - [x] Export TypeScript types inferred from Zod schemas.
  - [x] Build/Transpile `packages/types` so it can be consumed by apps.

- [x] Task 3: Setup Backend Foundation (AC: 1)
  - [x] Install `express`, `mongoose`, `cors`, `dotenv` in `apps/api`.
  - [x] Configure MongoDB connection logic in `apps/api/src/config/db.ts`.
  - [x] Set up basic Express app structure (`app.ts`, `server.ts`).
  - [x] Configure `tsconfig.json` to reference `packages/types`.

- [x] Task 4: Implement Mongoose Schema (AC: 2)
  - [x] Create `Student` Mongoose Model in `apps/api/src/models/student.model.ts`.
  - [x] Ensure Mongoose schema mirrors the Zod schema from `packages/types` (Strict Mode).
  - [x] Add `timestamps: true`.

- [x] Task 5: Setup Frontend Foundation (AC: 1)
  - [x] Install `shadcn-ui`, `tailwindcss`, `lucide-react` in `apps/web`.
  - [x] Configure `tsconfig.json` to reference `packages/types`.
  - [x] verify `import { Student } from '@repo/types'` works in a test file (Verified via check-types).

## Dev Notes

### Architecture Compliance
- **Monorepo:** Must use TurboRepo.
- **Strict Types:** All schemata must be defined in `packages/types` first.
- **Language:** TypeScript Strict Mode is MANDATORY.
- **Database:** MongoDB with Mongoose.

### Technical Detail
- **Package Linking:** Ensure `workspaces` in `package.json` are set correctly so `npm install` links the local package.
- **Ports:** API should run on `3000`, Web on `5173`.
- **Environment:** Use `dotenv` for `MONGO_URI`.

### References
- [Architecture: Turbo-MERN](../planning-artifacts/architecture.md#selected-architecture-turbo-mern-custom-scaffold)
- [Project Context: Types](../project-context.md#critical-implementation-rules)
- [Epics: Story 1.1](../planning-artifacts/epics.md#story-11-database-schema--project-setup)

## Dev Agent Record

### Agent Model Used
- Model: Gemini 2.0 Flash

### Debug Log

### Completion Notes List

### File List
