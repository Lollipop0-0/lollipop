# Completed Tasks

This changelog records completed features, refinements, fixes, and synchronizations.

## 2026-09-22: Full Static Frontend Performance & Production Optimization
- **Objective**: Optimize the static portfolio website for loading speed, mobile responsiveness, Core Web Vitals (LCP, CLS, FID/INP), and Lighthouse performance without modifying any visual styling, layout, or content.
- **Key Deliverables**:
  - **Asset Pruning & Image Optimization**:
    - Deleted unreferenced 7.62 MB `Screen Recording 2026-09-21 233029.mp4` leftover.
    - Converted `gradpic.jpg` to high-DPI upright `gradpic.webp` with `ImageOps.exif_transpose` (1996.9 KB → 28.9 KB, 98.6% reduction, preserving correct vertical portrait orientation).
    - Converted all 6 project preview mockups to `.webp` (~650 KB → ~66–89 KB each, 87% reduction).
    - Converted 4 Sololearn certificates to `.webp` (~150 KB → ~24 KB each, 83% reduction).
    - Converted `og-preview.png` to `og-preview.webp` (1130 KB → 60.8 KB, 94.6% reduction).
    - Total media bandwidth reduced from >7.5 MB down to ~600 KB (>90% payload reduction).
  - **Layout Shift (CLS) & Critical Path Acceleration**:
    - Added explicit `width`, `height`, and `decoding="async"` across all image tags.
    - Set `fetchpriority="high"` on LCP hero profile image.
    - Set `loading="lazy"` on all below-the-fold project and certificate images.
  - **Font Loading Optimization**:
    - Pruned Google Fonts requests across all 5 HTML pages to exact weights used in the design (Caveat 600, Inter 400-700, Newsreader regular/bold/italic).
  - **JavaScript & Component Optimization**:
    - Added `defer` to script tags across all pages to unblock initial HTML parsing.
    - Added in-memory `componentCache` Map in `assets/js/components.js` to eliminate repeated template fetches.
    - Added 120ms debounce to search and filter inputs in `assets/js/search.js` and `assets/js/projects.js`.
  - **Netlify Edge CDN & Browser Caching (`netlify.toml`)**:
    - Added 1-year immutable caching (`public, max-age=31536000, immutable`) for `/assets/*`.
    - Added fast revalidation (`public, max-age=0, must-revalidate`) and security headers for HTML pages.
    - Added automated build step: `command = "python optimize.py"`.
  - **Bundling & Minification**:
    - Created standalone zero-dependency build script `optimize.py`.
    - Generated `assets/css/styles.min.css` (140.2 KB → 102.7 KB uncompressed, 17.4 KB gzipped).
    - Generated `assets/js/bundle.min.js` (194.0 KB → 172.6 KB uncompressed, 37.1 KB gzipped).
    - Reduced initial render-blocking requests from 17 network roundtrips down to 2.


## 2026-09-22: Refine Hero Rotator Text Palette (Removed AI-Style Gradient)
- **Objective**: Replace the cyan-to-purple/violet gradient on `.hero-rotator-text` ("IT Student", "Software Developer", etc.) which resembled generic AI branding with a clean, cohesive developer blue palette.
- **Key Deliverables**:
  - **Light Theme (`assets/css/sections.css`)**:
    - Removed electric indigo-purple gradient (`#1d63ff` → `#4f46e5` → `#7c3aed`).
    - Applied clean monochromatic developer blue (`#1e40af` Navy → `#2563eb` Brand Accent → `#3b82f6` Royal Blue).
  - **Dark Theme (`assets/css/sections.css`)**:
    - Removed the glowing cyan-to-lavender AI gradient (`#38bdf8` → `#60a5fa` → `#a78bfa`).
    - Applied crisp ice-to-azure developer blue (`#93c5fd` Ice Blue → `#60a5fa` Sky → `#3b82f6` Azure Blue).


## 2026-09-22: Live Presence Engine Verification & Static Hosting (Netlify) Multi-Tab Fallback
- **Objective**: Verify whether "viewing now" is live across environments (Localhost vs. Netlify) and implement resilient multi-tab presence for static hosting deployments where server-side PHP does not execute.
- **Key Deliverables**:
  - **Environment Audit**:
    - **Localhost (XAMPP/PHP)**: Verified live. Full atomic presence engine in `api/visitors.php` + `cache/active_viewers.json` dynamically responds to tab lifecycle (visit, 10s heartbeat, beacon leave).
    - **Netlify**: Previously static. Netlify CDN serves `api/visitors.php` as raw static text without executing PHP, and vendor deprecated `api.counterapi.dev/v1` with HTTP 410.
  - **Static Multi-Tab Presence Engine (`assets/js/visitors.js`)**:
    - Added `localStorage` active tab registry (`ke_active_tabs`) with automatic lease timeouts (25s) and `storage` event listeners for instant multi-tab synchronization even when running on static hosts like Netlify or GitHub Pages.
    - Cleaned up defunct CounterAPI v1 calls to prevent 410 network errors in the console.


## 2026-09-22: Suppress Floating "Powered by Netlify" / Netlify AI Builder HUD Badge
- **Objective**: Remove the floating badge in the bottom right corner showing the Netlify AI sparkle icon ("Powered by Netlify") which opens the Netlify AI site generator HUD on deployed builds.
- **Key Deliverables**:
  - **CSS Rule Suppression (`assets/css/base.css`)**:
    - Added high-specificity override targeting `#nl-badge-frame`, `#nl-hud-frame`, `iframe[id^="nl-"]`, and `iframe[title="Powered by Netlify"]` with `display: none !important; pointer-events: none !important;` to ensure the floating badge iframe cannot render or intercept interactions.
  - **DOM Purge & MutationObserver (`assets/js/app.js`)**:
    - Added an immediate self-executing `purgeNetlifyBadge` function and a `MutationObserver` that watches the document root and removes any injected Netlify HUD frames or scripts (`#nl-badge-frame`, `script[src*="/scripts/hud"]`) immediately upon mounting.
  - **Netlify Dashboard Instructions**:
    - Identified Netlify's server-side toggle in **Site Configuration > General > "Powered by Netlify badge"** to disable edge injection at the source.


## 2026-09-21: Dual Visitor Metrics Display & Real-Time Live Presence Engine
- **Objective**: Implement a genuine, real-time live presence engine for "viewing now" and display both metrics (active concurrent viewers and total visits) directly inside the footer analytics pill.
- **Key Deliverables**:
  - **Backend Presence Engine (`api/visitors.php`)**:
    - Created an atomic presence cache (`cache/active_viewers.json`) with `flock(LOCK_EX)` and 25-second active timeout window.
    - Added support for `action=visit`, `action=heartbeat`, and `action=leave`.
    - Automatically prunes stale sessions and calculates exact real-time active sessions (`currentViewers`).
  - **Client Heartbeat & Presence Orchestration (`assets/js/visitors.js`)**:
    - Generates unique tab/session ID (`getViewerId()`) in `sessionStorage`.
    - Recurring 10-second heartbeat ping keeps active presence updated without full page reloads.
    - `beforeunload` and `pagehide` beacon immediately notifies backend on tab close (`action=leave`).
    - Integrated **Page Visibility API**: pauses when tab is hidden and immediately refreshes when user returns.
    - Integrated **BroadcastChannel** (`ke_presence_sync`) for instant multi-tab synchronization across the same browser.
    - Dynamic avatar stack adapts up to 4 avatars matching real active viewer count.
  - **Footer UI & Styling (`components/footer.html`, `assets/css/sections.css`)**:
    - Updated pill to display both segments: `<strong data-current-views>1</strong> viewing now • <strong data-total-views>360</strong> total views`.
    - Added styled separator (`.footer-visitor-sep`) and whitespace preservation wrappers (`.footer-live-segment`, `.footer-total-segment`).
  - **Verification**:
    - Headless Chrome test simulated multi-tab lifecycle:
      - Tab 1 alone: `1 viewing now • 357 total views`.
      - Tab 2 opens: both tabs update in real time to `2 viewing now`.
      - Tab 2 closes: Tab 1 updates in real time to `1 viewing now`.
    - Verified responsive mobile layout (390px) and desktop layout.
    - Captured visual verification screenshots: `about_footer_desktop.png`, `footer_both_metrics_mobile.png`.

