# Completed Tasks

This changelog records completed features, refinements, fixes, and synchronizations.

## 2026-09-19: Remove Contact Section from About Page & Route Contact Nav Links to Homepage
- **Objective**: Remove the contact section (`components/contact.html`) from the dedicated About page (`about.html`), letting the page transition cleanly from the Verified Certificates gallery to the colophon footer. Route the header navigation Contact links (`components/header.html`) to `index.html#contact` so clicking Contact from `about.html` navigates directly to the contact form on the homepage.
- **Changes**:
  - `assets/js/components.js`: Removed `contact` component from `ABOUT_MANIFEST`. `HOMEPAGE_MANIFEST` retains `contact` as section 05 (`components/contact.html`).
  - `components/header.html`: Updated desktop nav link and mobile nav link `href` from `#contact` to `index.html#contact`.
  - `assets/js/navigation.js`: Refined anchor click event listener so elements existing in the current DOM (e.g., `#contact` on the homepage) smooth-scroll immediately without reloading, while cross-page anchors (e.g., `#contact` from `about.html`) cleanly navigate to the destination page.
  - Verification: All JS modules validated with `node -c`, HTTP 200 response on both pages, zero console errors.

---

## 2026-09-19: Selected Work Project Update (Excluding CUP) & Complete 01–05 Homepage Flow
- **Objective**: Ensure Celestine University of the Pacific appears ONLY in `01 — Currently Building` (labeled with System Integration Architecture subject context), and update `02 — Selected Work` to showcase strictly the requested projects (SmartSpace, Hotel Management System, Inventory Management System, Library Management System, UI-SneakerHub) with both direct GitHub repo links and case study triggers. Ensure complete 01–05 sequence across the homepage.
- **Sequence Synchronized**:
  - `Hero`
  - `01 — Currently Building`: Celestine University of the Pacific (System Integration Architecture · Collaborative Project)
  - `02 — Selected Work`: SmartSpace, Hotel Management System, Inventory Management System, Library Management System, UI-SneakerHub
  - `03 — GitHub Activity`: Original Code Activity matrix, feed, and languages breakdown
  - `04 — About Me`: Teaser preview with link to `about.html`
  - `05 — Get in Touch`: Original Message / Contact section and form
  - `Footer`: Refined cohesive bar with visitor telemetry and back to top
- **Files Modified**:
  - `assets/js/app.js`: Updated `renderSelectedProjects()` to select `06`, `05`, `02`, `03`, `04` and exclude CUP.
  - `components/currently-building-section.html`: Updated label to "System Integration Architecture · Collaborative Project" and "Enrollment & Admissions Management System".
  - `components/activity.html`: Added `03` kicker badge.
  - `components/about-preview.html`: Added `04` kicker badge and updated heading to "About Me".
  - `components/contact.html`: Added `05` kicker badge.
  - `assets/css/sections.css`: Added `.selected-project-actions` and `.selected-repo-link`.

---

## 2026-09-19: Homepage Section Re-sequencing & Restoration of Original GitHub Activity and Contact Form
- **Objective**: Re-sequence the homepage so `01 — Currently Building` precedes `02 — Selected Work`, and restore the exact original `Code Activity` (with full activity feed and top languages breakdown) and `Message / Get in Touch` section (with original layout, form, error states, and actions) while preserving the new Home and About page designs.
- **Sequence Applied**:
  - `Hero` (`components/hero.html` with primary button pointing to `#currently-building`)
  - `01 — Currently Building` (`components/currently-building-section.html`, kicker `01`)
  - `02 — Selected Work` (`components/selected-work.html`, kicker `02`)
  - `Original GitHub Recent Activity` (`components/activity.html`, `#github-activity-feed`, `#github-languages-list`, `#github-matrix-container`)
  - `About Preview` (`components/about-preview.html`)
  - `Original Message / Get in Touch` (`components/contact.html`, `#contact-form`, `#contact-status`, verified contact channels)
  - `Footer` (`components/footer.html`)
- **Files Modified**:
  - `assets/js/components.js`: Updated `HOMEPAGE_MANIFEST` and `ABOUT_MANIFEST` to mount `activity.html` and `contact.html`.
  - `components/currently-building-section.html`: Renumbered kicker to `01`.
  - `components/selected-work.html`: Renumbered kicker to `02`.
  - `components/hero.html`: Primary CTA points to `#currently-building`.
  - `components/about-preview.html`: Removed orphaned kicker badge.

