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

## Decision 7: Tablet Viewport Optimization (2-Column Grids for Snapshots, Projects & Development Journey)
- **Decision**: Optimize tablet viewports (`601px` to `868px`) by maintaining 2-column dashboard layouts for About snapshots (`2×2`), project archive cards (`repeat(2, 1fr)`), and Development Journey (`1.08fr 0.92fr` with top alignment).
- **Rationale**:
  - Previously, `.journey-layout-grid`, `.snapshot-grid`, and `.projects-grid` collapsed into a single column (`1fr`) at `max-width: 868px`.
  - On tablet displays (e.g. 768px iPad Mini and 800px+ Android tablets), a single-column layout stretched excessively across the entire screen, pushing the "Currently Figuring Things Out" card all the way below milestone 09, creating huge vertical scrolling.
  - Retaining a 2-column side-by-side layout (`1.08fr 0.92fr` with `align-items: start;`) on tablet keeps the milestone timeline and "Currently Figuring Things Out" card directly visible together, matching the desktop and iPad Pro 13 aesthetic.
  - Moving the 1-column mobile collapse to `@media (max-width: 600px)` ensures phone viewports maintain clean, readable single-column stacking.
- **Files Responsible**:
  - `assets/css/responsive.css`: Configures `@media (max-width: 868px)` with 2-column layouts and `@media (max-width: 600px)` with `1fr`.

---

## Decision 8: Tablet Squeezed 2-Column Hero & Profile Ergonomics
- **Decision**: In tablet viewports (`601px` to `868px`, e.g. 768px iPad Mini), retain the side-by-side 2-column layout (`.hero-grid { grid-template-columns: 1.15fr 0.85fr; }`) and "squeeze" the profile visual cluster proportionally (`width: 215px; height: 270px;` photo frame, `bottom: -18px; right: -22px;` Currently Building card, and both annotations visible), rather than stacking them vertically into 1 column.
- **Rationale**:
  - Tablet screens (e.g. 768px) have ample horizontal space (~736px container width). Forcing the hero into a single vertical column caused Karl's intro text to stretch across the top, pushed the profile photo downward into an isolated centered block with awkward empty horizontal space, and pushed the About Me section off-screen.
  - Squeezing the profile component into the right column preserves the visual relationship established on desktop (intro copy on left, graduation portrait + PHP card + Currently Building badge on right), matching the compact layout seen on Surface Pro / wide tablet devices.
  - Side-by-side layout in About Me (`.about-header-row { grid-template-columns: 1fr 1.45fr; }`) mirrors this layout balance immediately below the hero.
  - Stacking into 1 column is reserved strictly for phone viewports (`@media (max-width: 600px)`), where physical width constraints genuinely necessitate vertical order.
- **Files Responsible**:
  - `assets/css/responsive.css`: Configures tablet rules under `@media (max-width: 868px)` and mobile-only collapse under `@media (max-width: 600px)`.

## Decision 9: Multi-Tier Resilient Visitor Counter Architecture (Footer-Only Placement)
- **Decision**: Implement the website viewer/visitor counter exclusively in the global footer colophon (`components/footer.html`), using a resilient three-tier fallback architecture:
  1. Local PHP API (`api/visitors.php`) with atomic file locking (`flock`) on `cache/visitors.json` and session cooldown cookies (`ke_portfolio_sess`).
  2. Public REST Counter API (`api.counterapi.dev`) for static CDN deployments (Netlify / GitHub Pages), strictly treated as non-guaranteed with a 2.5s `AbortController` timeout and content-type verification.
  3. `localStorage` cache & persistent seed fallback (`248 site views`) ensuring the badge never displays an error or "NaN".
- **Rationale**:
  - **Footer-Only Placement**: Keeping the badge exclusively in the global footer prevents visual competition with Karl's primary hero identity, portrait, and action buttons, while still maintaining full visitor transparency.
  - **Non-Guaranteed Public API Handling**: External free APIs like `counterapi.dev` can suffer from downtime or rate limits. Enforcing a strict timeout and type validation guarantees that a slow or broken external service will never stall portfolio loading or display a broken state.
  - **Zero-Dependency Privacy**: No third-party tracking cookies or external analytical SDKs are loaded.
- **Files Responsible**:
  - `api/visitors.php`: Local backend endpoint with atomic write lock and session deduplication.
  - `cache/visitors.json`: Local atomic counter storage.
  - `assets/js/visitors.js`: Client orchestrator with 3-tier fallback and smooth number animation.
  - `components/footer.html`: Clean UI pill badge markup with live pulsating indicator.
  - `assets/css/sections.css`: Styling for `.footer-visitor-pill`.

## Decision 10: Data-Driven Modular Certificates Architecture with Modal Inspection
- **Decision**: Architect the coursework certificates showcase as a data-driven, modular component (`components/certificates.html` and `PORTFOLIO_DATA.certificates`), inserted sequentially between `#stack` and `#journey`, and leveraging the existing WAI-ARIA accessible modal dialog (`ModalManager.openCertificate`) for full credential inspection.
- **Rationale**:
  - **Narrative Continuity**: Placing verified credentials directly after the technical stack ("Things I Build With") provides tangible proof of Karl's skills in JavaScript, HTML, CSS, and C++ before transitioning into his chronological learning journey ("Development Journey").
  - **Data-Driven Decoupling**: Storing certificate metadata (ID, issuer, issue date, skills, description, and image path) inside `PORTFOLIO_DATA` in `data.js` ensures that updating, removing, or adding future credentials requires zero HTML modifications.
  - **Accessible Inspection**: Certificate cards feature full keyboard accessibility (`tabindex="0"`, `Enter`/`Space` listeners), and clicking any card invokes the WAI-ARIA modal dialog, providing visitors with high-resolution image viewing, credential verification ID, issuing body, CEO signatory, and direct image download actions.
  - **Unified Command Search**: Registering the certificates and section in `search.js` enables instant access via `Ctrl+K` for recruiters and reviewers looking for certifications.
- **Files Responsible**:
  - `components/certificates.html`: Semantic section template with header and dynamic grid mount.
  - `assets/js/data.js`: Authoritative certificates dataset in `PORTFOLIO_DATA`.
  - `assets/js/components.js`: Registered in `COMPONENT_MANIFEST`.
  - `assets/js/app.js`: `renderCertificates()` dynamic rendering function.
  - `assets/js/modal.js`: `ModalManager.openCertificate()` preview and keyboard handling.
  - `assets/js/search.js`: Search index items and modal triggers.
  - `assets/css/sections.css`: `.certificates-section`, `.certificate-card`, and `.cert-summary-pill`.
  - `assets/css/components.css`: `.modal-cert-preview-frame` and `.cert-code-highlight`.
  - `assets/css/responsive.css`: 4-column (desktop) → 2-column (tablet) → 1-column (mobile) grid rules.

---

## Cross References
- Architecture: [[Architecture]]
- Rules: [[Project Rules]]
- Features: [[Features]]
- Tech Stack: [[Tech Stack]]
- Known Issues: [[Known Issues]]


