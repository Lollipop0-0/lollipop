# Current Task

## Status: Complete / Idle
**Last Updated**: October 2, 2026

---

## Active Task Summary
- **Tasks**:
  1. **Clean, Minimal Tour Invitation Modal (Cut Picture & Fluff)**:
     - **Removed AI-Style Visuals**: Completely removed the avatar picture/frame, rainbow gradient borders, glowing gradient orb, green pulsing radar beacons, and feature chips.
     - **Natural, Human Prompting**: Replaced verbose copy with clean, direct typography:
       - Heading: `Want a quick tour?`
       - Description: `I can show you around the key sections and features.`
     - **Direct Action Buttons**: Two clean, balanced, side-by-side buttons: `No, thanks` (secondary) and `Yes, guide me` (primary).
     - **Button Contrast Fix**: Fixed button text visibility bug where `.gi-btn-primary` used non-existent `--background` variable; added `color: #ffffff !important` in light mode and `color: #09090b !important` in dark mode.
     - **Compact & Focused Card**: Set to `max-width: 320px` with 18px border radius and clean surface background matching the site's design tokens.
     - **Recompiled Assets**: Compiled production `styles.min.css` (161.9 KB) and `bundle.min.js` (338.0 KB). Syntax validated with `node -c`.
  2. **Mobile Menu Toggle Tour Guidance (`#mobile-menu-toggle`)**:
     - **Pre-Drawer Hamburger Guidance**: On mobile devices, the autonomous guide now specifically points to the hamburger menu toggle button (`#mobile-menu-toggle` / `[data-guide="mobile-menu-toggle"]`) before the drawer is opened.
     - **Visual Feedback & Tap Animation**: Cursor glides directly to the mobile toggle, applies simulated hover/tap styling (`.mobile-menu-toggle.gc-hover`), and types: *"Tap the menu toggle anytime to open navigation links and explore pages."*
     - **Autonomous Interaction & Sound**: Once explained, the guide triggers an acoustic pop (`SoundManager.playPop()`), opens the navigation drawer (`NavigationManager.openDrawer()`), pauses for drawer animation, and guides through drawer items (`About`, `Projects`, `Certificates`, `More`, `Gear`, `Tech Stack`).
     - **Adaptive Desktop Skip**: Includes `skip: () => !isMobile()` guard so desktop users continue guiding directly to header navigation links without any awkward jumps or delay.
     - **Recompiled Assets**: Compiled production `styles.min.css` (164.0 KB) and `bundle.min.js` (340.0 KB). Syntax validated with `node -c`.
  2. **Centered & Ultra-Refined Tour Invitation Modal Redesign**:
     - **Centered Viewport Presentation**: Fixed the bottom-docked positioning, centering the modal perfectly across both mobile and desktop with a deep cinematic backdrop blur (`14px saturate(160%)`).
     - **Spotlight Karl Avatar Frame**: Created a centered 72px squircle avatar with a 3-color gradient ring (`#6366f1` -> `#38bdf8` -> `#ec4899`), subtle drop shadow, and a pulsing live green beacon badge.
     - **Ambient Gradient Orb**: Added `.gi-glow-orb` giving the top of the card an elegant, futuristic radial illumination.
     - **Feature Preview Chips**: Added 3 micro-chips (`Featured Projects`, `Tech Stack`, `Workstation`) setting clear expectations for the tour.
     - **Vertical Action Hierarchy**: Replaced cramped side-by-side buttons with full-width primary CTA pill (`Yes, guide me ->`) and secondary ghost button (`No, I'll explore on my own`), eliminating awkward line wraps and maximizing touch friendliness.
     - **Recompiled Assets**: `styles.min.css` (163.8 KB) and `bundle.min.js` (339.4 KB). Syntax validated with `node -c`.
  2. **Comprehensive User Interaction Lockout During Guided Tour**:
     - **Full Action Barrier**: While on the tour, visitors are completely prevented from clicking underlying links/buttons/cards, scrolling (wheel/touch/keys), and pressing keyboard shortcuts (`Ctrl+K`, `M`, `Tab`, `Space`, `Enter`, navigation keys).
     - **Whitelisted Target**: The only element permitted to receive interaction is the Stop Guide button (`#guideStopBtn` / `#guideStopWrap`), plus the SweetAlert2 confirmation dialog when invoked.
     - **Capture-Phase Window Shield (`assets/js/guide.js`)**: Implemented `lockUserInteractions()` and `unlockUserInteractions()` intercepting pointer, scroll, keydown, drag, and focus events at the `window` capture level with `e.stopImmediatePropagation()` and `e.preventDefault()`.
     - **Scroll & Viewport Lock (`assets/css/guide.css`)**: Added `html.tour-locked, body.tour-locked` (`overflow: hidden !important; touch-action: none !important; user-select: none !important;`).
     - **Recompiled Assets**: `styles.min.css` (161.9 KB) and `bundle.min.js` (338.4 KB). Syntax checked with `node -c`.
  2. **Removed Hero Scroll-Down Animated Indicator**:
     - **Markup**: Completely removed `#hero-scroll-indicator` and its child capsule, dot, text, and SVG arrow from [components/hero.html](file:///c:/xampp/htdocs/lollipop/components/hero.html).
     - **Navigation Logic**: Cleaned up the scroll-tracking listener in [assets/js/navigation.js](file:///c:/xampp/htdocs/lollipop/assets/js/navigation.js) that toggled `.is-scrolled-hidden`.
     - **Styles & Keyframes**: Removed all obsolete styles, media query overrides, and animations (`scroll-dot-slide`, `scroll-arrow-nudge`, `scroll-indicator-float`) from [assets/css/sections.css](file:///c:/xampp/htdocs/lollipop/assets/css/sections.css) and [assets/css/responsive.css](file:///c:/xampp/htdocs/lollipop/assets/css/responsive.css).
     - **Recompiled Assets**: Generated updated `styles.min.css` (161.5 KB, saving 2.3 KB unminified/bundled) and `bundle.min.js` (335.3 KB). Syntax validated with `node -c`.
  2. **More Dropdown Display & Separate Gear & Tech Stack Tour Guidance**:
     - **Dropdown Opening & Exhibition**: On desktop, the autonomous guide opens the "More" dropdown (`openMoreDropdown()`) so the visitor visually sees the dropdown menu expand with animated icons and descriptions. On mobile, the guide highlights the "More" section header within the open navigation drawer.
     - **Separate Navigation Guidance**:
       - **Gear Step (`gear`)**: Glides to the `Gear` item (`#more-link-gear` on desktop, `.mobile-nav-sublink[href*="gear"]` on mobile), applies simulated hover (`.nav-dropdown-item.gc-hover`), and explains: *"Gear: Explore my workstation setup, hardware, and developer equipment."*
       - **Tech Stack Step (`stack`)**: Glides to the `Tech Stack` item (`#more-link-stack` on desktop, `.mobile-nav-sublink[href*="tech-stack"]` on mobile), applies simulated hover, and explains: *"Tech Stack: Explore the languages, frameworks, databases, and AI tools I build with."*
     - **Smooth Teardown**: Upon advancing to `search`, exiting, or stopping, `closeMoreDropdown()` cleanly closes the dropdown menu and resets state.
     - **Markup & Styling**: Added `data-guide="nav-gear"` and `data-guide="nav-stack"` to [components/header.html](file:///c:/xampp/htdocs/lollipop/components/header.html), styled `.nav-dropdown-item.gc-hover` in [assets/css/guide.css](file:///c:/xampp/htdocs/lollipop/assets/css/guide.css), and exported `openMoreDropdown`/`closeMoreDropdown` from `NavigationManager` in [assets/js/navigation.js](file:///c:/xampp/htdocs/lollipop/assets/js/navigation.js).
  2. **Added Missing Certificates / Certification Tour Step in Mobile Drawer & Desktop Nav**:
     - **Resolved Skipped Certification**: On mobile view, the autonomous walkthrough previously jumped from `Projects` directly to `Tech Stack`, skipping over the `Certificates` link in the mobile navigation drawer.
     - **Choreography Update (`assets/js/guide.js` & `components/header.html`)**: Added the `certificates` step between `projects` and `stack`:
       - Seamlessly highlights the `Certificates` link in the open mobile drawer (or in the desktop top navigation) with synthetic `.gc-hover`.
       - Explains Karl's verified credentials: *"Explore my verified programming certifications and course credentials."*
       - Added `data-guide="nav-certificates"` to both desktop and mobile navigation links in `components/header.html`.
  2. **Mobile Guided Tour Invitation, Click Barrier (`#guideClickGuard`), Stop Button & SweetAlert2 Confirmation**:
     - **Mobile Decision Flow ("If no then no, if yes then guide them")**:
       - After preloader completion, visitors on mobile and desktop are prompted with the focused invitation modal: *"Want a quick guided tour? 👋"* with Karl's avatar and two clear options.
       - **If "No" ("No, I'll explore on my own" or dismiss)**: Dismisses smoothly, records choice in `sessionStorage` (`ket_guide_tour_choice: "no"`), does not run the tour, does not open mobile navigation drawer, and quietly displays the `#guidePrompt` replay pill at the bottom so the visitor can explore undisturbed.
       - **If "Yes" ("Yes, guide me")**: Records choice, smoothly starts the autonomous walkthrough, and activates the protective click barrier.
     - **Click Barrier Overlay (`#guideClickGuard`)**:
       - Fixed viewport barrier at `z-index: 9400` that prevents visitors from accidentally clicking, tapping, or navigating away through links, buttons, theme toggles, or cards while the guide is active. Intercepts and stops propagation for `click`, `mousedown`, `touchstart`, `touchend`, and `touchmove`.
     - **Dedicated Stop Guide Button (`#guideStopWrap` / `#guideStopBtn`)**:
       - Accessible floating pill at `z-index: 9600` (above the click barrier and cursor) positioned in the bottom center thumb zone (`bottom: 24px; left: 50%; transform: translateX(-50%);`) with a live pulsing indicator and `✕` icon, giving users full control to exit anytime.
     - **SweetAlert2 Confirmation Dialog Integration**:
       - Integrated standalone SweetAlert2 package locally (`assets/js/sweetalert2.all.min.js`) bundled directly into `assets/js/bundle.min.js` (zero CDN dependencies).
       - Clicking the Stop Guide button (or pressing `Escape`) immediately freezes the tour animation (`paused = true`) and presents a themed SweetAlert2 confirmation dialog: *"Stop the tour? Are you sure you want to stop the guided walkthrough?"*.
       - **Confirmed ("Yes, stop tour")**: Tears down the tour, removes `#guideClickGuard`, hides `#guideStopWrap`, closes mobile drawer if open, hushes speech bubble, and reveals the `#guidePrompt` pill.
       - **Cancelled ("Keep watching")**: Seamlessly unpauses the tour and resumes typing/gliding from the exact point of interruption.
     - **Theme-Adaptive SweetAlert Styling**: Custom styled for both obsidian dark mode and crisp paper light mode with glassmorphic backdrop blur and responsive layout.
  2. **Fixed Tour Speech Bubble Viewport Clipping & Headline Text Overlap**:
     - **Resolved Left Edge Viewport Clipping**: Eliminated rigid CSS `calc(-100% - 1px)` transforms in [assets/css/guide.css](file:///c:/xampp/htdocs/lollipop/assets/css/guide.css) that caused the bubble to protrude off-screen when `cursor.x < bubbleWidth`. Implemented dynamic viewport-boundary clamping in `place()` in [assets/js/guide.js](file:///c:/xampp/htdocs/lollipop/assets/js/guide.js), strictly bounding the bubble between `14px` and `window.innerWidth - width - 14px`.
     - **Resolved Content Overlap with Hero Title ("Tabunda")**: Changed the portrait step anchor from bottom (`at: "below"`) to top (`at: "top"`), placing the cursor on Karl's portrait and positioning the speech bubble cleanly in the open upper collage space rather than colliding with the hero headline.
  2. **Post-Preload Tour Invitation Card (`#guideInvite`) & Mobile Drawer Tour Guidance**:
     - **Post-Preload Invitation Prompt**: Synchronized immediately after the stickman runner preloader completes. Displays an elegant glassmorphic invitation card asking visitors: *"Want a quick guided tour? 👋"* with Karl's avatar thumbnail, a `Yes, guide me` CTA (starts tour with acoustic pop), and an `I'll explore on my own` dismissal (remembers choice in `sessionStorage` and activates floating `#guidePrompt` replay pill).
     - **Mobile Phone Tour Support**: Lifted desktop-only restrictions to provide full mobile cursor and speech bubble responsiveness (`assets/css/guide.css` and `assets/js/guide.js`).
     - **Mobile Navbar Drawer Guidance**: When reaching the navigation links on mobile devices, the autonomous guide automatically opens the mobile navigation drawer (`window.NavigationManager.openDrawer()`), highlights and explains `About`, `Projects`, and `Tech Stack` in the drawer without clicking or navigating away, and then smoothly closes the drawer (`window.NavigationManager.closeDrawer()`) before guiding through the header controls (`Search`, `Theme Toggle`, `Music Toggle`) and signing off with Farewell.
  2. **Customized Autonomous Tour Guide Choreography (`#guideCursor` & `#guidePrompt`)**: Tailored the virtual tour sequence to feature:
     - **Home**: Welcomes visitor at hero headline / home navigation (`Hi! I'm Karl Evan, welcome to my website! 👋`).
     - **Profile**: Glides to interactive avatar portrait card (`Hover over my portrait to reveal interactive character reactions.`), triggering live Easter egg reactions via `.gc-hover`.
     - **About**: Glides to About nav link / hero button (`Wanna know more about me? Check out my story and journey here.`).
     - **Projects**: Highlights featured work and case studies.
     - **Tech Stack & Gear**: Highlights `More` dropdown for workstation and language stack.
     - **Search Bar**: Highlights Ctrl+K modal search trigger (`Quickly search across my projects, stack, and milestones with Ctrl+K.`).
     - **Light Mode & Dark Mode**: Highlights theme selector toggle (`Switch between crisp light mode, obsidian dark mode, or follow your system theme.`).
     - **Lo-Fi Music & Sound**: Highlights audio synthesis toggle (`You can toggle procedural lo-fi ambient music and acoustic sounds here.`).
     - **Hire Me**: Highlights standout contact CTA pill.
     - **Farewell**: Glides into open space and signs off (`Enjoy exploring my work! Scroll around and make yourself at home. ✌️`).
     - Added smooth scroll to top when replaying the tour via `#guidePrompt`.
  2. **Fixed Modal Scroll Interference & Background Page Scroll Chaining**: Completely isolated modal scrolling so mouse wheel and touch gestures smoothly scroll `#modal-body` rather than scrolling the main page. Added `html.modal-locked, body.modal-locked { overflow: hidden !important; overscroll-behavior: none !important; }`, applied flexbox scroll containment (`flex: 1 1 auto; min-height: 0; overscroll-behavior: contain;`), added scroll traps on `#modal-backdrop` and `#project-modal`, and ensured `modalBody.scrollTop = 0` reset upon open.
  2. **Autonomous Guide Tour Cursor (`#guideCursor`) & Replay Prompt (`#guidePrompt`) Engine (Bryl Lim inspired)**: Analyzed and integrated the virtual guided tour system from `https://www.bryllim.com/`. Features minimum-jerk trajectory physics, natural hand tremors, variable typing cadence, preloader synchronization, light/dark theme adaptation, acoustic UI integration, session persistence (`sessionStorage`), and a floating bottom `#guidePrompt` pill for replaying the tour anytime (`?tour`).
  3. **Disambiguated Java vs JavaScript & Updated Java SVG Icon on Tech Stack (`tech-stack.html`)**: Resolved the language conflation where clicking Java displayed JavaScript web projects and Sololearn's JavaScript certificate due to substring search (`"javascript".includes("java")`). Implemented strict language guards in `assets/js/app.js`, updated the Java icon to the official steaming coffee cup (`#EA2D2E`, viewBox `0 0 384 512`) in `assets/js/tech-icons.js`, and verified clean fallback to `<ACTIVE-COMPETENCY/>` coursework for Java.
  4. **Sound & Ambient Lo-Fi Music On/Off Toggle Engine**: Added dedicated `#music-toggle-btn` in desktop navbar capsule and `#mobile-music-toggle-btn` in mobile drawer with live animated 3-bar equalizer waves (`.music-bars`), keyboard shortcut (`M`), state persistence, ascending activation chime, soft mute pop, and procedural ambient lo-fi chord synthesis.
  5. **Comprehensive Website Performance & Core Web Vitals Optimization**: Audited and optimized image compression (all WebP), CLS elimination (explicit dimensions on gear images), server and edge caching (`.htaccess` mod_deflate/mod_expires, `netlify.toml` immutable caching), API response caching (15-min sessionStorage for GitHub contributions), input debouncing, and bundle minification while strictly preserving visual identity and functionality.
  6. **Fixed "View Details" Modal Trigger on Tech Stack Page (`tech-stack.html`)**: Resolved the unhandled error where `window.ModalManager.openModal` was invoked but did not exist on `ModalManager` (which exported `open`). Added `ensureElements()` lazy element lookup, aliased `openModal: open`, and added `data-modal-project` and `data-modal-certificate` attributes so clicking "View Details" opens the modal dialog seamlessly.
  7. **Tactile Acoustic UI Sound Engine (Web Audio API Synthesizer)**: Implemented low-latency sound synthesis (`assets/js/sound.js`) inspired by Naphier Node (`naphiernode.vercel.app`), creating click pops, hover micro-ticks, navigation pops, theme switch chimes, and modal/search open/close sounds without any external audio asset overhead.
  8. **Adopted Custom SVG Cursor & Radial Click Burst from marwieang.com**: Extracted the exact minimal SVG arrow pointer (`<path d='M3 3v17l5.2-4.6h7.2z' fill='white' stroke='%23111113' stroke-width='1.5'/>`) and implemented the signature 5-spark radial click-burst particle interaction on mouse clicks.
  9. **Fixed Weird Active Cell in Dark Mode Navigation Dropdown**: Replaced the solid white blinding block with an elevated dark slate icon container (`#252528`), ensuring the white SVG icon is crisp and clearly visible. Refined the active row background and badge integration for dark mode.
  10. **Cut Tech Stack from About Page**: Removed tech section from `about.html`, allowing the narrative story, background, and timeline to flow cleanly.
  11. **Dedicated Tech Stack Page (`tech-stack.html`)**: Created dedicated, standalone Tech Stack page adopting the architectural, high-fidelity developer showcase inspired by Naphier Node (`naphiernode.vercel.app`).
  12. **Strict Git & Version Control Rule**: Enforced Rule 6 in `portfolio/Project Rules.md` forbidding automatic git pushes (`git push`). All commits and compiles remain strictly local until explicitly commanded by the user.

---

## Key Deliverables & Implementation

### 1. Isolated `about.html` Narrative Flow
- Removed `stack.html` from `ABOUT_MANIFEST` in `assets/js/components.js`.
- `about.html` now mounts: `header` → `about-hero` → `journey` → `footer` → `project-modal`.
- Updated CTA buttons on certificates gallery to distinguish between reading the story (`about.html`) and exploring technologies (`tech-stack.html`).

### 2. High-Fidelity Naphier Node Inspired Tech Stack (`tech-stack.html`)
- **Page Shell**: `tech-stack.html` configured with `data-page="tech-stack"`.
- **Hero Header (`components/stack-hero.html`)**: Monospace terminal kicker `<TECH-STACK/>`, title, subtitle, and live count pill (`18 Technologies`).
- **Interactive Component (`components/stack.html`)**:
  - 6 Categorized sections (`[01/06] WEB`, `[02/06] SOFTWARE`, `[03/06] DATABASE`, `[04/06] TOOLS`, `[05/06] UI/UX`, `[06/06] AI`).
  - High-resolution SVG tool icons (`assets/js/tech-icons.js`) for PHP, HTML, CSS, JavaScript, Bootstrap, Java, C++, MySQL, MariaDB, Git, GitHub, VS Code, NetBeans, XAMPP, Figma, Gemini, and Codex.
  - Interactive `<USED-IN-PROJECTS/>` pill tags displaying which projects use each tool. Clicking any tag opens `ModalManager` with full architecture, screenshots, and live demo links.
- **Navigation & Routing**:
  - Desktop header `More` dropdown links to `tech-stack.html`.
  - Mobile navigation drawer includes direct `Tech Stack` link.
  - Quick Search dialog (`search.js`) routes "Technology Stack" directly to `tech-stack.html`.

### 3. Strict Git Policy
- **Rule 6 in `portfolio/Project Rules.md`**: No auto-pushing under any circumstances.
- All testing, verification, and asset compilation via `optimize.py` are strictly local.

---

## Verification & Status
- `tech-stack.html` returns HTTP 200 with zero console errors.
- `about.html` returns HTTP 200 with zero console errors and clean narrative layout.
- JavaScript syntax check (`node -c assets/js/bundle.min.js`) passed with exit code 0.
- All changes remain local on branch `main`. No push executed.