---

## 2026-09-19: Homepage Direct & Minimal Redesign — Entry Point Architecture (WHO I AM → WHAT I BUILD → LET THE VISITOR EXPLORE)
- **Objective**: Redesign the homepage of the portfolio to be direct, minimal, and personal, stripping out resume-like information overload (Education, Focus, Currently Learning, Interests) and relocating detailed personal and academic background to a dedicated About page (`about.html`).
- **Changes**:
  - Re-anchored Hero section copy to Karl's authentic student voice: status badge "IT STUDENT", headline "Karl Evan Tabunda", core introduction ("IT student who enjoys building software and figuring out how things work."), supporting sentence ("I'm more into the backend side of things, but I also like exploring web development and generative AI."), primary button "View My Work →", and clean secondary links ("GitHub • LinkedIn • Contact"). Removed mini-resume chips ("BS Information Technology", "Philippines").
  - Streamlined Homepage sequence:
    - `01 — SELECTED WORK`: 4 compact project cards (CUP, Inventory Management, SmartSpace, UI SneakerHub) with image, title, one-line summary, tech pills, and modal trigger "View Case Study →", followed by "View all work →".
    - `02 — CURRENTLY BUILDING`: Compact active project card for Celestine University of the Pacific with personal focus statement: *"These days, I'm just building whatever catches my interest, learning new stuff along the way, and turning random ideas into actual projects."*
    - `03 — GITHUB ACTIVITY`: Compact live contribution matrix calendar preview with "View activity →" linking to GitHub.
    - `04 — A LITTLE ABOUT ME`: 2-sentence teaser narrative with "More about me →" button linking directly to `about.html`.
    - `CONTACT CTA`: Clean, high-impact prompt ("Let's build something together.") with direct NCST mailto action and social links.
    - `FOOTER`: Two-tier balanced footer with site view counter.
  - Created dedicated About page (`about.html` & `components/about-page-hero.html`) containing the full narrative, background cards (Education: BS IT at NCST, Exp. Grad 2028; Focus; Currently Learning; Interests), Development Journey timeline, Tech Stack breakdown, Verified Certificates gallery, Contact prompt, and Footer.
  - Upgraded `ComponentLoader` in `assets/js/components.js` with `HOMEPAGE_MANIFEST` and `ABOUT_MANIFEST`, dynamically detecting `data-page="about"` on `#app` or `about.html` pathname.
  - Extended `assets/js/app.js` with `renderSelectedProjects()`, updated `assets/js/navigation.js` to highlight active links across both pages and smoothly route cross-page anchors, and made `assets/js/search.js` route search results smoothly across `index.html` and `about.html`.
  - Added responsive rules for tablet and mobile in `assets/css/responsive.css` and section styling in `assets/css/sections.css`.
- **Files Modified/Created**:
  - Created: `about.html`, `components/selected-work.html`, `components/currently-building-section.html`, `components/activity-preview.html`, `components/about-preview.html`, `components/contact-cta.html`, `components/about-page-hero.html`.
  - Modified: `components/hero.html`, `components/header.html`, `assets/js/components.js`, `assets/js/app.js`, `assets/js/navigation.js`, `assets/js/search.js`, `assets/css/sections.css`, `assets/css/responsive.css`.

---

## 2026-09-19: Verified Course Certificates Integration (Sololearn Credentials)
- **Objective**: Integrate Karl Evan Tabunda's 4 Sololearn coursework certificates into the portfolio system with a dedicated modular section, data-driven architecture, accessible modal inspection, responsive grid styling, and command search integration.
- **Certificates Added**:
  1. **Introduction to C++** (ID: `CC-KDC4AZEG`, Issued 18 March, 2025)
  2. **Introduction to HTML** (ID: `CC-NHB7RE2H`, Issued 20 February, 2025)
  3. **Introduction to CSS** (ID: `CC-T8NGLTB4`, Issued 17 March, 2025)
  4. **Introduction to JavaScript** (ID: `CC-C8KJA5GY`, Issued 17 May, 2025)