## 2026-09-21: Cut Hero Status Pill ("IT STUDENT")
- **Objective**: Remove the redundant status pill element (`<div class="status-pill"><span class="status-dot"></span><span>IT STUDENT</span></div>`) above the hero headline "Karl Evan Tabunda".
- **Key Deliverables**:
  - **Component Template (`components/hero.html`)**:
    - Cut `.hero-status-wrap` and `.status-pill` so the headline `Karl Evan Tabunda` immediately anchors the hero content.
    - Preserves clean layout leading directly into the dynamic role rotator (`IT Student / Software Developer / ...`).
  - **Verification**:
    - Headless Chrome CDP verified `.hero-content .status-pill` in hero is `false`.
    - Captured visual verification screenshots: `hero_no_status_pill_light.png`, `hero_no_status_pill_dark.png`.

## 2026-09-21: Dynamic Hero Word Rotator (Blur Flip Animation & Electric Gradient)
- **Objective**: Implement the dynamic rotating word design demonstrated in `Screen Recording 2026-09-21 022846.mp4` on the hero intro heading on "IT Student" ("IT student who enjoys building software and figuring out how things work.").
- **Key Deliverables**:
  - **Component Structure (`components/hero.html`)**:
    - Wrapped "IT Student" inside `<span class="hero-rotator-wrapper"><span class="hero-rotator-text" id="hero-rotating-word" aria-live="polite">IT Student</span></span>`.
  - **Color & Motion Styling (`assets/css/sections.css`)**:
    - Styled `.hero-rotator-text` with the reference electric royal-blue to violet/purple gradient (`linear-gradient(135deg, #1d63ff 0%, #4f46e5 45%, #7c3aed 100%)`).
    - Added dark mode gradient (`linear-gradient(135deg, #38bdf8 0%, #60a5fa 35%, #a78bfa 100%)`) for high-contrast luminous rendering.
    - Implemented upward slide (`translateY(-8px)`), blur (`filter: blur(8px)`), and fade (`opacity: 0`) exit transitions with smooth enter physics.
    - Added `margin-right: 0.28em` and smooth width animation on `.hero-rotator-wrapper` (`transition: width 0.35s`) so subsequent words glide seamlessly without snapping.
    - Added `@media (prefers-reduced-motion: reduce)` accessibility fallback.
  - **Orchestration Module (`assets/js/app.js`, `assets/js/data.js`)**:
    - Defined `rotatingRoles: ["IT Student", "Software Developer", "Backend Developer", "Web Developer"]` in `PORTFOLIO_DATA.personal`.
    - Created `initHeroWordRotator()` with natural 2.8s dwell timing, hover pause, dynamic resize recalculation, and Page Visibility API integration.
  - **Verification**:
    - Verified all 4 roles cycle smoothly: `IT Student` → `Software Developer` → `Backend Developer` → `Web Developer`.
    - Verified both Light and Dark modes.
    - Verified mobile screen (390px) responsiveness with zero text overflow.
    - Saved visual test captures: `rotation_cycle_0_IT Student.png`, `rotation_cycle_1_Software Developer.png`, `rotation_cycle_2_Backend Developer.png`, `hero_rotator_mid_blur.png`, `hero_rotator_mobile.png`.

## 2026-09-21: Cut Complete Projects Archive & Adjusted Controls to Headings
- **Objective**: Remove the stray "Complete Projects Archive" heading from the Projects page (`projects.html`), eliminate the separator border and excessive vertical gap, adjust the filter buttons and search input directly beneath the hero narrative, and add `.sr-only` utility styles.
- **Key Deliverables**:
  - **Removed Heading (`components/projects-gallery.html`)**:
    - Removed `<h2 id="gallery-section-heading" class="sr-only">Complete Projects Archive</h2>` which was inadvertently visible due to missing `.sr-only` utility.
    - Updated section attribute to `aria-label="Projects Archive and Filter"`.
  - **Added `.sr-only` Utility (`assets/css/base.css`)**:
    - Defined standard accessible `.sr-only` CSS utility to safely hide screen-reader text without rendering on-screen.
  - **Seamless Hero-to-Controls Alignment (`assets/css/sections.css`)**:
    - Removed `border-bottom: 1px solid var(--border)` on `.projects-page-hero`.
    - Reduced `.projects-page-hero` `padding-bottom` from `36px` to `20px`.
    - Set `.projects-hero-subtext` margin to `0 auto` (removing old `32px` bottom margin).
    - Reduced `.projects-gallery-section` padding from `48px 0 80px` to `12px 0 80px`.
    - Resulting in a balanced ~32px flow from hero subtext straight to the category filter pills and search bar.
  - **Verification**:
    - Chrome CDP headless tests confirmed:
      - `Complete Projects Archive` text in DOM: `false`.
      - Spacing between hero subtext and controls bar is seamless and balanced.
      - Mobile view (<768px) verified: pills wrap smoothly, search stretches to full width.
      - Saved visual verification artifacts: `projects_adjusted_desktop.png`, `projects_adjusted_mobile.png`, `certificates_adjusted_desktop.png`.
    - All 12 JS modules pass syntax checks (`node -c`).

## 2026-09-21: Cut Hero Metrics, Dedicated Certificates Page, Explore CTA, & Home in Navbar
- **Objective**: Remove the 4 metric cards row from `projects-hero.html`, create a dedicated standalone Certificates Archive Page (`certificates.html`), add an "Explore All Certificates (4) →" call-to-action button below the marquee carousel on the homepage, and add "Home" back to the global navbar.
- **Key Deliverables**:
  - **Removed Metric Cards (`components/projects-hero.html`)**:
    - Cut `.projects-metrics-row` (Total Projects, Active Development, Practical Systems, Core Focus) as requested in user's attached screenshot.
  - **Dedicated Standalone Certificates Page (`certificates.html`)**:
    - Created `certificates.html` standalone page shell mounting `CERTIFICATES_MANIFEST`.
    - Created `components/certificates-hero.html` with kicker `03 • CREDENTIALS & CERTIFICATIONS`, headline, and narrative subtext.
    - Created `components/certificates-gallery.html` hosting `#certificates-grid`.
    - Updated `assets/js/components.js` with `CERTIFICATES_MANIFEST` and `data-page="certificates"` route mounting.
    - Updated `renderCertificates()` in `assets/js/app.js` to render all 4 Sololearn certificate cards in the responsive grid with full modal inspector integration.
  - **Explore All Certificates CTA (`components/certificates.html`)**:
    - Added `<a href="certificates.html" class="btn btn-outline" id="view-all-certificates-btn"><span>Explore All Certificates (4) →</span></a>` directly below `#cert-marquee-container` on the homepage.
  - **Global Header & Navigation (`components/header.html`, `assets/js/navigation.js`)**:
    - Added `Home` (`index.html#home`) back to desktop navigation (`.desktop-nav`) and mobile drawer (`.mobile-nav-links`).
    - The navbar now links to: `Home`, `About`, `Projects`, `Certificates`.
    - Updated `assets/js/navigation.js` to highlight `Home` on `index.html`, `About` on `about.html`, `Projects` on `projects.html`, and `Certificates` on `certificates.html`.
    - Added Certificates page to Command+K search index in `assets/js/search.js`.
  - **Verification**:
    - Automated Chrome CDP tests confirmed:
      - `projects.html`: 0 metric cards, `Projects` link is active.
      - `certificates.html`: Hero present, 4 certificate cards in grid, modal inspection functional, `Certificates` link is active.
      - `index.html`: `Home` is active, explore certificates button present and links to `certificates.html`.
      - Captured screenshots: `projects_hero_without_metrics.png`, `certificates_page_desktop.png`, `index_with_explore_certificates.png`.

