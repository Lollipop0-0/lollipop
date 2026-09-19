# System Features

This document provides a detailed breakdown of all user-facing features, their behaviors, and their controlling source files.

---

## 1. Hero Section (Entry Point)
- **Location**: `components/hero.html`
- **Styles**: `assets/css/sections.css`, `assets/css/components.css`, `assets/css/responsive.css`
- **Behavior**:
  - Direct, honest introduction designed around: **WHO I AM → WHAT I BUILD → LET THE VISITOR EXPLORE**.
  - Status pill: "IT STUDENT".
  - Large headline: "Karl Evan Tabunda".
  - Core introduction: "IT student who enjoys building software and figuring out how things work."
  - Supporting sentence: "I'm more into the backend side of things, but I also like exploring web development and generative AI."
  - Primary button: "View My Work →" pointing to `#selected-work`.
  - Secondary quick links: GitHub • LinkedIn • Contact.
  - Preserves visual identity: portrait photo frame (`.hero-photo-card`), taped PHP code card behind the photo, and handwritten annotations.
  - Stripped of resume pills ("BS Information Technology", "Philippines"), moving all detailed academic metadata to `/about.html`.

---

## 2. Dedicated About Page (`about.html`)
- **Location**: `about.html`, `components/about-page-hero.html`
- **Styles**: `assets/css/sections.css`, `assets/css/responsive.css`
- **Behavior**:
  - Full personal narrative detailing how Karl builds software, experiments with backend systems, and explores generative AI.
  - Organized secondary metadata cards:
    - **Education**: BS Information Technology, National College of Science and Technology (NCST), Expected Graduation: 2028.
    - **Focus**: Backend Development, Software Development, Web Development, UI/UX, Generative AI.
    - **Currently Learning**: Java, PHP / MVC, JavaScript, Database Design, Git / GitHub.
    - **Interests**: Building practical systems, Backend development, Database-driven applications, Exploring new technologies.
  - Hosts full chronological Development Journey, Tech Stack, and Verified Certificates gallery (ending cleanly at the gallery before the footer, with the primary contact form residing on the homepage).

---

## 3. Section 01: Selected Work
- **Location**: `components/selected-work.html`, `assets/js/app.js` (`renderSelectedProjects`)
- **Styles**: `assets/css/sections.css`, `assets/css/responsive.css`
- **Behavior**:
  - Curated 4 compact project cards:
    1. `01` Celestine University of the Pacific (CUP)
    2. `02` Inventory Management System
    3. `06` SmartSpace Room Planning
    4. `04` UI SneakerHub
  - Compact format: preview image, title, one-line summary, tech pills, and "View Case Study →" trigger invoking `ModalManager`.
  - Closing CTA: "View all work →" linking to GitHub repositories.

---

## 4. Section 02: Currently Building
- **Location**: `components/currently-building-section.html`
- **Styles**: `assets/css/sections.css`, `assets/css/responsive.css`
- **Behavior**:
  - Small, focused section featuring Karl's current mindset: *"These days, I'm just building whatever catches my interest, learning new stuff along the way, and turning random ideas into actual projects."*
  - Compact active visual card for Celestine University of the Pacific with live pulsing indicator, case study trigger, and repository link.

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

## 13. Certificates & Verified Credentials
- **Location**: `components/certificates.html`, `assets/js/app.js` (`renderCertificates`)
- **Data Source**: `PORTFOLIO_DATA.certificates` in `assets/js/data.js`
- **Modal Inspector**: `assets/js/modal.js` (`ModalManager.openCertificate`)
- **Styles**: `assets/css/sections.css` (`.certificates-section`, `.certificates-grid`, `.certificate-card`), `assets/css/components.css` (`.modal-cert-preview-frame`), `assets/css/responsive.css`
- **Behavior**:
  - Displays Karl's verified Sololearn coursework credentials:
    1. **Introduction to C++** (ID: `CC-KDC4AZEG`, Issued 18 March, 2025)
    2. **Introduction to HTML** (ID: `CC-NHB7RE2H`, Issued 20 February, 2025)
    3. **Introduction to CSS** (ID: `CC-T8NGLTB4`, Issued 17 March, 2025)
    4. **Introduction to JavaScript** (ID: `CC-C8KJA5GY`, Issued 17 May, 2025)
  - Seamlessly positioned between the `#stack` and `#journey` sections in `ComponentLoader`.
  - Displays high-resolution certificate previews with completion badges, Sololearn verification badges, issuance dates, official credential IDs, and tested skills tags.
  - Interactive click or keyboard `Enter`/`Space` triggers the accessible WAI-ARIA modal dialog, providing a full preview frame, complete credential metadata, and external view/download options.
  - Integrated into global command search (`Ctrl+K`) for instantaneous discovery.
  - **Responsive Sizing**:
    - **Desktop (≥ 869px)**: 4-column balanced grid (`repeat(4, 1fr)`).
    - **Tablet (601px–868px)**: 2-column grid (`repeat(2, 1fr)`).
    - **Mobile (≤ 600px)**: 1-column stacked cards (`1fr`).

---

## 14. HTTP Error Handling & Private Repository States
- **Location**: `assets/js/error-state.js`, `404.html`, `.htaccess`, `assets/js/modal.js`, `assets/js/projects.js`, `assets/js/github.js`, `assets/js/contact.js`, `assets/js/components.js`
- **Styles**: `assets/css/components.css` (`.error-state-card`, `.selected-repo-status`, `.error-page-section`)
- **Behavior**:
  - Unified handling for 4xx client errors (400, 401, 403, 404, 429), 5xx server errors (500, 502, 503, 504), and network failures (0).
  - **Strict Repository Status Logic**:
    - **Private Repository** (`403` or verified metadata): Shows `[ 🔒 Private Repository ]` with lock icon and note: *"Private Repository: This repository isn't publicly accessible."*
    - **Repository Unavailable** (`404` without private confirmation): Shows `[ Repository Unavailable ]` with note: *"Repository Not Found: This project may have been moved, renamed, or is not publicly available."*
    - **Rate Limited** (`429`): Shows rate-limited notification.
    - Project cards are strictly kept visible in the portfolio even when repositories are private or unavailable.
  - **GitHub Recent Activity Resiliency**: If GitHub contribution fetching fails, only the matrix is replaced by a styled error card with an interactive "Retry" button. Profile badge, activity feed, and languages breakdown remain 100% intact.
  - **API Safety**: FormSubmit contact inquiries inspect HTTP response status and provide a direct mailto fallback on failure.
  - **Dedicated 404 Error Route**: `404.html` with `.htaccess` fallback provides an editorial, dark/light theme compatible error view with a "Back Home" CTA.

---

## Cross References
- Architecture: [[Architecture]]
- File Map: [[File Map]]
- Tech Stack Details: [[Tech Stack]]
- Decisions: [[Technical Decisions]]