- **Changes**:
  - Verified and stored image assets in `assets/images/certificates/` (`cert-javascript.png`, `cert-html.png`, `cert-css.png`, `cert-cpp.png`).
  - Added structured `certificates` dataset to `PORTFOLIO_DATA` in `assets/js/data.js` including title, issuer, issue date, credential ID, skills, and course summary.
  - Created modular component `components/certificates.html` with section header, eyebrow, verified count badge ("4 Verified"), and dynamic `#certificates-grid`.
  - Registered `certificates` in `COMPONENT_MANIFEST` in `assets/js/components.js` positioned between `#stack` and `#journey`.
  - Added "Certificates" navigation item to desktop header and mobile drawer in `components/header.html`.
  - Implemented `renderCertificates()` in `assets/js/app.js` generating interactive cards with hover zoom preview, verified badge, title, skills pills, credential ID, and inspection action.
  - Extended `ModalManager` in `assets/js/modal.js` with `openCertificate()` and `renderCertificateContent()` supporting WAI-ARIA focus trap, backdrop dismiss, Escape key dismiss, and direct image viewing/downloading.
  - Indexed the Certificates section and all 4 credentials in `assets/js/search.js` (`Ctrl+K` command search).
  - Styled certificates section in `assets/css/sections.css`, modal frame in `assets/css/components.css`, and responsive grid rules (4-col desktop, 2-col tablet, 1-col mobile) in `assets/css/responsive.css`.
  - Synchronized `portfolio/Features.md` (Section 13), `portfolio/File Map.md`, `portfolio/Technical Decisions.md` (Decision 10), `portfolio/Completed Tasks.md`, and `portfolio/Current Task.md`.
- **Files Modified/Created**:
  - Created: `components/certificates.html`.
  - Modified: `assets/js/data.js`, `assets/js/components.js`, `components/header.html`, `assets/js/app.js`, `assets/js/modal.js`, `assets/js/search.js`, `assets/css/sections.css`, `assets/css/components.css`, `assets/css/responsive.css`, `portfolio/Features.md`, `portfolio/File Map.md`, `portfolio/Technical Decisions.md`.

---

## 2026-09-19: Tablet Viewport Optimization — Side-by-Side Development Journey Layout
- **Objective**: Adjust the Development Journey section on tablet viewports (e.g. iPad Mini 768×1024) to match the 2-column side-by-side aesthetic of the desktop / iPad Pro 13 view, eliminating excessive vertical stacking while strictly retaining 1-column mobile stacking (`≤ 600px`).
- **Changes**:
  - Updated `.journey-layout-grid` in `assets/css/responsive.css` under `@media (max-width: 868px)` to `grid-template-columns: 1.08fr 0.92fr; gap: 20px; align-items: start;`.
  - Tuned `.figuring-out-card` on tablet with `padding: 20px 16px;`, tightened header gap to `8px`, and adjusted `.figuring-card-header h3` to `font-size: 0.975rem; letter-spacing: -0.01em;` so "Currently Figuring Things Out" sits on a single clean line.
  - Added explicit mobile override under `@media (max-width: 600px)` for `.journey-layout-grid` (`grid-template-columns: 1fr; gap: 24px;`) and `.figuring-out-card` (`padding: 20px;`), guaranteeing phone screens maintain clean vertical stacking.
  - Verified live at 768×1024 (iPad Mini) using headless Chrome, confirming side-by-side alignment with top-aligned cards and zero overflow.
  - Synchronized `portfolio/Features.md`, `portfolio/Technical Decisions.md`, `portfolio/Completed Tasks.md`, and `portfolio/Current Task.md`.
- **Files Modified**: `assets/css/responsive.css`, `portfolio/Features.md`, `portfolio/Technical Decisions.md`.

---