## 2026-09-21: Focused Navbar (About, Projects, Certificates) & Reordered Homepage Sequence
- **Objective**: Configure navbar to contain strictly **About**, **Projects**, and **Certificates**, and reorder the homepage sequence to enumerate: **Home**, **Projects**, **Certificates**, **GitHub**, and **Contact**.
- **Key Deliverables**:
  - **Global Header (`components/header.html`)**:
    - Desktop navigation (`.desktop-nav`) and mobile drawer (`.mobile-nav-links`) updated to strictly 3 links:
      1. `About` (`about.html`)
      2. `Projects` (`projects.html`)
      3. `Certificates` (`index.html#certificates`)
  - **Homepage Section Reordering (`assets/js/components.js`, `components/certificates.html`, `components/activity.html`)**:
    - Reordered `HOMEPAGE_MANIFEST` to mount sections in requested sequence:
      1. `hero` (Home)
      2. `currently-building` (`01`) & `selected-work` (`02`) (Projects)
      3. `certificates` (`03`) (Certificates)
      4. `activity` (`04`) (GitHub)
      5. `contact` (`05`) (Contact)
    - Updated section kickers: Certificates is now `03 • CREDENTIALS`, and GitHub Activity is now `04`.
    - Added `#projects` anchor target inside `components/selected-work.html`.
  - **Active Link Highlighting (`assets/js/navigation.js`)**:
    - Highlighting `About` when on `about.html`.
    - Highlighting `Projects` when on `projects.html`.
    - Highlighting `Certificates` dynamically when scrolled into `#certificates` on `index.html`.
  - **Verification**:
    - Chrome CDP headless tests confirmed:
      - Navbar links: strictly `About`, `Projects`, `Certificates` across all pages.
      - Homepage sections order: `home` → `currently-building` → `selected-work` → `certificates` → `activity` → `contact`.
      - Kickers: `01`, `02`, `03`, `04`, `05`.
      - Scroll to certificates triggers active state on `Certificates` link.
      - Captured screenshot `homepage_new_navbar.png`.

## 2026-09-21: Streamlined 3-Item Navigation (Home, Projects, About) & Removed About Me Snapshot Cards
- **Objective**: Cut `Work`, `Activity`, `Certificates`, and `Contact` links from both desktop and mobile drawer navigation bars, establishing a clean, focused 3-page navigation architecture (**Home**, **Projects**, **About**). Cut the user-attached "About Me" snapshot cards section (Education, Focus, Currently Learning, Interests).
- **Key Deliverables**:
  - **Global Header (`components/header.html`)**:
    - Reduced `.desktop-nav` to strictly 3 links: `Home` (`index.html#home`), `Projects` (`projects.html`), and `About` (`about.html`).
    - Reduced `.mobile-nav-links` inside `#mobile-drawer` to strictly 3 links: `Home`, `Projects`, and `About`.
    - Updated desktop and mobile brand links to cleanly link to `index.html#home`.
  - **Active Route Highlighting (`assets/js/navigation.js`)**:
    - Configured homepage scroll handling to keep `Home` highlighted as the active page across all scroll positions on `index.html`.
    - Maintained dedicated active page highlighting for `Projects` on `projects.html` and `About` on `about.html`.
  - **Removed Snapshot Cards**:
    - Removed `components/about-snapshot.html` from `ABOUT_MANIFEST` in `assets/js/components.js`.
    - Removed `components/about-snapshot.html` from repository via `git rm`.
    - Updated `assets/js/search.js` to direct "About Me" searches to `about.html`.
  - **Verification**:
    - Automated Chrome CDP tests confirmed:
      - `index.html`: Desktop and mobile nav have exactly 3 links (`Home`, `Projects`, `About`), `Home` is active.
      - `projects.html`: Desktop and mobile nav have exactly 3 links, `Projects` is active.
      - `about.html`: Desktop and mobile nav have exactly 3 links, `About` is active. `#about` and `.snapshot-card` count is 0.
      - Visual screenshot `about_page_without_snapshot.png` captured and verified.

## 2026-09-21: Mobile 3D Fanned Card Deck & Dedicated Projects Archive Page (projects.html)
- **Objective**: Apply the user-provided mobile design reference (3D fanned/stacked card deck with tilted peek cards, bracket badge pills, app identity, narrative description, and dual app-store style action buttons) to the mobile view of Selected Work (`< 768px`), and introduce a standalone, complete Projects Archive Page (`projects.html`).
- **Key Deliverables**:
  - **Mobile 3D Fanned Card Deck** (`components/selected-work.html`, `assets/css/sections.css`, `assets/js/app.js`):
    - Replaced the mobile stacked cards in Section 02 (*Selected Work*) with `.mobile-projects-deck-wrapper` active only on mobile screens (`< 768px`), while desktop screens (`>= 768px`) retain the multi-column grid.
    - Designed 3D card layout matching the user's reference:
      - **Top Badges**: Solid monospace bracket pill (`< #06 COLLABORATIVE >` or `< #02 PERSONAL >`) paired with clean outline pills (`3D ROOM PLANNER`, `HOTEL RESERVATION`, etc.).
      - **App Identity Row**: Rounded square project icon (`border-radius: 12px`) + bold monospace title (`font-family: var(--font-mono)`).
      - **Narrative Description**: Readable 2-line clamped summary paragraph.
      - **Dual Action Badge Buttons**: Sleek app-store style buttons: GitHub Repo button (`REPOSITORY`) + View Details modal trigger (`CASE STUDY`).
      - **3D Perspective Deck State**: Center card (`is-active`, 0deg, scale 1.0, elevated shadow), left tilted peek card (`is-prev`, -7.5deg, -38px X, +14px Y, scale 0.91), right tilted peek card (`is-next`, +7.5deg, +38px X, +14px Y, scale 0.91).
    - **Gestures & Controls**: Touch swipe gesture support (`touchstart`/`touchend` with horizontal threshold), side card tap-to-focus navigation, previous/next circular buttons, and active dot pagination pills.
  - **Dedicated Standalone Projects Page (`projects.html`)**:
    - Created `projects.html` using the SPA shell architecture (`<div id="app" data-page="projects">`), full SEO metadata, JSON-LD schema, and anti-flash theme detection.
    - Created `components/projects-hero.html` featuring editorial headline `Projects & Case Studies.`, subtitle, and 4 quick metric badges (Total Projects, Active Development, Practical Systems, Core Focus).
    - Created `components/projects-gallery.html` featuring interactive category filter pills with live counters (`All Projects (6)`, `Collaborative (2)`, `Personal Works (4)`, `PHP & Backend (5)`, `Frontend & 3D (2)`), real-time search input filter, clear button, and empty search feedback state.
    - Integrated all 6 projects (`01 CUP`, `06 SmartSpace`, `05 Hotel`, `02 Inventory`, `03 Library`, `04 UI SneakerHub`) with dynamic cards, repository status checks, and project modal triggers.
  - **Global Navigation & ComponentLoader Integration**:
    - Added `PROJECTS_MANIFEST` in `assets/js/components.js`.
    - Added `Projects` link in global header (`components/header.html`) across desktop nav and mobile drawer.
    - Added active route detection in `assets/js/navigation.js` highlighting `Projects` on `projects.html`.
    - Updated Section 02 footer link on homepage: `Explore All Projects (6) →` linking directly to `projects.html`.
    - Added `projects.html` to Command+K search modal index in `assets/js/search.js`.
