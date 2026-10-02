# Tech Stack Documentation

## Overview
The Technology Stack is housed on its own dedicated page (`tech-stack.html`, accessible via header `More → Tech Stack`) featuring an architectural, high-fidelity developer showcase inspired by Naphier Node (`naphiernode.vercel.app`). It highlights core languages, frameworks, runtime environments, databases, developer tools, and AI assistants used across Karl Evan's projects.

---

## Dedicated Page Architecture
- **Page Route**: `tech-stack.html` (`data-page="tech-stack"`)
- **Manifest**: `TECH_STACK_MANIFEST` in `assets/js/components.js`:
  1. `header` (`components/header.html`)
  2. `stack-hero` (`components/stack-hero.html`)
  3. `stack` (`components/stack.html`)
  4. `project-modal` (`components/project-modal.html`)
- **Navigation Integration**:
  - Desktop Header: `More` dropdown → `Tech Stack` (`tech-stack.html`).
  - Mobile Drawer: Direct `Tech Stack` navigation link.
  - Command Palette (`search.js`): Quick search triggers direct routing to `tech-stack.html`.

---

## Data Source & SVG Icon Dictionary
- **Data File**: `assets/js/data.js` (`window.PORTFOLIO_DATA.techStack`)
- **Icons Dictionary**: `assets/js/tech-icons.js` (`window.TECH_ICONS`)
  - Contains exact, optimized SVG paths and viewboxes for all 18 tech items.

---

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

---

## Architectural UI & Interactive Features (Naphier Node Pattern)
- **`<TECH-STACK/>` Terminal Header**: Monospace kicker, live items count pill (`18 Technologies`), and architectural subtitle.
- **6 Category Sections**:
  - Each section features a monospace kicker (`[01/06]`, `[02/06]`, etc.), category title, and an icon grid (`.naphier-tech-grid`).
- **Interactive Tech Card (`.naphier-tech-card`)**:
  - Crisp high-resolution SVG icon (`.naphier-tech-icon-box`).
  - Primary tool title (`.naphier-tech-name`) and description (`.naphier-tech-desc`).
  - **`<USED-IN-PROJECTS/>` Tag Filter**:
    - Highlights projects that utilize this specific technology (e.g. `SmartSpace`, `Celestine University`, `Library System`).
    - Clicking on any project tag directly launches the WAI-ARIA accessible `ModalManager` dialog displaying detailed architecture, screenshots, and live repository links.
- **Responsive Layout**:
  - Desktop (> 868px): CSS Grid auto-fill with responsive 280px minimum width cards.
  - Mobile (≤ 640px): Single-column cards with touch-optimized target sizes.

---

## Cross References
- System Structure: [[Architecture]]
- File Responsibilities: [[File Map]]
- Non-Negotiable Rules: [[Project Rules]]
- System Decisions: [[Technical Decisions]]