## 2026-09-19: Live Site Visitor & Viewer Counter System Implementation (Option 1 — Footer Badge Only)
- **Objective**: Implement a resilient, privacy-friendly site visitor and viewer counter system strictly in the global footer colophon (Option 1: `● 👁 248 site views`) with a 3-tier fallback pipeline (local PHP -> non-guaranteed CounterAPI with 2.5s timeout -> `localStorage` seed fallback) and smooth cubic animation, keeping the Hero section clean.
- **Changes**:
  - Created `api/visitors.php` to handle view counting with atomic file locking (`flock`), session cooldown cookies (`ke_portfolio_sess`) to throttle reload spam, and atomic updates to `cache/visitors.json`.
  - Created `cache/visitors.json` initialized with seed counts.
  - Created `assets/js/visitors.js` implementing `VisitorManager` with a verified 3-tier fallback pipeline (`api/visitors.php` -> non-guaranteed `api.counterapi.dev` with 2.5s `AbortController` timeout -> `localStorage` seed fallback of `248 site views`) and smooth cubic ease-out animation.
  - Added `.footer-visitor-pill` exclusively to `components/footer.html` (brand colophon) with pulsating status dot (`.status-dot-active`), eye vector icon, and formatted live count. Kept `components/hero.html` free of counter chips.
  - Mounted `VisitorManager.init()` in `assets/js/app.js` and included `assets/js/visitors.js` in `index.html`.
  - Styled `.footer-visitor-pill` in `assets/css/sections.css` using theme variables and responsive alignments.
  - Cleaned stray string from JSON-LD schema in `index.html`.
  - Synchronized `portfolio/Features.md`, `portfolio/Technical Decisions.md`, `portfolio/File Map.md`, and `portfolio/Current Task.md`.
- **Files Modified/Created**:
  - Created: `api/visitors.php`, `cache/visitors.json`, `assets/js/visitors.js`.
  - Modified: `components/footer.html`, `assets/css/sections.css`, `assets/js/app.js`, `index.html`, `portfolio/Features.md`, `portfolio/Technical Decisions.md`, `portfolio/File Map.md`.

---

## 2026-09-19: Streamline Hero Actions — Removed Hero Resume Button, Preserved Navbar Resume
- **Objective**: Remove the secondary "Resume" button from the Hero section (`components/hero.html`) to eliminate redundant button wrapping, while strictly keeping the primary "Resume" button in the sticky desktop navigation bar and mobile drawer.
- **Changes**:
  - Removed `<a href="assets/documents/Karl-Evan-Tabunda-Resume.pdf" class="btn btn-secondary">...<span>Resume</span></a>` from `.hero-actions` in `components/hero.html`.
  - Confirmed `View Projects ->` and all 4 circular social channels (GitHub, LinkedIn, Facebook, Email) now align seamlessly on a single, balanced row across desktop and tablet viewports.
  - Verified that the sticky navigation bar's `.nav-resume-btn` and mobile drawer's "Download Resume" remain intact and fully functional.
  - Synchronized `portfolio/Features.md`, `portfolio/Completed Tasks.md`, and `portfolio/Current Task.md`.
- **Files Modified**: `components/hero.html`, `portfolio/Features.md`.

---

## 2026-09-19: Complete Removal of Contact Section Polaroid Photo Sticker Component & Asset
- **Objective**: Completely delete the casual polaroid sticker photo card component, handwritten note ("Let's build something!"), associated CSS rules, and image asset (`assets/images/profile-sticker.jpg`) across the entire system.
- **Changes**:
  - Removed `<div class="contact-polaroid-wrap">...</div>` (including taped polaroid frame, sticker image, and handwritten annotation) from `components/contact.html`.
  - Removed `.contact-polaroid-wrap`, `.contact-polaroid-card`, `.contact-polaroid-img`, and `.contact-polaroid-note` from `assets/css/sections.css`.
  - Removed responsive `.contact-polaroid-wrap` and `.contact-polaroid-note` rules from `assets/css/responsive.css`.
  - Deleted image asset file `assets/images/profile-sticker.jpg`.
  - Cleaned directory tree and photo placement instructions in `README.md`.
  - Synchronized `portfolio/File Map.md` and `portfolio/Current Task.md`.
- **Files Modified/Deleted**:
  - Deleted: `assets/images/profile-sticker.jpg`.
  - Modified: `components/contact.html`, `assets/css/sections.css`, `assets/css/responsive.css`, `README.md`, `portfolio/File Map.md`.

---

