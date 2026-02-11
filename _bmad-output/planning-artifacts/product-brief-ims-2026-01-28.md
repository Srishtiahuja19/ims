---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: ['analysis/brainstorming-session-2026-01-28.md', 'analysis/brainstorming-session-2026-01-23.md', 'project-context.md']
date: 2026-01-28
author: Wissen
---

# Product Brief: ims

<!-- Content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

The IMS Onboarding Module streamslines the critical transition from "Candidate" to "Productive Intern." By automating credential delivery and centralizing document verification, it eliminates the "waiting limbo" of the pre-joining phase. The system empowers Admins with a "Control Center" to trigger access, verify compliance, and assign initial training tasks, ensuring every intern is ready to work on Day 1.

---

## Core Vision

### Problem Statement

Once a candidate is hired, they often fall into an administrative gap. Managing logins, collecting sensitive documents (PAN/Adhaar), and tracking initial tasks is currently disjointed, handled via email threads or spreadsheets. This leads to:
1.  **Security Risks:** Manual password sharing.
2.  **Compliance Gaps:** Interns starting work without verified documents.
3.  **Low Visibility:** Admins cannot see who is "stuck" in the process.

### Proposed Solution

A dedicated **Onboarding Interface** that bridges the gap between Hiring and Training:
1.  **The Trigger:** A single "Send Credentials" action automates secure account creation (Email + Random Password).
2.  **The Visbility:** Triggered interns immediately appear in a live "Roster View" for real-time tracking.
3.  **The Gate:** A "Verification & Task" loop where Admins approve docs before unlocking training.

### Key Differentiators

*   **Logic-Gated Access:** Unlike standard HR tools, IMS hard-links "Compliance" to "Training Access." You cannot start learning until you are verified.
*   **Admin-Centric Trigger:** The process doesn't start until the Admin explicitly clicks "Send Credentials," giving total control over the cohort start timing.
*   **Unified Lifecycle:** Interns use the *same* portal for application, onboarding, and training—no context switching.

## Target Users

### Primary Users

#### 1. The Admin (Coordinator)
*   **Role:** HR Associate or Program Manager responsible for the intern cohort.
*   **Goal:** Efficiently transition 50+ candidates from "Hired" to "Ready" without drowning in emails.
*   **Key Interaction:** The "Control Center" dashboard where they trigger credentials, verify documents, and track cohort progress.
*   **Success:** "I spent 10 minutes approving documents instead of 4 hours checking emails."

#### 2. The Intern (Candidate)
*   **Role:** Newly hired student, eager but anxious about the process.
*   **Goal:** Quickly complete formalities to access the learning material.
*   **Key Interaction:** The "Onboarding Portal" where they upload docs and watch their status change from Pending -> Approved -> Training Unlocked.
*   **Success:** "I knew exactly what to do, feedback was instant, and I got my training access immediately."

### User Journey (The "Happy Path")

1.  **Trigger:** Admin selects "Hired" candidates and clicks **"Send Credentials"**.
2.  **Notification:** Intern receives Welcome Email with auto-generated credentials.
3.  **Login:** Intern logs into the main portal.
4.  **The block:** Intern sees "Training Locked" and a "Action Required: Verify Identity" prompt.
5.  **Submission:** Intern uploads PAN, Adhaar, and Marksheets.
6.  **Verification:** Admin sees "4 Pending Approvals" on dashboard -> Reviews -> **Approves**.
7.  **Success:** Intern gets "Approved" notification -> **Training Module Unlocks** automatically.

## Success Metrics

### User Success
*   **For Interns (Time-to-Training):** The primary measure of success is the speed at which a hired candidate becomes a learning intern.
    *   *Target:* Interns should be able to complete the entire onboarding process (Login -> Upload -> Training Access) in under **24 hours**.
*   **For Admins (Process Velocity):** The ability to clear a queue of 50+ interns in a single sitting without context switching.

### Business Objectives
*   **Operational Efficiency:** Reduce the administrative burden of onboarding a new batch from days to hours.
*   **Day 1 Readiness:** Ensure 100% of interns have training access *before* their official start date, eliminating the "first week slump."

### Key Performance Indicators (KPIs)
1.  **Onboarding Velocity:** Average time from "Credentials Sent" to "Training Unlocked."
2.  **Verification Throughput:** Average time an Admin spends reviewing a single candidate (Target: < 2 minutes).
3.  **Correction Rate:** Percentage of documents rejected (tracking clarity of instructions).

## MVP Scope

### Core Features (The Build list)
1.  **Admin "Control Center":**
    *   List view of Hired Interns with status columns (Pending, Verification, Ready).
    *   "Send Credentials" button (The Trigger).
    *   Verification Modal (View Doc, Approve, Reject with Feedback).
2.  **Auth & Notifications:**
    *   Hardcoded "Welcome" Email Template.
    *   Credential Generator service.
3.  **Intern Onboarding Portal:**
    *   Static Profile View (Name/Email from DB).
    *   Document Upload Form (PAN, Adhaar, Marksheets).
    *   "Training Locked" State Indicator.
4.  **The Logic Core:**
    *   State Machine: `Pending` -> `Review` -> `Approved` -> `Unlocked`.

### Out of Scope for MVP (The "No" list)
*   **Offer Acceptance:** Handled offline/email before this process starts.
*   **Mobile App:** Web Portal optimization only (Desktop focus for Admin).
*   **Analytics Dashboard:** No charts/graphs, just the Roster View.
*   **Custom Email Editor:** All emails use a standard, hardcoded template.
*   **Self-Registration:** Interns cannot sign up; they must be invited by Admin.

### MVP Success Criteria
*   **Functional:** An intern can successfully log in and unlock training without asking a human for help.
*   **Speed:** Admin receives 0 emails regarding "What is my login?" or "Did you get my docs?".
*   **Visual:** The "Training" tab visually unlocks (changes from gray to color) immediately upon approval.
