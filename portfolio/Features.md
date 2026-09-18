# System Features

This document provides a detailed breakdown of all user-facing features, their behaviors, and their controlling source files.

---

## 1. Hero Section
- **Location**: `components/hero.html`
- **Styles**: `assets/css/sections.css`, `assets/css/components.css`, `assets/css/responsive.css`
- **Behavior**:
  - Displays Karl's primary graduation/portrait photo (`assets/images/gradpic.jpg`) inside `.hero-photo-card` (`z-index: 2`) as the clear visual focal point.
  - Floating PHP syntax-highlighted code snippet card (`.php-snippet-card`, `z-index: 1`) positioned in the upper-left, strictly layered **behind** the photo frame so overlapping edges are naturally masked by the photo frame across all viewports.
  - Hand-drawn tape strip (`.tape-strip`, `z-index: 3`) pinned to the top-center of the photo frame.
  - Floating "Currently Building" card (`.currently-building-card`, `z-index: 5`) attached to the lower-right outside edge of the photo frame, slightly overlapping the frame border while keeping Karl's portrait completely visible across all desktop and mobile viewports.
  - Handwritten Caveat doodle annotations: "Better Code Bigger Dreams" (top-right) and "small steps big progress" (bottom-left).
  - Quick action buttons ("View Projects" primary CTA, circular GitHub, LinkedIn, Facebook, and Email channels; Resume CTA is cleanly anchored in the sticky navigation bar and mobile drawer).
  - **Responsive Layout**:
    - **Desktop (≥ 869px)**: 2-column layout (`1.15fr 0.95fr`).
    - **Tablet (601px–868px, e.g. 768px iPad Mini)**: Maintains an ergonomic 2-column side-by-side layout (`1.15fr 0.85fr`) with the profile cluster squeezed proportionally (`width: 215px; height: 270px;` photo frame, `bottom: -18px; right: -22px;` Currently Building card, both doodles visible) so intro copy and visual identity sit side-by-side without vertical displacement or awkward empty spaces.
    - **Mobile (≤ 600px)**: Collapses cleanly into a single vertical column (`1fr`) with the photo centered below intro text and Currently Building card below the frame.

---

## 2. About Me & Snapshot Statistics
- **Location**: `components/about.html`
- **Styles**: `assets/css/sections.css`, `assets/css/responsive.css`
- **Behavior**:
  - Details academic standing as a BSIT student at NCST (Class of 2027).
  - Snapshot statistics grid displaying years of coding, academic GPA/status, active projects, and primary frameworks.
  - **Responsive Sizing**: Renders side-by-side on desktop (`1fr 1.65fr`) and tablet (`1fr 1.45fr`), placing "About Me" bio text on the left and an ergonomic 2×2 metric grid (`repeat(2, 1fr)`) on the right. Collapses to a single column (`1fr`) on mobile devices (≤600px).

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
- **Styles**: `assets/css/sections.css`, `assets/css/responsive.css`
- **Behavior**:
  - Dynamically renders project cards for personal and collaborative projects.
  - Filter bar supports switching between `All`, `Personal Projects`, and `Collaborative Projects`.
  - Each card displays numbered editorial badges, project titles, tech pills, repository links, and an inspector modal trigger.
  - **Responsive Sizing**: Renders in 3 columns on desktop, adapts to 2 balanced columns (`repeat(2, 1fr)`) on tablets (601px–868px) to prevent card stretching, and collapses to 1 column (`1fr`) on mobile screens (≤600px).

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
- **Responsive Layout**:
  - **Desktop & Tablet (`> 600px`, e.g. iPad Mini 768px, iPad Pro 1032px)**: Preserves side-by-side 2-column layout (`1.08fr 0.92fr` on tablet, `1.4fr 1fr` on desktop) with top alignment (`align-items: start;`). Left column displays the vertical milestones (01 to 09); right column displays the "Currently Figuring Things Out" card with single-line header typography.
  - **Mobile (`≤ 600px`)**: Neatly stacks into a single column (`grid-template-columns: 1fr; gap: 24px;`), milestones first followed by the figuring-out card.
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

## 12. Live Site Visitor & Viewer Counter
- **Location**: `components/footer.html`, `assets/js/visitors.js`
- **Backend / Cache**: `api/visitors.php`, `cache/visitors.json`
- **Styles**: `assets/css/sections.css` (`.footer-visitor-pill`)
- **Behavior**:
  - Multi-tier resilient architecture:
    1. **Tier 1 (Local PHP on XAMPP)**: Calls `api/visitors.php` with atomic file locking (`flock`) on `cache/visitors.json` and 30-minute session cooldown cookies to prevent rapid refresh spam.
    2. **Tier 2 (Static Fallback on Netlify/CDN)**: Evaluates a public counter API (`api.counterapi.dev`) with strict 2.5s `AbortController` timeout and content-type validation; does not assume availability.
    3. **Tier 3 (Offline / LocalStorage Cache)**: If both endpoints are unreachable or invalid, immediately falls back to `localStorage` and a seed value (`248`), guaranteeing the counter never errors or displays "NaN".
  - **Display**: Exclusively placed in the global **Footer** brand colophon as a sleek, editorial pill (`● 👁 248 site views`) with a live pulsating status dot (`.status-dot-active`), leaving the Hero section clean and focused.
  - Features smooth cubic ease-out numeric animation on page load.

---

## Cross References
- Architecture: [[Architecture]]
- File Map: [[File Map]]
- Tech Stack Details: [[Tech Stack]]
- Decisions: [[Technical Decisions]]
