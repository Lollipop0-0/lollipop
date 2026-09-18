# Technical Decisions

This document records the major architectural, engineering, and UX decisions made throughout the development of the portfolio, including their rationale, alternatives considered, and tradeoffs.

---

## Decision 1: Pure Vanilla Stack over SPA Frameworks
- **Decision**: Build the application using standard HTML5, modern Vanilla CSS, and native ES6+ modules without React, Vue, Svelte, or Next.js.
- **Rationale**:
  - Maximizes performance, minimizing initial JavaScript payload to a few kilobytes.
  - Zero build step required; runs instantly via XAMPP/Apache, Python HTTP server, GitHub Pages, or Netlify.
  - Aligns with Karl's academic focus on foundational web standards, DOM mastery, and maintainable zero-dependency engineering.
- **Tradeoff**: Requires manual DOM updates and component assembly via `ComponentLoader`, which is easily managed for a portfolio-scale application.

---

## Decision 2: Multi-Tier Resilient GitHub Contribution Fetching
- **Decision**: Rather than calling GitHub's REST/GraphQL API with personal access tokens on the client, fetch contribution data using a three-tier fallback pipeline:
  1. Local PHP Proxy (`api/contributions.php`)
  2. Netlify Serverless Function (`/.netlify/functions/contributions`)
  3. Static Committed Cache (`cache/contributions_lollipop0-0.json`)
- **Rationale**:
  - Client-side personal access tokens leak secrets and violate security best practices.
  - Unauthenticated client requests hit GitHub's 60 req/hr IP rate limit quickly.
  - If rate-limited or offline, tier 3 guarantees the contribution calendar renders real cached activity rather than breaking or showing blank spaces.
- **Tradeoff**: Static cache must be periodically committed or refreshed when deployed statically.

---

## Decision 3: Stable SVG Stroke Highlighting for GitHub Contribution Matrix
- **Decision**: Avoid CSS `transform: scale()` on contribution grid cells on `:hover`; instead use non-reflowing SVG `stroke` / `stroke-width` highlighting and a detached fixed tooltip.
- **Rationale**:
  - Scaling grid elements caused severe micro-jitter, sub-pixel shifting, and browser repaint thrashing across the SVG calendar grid.
  - Stroke-based highlighting alters only vector border strokes without affecting element dimensions or neighbor coordinates, ensuring 100% fluid 60fps interaction.
- **Previous Failed Approach**: CSS `transform: scale(1.15)` on `.contribution-cell:hover` caused layout shaking.

---

## Decision 4: CSS Grid `minmax(160px, 1fr)` for Tech Stack Categories
- **Decision**: Set `.stack-grid` column sizing to `repeat(auto-fit, minmax(160px, 1fr))` in `assets/css/sections.css`.
- **Rationale**:
  - With the addition of the 6th category (`AI` alongside `WEB`, `SOFTWARE`, `DATABASE`, `TOOLS`, `UI / UX`), the previous `minmax(200px, 1fr)` required at least 1280px to stay on one row, causing the 6th card to wrap awkwardly into an orphaned second row on standard desktop screens (1024px–1200px).
  - `minmax(160px, 1fr)` allows all 6 cards to align symmetrically across desktop viewports while providing ample room for 9-character words like "Bootstrap".
  - When wrapping does occur (e.g. tablet), 6 cards neatly divide into 3 columns × 2 rows or 2 columns × 3 rows.

---

## Decision 5: Transparent `mailto:` Contact Flow vs Synthetic Backend
- **Decision**: Use client-side input validation paired with a pre-filled `mailto:` email action instead of mocking a synthetic "Email sent to database" message.
- **Rationale**:
  - Avoids running a fragile email relay/serverless backend that requires third-party API keys (e.g. EmailJS, Formspree) or backend SMTP upkeep.
  - Completely honest with visitors: opens the user's native email client directly addressed to Karl's verified NCST university email, accompanied by an on-screen address card and clipboard copy fallback.

---

## Decision 6: Hero Section Layering & Z-Index Hierarchy
- **Decision**: The PHP code card must ALWAYS sit visually BEHIND the profile photo/frame across all responsive breakpoints, while the Currently Building card remains on top of both.
- **Strict Stacking Order Hierarchy**:
  - `z-index: 1` (**Lowest**): PHP code snippet card (`.php-snippet-card` in `assets/css/components.css`, `.hero-visual .php-snippet-card` in `assets/css/sections.css`).
  - `z-index: 2` (**Middle**): Photo frame / profile photo (`.hero-photo-card` in `assets/css/sections.css`). Naturally overlaps and masks the bottom-right portion of the PHP card.
  - `z-index: 3`: Hand-drawn tape strip (`.tape-strip` in `assets/css/components.css`). Taped over the top center of the photo card.
  - `z-index: 5` (**Highest**): Currently Building card (`.currently-building-card` in `assets/css/sections.css`). Floats above the photo frame.
- **Responsive Invariance**:
  - This stacking relationship (`PHP Card < Photo Frame < Currently Building Card`) applies identically across Desktop (`≥ 1024px`), Tablet (`768px – 1023px`), Mobile (`≤ 767px`), and Very Narrow Mobile (`≤ 480px`).
  - Position adjustments in `assets/css/responsive.css` alter only coordinates (`top`, `left`) and dimensions, never altering the z-index hierarchy.
- **Positioning of Currently Building Card (Outside Photo Area)**:
  - The Currently Building card is intentionally anchored outside the primary photo area so the portrait remains the clear focal visual without obstruction.
  - **Desktop**: Positioned at `bottom: -24px; right: -38px;` in `assets/css/sections.css`, touching only the outer bottom-right white border of the photo frame.
  - **Mobile**: Positioned at `bottom: -75px; right: 5px;` with `.hero-visual { margin: 4px 0 90px 0; }` in `assets/css/responsive.css`, moving the card below the portrait area while maintaining seamless vertical clearance with the About section below.
- **Files Responsible**:
  - `assets/css/sections.css`: Controls `.hero-visual .php-snippet-card` (`z-index: 1`), `.hero-photo-card` (`z-index: 2`), and `.currently-building-card` (`z-index: 5`, `bottom: -24px; right: -38px;`).
  - `assets/css/responsive.css`: Adjusts mobile positioning (`bottom: -75px; right: 5px;`) and container clearance.
  - `assets/css/components.css`: Sets base `.php-snippet-card` (`z-index: 1`) and `.tape-strip` (`z-index: 3`).

---

## Cross References
- Architecture: [[Architecture]]
- Rules: [[Project Rules]]
- Features: [[Features]]
- Tech Stack: [[Tech Stack]]
- Known Issues: [[Known Issues]]