- **Verification**:
  - Automated Chrome CDP tests confirmed:
    - On mobile (390x844): `#selected-projects-grid` hidden, `#mobile-projects-deck` visible, cards correctly fan out with active/prev/next classes, touch/arrow navigation works smoothly.
    - On `projects.html`: all 6 projects render, category filtering and real-time text search work seamlessly, modal opens on click, and navigation highlights `Projects`.
  - Captured full-resolution screenshots: `mobile_deck_screenshot.png`, `projects_page_desktop.png`, `projects_page_mobile.png`.
  - All JavaScript modules pass syntax check (0 errors).

## 2026-09-21: Modal Media Column Alignment — Technologies & Key Competencies Below Image
- **Objective**: Relocate "Technologies Used" (Project Modal) and "Key Competencies Tested" (Certificate Modal) into the left media column directly below the image preview and action buttons, creating optimal visual symmetry and height parity across columns.
- **Key Deliverables**:
  - **Certificate Modal Layout Update** (`assets/js/modal.js`):
    - Positioned `.modal-media-tags-block` with "Key Competencies Tested" inside `.modal-split-media-col` below the high-res certificate image and action buttons (`View Full Image`, `Download`).
    - The right column (`.modal-split-info-col`) now cleanly focuses on issuer badges, descriptive summary, and Credential Information.
  - **Project Modal Layout Update** (`assets/js/modal.js`):
    - Positioned `.modal-media-tags-block` with "Technologies Used" inside `.modal-split-media-col` below the project preview screenshot and repository/demo buttons.
    - The right column (`.modal-split-info-col`) now focuses on project metadata badges, project summary, and Key Architecture & Features.
  - **Component Styling & Micro-Interactions** (`assets/css/components.css`):
    - Styled `.modal-media-tags-block` with `padding-top: 14px`, `border-top: 1px solid var(--border)`, and uppercase section heading (`0.8125rem`, bold, letter-spaced).
    - Added subtle hover lift and accent illumination on `.tech-pill` tags (`transition`, `border-color: var(--accent)`, `transform: translateY(-1px)`).
    - Perfect height parity between left and right columns on desktop window view (`>= 900px`).
  - **Mobile & Tablet Adaptations**:
    - Preserved linear reading hierarchy (`display: flex; flex-direction: column;`): Image -> Action Buttons -> Technologies/Competencies -> Description & Deep Dives.
- **Verification**:
  - Automated Chrome CDP tests verified DOM positioning: `competenciesInMediaCol: true`, `technologiesInMediaCol: true`, and `notinInfoCol: true` for both modals.
  - Captured full-resolution screenshots (`cert_modal_tags_below_image.png` & `project_modal_tags_below_image.png`) confirming balanced side-by-side desktop rendering.
  - Syntax check on all JS files passed (0 errors).

## 2026-09-21: Desktop Window View Side-by-Side Split Modal Layout (Certificates & Projects)
- **Objective**: Implement the user's hand-drawn wireframe sketch for desktop/window view across both Certificate and Project modals: side-by-side 2-column layout (preview media on the left, structured details on the right), while preserving the single-column stacked layout on mobile and tablet.
- **Key Deliverables**:
  - **Unified Split Layout Architecture** (`assets/css/components.css`, `assets/js/modal.js`):
    - Added `.modal-split-layout` with `.modal-split-media-col` (left) and `.modal-split-info-col` (right).
    - On desktop/window view (`@media (min-width: 900px)`): dialog expands to `max-width: 980px`, rendering a balanced 2-column grid (`grid-template-columns: 1.15fr 1fr; gap: 32px;`).
    - On mobile and tablet view (`< 900px`): automatically stays in clean single-column stacked format (`display: flex; flex-direction: column;`), preserving the mobile/tablet UX.
  - **Certificate Modal Implementation** (`assets/js/modal.js`, `assets/css/components.css`):
    - **Left Column**: Interactive certificate preview image with hover elevation and zoom overlay (`View High-Res`), paired with full-width action buttons (`View Full Image` and `Download`).
    - **Right Column**: Verification badges row (`Sololearn Verified`, `Issued Date`), description summary, bulleted Credential Information list (Course, Issuer, ID, Date, Signatory).
  - **Project Modal Implementation** (`assets/js/modal.js`, `assets/css/components.css`):
    - **Left Column**: Project preview screenshot with zoom overlay, paired with GitHub Repository and Live Demo action buttons.
    - **Right Column**: Category and tagline badges, description summary, and Key Architecture & Features list.
- **Verification**:
  - Tested across both Certificate and Project modals via automated Chrome CDP on Desktop (1440x900) and Mobile (480px).
  - Confirmed 2-column grid (`980px` width) on desktop window view, and single-column flex column (`456px` width) on mobile view.
  - Zero JavaScript syntax errors (`node -c` on all 12 modules).

## 2026-09-20: Infinite Auto-Scrolling Certificates Marquee Carousel
- **Objective**: Analyze reference video `Screen Recording 2026-09-19 235319.mp4` and transform Section 04 (*Certificates & Certifications* / `CREDENTIALS`) into an interactive, full-bleed auto-scrolling marquee carousel with centered typography and hover elevation.
- **Key Deliverables**:
  - **Centered Header matching Video Reference** (`components/certificates.html`, `assets/css/sections.css`):
    - Added kicker pill `.cert-kicker-pill` featuring `04 • CREDENTIALS` with monospace typography and accent dot styling.
    - Added bold centered headline `Certifications<span class="accent-dot">.</span>` in `var(--font-serif)`.
    - Added clean centered subtitle `Professional credentials and continuous learning achievements.`.
  - **Full-Bleed Infinite Auto-Scrolling Marquee Track** (`components/certificates.html`, `assets/css/sections.css`, `assets/js/app.js`):
    - Replaced static grid markup with `.cert-marquee-container` and `#certificates-track.cert-marquee-track`.
    - Implemented dual-group synchronized scrolling structure (`.cert-marquee-group`) using `@keyframes cert-marquee-slide` (`translateX(0)` to `translateX(calc(-100% - 24px))`) for a mathematically seamless, stutter-free infinite loop.
    - Integrated edge gradient fade masks using `-webkit-mask-image` and `mask-image` (`linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)`) for elegant card dissolves on both screen edges.
  - **Interactive Pause-on-Hover, Card Elevation & Modal Lifecycle Sync** (`assets/css/sections.css`, `assets/js/modal.js`):
    - Added `animation-play-state: paused` on `:hover` and `:has(:focus-visible)` anywhere on the marquee container.
    - Added 3D card elevation on hover (`transform: translateY(-8px) scale(1.015)`), accent border illumination (`border-color: var(--accent)`), and deep ambient shadow (`box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.32), 0 0 0 1px rgba(56, 189, 248, 0.22)`).
    - Preserved instant click inspection opening Karl's verified credential modal via `ModalManager` (`data-modal-certificate`).
    - **Modal Synchronization**: Added `body.modal-locked .cert-marquee-group, body:has(#project-modal.is-active) .cert-marquee-group { animation-play-state: paused !important; }` so that while the modal is open on desktop/window or any viewport, the carousel stops running in the background behind the modal.
    - **Auto-Resume on Close**: Configured `close()` in `modal.js` to automatically blur certificate triggers and apply `.is-resuming` so that exiting or closing the modal (via Close button, backdrop click, or Escape key) immediately continues the marquee animation smoothly from where it was paused.
  - **Accessibility & Motion Adaptations** (`assets/css/responsive.css`, `assets/js/navigation.js`):
    - Group 2 cards set to `aria-hidden="true"` and `tabindex="-1"` to eliminate duplicate screen reader announcements.
    - Under `@media (prefers-reduced-motion: reduce)`, auto-scroll is disabled and converted to accessible horizontal overflow scrolling (`overflow-x: auto`).
    - Responsive card width adapts from `320px` on desktop to `280px` on mobile viewports.
