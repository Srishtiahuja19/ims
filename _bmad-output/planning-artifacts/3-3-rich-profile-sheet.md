# Story 3.3: Rich Profile Sheet (Context-Free)

**Status:** done

## Story

As an Admin,
I want to click on a student row and see their complete profile in a side panel,
So that I can review all their details (resume, contact info, status) without losing my place in the grid.

## Acceptance Criteria

- [ ] **Given** I'm viewing the student grid
- [ ] **When** I click on any student row
- [ ] **Then** a slide-out panel appears from the right showing the full profile
- [ ] **And** the panel displays: Name, Photo (if available), Contact Info, Resume Preview/Download, Current Status
- [ ] **And** I can close the panel with an X button or by clicking outside
- [ ] **And** the grid remains visible in the background (dimmed)

## Tasks/Subtasks

- [ ] Create `StudentProfileSheet` component (slide-out panel)
- [ ] Add click handler to `StudentGrid` rows
- [ ] Implement resume preview (PDF viewer or download link)
- [ ] Add smooth slide-in/out animations
- [ ] Style with glassmorphism to match design system
- [ ] Handle edge cases (no resume, missing data)

## Dev Notes

- **Animation:** Use CSS transitions for slide-in from right
- **Backdrop:** Semi-transparent overlay with blur
- **Resume:** Use `<iframe>` for PDF preview or provide download button
- **State:** Pass selected student ID to the sheet component

## Dev Agent Record

- **Debug Log:**
- **Completion Notes:**

## File List

## Change Log
