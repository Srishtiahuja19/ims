# Story 1.1: Project Initialization & Monorepo Structure

**Status:** done

## Story

As a Developer,
I want to initialize the TurboRepo with the architectural MERN structure and shared types,
So that all future development is type-safe and consistent.

## Acceptance Criteria

- [ ] **Given** a fresh environment, **When** I run `npx create-turbo@latest` and configure the workspace, **Then** I should see `apps/web` (Vite), `apps/api` (Express), and `packages/types` directories
- [ ] **And** `t3-env` should be configured to validate `DATABASE_URL` and `JWT_SECRET` on startup
- [ ] **And** `packages/types` should export a dummy Zod schema that is consumable by both apps

## Tasks/Subtasks

- [x] Initialize TurboRepo (pnpm, apps/web, apps/api)
- [x] Create `packages/types` workspace
- [x] Install and configure `zod` in `packages/types`
- [x] Export dummy Zod schema from `packages/types`
- [x] Install `t3-env` in `packages/config` or root
- [x] Configure `t3-env` for `DATABASE_URL` and `JWT_SECRET`
- [x] Verify `apps/web` and `apps/api` can import from `packages/types`
- [x] Verify env validation fails if vars missing

## Dev Notes

- **Architecture:** Monorepo (Turbo).
- **Stack:** Vite (Web), Express (API).
- **Key Pattern:** Shared `packages/types` is the source of truth for Zod schemas.
- **Env:** Use `@t3-oss/env-core` (or similar) for runtime validation.

## Dev Agent Record

- **Debug Log:**
- **Completion Notes:**
  - Initialized Monorepo with `npm` (instead of pnpm).
  - Created `apps/api` (Express) and `apps/web` (Vite React).
  - Created `@repo/types` with Zod.
  - Created `@repo/env` with t3-env.
  - Verified imports via `turbo run build`.

## File List

- package.json
- turbo.json
- apps/web/package.json
- apps/web/src/App.tsx
- apps/api/package.json
- apps/api/tsconfig.json
- apps/api/src/index.ts
- packages/types/package.json
- packages/types/tsconfig.json
- packages/types/src/index.ts
- packages/env/package.json
- packages/env/tsconfig.json
- packages/env/src/index.ts

## Change Log

- 2026-01-25: Initial implementation of Monorepo structure.