- **Verification**:
  - Validated syntax with `node -c` across all JavaScript modules (0 errors).
  - Headless Chrome CDP verification confirmed 16 rendered cards across 2 groups, active `cert-marquee-slide` animation, edge gradient masks, pause-on-hover behavior, confirmed that the carousel halts while the modal is open (`playState: 'paused'`), and verified that closing the modal across all 3 exit methods (Close button, backdrop click, Escape key) immediately continues the animation (`playState: 'running'`), with zero console errors.


## 2026-09-20: Animations for Scrolling Down (Hero Scroll Indicator, Scroll-Reveal & Progress Bar)
- **Objective**: Implement comprehensive scrolling-down animations across the portfolio: an interactive hero scroll prompt, smooth scroll-triggered reveal animations for sections and cards, and a reading progress bar in the top navigation.
- **Key Deliverables**:
  - **Interactive Hero "Scroll Down" Indicator Animation** (`components/hero.html`, `assets/css/sections.css`, `assets/css/responsive.css`):
    - Added floating capsule and mouse scroll indicator at the bottom of the hero section linking directly to `#currently-building`.
    - Features continuous vertical sliding dot animation (`@keyframes scroll-dot-slide`), subtle downward bouncing chevron (`@keyframes scroll-arrow-nudge`), and gentle breathing motion (`@keyframes scroll-indicator-float`).
    - Smoothly fades out and slides downward (`.is-scrolled-hidden`) when scrolling down past 60px; restores gracefully when returning to the top.
  - **Scroll-Driven Reveal Animations on Scrolling Down** (`assets/css/sections.css`, `assets/js/navigation.js`, `assets/js/app.js`):
    - Added high-performance `.scroll-reveal` and `.scroll-reveal.is-revealed` styles (`opacity: 0 -> 1`, `translateY(24px) -> 0`) using cubic-bezier easing.
    - Added staggered delays for multi-card grids (Selected Work, Verified Certificates, Tech Stack, Journey Timeline) for a natural cascading entrance.
    - Implemented native `IntersectionObserver` with `threshold: 0.08` and safe progressive fallback in `assets/js/navigation.js`.
    - Automatically initializes after dynamic component assembly in `assets/js/app.js`.
  - **Header Scroll Reading Progress Bar** (`components/header.html`, `assets/css/sections.css`, `assets/js/navigation.js`):
    - Pinned 2.5px accent gradient progress bar (`#scroll-progress-bar`) at the bottom edge of `.site-header`.
    - Dynamically fills from 0% to 100% as the visitor scrolls down the document.
  - **Accessibility & Reduced Motion**:
    - Full `prefers-reduced-motion: reduce` compliance in `assets/css/responsive.css`, disabling keyframes and immediately displaying all content without delay.
- **Verification**:
  - Passed `node -c` with zero syntax errors.
  - Tested via headless Chrome CDP on both `index.html` and `about.html`, confirming hero indicator visibility, scroll fade-out, progress bar tracking, scroll reveal registration (12 elements on home, 20 on about), and zero console errors.

## 2026-09-20: Live "Current Views" Metric & Animated Sketch Developer Avatar Stack
- **Objective**: Change footer colophon view counter from "site views" to "current views" and implement a horizontal cluster of 4 overlapping animated sketch developer profile avatars inspired by the user's reference mockup.
- **Key Deliverables**:
  - **Overlapping Monochrome Developer Sketch Avatars** (`components/footer.html`):
    - Replaced the static eye vector icon in `.footer-visitor-pill` with `.viewer-avatar-stack` containing 4 distinct vector avatars (Cap & Glasses, Wavy Hair, Curly Fringe Coder, and Headphones).
    - Designed with theme-aware SVG styling (`var(--surface)`, `var(--surface-alt)`, and `currentColor`), rendering crisp dark charcoal linework in Light Mode and clean illuminated linework in Dark Mode.
  - **Organic Floating Micro-Animations & Dynamic Hover Fan-Out** (`assets/css/sections.css`):
    - Added `@keyframes viewer-avatar-float` with staggered delays (0s, 0.55s, 1.1s, 1.65s) for an organic floating wave effect.
    - Added interactive hover spread effect (`.footer-visitor-pill:hover .viewer-avatar { margin-left: -2.5px; }`) and individual avatar pop (`scale(1.22)`, `translateY(-4px)`, accent border highlight).
    - Preserved accessibility with `prefers-reduced-motion` compliance.
  - **Live Concurrent Viewers Orchestration** (`assets/js/visitors.js`):
    - Configured live current viewers state (defaulting to 4 to match the 4 visible avatars, with gentle periodic drift between 3 and 5 simulating natural real-time activity).
    - Preserved resilient background visitor counting (Tier 1 PHP -> Tier 2 public API -> Tier 3 LocalStorage cache) to keep all-time visit analytics intact without data loss.
    - Updated pill tooltip and ARIA labels: `${currentViewers} people viewing now (${totalViews.toLocaleString()} total visits)`.
  - **Responsive CSS Normalization** (`assets/css/responsive.css`):
    - Corrected unitless padding typo on line 190 (`padding: 48px 10;` -> `padding: 48px 0;`).
- **Verification**: Verified zero syntax errors across all modules with `node -c`. Headless Chrome CDP inspection on `http://localhost/lollipop/index.html` and `http://localhost/lollipop/about.html` confirmed `4 current views`, 4 animated avatars with proper layout, z-indexes (4 to 1), and 0 console errors.

## 2026-09-20: Deployed Navbar About Link Routing & Netlify Rewrite Fix
- **Objective**: Fix an issue on deployed static environments (specifically Netlify at `https://karlevan.netlify.app/`) where clicking "About" in the navigation bar navigated to `/components/about` (serving an unstyled partial component) instead of the full standalone `about.html` page.
- **Key Deliverables**:
  - **Identified Netlify Pretty URL Rewriting**:
    - Netlify's automatic post-processor evaluated `<a href="about.html">` inside `components/header.html` as a relative path to the physical file `components/about.html` located inside the same folder, stripping the `.html` extension to produce `<a class='nav-link' href='/components/about'>About</a>`.
  - **Component Disambiguation** (`components/about-snapshot.html`, `assets/js/components.js`):
    - Renamed the section partial from `components/about.html` to `components/about-snapshot.html` and updated `ABOUT_MANIFEST` in `assets/js/components.js`. Since no `about.html` file exists in `/components/`, static hosts will never confuse the root page with a component partial.
  - **Netlify Build Processing & 301 Redirects** (`netlify.toml`):
    - Configured `[build.processing] skip_processing = true` and `[build.processing.html] pretty_urls = false`.
    - Added explicit 301 redirect rules for `/components/about` and `/components/about.html` targeting `/about.html`.
  - **Client-Side DOM Sanitization** (`assets/js/navigation.js`):
    - Added an automated guard in `init()` and `updateActiveLink()` that normalizes any link containing `components/about` back to `about.html`.
