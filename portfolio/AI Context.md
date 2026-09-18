# AI Context

This note provides high-level system context, design philosophy, and operational guidance for any AI assistant working on the **Karl Evan Tabunda** personal developer portfolio.

---

## 1. Project Identity
- **Owner**: Karl Evan Tabunda (`Lollipop0-0`)
- **Institution**: National College of Science and Technology (NCST), Philippines
- **Major**: Information Technology (Graduation: 2027)
- **Portfolio Focus**: Software engineering, dynamic PHP MVC web apps, Three.js 3D spatial planning, relational databases (MySQL/MariaDB), and accessible UI/UX.
- **Repository**: `c:\xampp\htdocs\lollipop` (served locally via Apache on XAMPP at `http://localhost/lollipop/`)

---

## 2. Core Technical Philosophies

### Zero Build Tooling / Pure Vanilla Stack
The project intentionally uses **zero frontend frameworks** (no React, Vue, Next.js, or Tailwind) and **zero npm build tools** (no Webpack, Vite, or Babel). It runs natively in any browser and is easily hosted on Apache/XAMPP, Netlify, or GitHub Pages.

### Integrity & Authentic Data
- **Real GitHub Data**: Contribution activity is never fabricated. It connects via a multi-tier fallback (local PHP proxy → Netlify Function → static cached JSON).
- **Transparent Contact Form**: Without an active backend database, form submission prepares a pre-filled `mailto:` draft directly to Karl's academic email, showing an on-screen status and copy fallback.

### Editorial & Clean Academic Aesthetic
- Typography: Newsreader (Editorial Serif for headings), Inter (Clean UI Sans for body/controls), Caveat (Handwritten doodles/annotations), JetBrains Mono (Code cards).
- Themes: Dual-mode system (Light Editorial Mode and Dark Slate Mode) with `localStorage` persistence and anti-flash `<head>` detection.

---

## 3. How AI Assistants Must Work on This Project

### 1. The Obsidian-First Rule
**Always read relevant Obsidian documentation first before inspecting or altering source code.**
Obsidian is the persistent context layer of this project. Do not scan the entire repository or rely on stale assumptions.
- Overview: [[AI Context]]
- Rules & Constraints: [[Project Rules]]
- File Map & Responsibilities: [[File Map]]
- System Architecture & Data Flow: [[Architecture]]
- Features: [[Features]]
- Technical Decisions & Rationale: [[Technical Decisions]]
- Known Issues & Quirks: [[Known Issues]]
- Current Status: [[Current Task]]
- History: [[Completed Tasks]]
- Technology Stack: [[Tech Stack]]

### 2. Targeted Code Inspection
Inspect only the minimal files relevant to the user's specific request.

### 3. Synchronize Obsidian Before Task Completion
Never consider a task complete without updating the corresponding Obsidian documentation notes. Code and documentation must reflect the identical system state.

---

## 4. Key Cross-References
- System Architecture: [[Architecture]]
- Development Constraints: [[Project Rules]]
- Component & Script Inventory: [[File Map]]
- Tech Stack & Tools: [[Tech Stack]]
