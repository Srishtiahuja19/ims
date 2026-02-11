# Story 1.3: Super Admin Authentication

**Status:** done

## Story

As a Super Admin,
I want to login utilizing a secure HTTP-Only cookie,
So that I can safely access restricted dashboard features.

## Acceptance Criteria

- [ ] **Given** the login API endpoint `/api/auth/login`, **When** I send valid credentials (validated against `adminSchema`), **Then** I should receive a `200` Success response and a `token` HTTP-Only cookie
- [ ] **And** subsequent requests to protected routes with `verifyAdmin` middleware should pass
- [ ] **And** the session should expire automatically after 30 minutes of inactivity
- [ ] **And** invalid credentials should return 401
- [ ] **And** missing token on protected route should return 401

## Tasks/Subtasks

- [x] Define `adminSchema` (email/password) in `packages/types`
- [x] Install `jsonwebtoken`, `bcryptjs`, `cookie-parser` and their types in `apps/api`
- [x] Create `Admin` Mongoose Model in `apps/api/src/models/Admin.ts`
- [x] Implement `authController.login` in `apps/api/src/controllers/authController.ts`
- [x] Implement `verifyAdmin` middleware in `apps/api/src/middleware/authMiddleware.ts`
- [x] Setup `authRoutes` in `apps/api/src/routes/auth.ts`
- [x] Register `cookie-parser` and routes in `index.ts`
- [x] Create a script to seed the initial Super Admin account

## Dev Notes

- **Security:** Use `httpOnly: true`, `secure: process.env.NODE_ENV === 'production'`, `sameSite: 'strict'`.
- **JWT:** Sign with `JWT_SECRET` from env.
- **Model:** Admin password must be hashed (bcrypt) before saving.

## Dev Agent Record

- **Debug Log:**
- **Completion Notes:**
  - Implemented `Admin` model with automatic bcrypt hashing.
  - Implemented secure `loginAdmin` controller (HttpOnly cookie, production-aware flags).
  - Implemented `verifyAdmin` middleware for protected routes.
  - Added `adminLoginSchema` to shared types for Zod validation.
  - Included a `seed.ts` script to bootstrap the initial "admin@ims.com" user.

## File List

- packages/types/src/index.ts
- apps/api/package.json
- apps/api/src/models/Admin.ts
- apps/api/src/controllers/authController.ts
- apps/api/src/middleware/authMiddleware.ts
- apps/api/src/routes/authRoutes.ts
- apps/api/src/index.ts
- apps/api/src/seed.ts

## Change Log

- 2026-01-25: Completed Super Admin Auth implementation.

