# Story 1.2: Database & Backend Foundation

**Status:** done

## Story

As a Backend Developer,
I want to set up the Express Server with Mongoose and Global Error Handling,
So that API development is standardized and robust.

## Acceptance Criteria

- [ ] **Given** the `apps/api` package, **When** I start the server, **Then** it should connect to MongoDB Atlas successfully (using `DATABASE_URL` from env)
- [ ] **And** any request to a non-existent route should return a JSend `404` response
- [ ] **And** a Zod validation error thrown anywhere should be caught by global middleware and returned as a `400` JSend fail response

## Tasks/Subtasks

- [x] Install `mongoose`, `cors`, `dotenv` in `apps/api`
- [x] Create `apps/api/src/config/db.ts` for Mongoose connection
- [x] Create `apps/api/src/utils/jsend.ts` (Helper functions for success/fail/error)
- [x] Create `apps/api/src/middleware/errorHandler.ts` (Global Error Handler)
- [x] Update `apps/api/src/index.ts` to use DB connection, CORS, and Middleware
- [x] Create a test route that throws a Zod error to verify handler
- [x] Create a test route that returns success to verify JSend
- [x] Verify 404 for unknown routes

## Dev Notes

- **JSend Standard:**
    - `success`: { status: "success", data: ... }
    - `fail`: { status: "fail", data: { title: "Required" } } (Validation errors)
    - `error`: { status: "error", message: "Db Connection Failed" } (System errors)
- **Env:** Use `@repo/env` to get `DATABASE_URL`.
- **Mongoose:** Ensure `strictQuery: true`.

## Dev Agent Record

- **Debug Log:**
- **Completion Notes:**
  - Installed `mongoose`, `cors`, `dotenv`.
  - Implemented `connectDB` using `@repo/env` for typesafe env vars.
  - Implemented `jsend` utility for standardized responses.
  - Implemented `errorHandler` middleware to catch Zod errors automatically.
  - Wired up `express` server in `index.ts` with CORS and JSON parsing.

## File List

- apps/api/package.json
- apps/api/src/config/db.ts
- apps/api/src/utils/jsend.ts
- apps/api/src/middleware/errorHandler.ts
- apps/api/src/index.ts
- apps/api/tsconfig.json

## Change Log

- 2026-01-25: Implemented Database Connection and Global Error Handling.