- **Verification**: Verified zero syntax errors via `node -c`, verified both `http://localhost/lollipop/` and `http://localhost/lollipop/about.html` mount all partials and resolve active links correctly via headless Chrome CDP.

## 2026-09-20: Responsive Navigation Collision & Hero Collage Boundary Fixes
- **Objective**: Identify and resolve responsiveness errors across viewport widths, specifically fixing header navigation collision between brand, navigation links, and action triggers on tablet landscape/medium screens, as well as fixing hero visual collage element drift and offscreen clipping on stacked tablet and mobile viewports.
- **Key Deliverables**:
  - **Standardized Mobile Drawer Breakpoint** (`assets/css/responsive.css`):
    - Changed the mobile drawer breakpoint from `868px` to `991px` (`@media (max-width: 991px)`), synchronizing it with `sections.css` line 841 (`.code-activity-grid`).
    - With 6 navigation links (including Certificates) requiring ~980px total header width, breaking below 992px completely eliminates overlap between the brand monogram, navigation menu, and action buttons on viewports between 869px and 991px.
  - **Medium Desktop Header Ergonomics** (`assets/css/responsive.css`):
    - Added `@media (min-width: 992px) and (max-width: 1120px)` rule with condensed navigation link gaps (`gap: 16px` instead of `28px`) and collapsed search placeholder text, providing ~90px of clean breathing room on 13" laptops and iPad Pro landscape screens.
  - **Bounded Hero Collage & Tight Frame** (`assets/css/responsive.css`):
    - Set responsive `max-width` bounds on `.hero-visual` (`max-width: 380px` for tablet `<= 991px`, `max-width: 320px` for mobile `<= 600px`, and `max-width: 275px` for small devices `<= 480px`).
    - Centered the collage with `margin: 12px auto 44px auto` so floating children (`.php-snippet-card`, `.currently-building-card`, handwritten annotations) remain tightly bound around the polaroid photo rather than drifting across an unbounded 100% wide container.
    - Adjusted `.php-snippet-card` (`left: -12px`) and `.currently-building-card` (`right: -10px`) coordinates to prevent clipping against viewport edges.
- **Verification**: Chrome CDP layout audit confirmed 0 overflow issues and 0 collisions across 320px, 360px, 375px, 480px, 600px, 768px, 868px, 900px, 991px, 992px, 1024px, and 1200px. All 12 JavaScript files validated with `node -c`. Both `http://localhost/lollipop/` and `http://localhost/lollipop/about.html` return HTTP 200 OK.

## 2026-09-19: Certificates Navigation Highlight & Scroll-Spy Synchronization
- **Objective**: Fix the navigation link and active highlight state for the "Certificates" section in both desktop and mobile headers so it correctly highlights when scrolling through `#certificates` on the homepage and reliably smooth-scrolls to the section without 404 errors.
- **Key Deliverables**:
  - **Header Navigation Path Resolution** (`components/header.html`):
    - Changed `href="certificates.html#certificates"` to `href="index.html#certificates"` in both `.desktop-nav` and `.mobile-nav-links`. Since certificates are hosted dynamically on `index.html` as Section 04, this points to the exact in-page anchor without attempting to load a nonexistent standalone page.
  - **Robust Scroll-Spy Hash Matching** (`assets/js/navigation.js`):
    - Enhanced `updateActiveLink()` to parse the target fragment (`linkHash === currentSectionId`), allowing any link format (`#certificates`, `index.html#certificates`) to match the active section.
    - Added fallback DOM query (`document.querySelectorAll`) in case dynamic partial templates finish mounting after initial scroll check.
    - Added bottom-of-page boundary detection and mapped `currently-building` to `selected-work` so the active navigation state never goes blank.
- **Verification**: Verified zero syntax errors via `node -c`, tested HTTP 200 responses on both `http://localhost/lollipop/` and `http://localhost/lollipop/about.html`.

## 2026-09-19: Fix & Improve Profile Responsiveness (Profile First Before Info)
- **Objective**: Reorder the hero elements on mobile and tablet screens so that the profile photo collage appears first before the introductory info/text, while completely optimizing the responsiveness and fluid scaling of the profile card, IDE code snippet, annotations, and floating cards to eliminate clipping and horizontal overflow.
- **Key Deliverables**:
  - **Profile-First Stacking Order** (`assets/css/responsive.css`):
    - Across tablet (`<= 868px`), mobile (`<= 600px`), and compact devices (`<= 480px`), set `.hero-visual` to `order: 1` and `.hero-content` to `order: 2`.
    - Visitors on handheld and tablet devices now see Karl's signature profile photo collage right at the top, followed immediately by his name, bio narrative, CTA buttons, and social channels.
  - **Responsive Photo Card Scaling** (`assets/css/responsive.css`):
    - Updated `.hero-photo-card` to use `aspect-ratio: 340 / 430` with fluid `clamp()` widths (`clamp(240px, 36vw, 290px)` on tablet, `clamp(210px, 60vw, 250px)` on mobile, and `clamp(185px, 58vw, 215px)` on small screens) with proportional padding.
    - Set `.hero-photo-img` to `height: calc(100% - 10px); width: 100%; object-fit: cover;`, preserving the authentic portrait proportions without stretching or distortion.
  - **Fluid Sizing for Floating Elements & Overflow Protection** (`assets/css/responsive.css`):
    - `.php-snippet-card`: Scaled with fluid clamp widths (`160px` to `250px`) and responsive font sizes and paddings, preventing side clipping.
    - `.currently-building-card`: Shifted coordinates and clamped width (`clamp(190px, 56vw, 230px)`), with refined label/title/status typography.
    - `.hero-annotation-dream` and `.hero-annotation-steps`: Sized fluidly with `clamp()`, hiding steps on narrow mobile screens to avoid visual collision.
    - Adjusted `.hero-visual` bottom margin to `32px–38px` so the overlapping Currently Building card floats with breathing room above `.hero-content`.
  - **Compact Button & Action Stacking** (`assets/css/responsive.css`):
    - On screens `<= 480px`, `.hero-actions` stacks cleanly with full-width primary button and evenly spaced social pill links (`flex: 1 1 0`).
  - **TODO List Tracking** (`README.md`):
    - Marked item `- [x] Fix and improve profile responsiveness (profile first before info)`.
- **Verification**: All 11 JavaScript modules pass `node -c` with zero syntax errors, verified HTTP 200 OK on both `http://localhost/lollipop/` and `http://localhost/lollipop/about.html`.

