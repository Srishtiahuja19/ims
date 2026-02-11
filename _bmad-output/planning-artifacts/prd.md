---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
inputDocuments: ['c:/Users/Srishti/OneDrive/Documents/Desktop/ims/_bmad-output/planning-artifacts/product-brief-ims-2026-01-23.md', 'c:/Users/Srishti/OneDrive/Documents/Desktop/ims/_bmad/bmm/data/project-context-template.md']
workflowType: 'prd'
classification:
  projectType: web_app
  domain: edtech
  complexity: medium
  projectContext: greenfield
---

# Product Requirements Document - ims

**Author:** Wissen
**Date:** 2026-01-23

## Success Criteria

### User Success
*   **"Zero-Click" Context:** Admin instantly reviews candidate Rich Profile (Resume + Socials + Rating Form) without opening new tabs or downloading files.
*   **Speed of Decision:** Admin processes a candidate interaction (Interview + Review + Pass/Fail) in under 3 minutes.
*   **Confidence:** 100% elimination of "lost data/resume" anxiety compared to paper process.

### Business Success
*   **Drive Efficiency:** Capability to process 1000+ candidates from Registration to Offer Letter within a standard 2-day campus visit.
*   **Data Integrity:** 100% capture of rating/review data for all candidates who reach Round 2.

### Measurable Outcomes
*   **Selection Latency:** <30 minutes to bulk-process Round 1 results for 500 candidates.
*   **Offer Turnaround:** <1 minute from "Final Pass" to "Offer Emailed".
*   **Funnel Throughput:** 100% of candidates reach a terminal state (Selected or Rejected) by end of drive.

## Product Scope

### MVP - Minimum Viable Product
*   **Unified Super-Admin Dashboard:** Single view for all 5 colleges with real-time funnel charts.
*   **5-Round Logic Engine:**
    *   R1: Binary Bulk P/F
    *   R2/3/5: Rating + Review + P/F
    *   R4: Review + P/F
*   **Rich Candidate Profile:** Modal with embedded PDF Resume and clickable social links.
*   **Automated Offer Engine:** One-click PDF generation and email delivery.

### Vision (Future)
*   **Alumni Tracking Module:** Long-term career tracking of hired interns.
*   **AI Resume Screening:** Pre-R1 smart filtering based on keywords.

## User Journeys

### Journey 1: The "Mass Filtration" Grind (Priya - Super Admin)
*   **Opening:** It's 9:00 AM at College A. 1000 students are waiting. Priya is stressed. She needs to filter them down to 100 by lunch.
*   **Action:** She logs into the **Unified Dashboard** and selects "College A". She switches Round 1 to "Active". As written test answer sheets come in, she uses the **Bulk Selection Tool**. She doesn't type 900 rejections; she just selects the 100 passing IDs and clicks "Promote".
*   **Climax:** 900 students are instantly moved to "Rejected" and sent regret emails. The list cleans up. She breathes a sigh of relief.
*   **Resolution:** She opens the "Round 2" tab. Only 100 names are there. The noise is gone. She is ready for interviews.

### Journey 2: The "Flash" Application (Amit - Student)
*   **Opening:** Amit sees the company banner. He's nervous he'll miss the deadline.
*   **Action:** He navigates to the **IMS Web Portal** (Internal App) on his mobile browser. The **Registration Module** loads instantly. He types his details and attaches his Resume PDF directly within the app.
*   **Climax:** He hits "Submit". A "Success" animation plays. *Ding!* He gets an email immediately: "You are registered. Your Roll No is 105."
*   **Resolution:** He walks into the exam hall confident that his data is safe in the company system.

### Journey 3: The "Zero-Touch" Closure (Priya - Round 5)
*   **Opening:** It's 6:00 PM. The Director has picked the final 10. Priya usually spends 2 hours typing offer letters now.
*   **Action:** She filters for "Round 5 Cleared". She selects all 10. She clicks **"Generate Offers"**.
*   **Climax:** The system generates 10 personalized PDFs and emails them. *Done.*
*   **Resolution:** She closes her laptop at 6:05 PM.

### Journey Requirements Summary
*   **Capabilities Required:**
    *   **Bulk State Management:** Ability to transition 100s of users in one click.
    *   **Public Web Portal:** Robust, mobile-responsive registration facing external users.
    *   **PDF Generator:** Backend service to create documents from templates.

## Domain-Specific Requirements (EdTech / Recruitment)

### Security & Access
*   **Single Super-Admin Model:** System must support a single, high-privilege account with unrestricted access to all modules (Filtration, Interview, Offer).
*   **Session Security:** Aggressive session timeouts to prevent "Open Laptop" risks during campus drives.
*   **Secure Access:** Admin Dashboard must be gated behind strong authentication; Student data must NEVER be publicly accessible via direct URL manipulation.

