# Story 2.2: Resume Upload & Parsing Service

**Status:** done

## Story

As an Applicant,
I want to upload my PDF resume,
So that the system can auto-fill my registration details (Name, Email, Phone, etc.).

## Acceptance Criteria

- [ ] **Given** a PDF file < 5MB, **When** posted to `/api/resume/upload`, **Then** it should be saved locally in `uploads/` directory
- [ ] **And** the server should return a JSON response with the file URL and *mock* extracted data (Name, Email, Phone)
- [ ] **And** non-PDF files should be rejected with 400
- [ ] **And** files > 5MB should be rejected with 400

## Tasks/Subtasks

- [x] Install `multer` and `@types/multer` in `apps/api`
- [x] Create `apps/api/src/middleware/uploadMiddleware.ts` (Local storage config, PDF filter, Limit 5MB)
- [x] Create `apps/api/src/services/resumeParser.ts` (Mock service returning dummy data)
- [x] Create `apps/api/src/controllers/resumeController.ts`
- [x] Create `apps/api/src/routes/resumeRoutes.ts`
- [x] Configure `express.static` in `index.ts` to serve `uploads/` folder
- [x] Verify upload works via Curl/Postman (or script)

## Dev Notes

- **Storage:** Local disk storage in `apps/api/uploads`.
- **Parsing:** For now, just return hardcoded mock data for the frontend to populate forms. Real parsing (Python/AI) is a future enhancement.
- **URL:** Return `http://localhost:3001/uploads/filename.pdf`

## Dev Agent Record

- **Debug Log:**
- **Completion Notes:**
  - Implemented Local File Storage for resumes (`apps/api/uploads`).
  - Configured `multer` with PDF filter and 5MB limit.
  - Exposed `/api/resume/upload` endpoint.
  - Implemented Mock Resume Parser service.
  - Configured static file serving for `/uploads` route.

## File List

- apps/api/package.json
- apps/api/src/middleware/uploadMiddleware.ts
- apps/api/src/services/resumeParser.ts
- apps/api/src/controllers/resumeController.ts
- apps/api/src/routes/resumeRoutes.ts
- apps/api/src/index.ts

## Change Log

- 2026-01-25: Implemented Resume Upload Service (Multer/Local).

