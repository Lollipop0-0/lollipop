# Completed Tasks

This changelog records completed features, refinements, fixes, and synchronizations.

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
