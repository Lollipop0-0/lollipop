# System Architecture

This document describes the high-level architecture, lifecycle, data flow, styling system, and state management of the portfolio.

---

## 1. High-Level Architecture Overview

The portfolio is structured as a **client-side single-page application (SPA)** built with Vanilla HTML5, CSS3, and ES6+ JavaScript, with no build or compilation step.

```
                  ┌───────────────────────────────┐
                  │          index.html           │
                  │   (App Shell + Mounting #app) │
                  └──────────────┬────────────────┘
                                 │
                 DOMContentLoaded Event
                                 │
                                 ▼
                  ┌───────────────────────────────┐
                  │  ComponentLoader (loadAll)    │
                  │   Fetches /components/*.html  │
                  └──────────────┬────────────────┘
                                 │
                   Mounts Partials into DOM
                                 │
                                 ▼
     ┌─────────────────────────────────────────────────────────────┐
     │              app.js Orchestrator Pipeline                   │
     ├───────────────────────────┬─────────────────────────────────┤
     │  1. ThemeManager.init()   │ Reads localStorage / system OS  │
     │  2. Navigation.init()     │ Smooth scroll, scrollspy, drawer│
     │  3. renderTechStack()     │ Renders stack cards from data.js│
     │  4. renderJourney()       │ Renders timeline from data.js   │
     │  5. renderFiguringOut()   │ Renders learning from data.js   │
     │  6. ProjectsManager.init()│ Archive filtering & render      │
     │  7. ModalManager.init()   │ Accessible details dialog       │
     │  8. GitHubManager.init()  │ Multi-tier API / cache fetcher  │
     │  9. ContactManager.init() │ Validation & transparent mailto │
     │ 10. SearchManager.init()  │ Cmd+K command palette           │
     └─────────────────────────────────────────────────────────────┘
```

---

## 2. Component System (`ComponentLoader`)

Instead of hardcoding a monolithic 2,000-line HTML file, sections are separated into standalone HTML templates inside the `components/` directory.

- **Manifest**: Managed in `assets/js/components.js`:
  ```javascript
  const COMPONENT_MANIFEST = [
    { name: "header", path: "components/header.html", isMainChild: false },
    { name: "hero", path: "components/hero.html", isMainChild: true },
    { name: "about", path: "components/about.html", isMainChild: true },
    { name: "work", path: "components/work.html", isMainChild: true },
    { name: "activity", path: "components/activity.html", isMainChild: true },
    { name: "stack", path: "components/stack.html", isMainChild: true },
    { name: "journey", path: "components/journey.html", isMainChild: true },
    { name: "contact", path: "components/contact.html", isMainChild: true },
    { name: "footer", path: "components/footer.html", isMainChild: false },
    { name: "project-modal", path: "components/project-modal.html", isMainChild: false }
  ];
  ```
- **Execution**: All templates are fetched concurrently via `Promise.all` and injected into `<div id="app">`.
- **Main Container Wrapping**: Components with `isMainChild: true` are wrapped in a semantic `<main id="main-content">` landmark.

---

## 3. Data Flow & Separation of Concerns

Content is completely decoupled from markup and presentation:
- **`assets/js/data.js`**: Global `window.PORTFOLIO_DATA` object containing:
  - `personal`: Bio, institution, degree, contact, social links.
  - `featuredProject`: Deep dive data for Celestine University of the Pacific (CUP).
  - `projects`: Array of personal and collaborative projects.
  - `techStack`: Categorized skills (`WEB`, `SOFTWARE`, `DATABASE`, `TOOLS`, `UI / UX`, `AI`). See [[Tech Stack]].
  - `developmentJourney`: Chronological milestones.
  - `figuringOut`: Currently active learning topics.
- **Rendering Functions**: Pure template literal rendering functions in `app.js` and `projects.js` read `PORTFOLIO_DATA` and insert escaped HTML into designated container IDs.

---

## 4. CSS Architecture & Design Token System

The styling layer follows a tokenized modular design:

1. **`assets/css/variables.css`**:
   - Design tokens for light and dark themes (`--bg`, `--surface`, `--primary`, `--secondary`, `--accent`, `--border`, etc.).
   - Typography tokens (`--font-serif`, `--font-sans`, `--font-hand`, `--font-mono`).
   - Shadows, border radii, and z-index layers.
2. **`assets/css/base.css`**:
   - CSS reset, box-sizing, root typography scale, skip-link styles, `.container` max-width (`1320px`).
3. **`assets/css/components.css`**:
   - Universal reusable components: buttons, pills, stickers, annotations, modal dialog, search palette.
4. **`assets/css/sections.css`**:
   - Section-specific layout rules (Hero, About, Work, Activity, Stack, Journey, Contact, Footer).
5. **`assets/css/responsive.css`**:
   - Mobile navigation drawer and responsive breakpoint overrides.

---

## 5. State Management & Persistence

- **Theme Persistence**:
  - Managed by `ThemeManager` (`assets/js/theme.js`).
  - Stored in `localStorage` under `ket_portfolio_theme`.
  - An inline script in `<head>` applies `data-theme` immediately before stylesheet evaluation to eliminate flash of unstyled theme (FOUC).
- **GitHub Data Caching**:
  - Managed by `GitHubManager` (`assets/js/github.js`).
  - GitHub metadata and event requests are cached in `sessionStorage` with a 15-minute expiration timestamp to respect GitHub's 60 req/hr rate limit.

---

## Cross References
- Rules: [[Project Rules]]
- Files: [[File Map]]
- Features: [[Features]]
- Technical Decisions: [[Technical Decisions]]