## 2026-09-19: Tablet Squeezed Profile & Side-by-Side Hero Layout
- **Objective**: Squeeze and integrate Karl's hero profile component into a side-by-side 2-column layout on tablet viewports (601px–868px, matching iPad Mini 768px test environment), exactly replicating the compact aesthetic of wide tablet / desktop screens (e.g. Surface Pro 10) instead of dropping the photo below the text in a single column.
- **Changes**:
  - Configured `.hero-grid` in `assets/css/responsive.css` under `@media (max-width: 868px)` with `grid-template-columns: 1.15fr 0.85fr; gap: 20px; align-items: center;`.
  - Scaled and squeezed profile dimensions on tablet: `.hero-photo-card` to `215px × 270px`, `.hero-photo-img` to `height: 242px;`, `.php-snippet-card` to `left: -16px; top: -4px; font-size: 0.64rem;`, and `.currently-building-card` to `right: -22px; bottom: -18px; max-width: 195px;`.
  - Displayed both handwritten annotations ("Better Code Bigger Dreams" top right, "small steps big progress" bottom left) gracefully positioned inside the tablet column.
  - Set `.about-header-row` on tablet to `grid-template-columns: 1fr 1.45fr; gap: 20px; align-items: center;` to maintain side-by-side harmony with the hero section.
  - Confirmed mobile screens (`@media (max-width: 600px)`) strictly retain their 1-column stacked flow with centered photo and full vertical clearance.
  - Captured live rendered output directly from the running local Apache environment at `768x1024` (iPad Mini) and `375x812` (mobile), visually verifying the side-by-side hero layout, squeezed profile cards, and clean zero-overflow alignment.
- **Files Modified**: `assets/css/responsive.css`.

---

## 2026-09-19: Tablet Responsive Layout Optimization & Live System Visualization
- **Objective**: Optimize portfolio layouts specifically for tablet viewports (601px–868px) to eliminate card stretching and excessive vertical scrolling, leaving mobile screens (≤600px) untouched, and capture visualized output directly from the user's running system.
- **Changes**:
  - Updated `.snapshot-grid` in `assets/css/responsive.css` under `@media (max-width: 868px)` to `repeat(2, 1fr)` with `gap: 12px` to render an ergonomic 2×2 metric grid on tablets.
  - Updated `.projects-grid` in `assets/css/responsive.css` under `@media (max-width: 868px)` to `repeat(2, 1fr)` with `gap: 18px` to present archive cards in 2 balanced columns instead of stretching 1 card across 768px+.
  - Added `@media (max-width: 600px)` breakpoint explicitly preserving single-column (`1fr`) stacking for mobile devices for both `.snapshot-grid` and `.projects-grid`.
  - Captured live rendered output directly from the user's running system via headless Chrome at 768px tablet resolution (`http://localhost/lollipop/`), visually verifying clean hero photo/card layering, 2×2 snapshot metrics, and 2-column project cards.
- **Files Modified**: `assets/css/responsive.css`.

---

## 2026-09-19: Obsidian-First Vault Initialization & Full Sync
- **Objective**: Establish and synchronize the complete Obsidian documentation suite in `portfolio/` to serve as the persistent project knowledge base.
- **Notes Created**:
  - [[AI Context]]: High-level onboarding guide, developer profile, and operating constraints for AI agents.
  - [[Project Rules]]: Non-negotiable engineering rules (Obsidian-first, zero build frameworks, accessibility, data honesty).
  - [[Architecture]]: ComponentLoader mounting pipeline, data flow, CSS token system, state management.
  - [[File Map]]: Complete inventory of all root, component, CSS, JS, API, and vault files with responsibilities.
  - [[Features]]: Detailed functionality guide for all 11 user-facing sections and systems.
  - [[Technical Decisions]]: Key architectural decisions, rationale, alternatives, and tradeoffs.
  - [[Known Issues]]: Known API rate limits, mailto quirks, and local server requirements.
  - [[Tech Stack]]: Deep dive on the 6 stack categories (including AI tools Gemini and Codex).
  - [[Current Task]]: Active project state tracking.
  - [[Completed Tasks]]: Historical log of implementations and fixes.

## 2026-09-19: Cleanup of Stray Handwritten Doodle Behind Currently Building Card
- **Objective**: Identify and remove the stray cursive letter "t" poking out to the right of the "Currently Building" card.
- **Cause**: An old redundant annotation element (`.hero-annotation-student` containing `IT<br>Student<br>'27 ✦`) was positioned at `bottom: 0px; right: 0px;` directly underneath the Currently Building card. Repositioning the card had partially exposed the trailing `t` in "Student".
- **Changes**:
  - Removed `<div class="handwritten-note handwritten-note-accent hero-annotation-student">` from `components/hero.html`.
  - Removed unused `.hero-annotation-student` rule from `assets/css/sections.css`.
- **Files Modified**: `components/hero.html`, `assets/css/sections.css`.

---

