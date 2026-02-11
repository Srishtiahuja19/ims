---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments: ['c:/Users/Srishti/OneDrive/Documents/Desktop/ims/_bmad-output/analysis/brainstorming-session-2026-01-23.md', 'c:/Users/Srishti/OneDrive/Documents/Desktop/ims/_bmad/bmm/data/project-context-template.md']
date: 2026-01-23
author: Wissen
---

# Product Brief: ims

<!-- Content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

The **Intern Management System (IMS)** is a high-efficiency recruitment platform designed to handle large-scale, concurrent offline-to-online hiring drives across multiple campuses. It solves the operational bottleneck of processing thousands of candidates down to a select few by streamlining the initial "Mass Filtration" phase and providing deep evaluation tools for final selection. The system unifies data from multiple colleges into a single dashboard while allowing granular filtering, ensuring Admins can manage specific drives without losing the global recruitment picture. It closes the loop with automated, zero-touch offer letter generation.

---

## Core Vision

### Problem Statement

Managing concurrent high-volume internship drives (1000+ registrations per college) with deep attrition rates (90% cut in Round 1) creates an overwhelming administrative burden. Manually aggregating data from offline written tests across different campuses and tracking status across 5 sequential rounds leads to data silos, delays, and operational fatigue.

### Problem Impact

*   **Operational Bottleneck:** HR spends hours manually processing thousands of "Rejections" instead of focusing on the top candidates.
*   **Data Fragmentation:** Operating separate drives for each college prevents a unified view of the talent pool and hiring progress.
*   **Candidate Experience:** Lack of transparency and slow processing times damage the employer brand across campuses.

### Why Existing Solutions Fall Short

Generic HR tools are often too complex, lack specific "Offline-to-Online" state management, or fail to handle multi-campus filtering efficiently, forcing teams to run disjointed processes.

### Proposed Solution

A purpose-built **"Funnel Management" System** that assumes high rejection rates and multi-campus operations by design.
*   **Unified Multi-Campus Architecture:** A single master database for all colleges, with powerful "College Filtering" to allow focused processing within a unified system.
*   **Management by Exception:** Bulk-action interfaces that allow Admins to "Select the Few" rather than "Reject the Many".
*   **Digital Drop-Box:** Frictionless registration for students that acts as a secure data entry point.
*   **Integrated Onboarding:** Auto-generated PDF offers via email for final selections, eliminating manual paperwork.

### Key Differentiators

1.  **Multi-Campus Architecture:** Seamlessly manages concurrent drives at different colleges within a single dashboard, preventing data silos.
2.  **High-Volume Optimization:** Specifically designed for the 10:1 rejection ratio of campus drives unique to the internship market.
3.  **Zero-Touch Onboarding:** Automated Offer Letter generation eliminates the final mile of paperwork.

## Target Users

### Primary Users

**The "Super Admin" (e.g., Priya - Placement Coordinator)**
*   **Role:** The single point of control for the entire recruitment drive. She wears multiple hats: Data Entry Operator, Interviewer, Filterer, and Offer Issuer.
*   **Context:** Manages concurrent drives across colleges. She is overwhelmed by paper handling and data fragmentation. She values **Speed** and **Control** above all else.
*   **Motivation:** Wants to process 1000 students down to 100 offers with minimum clicks and zero errors.
*   **Success Vision:** A unified dashboard where she can switch between colleges, bulk-reject the "noise", and move candidates through the pipeline without switching tools.

### Secondary Users

**The Applicant (e.g., Amit - Final Year Student)**
*   **Role:** Data Contributor.
*   **Context:** Anxious, eager student applying for internships.
*   **Interaction:** Minimal. He just needs a friction-free way to drop his resume into the system and get a confirmation.

### User Journey (The "Super Admin" Flow)