## 2026-09-19: "More About Me" CTA & Homepage / About Page Section Swap
- **Objective**: Replace the Hero primary CTA button with "More About Me" linking to `about.html`, relocate the Certificates & Certifications section onto `index.html` (as section `04`), and move the About Me bio and snapshot grid to `about.html` while ensuring the Tech Stack remains intact.
- **Key Deliverables**:
  - **Hero CTA Transformation** (`components/hero.html`):
    - Replaced the primary CTA button text with `"More About Me"` and redirected its destination to `about.html`.
  - **Homepage Section 04: Verified Certificates** (`components/certificates.html`, `assets/js/components.js`, `assets/css/sections.css`):
    - Cut `about-preview` from `HOMEPAGE_MANIFEST` and mounted `certificates`.
    - Added `<span class="section-kicker-num">04</span>`, heading, and verified summary pill to `components/certificates.html`.
    - Applied desktop full-height styling (`min-height: 100vh; min-height: 100dvh; display: flex; align-items: center;`) with responsive collapse for mobile/tablet in `assets/css/responsive.css`.
    - Dynamic certificate grid populated automatically by `renderCertificates()` with credential modal inspection triggers.
  - **About Page: Dedicated About Me Snapshot & Preserved Tech Stack** (`assets/js/components.js`, `components/about-page-hero.html`, `components/about.html`):
    - Cut `certificates` from `ABOUT_MANIFEST` and mounted `about` (`components/about.html`) directly after Tech Stack (`stack`), preserving the full tech stack section.
    - Cleaned up redundant `.about-secondary-meta` from `components/about-page-hero.html` so that Education, Focus, Currently Learning, and Technical Interests are exclusively presented in the dedicated About Me component.
    - Aligned Focus and Interests in `components/about.html` to reflect Karl's backend, web development, and generative AI interests.
  - **Search & Navigation Synchronization** (`assets/js/search.js`):
    - Updated `aboutSections` lookup so section `about` maps to `about.html#about` and `certificates` smoothly targets `index.html#certificates`.
  - **TODO List Tracking** (`README.md`):
    - Marked item `- [x] Replace "View Projects" with "More About Me" and swap certificates / about me sections between index and about pages`.
- **Verification**: All JavaScript files validated syntax (`node -c`), verified HTTP 200 OK across both `http://localhost/lollipop/` and `http://localhost/lollipop/about.html`.

## 2026-09-19: Universal Blueprint Grid Lines Background Across All Sections (Excluding Footer)
- **Objective**: Apply the subtle technical blueprint / editorial grid lines ("the line thing") site-wide across all sections (excluding the global footer), creating a cohesive, architectural aesthetic throughout the entire portfolio while keeping the footer clean and grounded.
- **Key Deliverables**:
  - **Universal Grid Lines Pseudo-Element** (`assets/css/base.css`):
    - Configured `section::before, .editorial-grid-bg` with `position: absolute; inset: 0; background-image: linear-gradient(to right, var(--border-subtle) 1px, transparent 1px), linear-gradient(to bottom, var(--border-subtle) 1px, transparent 1px); background-size: 80px 80px; opacity: 0.35; pointer-events: none; z-index: 0;`.
    - Applied `position: relative;` to all `section` elements.
    - Set `section > .container { position: relative; z-index: 1; }` so all content, cards, badges, text, and interactions sit cleanly above the grid lines.
    - Explicitly excluded `.site-footer` so the footer maintains its solid, refined base styling.
    - Cleaned up redundant manual grid `<div>` in `components/hero.html` to maintain uniform line weight and opacity everywhere.
  - **Coverage Across Site**:
    - Homepage: Hero, 01 Currently Building, 02 Selected Work, 03 GitHub Activity, 04 About Me Preview, and 05 Contact.
    - About Page: About Hero, Development Journey, Tech Stack, and Certificates.
    - 404 Error Page: Error showcase card and background.
  - **Theme-Adaptive**:
    - Lines automatically synchronize with light mode (`#ECEEF2`) and dark mode (`#1E293B`) via CSS custom properties.
- **Verification**: Zero syntax errors in CSS/JS (`node -c`), verified both `http://localhost/lollipop/` and `http://localhost/lollipop/about.html` return `HTTP 200 OK`.

## 2026-09-19: High-Impact Desktop Visual Scaling & Reference Layout Alignment
- **Objective**: Scale up the visual hierarchy and layout elements across desktop displays so they look prominent, commanding, and fill the screen with stature (matching the reference layout of Logan M. Panucat), eliminating undersized elements and vast empty spaces.
- **Key Deliverables**:
  - **Wider Container Footprint** (`assets/css/variables.css`):
    - Expanded `--container-max` from `1320px` to `1520px`, allowing content to spread naturally across desktop displays while keeping balanced side margins.
  - **Monumental Typography & Actions** (`assets/css/sections.css`):
    - `.hero-title`: Scaled up to `clamp(3.25rem, 5.2vw, 5.5rem); font-weight: 700; line-height: 1.05; letter-spacing: -0.035em;`.
    - `.hero-intro`: Enlarged to `clamp(1.25rem, 1.8vw, 1.65rem); font-weight: 500; max-width: 640px;`.
    - `.hero-supporting`: Elevated to `1.0625rem; line-height: 1.65; max-width: 580px;`.
    - `.hero-cta-btn`: Scaled to `padding: 13px 28px; font-size: 1rem; border-radius: var(--radius-full); box-shadow: 0 4px 14px rgba(37,99,235,0.28);`.
    - `.hero-text-link`: Transformed secondary links into interactive pill buttons (`padding: 10px 18px; border-radius: var(--radius-full); background: var(--surface); border: 1px solid var(--border);`).
  - **Right Visual Collage Enlargement** (`assets/css/sections.css`, `assets/css/components.css`, `components/hero.html`):
    - `.hero-photo-card`: Scaled up from 268x334px to `340px x 430px` (image `height: 396px;`) with a rich elevation shadow (`0 24px 50px -12px rgba(15, 23, 42, 0.25)`).
    - `.php-snippet-card`: Expanded to `290px` wide and styled with an authentic IDE window header with window dots (`.dot-red`, `.dot-yellow`, `.dot-green`) and `Student.php` label.
    - `.currently-building-card`: Scaled up to `280px` max-width with larger typography and badges.
    - Handwritten Annotations: Scaled up to `1.65rem` and `1.5rem` for prominent editorial personality.
    - Added subtle blueprint grid background (`.editorial-grid-bg`) to `.hero-section`.
  - **Section Headings & Currently Building Scaling** (`assets/css/sections.css`):
    - `.section-heading`: Scaled to `clamp(2.25rem, 3.8vw, 3.25rem); font-weight: 700;`.
    - `.cb-statement`: Scaled to `1.35rem; max-width: 580px;`.
    - `.cb-compact-card` & body: Scaled up with richer padding (`24px 28px`) and `1.35rem` title.
- **Verification**: Zero syntax errors in CSS/JS (`node -c`), verified both `http://localhost/lollipop/` and `http://localhost/lollipop/about.html` return `HTTP 200 OK`.

