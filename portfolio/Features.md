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

## 12. Live Site Visitor & Viewer Counter [Removed]
- **Status**: Completely removed following footer removal. Background heartbeat polling, `api/visitors.php`, `cache/visitors.json`, and client-side `VisitorManager` orchestrator have been eliminated.

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

## 15. Global Navigation & Gear Link
- **Location**: `components/header.html`, `assets/js/navigation.js`, `assets/css/sections.css`, `assets/css/responsive.css`
- **Behavior**:
  - Refined floating island capsule navbar with desktop links: Home, About, Projects, Certificates, and Gear.
  - Active page detection lights up the current page link (including `gear.html`).
  - Mobile drawer navigation includes direct links to all top-level destinations.

---

## 16. Dedicated Gear & Workspace Setup Page (`gear.html`)
- **Location**: `gear.html`, `components/gear-hero.html`, `components/gear.html`
- **Styles**: `assets/css/sections.css`, `assets/css/responsive.css`
- **Behavior**:
  - Showcases Karl Evan Tabunda's daily physical hardware and ergonomic desk setup: **ASUS TUF Gaming A16** laptop, **Lenovo Legion 27"** monitor, **AULA F75** mechanical keyboard (Comic Keycaps Edition), **Attack Shark X11** wireless mouse, **Apple iPhone 13**, **Apple iPhone 11**, and **Soundcore R50i** earbuds.
  - Interactive card grid with technical spec tags, status badges, and hardware descriptions.

---

## 17. Custom SVG Cursor & Radial Click Burst Interaction (marwieang.com inspired)
- **Location**: `assets/css/base.css`, `assets/css/components.css`, `assets/js/app.js` (`initClickBurst`)
- **Styles**: `assets/css/base.css` (`html { cursor: url(...) }`), `assets/css/components.css` (`.click-burst`, `@keyframes click-burst`)
- **Behavior**:
  - **Custom SVG Angled Arrow**: Crisp 24×24px minimal SVG triangle pointer (`path d="M3 3v17l5.2-4.6h7.2z"` with white fill and `#111113` outline) with hotspot at `3 3`, perfectly contrasting across both light and dark backgrounds.
  - **Radial Click Burst**: Spawns 5 radial sparks upon pointerdown at angles `[135°, 180°, 225°, 270°, 315°]` from the exact click coordinate.
  - **Theme Adaptive**: Particles use `var(--primary)`, delivering dark slate sparks in light mode and bright glowing white sparks in dark mode.
  - **Motion-Safe**: Respects `@media (prefers-reduced-motion: reduce)` by disabling spark generation.

---

## 18. Tactile Acoustic UI Sound & Ambient Lo-Fi Music Engine
- **Location**: `assets/js/sound.js`, `components/header.html`, `assets/css/sections.css`, `assets/css/components.css`, `assets/js/app.js`
- **Architecture**: Native Web Audio API (`AudioContext`) real-time synthesis engine modeled after Naphier Node (`naphiernode.vercel.app`) with generative warm ambient lo-fi music synthesis.
- **Zero Assets / Zero Overhead**: Pure oscillator and filter synthesis requiring zero external `.mp3` or `.wav` files, zero extra network requests, and zero decoding lag.
- **Ambient Lo-Fi Background Music**:
  - Continuous 4-chord Neo-Soul progression (Dmaj9 → Bm9 → Gmaj7(#11) → A13sus4) looping seamlessly.
  - Warm polyphonic dual-oscillator chorus (detuned by ±3.5 cents) through a 1050 Hz lowpass filter with slow 700ms attack and 1400ms release crossfading, anchored by deep 170 Hz sub-bass.
  - Smooth fade-in (600ms) on start and fade-out (450ms) on stop.
  - Custom `<audio id="bg-music-audio">` fallback support if an external audio file is provided.
- **Interactive On/Off Controls**:
  - **Desktop Header Button (`#music-toggle-btn`)**: 36px circular capsule button in navbar actions.
    - Active: 3-bar animated jumping equalizer wave (`.music-bars`) pulsing via `@keyframes musicBarWave`.
    - Muted: Crisp musical note icon with diagonal mute slash.
  - **Mobile Drawer Row (`#mobile-music-toggle-btn`)**: Dedicated control row with animated toggle switch (`.mobile-toggle-switch`).
  - **Keyboard Shortcut**: Press `M` anytime (outside input/textarea fields) to toggle sound & music.
  - **Audio Confirmation**: Upbeat ascending chime on turning ON; soft descending pop on turning OFF.
- **Sound Palette (Tactile Feedback)**:
  - **Mechanical Click (`playClick`)**: Lowpass-filtered (1600 Hz) triangle wave frequency ramping from 580 Hz down to 240 Hz over 40ms.
  - **Micro-Tick Hover (`playHover`)**: High-frequency sine wave (2200 Hz to 1400 Hz over 25ms, gain 0.02) with 75ms throttling to prevent flutter during fast mouse movement across links and cards.
  - **Navigation Leap (`playNavigate`)**: Harmonized dual-sine pop (520 Hz / 780 Hz ramping to 650 Hz / 975 Hz over 70ms) triggering on navigation clicks and smooth section scroll jumps.
  - **Harmonic Theme Chime (`playTheme`)**: Rich harmonized dual-sine chime (440 Hz / 660 Hz ramping to 880 Hz / 1320 Hz over 100ms) accompanying the digital matrix rainfall transition.
  - **Modal / Search Open (`playOpen`)**: Ascending sine wave (480 Hz to 880 Hz over 60ms) triggered on modal dialog, quick command palette, and mobile drawer open.
  - **Modal / Search Dismiss (`playClose`)**: Descending sine wave (780 Hz to 420 Hz over 55ms) triggered on modal dialog, quick command palette, and mobile drawer close.
- **Resiliency & Autoplay Compliance**:
  - Defaults to OFF on initial visit for visitor comfort and strict browser autoplay policy compliance.
  - Automatically unlocks the browser's suspended `AudioContext` on first user gesture (`pointerdown`, `keydown`, `touchstart`).
  - Persists user mute/active preference across page reloads and visits via `localStorage.getItem("ket_portfolio_sound")`.

---

## Cross References
- Architecture: [[Architecture]]
- File Map: [[File Map]]
- Tech Stack Details: [[Tech Stack]]
- Decisions: [[Technical Decisions]]


