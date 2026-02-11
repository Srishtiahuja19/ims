---
stepsCompleted: [1, 2, 3]
inputDocuments: 
  - planning-artifacts/product-brief-ims-2026-01-28.md
  - analysis/brainstorming-session-2026-01-28.md
  - planning-artifacts/prd.md
  - planning-artifacts/architecture.md
  - planning-artifacts/ux-design-specification.md
---

# ims - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for ims, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**From Onboarding Brief (New Module):**
*   **FR-ONB-01 (Trigger):** Admin button "Send Credentials" generates and emails random password to selected candidates.
*   **FR-ONB-02 (Roster):** Admin Dashboard shows "Hired Interns" roster with Status (Pending, Verification, Ready).
*   **FR-ONB-03 (Auth):** Intern logs in using email + generated password.
*   **FR-ONB-04 (Gate):** Intern sees "Training Locked" state until documents are verified.
*   **FR-ONB-05 (Upload):** Intern can upload PAN, Adhaar, and Marksheets.
*   **FR-ONB-06 (Review):** Admin can View, Approve, or Reject (with feedback) uploaded documents.
*   **FR-ONB-07 (Unlock):** "Training Module" unlocks automatically upon status "Approved".

**From Hiring PRD (Existing Module):**
*   **FR-HIR-01:** Super Admin login/logout.
*   **FR-HIR-02:** Student Registration Form (Public).
*   **FR-HIR-03:** College Drive Configuration.
*   **FR-HIR-04:** Round 1 Bulk Pass/Fail.
*   **FR-HIR-05:** Rounds 2-5 Rating & Review.
*   **FR-HIR-06:** Offer Letter Generation (PDF).

### NonFunctional Requirements

**From Onboarding Brief:**
*   **NFR-ONB-01 (Speed):** Onboarding process (Login -> Training) achievable in < 24 hours.
*   **NFR-ONB-02 (Efficiency):** Admin verification per candidate < 2 minutes.

**From Hiring PRD:**
*   **NFR-HIR-01:** 1000 concurrent writes (Registration).
*   **NFR-HIR-02:** Bulk actions < 2 seconds latency.
*   **NFR-HIR-03:** Zero Data Loss (Local Storage persistence).

### Additional Requirements

**From Architecture (Hiring Context - Turbo MERN):**
*   **Tech Stack:** Monorepo (Turbo), Apps: `web` (Vite), `api` (Express).
*   **Grid Strategy:** Client-Side Data Model (load all rows) for Admin Dashboard.
*   **Auth:** JWT in HttpOnly Cookie for Admin.
*   **PDF Parsing:** `pdf-parse` for Resume extraction (Likely reusable for Doc verification?).
*   **Validation:** Zod schemas shared in `packages/types`.

**From UX Design (Hiring Context):**
*   **Pattern:** "Action Island" for bulk actions.
*   **Pattern:** "Context-Free Sheet" for detailed views (likely applicable to verification modal).
*   **Constraint:** Admin Dashboard blocked on mobile (<1024px).

### FR Coverage Map

FR-ONB-01 (Trigger): Epic 1 - Admin credential generation
FR-ONB-02 (Roster): Epic 2 - Dashboard visualization
FR-ONB-03 (Auth): Epic 1 - Intern Login logic
FR-ONB-04 (Gate): Epic 3 - Locked state UI
FR-ONB-05 (Upload): Epic 3 - Document upload form
FR-ONB-06 (Review): Epic 2 - Admin verification modal
FR-ONB-07 (Unlock): Epic 4 - State transition logic

## Epic List

#### Epic 1: The Administrative Bridge (The Trigger)

Enable Admins to securely generate and send credentials to hired students, eliminating manual Excel work.

#### Story 1.1: Database Schema & Project Setup

As a Developer,
I want to initialize the project structure and database schema,
So that I have a foundation to build the onboarding logic.

**Acceptance Criteria:**
**Given** a clean environment
**When** I run the initialization script
**Then** a TurboRepo monorepo with `apps/web`, `apps/api`, and `packages/types` is created.
**And** the `Student` schema in Mongoose includes `email`, `passwordHash`, `role` (Admin/Student), and `onboardingStatus` (Hired/Pending/Verified).
**And** the `packages/types` exports a shared Zod schema `studentSchema` matching the DB.

#### Story 1.2: The "Send Credentials" API (Backend)

As an Admin,
I want to trigger credential generation for selected students,
So that they can access the system without me manually creating passwords.

**Acceptance Criteria:**
**Given** a list of valid Student IDs (Status: Hired)
**When** I call `POST /api/students/send-credentials`
**Then** the system generates a random 8-char password for each student.
**And** the password is hashed and saved to the DB.
**And** the `onboardingStatus` changes to `Pending`.
**And** a (Mocked) email is logged to the console containing the plaintext credentials.

#### Story 1.3: Unified Login Interface

