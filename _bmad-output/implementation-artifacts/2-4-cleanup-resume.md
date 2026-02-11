# Story 2.4: Cleanup Resume Upload

Status: complete

## Story

As a Student,
I want to view my submitted resume instead of uploading it again,
Since I already uploaded it during registration.

## Acceptance Criteria

1.  **Given** the Student Dashboard, **Then** the "Resume Upload" section is removed.
2.  **Given** the dashboard, **Then** I see "Resume: [View PDF]" link or button.
3.  **Given** I click the link, **Then** it opens the stored `resumeUrl` in a new tab.

## Tasks / Subtasks

- [x] Task 1: Modify Student Dashboard (AC: 1, 2, 3)
  - [x] Remove `handleResumeUpload` and file input.
  - [x] Add `a` tag linking to `student.resumeUrl`.
  - [x] Style it as a card similar to the profile statuses.

## Dev Notes
- We assume `student.resumeUrl` is populated from the registration flow.
- If `resumeUrl` is missing (legacy data), we might show a fallback "No resume found" or keep upload as a fallback?
  - *Decision:* For now, assume it's there. If missing, maybe just show "Not Uploaded".

## Dev Agent Record
- Model: Gemini 2.0 Flash