### Data Handling
*   **Resume Privacy:** Uploaded Resumes must be private-read-only (accessible only to authenticated Admin).
*   **Bulk Processing Integrity:** "Select All" actions must be atomic – preventing partial failures where half the students get rejected and half don't.

## Web App Specific Requirements

### Technical Architecture
*   **Architecture Pattern:** Single Page Application (SPA) for fluid, app-like experience.
*   **Frontend Separation:** Distinct layouts for "Public Registration" (Mobile-First) vs "Admin Dashboard" (Desktop-Optimized).
*   **Real-time:** WebSockets/Polling for live updates on Admin Dashboard charts.

### Browser & Device Matrix
*   **Student Portal:** 100% responsive on Mobile Web (Chrome Android, Safari iOS).
*   **Admin Dashboard:** Optimized for Desktop/13"+ Laptop screens (Chrome/Edge).

### Performance Targets
*   **Registration Load Time:** <2 seconds on 4G networks.
*   **SEO Strategy:** **None.** Private internal tool. No indexing required. Robots.txt disallow all.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy
*   **MVP Approach:** **"The Campus Core"** - Prioritizing the critical path (Registration -> Selection -> Offer) for a live drive over analytics or bells-and-whistles.
*   **Primary Risk:** System failure during a live drive with 1000 students waiting. Stability > Features.

### Phase 1: MVP (Must-Haves)
*   **Core User Journeys:** "Mass Filtration" (Priya), "Flash Application" (Student).
*   **Capabilities:**
    *   Single Super-Admin Login.
    *   Global College Selector.
    *   Round 1 Bulk Logic (Pass/Fail).
    *   Rounds 2-5 Evaluation Logic (Rich Profile + Forms).
    *   Offer Generation Engine.

### Post-MVP Features

**Phase 2: Insight & Scale**
*   **Analytics Dashboard:** Real-time funnel visualization and diversity stats.
*   **Global Search:** "Find Student" across multiple drives.
*   **Archive Mode:** Read-only view of past drives.

**Phase 3: Intelligence (Future)**
*   **AI Resume Screening:** Keyword-based pre-filtering.
*   **Alumni Tracking:** Career progression modules.

### Risk Mitigation Strategy
*   **Technical Risk (Data Loss):** Implemenet robust "Auto-Save" on all rating forms and transactional database logic for bulk moves.
*   **Market Risk (Adoption):** "Zero-Click" simplicity ensures Admin prefers this over Excel.
*   **Resource Risk:** If schedule slips, cut "Rich Profile" features (e.g. social preview) but keep PDF view.

## Functional Requirements

### 1. Authentication & Access
*   **FR-01:** Super Admin can login via secure email/password.
*   **FR-02:** System auto-logs out Admin after 30 mins of inactivity.
*   **FR-03:** Students can access the Registration Form via a prominent link/button located on the main Application Login Page (No login required to register).

### 2. Candidate Management (The Funnel)
*   **FR-04:** Admin can create a new "College Drive" configuration (Name, Date, Active Rounds).
*   **FR-05:** System automatically enrolls all successfully registered students into "Round 1" for their respective college.
*   **FR-06:** Admin can manually select students (Individual or Multi-Select) to mark as "Pass" or "Fail" for Round 1 (No score criteria required).
*   **FR-07:** Admin can view "Rich Profile" (Resume + Socials) in a modal overlay for any candidate in any round.

### 3. Evaluation & Verification
*   **FR-08:** Admin can rate candidates (1-5 Stars) and add text notes during Round 2, 3, and 5.
*   **FR-09:** System prevents promoting a candidate from Round 2/3/5 if no Rating/Notes are entered (Completeness Check).
*   **FR-10:** Admin can toggle "Pass/Fail" status for any candidate in proper sequence (Cannot skip rounds).

### 4. Offer Management
*   **FR-11:** Admin can generate Offer Letters for all candidates who pass Round 5.
*   **FR-12:** System generates a personalized PDF from a standard template and triggers an email to the student with the attachment.

## Non-Functional Requirements

### Performance (The "Burst" Load)
*   **Concurrency:** System must handle 1000 concurrent writes (Student Registrations) within a 15-minute window without crashing.
*   **Latency:** Admin "Bulk Actions" (Reject 500 students) must complete within 2 seconds.

### Reliability & Data Integrity
*   **Zero Data Loss:** All form inputs must have client-side persistence (Local Storage) to survive a network drop.
*   **Uptime:** 99.9% uptime required during the "Drive Window" (9 AM - 6 PM).

### Usability (Mobile First)
*   **Responsive:** Student Portal must pass Google Mobile-Friendly test.
*   **Cross-Browser:** Must work on Chrome (Android), Safari (iOS), and Edge (Windows).