As a User (Admin or Intern),
I want to log in using a single interface,
So that I am routed to the correct dashboard based on my role.

**Acceptance Criteria:**
**Given** the user is on `/login`
**When** they enter valid credentials
**Then** the system validates the password hash.
**And** returns a JWT token with the user's `role` encoded.
**And** if Role is `Admin`, redirects to `/admin/dashboard`.
**And** if Role is `Student`, redirects to `/student/onboarding`.

### Epic 2: The Control Center (Visibility)

Provide Admins with a real-time dashboard to track intern status and perform verification tasks.

#### Story 2.1: Admin Roster View (The Grid)

As an Admin,
I want to view a list of all interns with their current onboarding status,
So that I can identify who needs attention.

**Acceptance Criteria:**
**Given** the Admin is logged in
**When** they load the Dashboard
**Then** the system fetches ALL student records (Client-side model).
**And** renders a table with columns: Name, Email, Status Pill (Color-coded).
**And** I can filter the list by "Status=Uploaded" to see pending work.

#### Story 2.2: Verification Logic API

As a System,
I want to process verification decisions securely,
So that the intern's status reflects the Admin's review.

**Acceptance Criteria:**
**Given** an authenticated Admin request
**When** `POST /api/students/:id/verify` is called with `{ status: "Verified" }`
**Then** the `onboardingStatus` is updated in the DB to `Verified`.
**And** if `{ status: "Rejected", feedback: "..." }` is sent, the status updates to `Rejected` and feedback is saved.

#### Story 2.3: Verification Modal UI

As an Admin,
I want to view uploaded documents and approve/reject them in one interface,
So that I can verify compliance quickly without context switching.

**Acceptance Criteria:**
**Given** I click a student name in the Roster
**When** the modal opens
**Then** I see the uploaded document links (Mocked PDF view or Link).
**And** I see "Approve" (Green) and "Reject" (Red) buttons.
**And** clicking "Reject" prompts for a text reason.
**And** clicking "Approve" triggers the API and closes the modal.

### Epic 3: The Intern Portal (Submission)

Allow interns to log in, view their status, and upload compliance documents securely.

#### Story 3.1: Intern Dashboard (Gated State Controller)

As an Intern,
I want to see my current onboarding status immediately upon login,
So that I know if I need to take action or wait.

**Acceptance Criteria:**
**Given** the Intern logs in
**When** the dashboard loads
**Then** if status is `Pending/Rejected`, I see the "Action Required" UI.
**And** if status is `Uploaded`, I see a "Under Verification" banner (Read-Only).
**And** if status is `Verified`, I see the "Training Unlocked" success state.
**And** if Rejected, I see the specific Admin feedback text at the top.

#### Story 3.2: Interactive Tabbed Document Upload

As an Intern,
I want to upload my documents via an interactive tabbed interface,
So that I can focus on one document at a time without being overwhelmed.

**Acceptance Criteria:**
**Given** the "Action Required" view
**When** I load the component
**Then** I see 4 distinct tabs (PAN, Adhaar, Marksheets, Photo).
**And** I can switch between tabs with smooth animations (Framer Motion).
**And** each tab contains a specific file upload dropzone.
**And** a "Green Check" appears on the tab header when a file is successfully attached.
**And** the "Submit for Review" button is disabled until ALL 4 tabs have files.

#### Story 3.3: Persistence & Optimistic State

As an Intern,
I want my upload progress to be saved if I reload the page,
So that I don't lose work if my connection drops.

**Acceptance Criteria:**
**Given** I have uploaded files to Tabs 1 and 2
**When** I refresh the browser
**Then** Tabs 1 and 2 still show the attached files (rehydrated from LocalStorage/Cache).
**And** I can continue uploading Tab 3 without starting over.

### Epic 4: The Logic Gate (Compliance)

Enforce the "No Verification = No Training" rule via backend logic and automated status transitions.

#### Story 4.1: The "Unlock" Transition Logic

As a System,
I want to automatically unlock training when verification is approved,
So that the intern gets immediate access without manual intervention.

**Acceptance Criteria:**
**Given** an Admin approves a verification request (Story 2.2)
**When** the `onboardingStatus` updates to `Verified`
**Then** the system triggers an event to grant "Learning Access" (e.g., enable flag in User Profile).
**And** sends a notification/email to the intern: "Training Unlocked!".

#### Story 4.2: Training Access Control (Middleware)

As a Developer,
I want to protect the Training routes with middleware,
So that unverified users cannot access content by guessing URLs.

**Acceptance Criteria:**
**Given** a user is logged in
**When** they attempt to access `/student/training/*`
**Then** the middleware checks `user.onboardingStatus`.
**And** if status is NOT `Verified`, returns `403 Forbidden` JSON or redirects to Dashboard.
**And** if status is `Verified`, allows the request to proceed.