## 2026-09-19: Hero Currently Building Card Repositioning — Portrait Clarity Fix
- **Objective**: Move the "Currently Building" card outside the primary portrait area across all viewports so Karl's photo is completely unobstructed while keeping the card attached to the lower-right of the photo frame.
- **Changes**:
  - Adjusted desktop positioning in `assets/css/sections.css` to `bottom: -24px; right: -38px;`, so the card touches only the outer bottom-right white border of the photo frame.
  - Adjusted mobile positioning in `assets/css/responsive.css` to `bottom: -75px; right: 5px;` and updated `.hero-visual { margin: 4px 0 90px 0; }` so the card sits below the photo area, keeping the cap, face, green sash, and graduation gown 100% visible with zero horizontal overflow.
  - Confirmed the PHP card stacking order (`z-index: 1`) and photo frame (`z-index: 2`) remain completely unchanged.
- **Files Modified**: `assets/css/sections.css`, `assets/css/responsive.css`.

---

## 2026-09-19: Hero PHP Code Snippet Layering — Strict Behind-Photo Stacking
- **Objective**: Ensure the PHP code card ALWAYS sits visually behind the graduation profile photo and frame across all responsive breakpoints (`Desktop`, `Tablet`, `Mobile`, `Very Narrow Mobile`), strictly following `PHP Card (z-index: 1) < Photo Frame (z-index: 2) < Tape Strip (z-index: 3) < Currently Building Card (z-index: 5)`.
- **Changes**:
  - Maintained `.php-snippet-card` at `z-index: 1` in `assets/css/components.css`.
  - Explicitly set `z-index: 1` on `.hero-visual .php-snippet-card` in `assets/css/sections.css` to guarantee stacking context priority below `.hero-photo-card` (`z-index: 2`).
  - Verified no positional, rotational, dimensional, or layout changes were introduced.
  - Confirmed overlapping portions of the PHP card are naturally covered and masked by the photo frame across all screen widths without horizontal overflow.
- **Files Modified**: `assets/css/components.css`, `assets/css/sections.css`.

---

## 2026-09-19: AI Stack Integration (Gemini & Codex)
- **Objective**: Add an "AI" stack category featuring Gemini and Codex to "Things I Build With".
- **Changes**:
  - Added `AI` entry to `PORTFOLIO_DATA.techStack` in `assets/js/data.js` with `{ name: "Gemini", icon: "sparkles" }` and `{ name: "Codex", icon: "cpu" }`.
  - Adjusted `.stack-grid` in `assets/css/sections.css` to `repeat(auto-fit, minmax(160px, 1fr))` for a single-row 6-card desktop layout.
  - Added search entries for Gemini and Codex in `assets/js/search.js` (`Cmd/Ctrl + K`).
  - Added `"AI Tools (Gemini, Codex)"` to `index.html` JSON-LD structured data.
- **Files Modified**: `assets/js/data.js`, `assets/css/sections.css`, `assets/js/search.js`, `index.html`.

---

## 2026-09-18: GitHub Contribution Matrix Hover Stabilization
- **Objective**: Eliminate layout stuttering and cell jittering when hovering over contribution matrix cells.
- **Changes**:
  - Replaced scale transform hover animations with stable SVG `stroke` / `stroke-width` vector border highlighting.
  - Decoupled tooltip rendering from the matrix grid flow to prevent DOM reflows.
- **Files Modified**: `assets/js/github.js`, `assets/css/sections.css`.

---

## 2026-09-18: Hero Section Layout & Portrait Focal Point Polish
- **Objective**: Ensure Karl's graduation photo remains the uncompromised visual focal point of the hero section while maintaining layered student-developer aesthetic.
- **Changes**:
  - Repositioned PHP code snippet card to upper-left with ample breathing room.
  - Positioned Caveat handwritten doodle ("Better Code Bigger Dreams") to upper-right.
  - Layered "Currently Building" card to lower-right without obstructing face or upper body.
- **Files Modified**: `assets/css/sections.css`, `components/hero.html`.

---

## 2026-09-18: Open Graph & Social Preview Banner Update
- **Objective**: Update Open Graph and Twitter social share preview banner.
- **Changes**:
  - Generated and replaced `assets/images/og-preview.png` reflecting Karl's graduation portrait.
  - Verified Open Graph meta tags in `index.html`.
- **Files Modified**: `assets/images/og-preview.png`, `index.html`.
