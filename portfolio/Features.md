# System Features

This document provides a detailed breakdown of all user-facing features, their behaviors, and their controlling source files.

---

## 1. Hero Section
- **Location**: `components/hero.html`
- **Styles**: `assets/css/sections.css`, `assets/css/components.css`
- **Behavior**:
  - Displays Karl's primary graduation/portrait photo (`assets/images/gradpic.jpg`) inside `.hero-photo-card` (`z-index: 2`) as the clear visual focal point.
  - Floating PHP syntax-highlighted code snippet card (`.php-snippet-card`, `z-index: 1`) positioned in the upper-left, strictly layered **behind** the photo frame so overlapping edges are naturally masked by the photo frame across all viewports.
  - Hand-drawn tape strip (`.tape-strip`, `z-index: 3`) pinned to the top-center of the photo frame.
  - Floating "Currently Building" card (`.currently-building-card`, `z-index: 5`) attached to the lower-right outside edge of the photo frame, slightly overlapping the frame border while keeping Karl's portrait completely visible across all desktop and mobile viewports.
  - Handwritten Caveat doodle annotations: "Better Code Bigger Dreams" (top-right) and "small steps big progress" (bottom-left).
  - Quick action buttons ("View Projects", "Resume") and metadata chips.

---

## 2. About Me & Snapshot Statistics
- **Location**: `components/about.html`
- **Styles**: `assets/css/sections.css`
- **Behavior**:
  - Details academic standing as a BSIT student at NCST (Class of 2027).
  - Snapshot statistics grid displaying years of coding, academic GPA/status, active projects, and primary frameworks.

---

## 3. Featured Project Showcase: Celestine University of the Pacific (CUP)
- **Location**: `components/work.html`
- **Data Source**: `PORTFOLIO_DATA.featuredProject` in `assets/js/data.js`
- **Styles**: `assets/css/sections.css`
- **Behavior**:
  - Editorial spotlight on the collaborative admissions and university management platform.
  - Highlights core architectural pillars: role-based access control (RBAC), multi-step applicant registration, real-time application tracking, and MySQL relational queries.
  - Interactive "View Deep Dive" button triggers the accessible project details modal.

---

## 4. Project Archive & Filtering
- **Location**: `components/work.html`, `assets/js/projects.js`
- **Data Source**: `PORTFOLIO_DATA.projects` in `assets/js/data.js`
- **Behavior**:
  - Dynamically renders project cards for personal and collaborative projects.
  - Filter bar supports switching between `All`, `Personal Projects`, and `Collaborative Projects`.
  - Each card displays numbered editorial badges, project titles, tech pills, repository links, and an inspector modal trigger.

---

## 5. Accessible Project Details Modal
- **Location**: `components/project-modal.html`, `assets/js/modal.js`
- **Styles**: `assets/css/components.css`
- **Behavior**:
  - Implements WAI-ARIA modal dialog specifications (`role="dialog"`, `aria-modal="true"`).
  - Traps keyboard focus within the dialog when open.
  - Closes on Escape key press, clicking the close button, or clicking the backdrop overlay.
  - Restores keyboard focus to the triggering element upon dismissal.
  - Displays full project screenshots, detailed architectural summaries, key highlights, and GitHub repository links.

---

## 6. GitHub Activity & Live Contribution Matrix
- **Location**: `components/activity.html`, `assets/js/github.js`
- **Styles**: `assets/css/sections.css`
- **Behavior**:
  - Multi-tier resilient data fetcher (`api/contributions.php` → `/.netlify/functions/contributions` → `cache/contributions_lollipop0-0.json`).
  - Fetches real public commit metrics, follower count, and repository languages from the GitHub API.
  - Renders a responsive contribution matrix with stable hover interactions (stroke-based highlights without transform/scale to prevent jitter).
  - Caches API responses in `sessionStorage` for 15 minutes to respect GitHub rate limits.

---

## 7. Technology Stack ("Things I Build With")
- **Location**: `components/stack.html`, `assets/js/app.js` (`renderTechStack`)
- **Data Source**: `PORTFOLIO_DATA.techStack` in `assets/js/data.js`
- **Styles**: `assets/css/sections.css` (`.stack-grid`, `.stack-category-card`)
- **Behavior**:
  - Displays 6 categorized technology cards: `WEB`, `SOFTWARE`, `DATABASE`, `TOOLS`, `UI / UX`, and `AI`.
  - Features AI stack tools: **Gemini** (Google Gemini for code reasoning, planning, architectural review) and **Codex** (AI code generation, agentic development, scaffolding).
  - Symmetrically auto-fits in a single row on desktop (`minmax(160px, 1fr)`) and wraps smoothly on smaller viewports. See [[Tech Stack]].

---

## 8. Development Journey & Currently Figuring Out
- **Location**: `components/journey.html`, `assets/js/app.js` (`renderJourney`, `renderFiguringOut`)
- **Data Source**: `PORTFOLIO_DATA.developmentJourney` & `PORTFOLIO_DATA.figuringOut`
- **Behavior**:
  - Left column: Chronological milestone journey from foundational algorithms (C++) to MVC web apps and full management systems.
  - Right column: Real-time "Currently Figuring Out" exploration cards detailing topics under active study (e.g. MVC routing, database indexing, RBAC, payment lifecycles).

---

## 9. Transparent Contact Form & Direct Email
- **Location**: `components/contact.html`, `assets/js/contact.js`
- **Behavior**:
  - Validates Name, Email, and Message inputs client-side.
  - Submitting constructs a transparent `mailto:` link that opens the visitor's default email client addressed to `tabunda.karlevan@ncst.edu.ph`.
  - Displays an on-screen status card with recipient details and copy options in case browser protocol handlers are blocked.

---

## 10. Global Command Search (Cmd/Ctrl + K)
- **Location**: `components/header.html`, `assets/js/search.js`
- **Behavior**:
  - Global hotkey listener for `Cmd + K` (Mac) or `Ctrl + K` (Windows/Linux) opens a modern spotlight command palette.
  - Searches projects, tech stack skills, learning topics, and section navigation targets with instant live filtering and keyboard arrow selection.

---

## 11. Theme Management (Light & Dark Mode)
- **Location**: `assets/js/theme.js`, `assets/css/variables.css`
- **Behavior**:
  - Supports clean academic editorial light mode and deep slate dark mode.
  - Anti-flash inline script in `index.html` detects `localStorage` or `prefers-color-scheme` before render.
  - Dynamically updates the theme of the GitHub contribution chart without reloading the page.

---

## Cross References
- Architecture: [[Architecture]]
- File Map: [[File Map]]
- Tech Stack Details: [[Tech Stack]]
- Decisions: [[Technical Decisions]]
