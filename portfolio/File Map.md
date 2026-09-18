# File Map

This document provides a complete inventory of project files and their specific responsibilities.

---

## Root Files
| File | Responsibility |
|---|---|
| `index.html` | Minimal application shell with `<head>` metadata, Open Graph tags, JSON-LD structured data, anti-flash theme script, accessible skip link, `#app` mounting point, and script tags. |
| `README.md` | Comprehensive project setup, execution guide, folder overview, and architectural reference. |
| `.gitignore` | Git ignore rules for OS files, IDE configs, environment secrets, and node/temp artifacts. |
| `.env` | Environment configuration file (e.g. optional GitHub token for local environments). |

---

## Modular Component Partials (`components/`)
| File | Responsibility |
|---|---|
| `components/header.html` | Sticky navigation bar with brand monogram, desktop navigation links, theme toggle button, quick-search trigger (`Cmd+K`), and mobile drawer toggle. |
| `components/hero.html` | Hero introduction section, editorial portrait photo card, floating PHP code card, Caveat handwritten annotations, and "Currently Building" status badge. |
| `components/about.html` | Academic background at NCST, developer biography, philosophy, and quick snapshot statistics. |
| `components/work.html` | Featured Project deep dive (Celestine University of the Pacific) and categorized Project Archive with filtering tabs. |
| `components/activity.html` | GitHub activity overview, live profile stats, languages breakdown, and interactive contribution calendar matrix. |
| `components/stack.html` | "Things I Build With" container hosting categorized technology and tool cards. |
| `components/certificates.html` | "Certificates & Certifications" container hosting verified Sololearn course credentials and credential ID inspector triggers. |
| `components/journey.html` | Academic and programming development timeline alongside the "Currently Figuring Out" exploration cards. |
| `components/contact.html` | Contact information, verified channels, validated contact form, and transparent `mailto:` launch system. |
| `components/footer.html` | Footer colophon, social media links, back-to-top button, and copyright year. |
| `components/project-modal.html` | WAI-ARIA accessible modal dialog for inspecting detailed project architectural highlights and screenshots. |

---

## Styling Architecture (`assets/css/`)
| File | Responsibility |
|---|---|
| `assets/css/variables.css` | Design tokens for light and dark themes (colors, typography, shadows, borders, transitions, container max width). |
| `assets/css/base.css` | Reset rules, base element typography, skip links, `.container` width rules, subtle editorial grid pattern. |
| `assets/css/components.css` | Universal reusable UI elements: buttons, badges, status indicators, code snippet stickers, photo frames, and modal dialog. |
| `assets/css/sections.css` | Specific layouts for Hero, About, Work, Activity, Stack, Journey, Contact, and Footer. |
| `assets/css/responsive.css` | Mobile navigation drawer, responsive layout overrides for tablet (`≤ 868px`) and mobile (`≤ 480px`), and reduced-motion queries. |

---

## JavaScript Modules (`assets/js/`)
| File | Module / Responsibility |
|---|---|
| `assets/js/data.js` | Single source of truth for portfolio data: personal bio, featured project, archive projects, tech stack categories, timeline, and current studies (`PORTFOLIO_DATA`). |
| `assets/js/theme.js` | `ThemeManager`: Light and dark mode toggling, `localStorage` persistence (`ket_portfolio_theme`), system preference detection, and contribution chart theme syncing. |
| `assets/js/navigation.js` | `NavigationManager`: Smooth scrolling to section anchors, active section scrollspy, mobile navigation drawer open/close. |
| `assets/js/projects.js` | `ProjectsManager`: Dynamic rendering of project cards from `PORTFOLIO_DATA`, active category filtering (`all`, `personal`, `collaborative`). |
| `assets/js/modal.js` | `ModalManager`: WAI-ARIA accessible project details dialog, focus trapping, Escape key closing, body scroll lock. |
| `assets/js/github.js` | `GitHubManager`: Multi-tier resilient data fetcher (PHP proxy, Netlify serverless function, static JSON cache) for real GitHub user metrics, languages, and contribution calendar. |
| `assets/js/contact.js` | `ContactManager`: Client-side validation of name, email, and message; prepares pre-filled `mailto:` email links and provides copy fallbacks. |
| `assets/js/search.js` | `SearchManager`: Fast command palette / search dialog (`Cmd/Ctrl + K`) indexing all projects, tech stack, milestones, and sections with keyboard navigation. |
| `assets/js/visitors.js` | `VisitorManager`: Multi-tier resilient viewer counter orchestrator (local PHP -> public count API -> localStorage cache) with numeric animation. |
| `assets/js/components.js` | `ComponentLoader`: Concurrently fetches all component partials in `components/` and injects them into `#app`. |
| `assets/js/app.js` | Main orchestrator initializing modules sequentially once the DOM is fully loaded and components are mounted. |

---

## Backend & Cache Endpoints
| Path | Responsibility |
|---|---|
| `api/contributions.php` | Local PHP proxy script for querying and parsing GitHub contribution calendar HTML/SVG. |
| `cache/contributions_lollipop0-0.json` | Committed static fallback containing cached contribution calendar data for offline or rate-limited environments. |
| `api/visitors.php` | Local PHP visitor counter endpoint with atomic file locking (`flock`) and session cooldown cookies. |
| `cache/visitors.json` | Atomic JSON storage for total views and unique visitors. |

---

## Documentation Vault (`portfolio/`)
| File | Responsibility |
|---|---|
| `portfolio/AI Context.md` | Primary onboarding and operational guidelines for AI assistants. |
| `portfolio/Project Rules.md` | Non-negotiable architectural and engineering rules. |
| `portfolio/Architecture.md` | System architecture, data flow, CSS structure, and lifecycle pipeline. |
| `portfolio/File Map.md` | Comprehensive file index and responsibilities (this note). |
| `portfolio/Features.md` | Detailed breakdown of all user-facing features and their implementation. |
| `portfolio/Technical Decisions.md` | Record of technical decisions, rationale, and tradeoffs. |
| `portfolio/Known Issues.md` | Known bugs, limitations, and edge-case behaviors. |
| `portfolio/Current Task.md` | Currently active focus and status of the codebase. |
| `portfolio/Completed Tasks.md` | Chronological changelog of completed tasks and improvements. |
| `portfolio/Tech Stack.md` | Documentation of tech stack categories, tools, and UI integration. |

---

## Cross References
- Architecture: [[Architecture]]
- Features: [[Features]]
- Technical Decisions: [[Technical Decisions]]
