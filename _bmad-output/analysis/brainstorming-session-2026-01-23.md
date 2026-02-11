---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: []
session_topic: 'Intern Management System (Hiring & Onboarding Focus)'
session_goals: 'Define detailed features and user flows for the Hiring and Onboarding phases.'
selected_approach: 'User-Selected Techniques'
techniques_used: ['Decision Tree Mapping']
ideas_generated: []
context_file: 'c:/Users/Srishti/OneDrive/Documents/Desktop/ims/_bmad/bmm/data/project-context-template.md'
session_active: false
workflow_completed: true
---

# Brainstorming Session Results

**Facilitator:** Wissen
**Date:** 2026-01-23

## Session Overview

**Topic:** Intern Management System (Hiring & Onboarding Focus)
**Goals:** Define detailed features and user flows for the Hiring and Onboarding phases.

### Context Guidance

_The session will leverage the project context to explore User Problems (e.g., streamlined applications), Feature Ideas (e.g., resume parsing, portal access), and Process Flows (e.g., interview scheduling, document submission)._

### Session Setup

We are focusing specifically on the initial stages of the intern lifecycle. This "Hiring to Onboarding" scope allows us to dive deep into the candidate experience and administrative efficiency before looking at long-term management._

## Technique: Decision Tree Mapping (Selections)

**Interactive Focus:** Mapping the sequential logic of the 5-round selection process.

**Key Concepts Captured:**

1.  **Login & Registration Handshake:**
    *   **Student Side:** "Digital Drop-Box" model. Register -> Success Message -> Home. (No immediate dashboard). Data stored in DB.
    *   **Admin Side:** "Registered Students List" populates immediately.

2.  **Selection Logic (The "Pass/Fail" Funnel):**
    *   **Rounds:** 5 sequential rounds.
    *   **Round 1 (Offline Written Test):** Results entered manually by Admin.
    *   **Rounds 2 & 3 (Interviews):**
        *   **Context:** Admin/Interviewer needs deep context.
        *   **Features:**
            *   **Resume View:** Embedded or easily accessible Resume.
            *   **Feedback:** Text area for "Interviewer Reviews/Notes".
            *   **Rating:** 5-Star Rating System.
            *   **Decision:** Manual Pass/Fail toggle.
    *   **Round 4 (Assignment - Offline):**
        *   **Input:** Admin enters Text Reviews + Pass/Fail.
    *   **Round 5 (Director Interview):**
        *   **Input:** Admin enters Text Reviews + 5-Star Rating + Pass/Fail.
        *   **Critical Event:** "Pass" action here triggers move to **"Selected Students List"**.

4.  **Onboarding Phase (Post-Selection):**
    *   **Offer Letter Automation:**
        *   **Trigger:** Admin clicks "Send Offer Letter" on a selected student.
        *   **Mechanism:** System takes a standard Template (provided by Admin) and Autofills placeholders (Name, etc.) from DB.
        *   **Output:** Generates/Sends the personalized Offer Letter.
    *   **Scope Boundary:** The current system scope ENDS here (Step: Offer Letter Sent).

5.  **General Features:**
## Idea Organization and Prioritization

**Thematic Organization:**

**Theme 1: The "Digital Drop-Box" (Registration)**
*   **Focus:** Streamlined entry point for candidates.
*   **Key Concepts:**
    *   Simple Registration Form (Data -> DB).
    *   Instant Feedback (Success Message).
    *   No immediate "Student Dashboard" complexity -> Reduces dev scope.
    *   **Value:** Low barrier to entry, immediate data capture for Admin.

**Theme 2: The "Management by Exception" Funnel (Selection)**
*   **Focus:** Efficient handling of high-volume applications through 5 offline/online rounds.
*   **Key Concepts:**
    *   **Bulk Actions:** "Select All -> Deselect Fails" pattern for Round 1 (Written).
    *   **Deep Evaluation:** Richer data (Reviews + Ratings) for Rounds 2-5 (Interviews/Director).
    *   **Unified Rejected List:** Centralized view for all dropped candidates keeps active lists clean.
    *   **Visual Stepper:** 5-Point Green/Red visualization for instant status recognition.

**Theme 3: Automated Onboarding (Offer Phase)**
*   **Focus:** Eliminating manual HR paperwork.
*   **Key Concepts:**
    *   **Template Engine:** Admin provides Offer Template.
    *   **Autofill:** System injects Student Data.
    *   "Pass" Round 5 -> **"Send Offer"** workflow.
    *   **Mechanism:**
        *   System takes a standard Template (provided by Admin).
        *   **Autofill:** Injects Student Data (Name, etc.).
        *   **PDF Generation:** Converts the filled template into a secure PDF.
        *   **Delivery:** Automatically emails the PDF to the student's registered email address.

**Prioritization Results:**

-   **Top Priority (Core MVP):**
    1.  Registration Module (Data Entry).
    2.  Admin Dashboard (Registered List View).
    3.  Round 1 Bulk Selection Logic (The Gatekeeper).
    4.  Offer Letter Generation (PDF via Email).

-   **Quick Wins:**
    1.  Global Search Bar (High value, standard implementation).
    2.  Unified Rejected List (Simplifies DB queries).

**Action Planning:**

1.  **Next Step:** Create Product Brief / PRD.
2.  **Technical Proof-of-Concept:** Test "Offer Letter PDF Generation" library/approach.
3.  **UI Design:** Mockup the "Student Detail Modal" with the 5-point progress stepper.

## Session Summary and Insights

**Key Achievements:**
-   Mapped the entire "Hire-to-Offer" lifecycle in under 60 minutes.
-   Defined a consistent data model for diverse round types (Written vs. Interview).
-   Identified key efficiency mechanisms (Bulks Actions, Auto-fill) that will define the Admin experience.

**Session Reflections:**
The shift from "Offline Written Test" to "Digital Management" was a key constraint that led to the efficient "Bulk Entry" design. The decision to stop at "Offer Sent" gives us a very clear, shippable MVP scope.

    *   **Efficiency Mechanism:** "Management by Exception". Admin can Bulk Select All -> Deselect Fails -> Submit.
    *   **State Transition:**
        *   **Pass:** Moves to "Round 2 List".
        *   **Fail:** Stamped as "Rejected" and moves to Centralized Rejected List.

3.  **UI Visualization Requirements:**
    *   **Unified Rejected View:** Single list for all rejected students, regardless of rejection round.
    *   **Student Detailed View:** Modal/Page showing full profile (Name, Roll No, College, Resume).
    *   **Progress Stepper:** A prominent visual element showing 5 dots/points.
        *   **Green:** Cleared Round.
        *   **Red:** Rejected at this Round.
        *   *(Implicit):* Grey/Inactive for future rounds.

