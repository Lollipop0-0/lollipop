# Project Rules

These rules govern all code modifications, architecture design, and development workflows for the portfolio.

---

## 1. The Obsidian-First Workflow
1. **Read First**: Every request begins by reading relevant Obsidian documentation (see [[AI Context]], [[Architecture]], [[File Map]], [[Technical Decisions]]).
2. **Inspect Minimally**: Inspect only files directly relevant to the requested task. Avoid entire codebase scans.
3. **Update Synchronously**: Every meaningful change to code, design, layout, or data must be recorded in the relevant Obsidian notes before marking the task complete.
4. **Link Notes**: Use Obsidian `[[WikiLinks]]` across notes to preserve navigation integrity.

---

## 2. Technology & Framework Constraints
- **Pure Vanilla Stack**: Strict HTML5, Vanilla CSS, and Vanilla JavaScript (ES6+).
- **No Build Tools or Bundlers**: No Vite, Webpack, Parcel, Rollup, Babel, or npm dependencies. Everything must run natively in the browser.
- **No CSS Frameworks**: Do not introduce TailwindCSS, Bootstrap CSS imports (except where conceptual tokens or classes exist natively), or styled-components.
- **No Simulated Data**: Never fabricate GitHub activity matrices, artificial contribution counts, or mock server success states. Maintain 100% data integrity.

---

## 3. CSS & Design System Standards
- **Token Usage**: Always use design tokens defined in `assets/css/variables.css` (e.g. `var(--primary)`, `var(--surface)`, `var(--radius-md)`, `var(--font-serif)`).
- **Modular Stylesheets**:
  - `variables.css`: Design tokens, colors, typography variables.
  - `base.css`: Reset, base tags, skip link, `.container`.
  - `components.css`: Reusable UI components (buttons, badges, cards, modal dialog).
  - `sections.css`: Section-specific layouts (Hero, About, Work, Stack, Journey, Contact).
  - `responsive.css`: Media query overrides and drawer behaviors.
- **Responsive Breakpoints**:
  - Desktop: Default styles (`> 868px`).
  - Tablet: `@media (max-width: 868px)` (2-column grids, mobile menu toggle, condensed headers).
  - Mobile: `@media (max-width: 480px)` (1-column layouts, stacked controls).
- **Accessibility & Motion**:
  - Respect `@media (prefers-reduced-motion: reduce)`.
  - Visible focus indicators (`:focus-visible`) must never be suppressed.
  - WCAG 2.1 AA color contrast compliance.

---

## 4. JavaScript Architecture Rules
- **Modular Encapsulation**: Use the Immediately Invoked Function Expression (IIFE) module pattern for each script (e.g., `ComponentLoader`, `ThemeManager`, `NavigationManager`, `ProjectsManager`, `ModalManager`, `GitHubManager`, `ContactManager`, `SearchManager`).
- **Data-Driven Decoupling**:
  - Static project data, tech stacks, milestones, and personal details belong in `assets/js/data.js` (`window.PORTFOLIO_DATA`).
  - Logic belongs in module scripts (`assets/js/*.js`).
  - Structural templates belong in `components/*.html`.
- **Asynchronous Mounting**:
  - `ComponentLoader` asynchronously fetches and injects HTML partials into `#app`.
  - All DOM-dependent managers must initialize inside `DOMContentLoaded` after `await ComponentLoader.loadAll('#app')`.

---

## 5. Accessibility (WAI-ARIA) Guidelines
- Accessible skip link (`#main-content`) at the very top of `<body>`.
- Semantic landmark elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- Dialogs must implement WAI-ARIA modal patterns (`role="dialog"`, `aria-modal="true"`, focus trapping, escape key closing).
- All interactive buttons must have accessible labels or `aria-label` when text is absent.

---

## Cross References
- System Structure: [[Architecture]]
- File Responsibilities: [[File Map]]
- System Decisions: [[Technical Decisions]]