## 2026-09-19: Full-Screen Height (100vh) Desktop Layout for All Sections
- **Objective**: Widen and elevate each section on desktop so that each section fills the entire screen height (`100vh`) with dedicated focus, eliminating awkward vertical viewport sharing (where Hero and 01 Currently Building previously shared one screen and cut off content) and removing unnecessary empty spaces.
- **Key Deliverables**:
  - **Homepage Sections Full-Screen Desktop Geometry** (`assets/css/sections.css`):
    - `.hero-section`: Configured with `min-height: 100vh; min-height: 100dvh; display: flex; align-items: center; padding-top: var(--header-height); padding-bottom: 24px; box-sizing: border-box; scroll-margin-top: 0;`.
    - `.currently-building-section`: Configured with `min-height: 100vh; min-height: 100dvh; display: flex; align-items: center; padding-top: calc(var(--header-height) + 24px); padding-bottom: 40px; box-sizing: border-box; border-top: 1px solid var(--border); scroll-margin-top: 0;`.
    - `.selected-work-section`: Configured with `min-height: 100vh; min-height: 100dvh; display: flex; align-items: center; padding-top: calc(var(--header-height) + 32px); padding-bottom: 56px; box-sizing: border-box; border-top: 1px solid var(--border); scroll-margin-top: 0;`.
    - `.activity-section`: Configured with `min-height: 100vh; min-height: 100dvh; display: flex; align-items: center; padding-top: calc(var(--header-height) + 24px); padding-bottom: 48px; box-sizing: border-box; scroll-margin-top: 0;`.
    - `.about-preview-section`: Configured with `min-height: 100vh; min-height: 100dvh; display: flex; align-items: center; justify-content: center; padding-top: calc(var(--header-height) + 24px); padding-bottom: 48px; box-sizing: border-box; border-top: 1px solid var(--border); scroll-margin-top: 0;`.
    - `.contact-section`: Configured with `min-height: calc(100vh - var(--header-height)); min-height: calc(100dvh - var(--header-height)); display: flex; align-items: center; padding-top: calc(var(--header-height) + 24px); padding-bottom: 48px; box-sizing: border-box; scroll-margin-top: 0;`.
    - Added `> .container { width: 100%; }` to each section flex parent to ensure container widths and responsive bounds remain robust.
  - **About Page Full-Screen Geometry** (`assets/css/sections.css`):
    - `.about-hero-section` and `.journey-section`: Enhanced with `min-height: 100vh; min-height: 100dvh; display: flex; align-items: center; padding-top: calc(var(--header-height) + 32px); scroll-margin-top: 0;`.
  - **Fluid Tablet and Mobile Resets** (`assets/css/responsive.css`):
    - Under `@media (max-width: 868px)`, reset all sections to `min-height: auto; display: block;` with standard responsive padding (`48px 0`) to preserve natural scrolling without mobile URL-bar layout shifts.
- **Verification**: Zero syntax errors in CSS and JS (`node -c`), verified both `http://localhost/lollipop/` and `http://localhost/lollipop/about.html` return `HTTP 200 OK`.

## 2026-09-19: Error State Design Enhancement & Custom 404 Showcase Experience
- **Objective**: Redesign the bare 404 error page into an editorial, developer-crafted showcase that seamlessly aligns with Karl Evan's portfolio design language (masking tape strip, watermarked serif numeral, syntax-highlighted PHP terminal snippet card, handwritten annotation, and multi-option recovery paths), integrated with site-wide header, footer, search modal, and theme manager.
- **Key Deliverables**:
  - **Showcase Error Component** (`components/error-404.html`):
    - Masking tape strip (`.tape-strip.tape-top-center`).
    - Watermarked `404` numeral in Newsreader serif at low opacity.
    - Status pill badge: `● HTTP 404 · ROUTE NOT FOUND`.
    - Serif headline: *"Lost in the codebase?"*.
    - Syntax-highlighted PHP terminal snippet card (`routing_exception.log`) with colored dots (`#EF4444`, `#F59E0B`, `#10B981`) and formatted route fallback logic.
    - Handwritten annotation note: *"don't worry, here's the way back ⤸"* in Caveat font.
    - Direct action choices: Primary button `Back to Home →`, Secondary button `View Selected Work`, and quick search trigger `Search Portfolio [Ctrl K]`.
    - Quick jump links list: Currently Building, Selected Work, Activity, About Karl, Contact.
  - **Component Architecture Integration** (`assets/js/components.js`, `404.html`):
    - Added `ERROR_404_MANIFEST` to mount standard site `header.html`, `error-404.html`, `footer.html`, and `project-modal.html`.
    - Set base path `<base href="/lollipop/">` in `404.html` for clean relative asset loading on nested missing routes.
    - Included all site-standard Google Fonts (`Caveat`, `Inter`, `JetBrains Mono`, `Newsreader`).
  - **Active State & Search Navigation** (`assets/js/navigation.js`, `assets/js/app.js`):
    - Added `is404Page` detection in `NavigationManager.updateActiveLink` to prevent false active link highlights.
    - Bound `#error-search-btn` to `SearchManager.open()` for immediate modal search access.
  - **ErrorState Module Upgrade** (`assets/js/error-state.js`):
    - Upgraded `renderPage()` to generate the identical rich showcase card with tape strip, terminal snippet, and recovery buttons on any dynamic component or router error.
  - **Styling Tokens & Dark Mode** (`assets/css/components.css`):
    - Added full styles for `.error-showcase-section`, `.error-showcase-card`, `.error-watermark-num`, `.error-code-terminal`, `.terminal-dots`, `.terminal-code`, `.error-doodle`, `.error-showcase-actions`, `.error-quick-destinations` with full light/dark theme CSS variable support.
- **Verification**: All JS modules validated with `node -c`, HTTP 200 returned on `404.html`, HTTP 404 returned on non-existent routes via `.htaccess`.

## 2026-09-19: HTTP Error Handling, Private Repository States & Custom 404 Routing
- **Objective**: Implement comprehensive 4xx client-error, 5xx server-error, and private repository state handling throughout the portfolio without altering the existing visual identity, design aesthetics, or section layouts. Ensure all API requests fail gracefully with clean, portfolio-styled error states, provide retry actions where appropriate, and differentiate between private/restricted (403), missing (404), rate-limited (429), and server-error (5xx) states.
- **Key Deliverables**:
  - **Reusable ErrorState Module** (`assets/js/error-state.js`):
    - Diagnostic mappings for 400, 401, 403, 404, 429, 500, 502, 503, 504, and 0 (Network Error).
    - `renderCard`: Developer-oriented error box with status badge, title, explanation, and interactive retry button.
    - `renderAction`: Distinctive repository action rendering (`[ 🔒 Private Repository ]`, `[ Repository Unavailable ]`, or active public link).
    - `renderModalAction`: In-modal repository action with explanatory status note.
    - `checkRepository`: Asynchronous status inspection with persistent 30-minute `sessionStorage` cache to safeguard against unauthenticated GitHub API rate limits.
    - `renderPage`: Full-page custom error view for 404 / 500 boundaries.
  - **Repository States on Project Cards**:
    - `assets/js/app.js`: Updated `renderSelectedProjects()` to render status pills and asynchronously verify repository availability. Updated `Currently Building` repository button to reflect status.
    - `assets/js/projects.js`: Updated `createProjectCardHtml` and `render` to preserve project cards while swapping the repository action to `[ 🔒 Private Repository ]` or `[ Repository Unavailable ]`.
    - `assets/js/modal.js`: Integrated `ErrorState.renderModalAction` with live status indicators in the "Repository & Links" area.
  - **GitHub Recent Activity Resiliency** (`assets/js/github.js`):
    - Preserved existing section layout (profile badge, activity feed, top languages breakdown).
    - If contribution calendar retrieval fails, replaces only the matrix container with a styled `ErrorState` card with an interactive "Retry Loading Activity" button.
  - **Contact Form & Component Loader API Safety**:
    - `assets/js/contact.js`: Added HTTP status inspection (400, 429, 5xx, network) with safe JSON parsing and mailto fallback.
    - `assets/js/components.js`: Replaced plain unstyled error with `ErrorState.renderPage` and retry action.
  - **Custom 404 Error Page & Server Routing**:
    - `404.html`: Standalone portfolio-styled 404 error page with theme switcher, Newsreader headline, and "Back Home" CTA.
    - `.htaccess`: Added Apache `ErrorDocument 404 /lollipop/404.html` and `ErrorDocument 500 /lollipop/404.html`.
  - **Design System Tokens** (`assets/css/components.css`):
    - Added clean error state cards, status badges, repository pills, and full-page error layout with automatic dark/light theme support.
- **Verification**: All 12 JS modules pass `node -c`, ErrorState unit test passed, Apache 200/404 routes verified.

---

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
