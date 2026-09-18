# Tech Stack Documentation

## Overview
The "Things I Build With" section (`#stack`) highlights the core technologies, tools, environments, and AI assistants used daily in development workflows.

## Data Source
- **File**: `assets/js/data.js`
- **Object**: `PORTFOLIO_DATA.techStack`

## Stack Categories & Items

### 1. WEB
- **PHP**: Server-side scripting, MVC architectural patterns, backend routing.
- **HTML**: Semantic structure, accessibility (WAI-ARIA).
- **CSS**: Modern Vanilla CSS, CSS Custom Properties, flexbox/grid layout systems.
- **JavaScript**: Vanilla ES6+, DOM manipulation, asynchronous fetching.
- **Bootstrap**: Responsive UI components and layout utilities.

### 2. SOFTWARE
- **Java**: OOP principles, desktop GUI development (Swing/AWT), data structures.
- **C++**: Computational logic, pointer arithmetic, memory management.

### 3. DATABASE
- **MySQL**: Relational database schema design, indexing, foreign keys, queries.
- **MariaDB**: Open-source relational DBMS and SQL operations.

### 4. TOOLS
- **Git**: Distributed version control, commit history, branching workflows.
- **GitHub**: Remote repository management, issue tracking, collaboration.
- **VS Code**: Primary code editor, extensions, integrated terminal.
- **NetBeans**: IDE for Java application development.
- **XAMPP**: Local Apache and MariaDB/MySQL web development environment.

### 5. UI / UX
- **Figma**: Wireframing, interactive prototyping, design systems, user flows.

### 6. AI
- **Gemini**: Google Gemini for architectural planning, code reasoning, prompt engineering, and debugging.
- **Codex**: AI code generation, agentic development, and automated scaffolding.

## Architecture & Rendering
- **Component File**: `components/stack.html` (contains container `<div id="tech-stack-container" class="stack-grid"></div>`).
- **Rendering Logic**: `assets/js/app.js` (`renderTechStack()`). Iterates over `Object.entries(window.PORTFOLIO_DATA.techStack)` and dynamically mounts `.stack-category-card` elements with bullets (`•`) and skill titles.
- **Styling**: `assets/css/sections.css` (`.stack-grid`, `.stack-category-card`, `.stack-category-header`, `.stack-category-indicator`, `.stack-category-title`, `.stack-items-list`, `.stack-item`).
- **Responsive Behavior**:
  - Desktop (> 868px): CSS Grid auto-fit with `minmax(160px, 1fr)` ensuring all 6 cards sit cleanly in a row or wrap proportionally.
  - Tablet (≤ 868px): 2 columns (`grid-template-columns: 1fr 1fr`).
- **Search Integration**: `assets/js/search.js` indexes individual stack items for the interactive quick-search palette (`Cmd/Ctrl + K`).

---

## Cross References
- Architecture & Data Flow: [[Architecture]]
- Features Overview: [[Features]]
- File Responsibilities: [[File Map]]
- Layout Decisions: [[Technical Decisions]]
- Project Rules: [[Project Rules]]
