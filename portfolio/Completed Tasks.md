# Completed Tasks

This changelog records completed features, refinements, fixes, and synchronizations.

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