1.  **Discovery:** Priya gets a list of 5 colleges to visit next week.
2.  **Setup:** She logs in and sees the "Unified Dashboard".
3.  **Filtration (The Grind):** She selects "College A". 500 students appear. She inputs the Written Test results (Bulk Actions). 450 are rejected instantly.
4.  **Deep Work:** She interviews the remaining 50. She clicks a name and instantly sees the **Rich Candidate Profile**:
    *   **Clickable Socials:** Direct links to GitHub/LinkedIn (opens in new tab) for rapid verification.
    *   **Embedded Resume:** Full PDF view visible *alongside* the rating form (no downloads required).
    She enters her notes/ratings directly in the modal and toggles "Pass".
5.  **Success:** She filters for "Round 5 Cleared". 10 names appear. She clicks "Generate Offers".
6.  **Closure:** The system emails PDFs to those 10 students. Priya closes the drive for College A and switches to College B.

## Success Metrics

### User Success (The "Smooth" Experience)
*   **Zero-Click Context:** Admin sees Resume, Social Links, and Rating Form immediately upon selecting a candidate (No "Open File" dialogs).
*   **Time-to-Decision:** Admin can review a profile, interview, and submit a "Pass/Fail" decision in under 3 minutes per candidate in rapid-fire rounds.
*   **Process Confidence:** Admin feels 100% improved confidence that "No data was lost" compared to the old paper system.

### Business Objectives
*   **Placement Efficiency:** Process 100% of the hiring drive (including Offer Rollout) within the designated campus visit days.
*   **Data Integrity:** Eliminate "lost answer sheets" or "missing interview notes" by digitizing the entire funnel.

### Key Performance Indicators (KPIs)
1.  **Selection Latency:** Average time taken to process Round 1 results (Target: <30 mins for 500 students).
2.  **Offer Turnaround:** Time from "Round 5 Pass" to "Offer Sent" (Target: <1 minute).
3.  **Application Throughput:** % of registered students successfully processed to a final "Pass/Reject" state (Target: 100%).

## MVP Scope

### Core Features

1.  **Unified "Super Admin" Dashboard:**
    *   Global view of all 5 colleges.
    *   **Analytics Widgets:** Real-time charts showing "Funnel Drop-off Rate" (e.g. 1000 -> 100), "College-wise Performance", and "Gender Diversity" stats.
    *   Global Search: Find any student instantly.

2.  **Round-Specific Logic Engine:**
    *   **Round 1 (Written):** **Binary Mode.** Simple Bulk Pass/Fail controls. (No reviews/ratings).
    *   **Rounds 2 & 3 (Interviews):** **Evaluation Mode.** Reviews + 5-Star Rating + Pass/Fail.
    *   **Round 4 (Assignment):** **Review Mode.** Reviews + Pass/Fail. (No Rating).
    *   **Round 5 (Director):** **Final Mode.** Reviews + 5-Star Rating + Pass/Fail.

3.  **Registration & Profile:**
    *   Public Registration Form (Web).
    *   **Rich Candidate View:** Modal with embedded Resume + Clickable Socials.

4.  **Offer Automation:**
    *   One-click PDF Generation & Email dispatch for Round 5 qualifiers.

### Out of Scope for MVP
*   **Student Dashboard:** Students do not log in to check status; they receive Email updates.
*   **Multi-Role Access Control:** No separate logins for "Interviewers" (Priya manages all data entry).
*   **Mobile App:** Admin interface is optimized for Desktop/Tablet web use only.

### MVP Success Criteria
*   **Metric Accuracy:** Funnel charts accurately reflect real-time count of students at every stage.
*   **Data Completeness:** 100% of Round 2/3/5 records contain valid Ratings & Reviews.
*   **Zero-Loss:** No candidate data is lost during transitions between rounds.

### Future Vision
*   **Alumni Tracking:** Tracking career progression of hired interns 1-2 years later.
*   **AI Resume Screening:** Auto-suggesting "Shortlists" based on resume keywords before Round 1.
