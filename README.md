# Karl Evan Tabunda — Personal Developer Portfolio

A production-quality, responsive personal developer portfolio website designed for **Karl Evan Tabunda**, an Information Technology student at the **National College of Science and Technology (NCST)**. Built with semantic HTML5, vanilla CSS3 design tokens, and modular vanilla JavaScript.

---

## Table of Contents

- [Project Purpose](#project-purpose)
- [Folder Structure](#folder-structure)
- [How to Run the Website Locally](#how-to-run-the-website-locally)
- [Where to Edit Personal Information](#where-to-edit-personal-information)
- [Where to Edit Project Data](#where-to-edit-project-data)
- [Where to Place Project Screenshots](#where-to-place-project-screenshots)
- [Where to Place Profile Photos](#where-to-place-profile-photos)
- [GitHub API Integration & Behavior](#github-api-integration--behavior)
- [GitHub API Limitations & Fallbacks](#github-api-limitations--fallbacks)
- [Contact Form Behavior](#contact-form-behavior)
- [Theme Switching & Persistence](#theme-switching--persistence)
- [Accessibility Features](#accessibility-features)
- [Troubleshooting](#troubleshooting)

---

## Project Purpose

The portfolio presents Karl Evan Tabunda's academic background, development journey, technical skills, and software projects in an editorial, student-developer aesthetic. It highlights collaborative systems such as the **Celestine University of the Pacific (CUP)** admissions platform alongside personal projects, demonstrating clean code, accessible UI/UX, and transparent technical documentation.

---

## Folder Structure

```
Tabunda-sample2/
├── index.html                           # Minimal application shell (#app mounting point)
├── .gitignore                           # Git ignore rules for OS, IDE, and .env files
├── .env                                 # Environment config for optional GitHub token
├── README.md                            # Complete project guide and documentation
│
├── components/                          # Modular HTML section components
│   ├── header.html                      # Header, navigation, theme toggle, mobile drawer
│   ├── hero.html                        # Hero section, profile area, annotations
│   ├── about.html                       # About Me and personal information
│   ├── work.html                        # Featured Project (CUP) and Project Archive
│   ├── activity.html                    # GitHub Activity, profile card, contribution matrix
│   ├── stack.html                       # Technology Stack
│   ├── journey.html                     # Development Journey and Currently Figuring Out
│   ├── contact.html                     # Contact info and validated form
│   ├── footer.html                      # Footer and back-to-top button
│   └── project-modal.html               # Accessible project details dialog
│
├── assets/
│   ├── css/
│   │   ├── variables.css                # CSS custom properties (light & dark palettes, tokens)
│   │   ├── base.css                     # Reset, typography hierarchy, skip links, containers
│   │   ├── components.css               # Buttons, badges, stickers, tape doodles, modal dialog
│   │   ├── sections.css                 # Hero, About, Featured CUP, Archive, Stack, Contact
│   │   └── responsive.css               # Mobile drawer, navigation breakpoints, reduced-motion
│   │
│   ├── js/
│   │   ├── data.js                      # Portfolio data (projects, skills, milestones, personal info)
│   │   ├── theme.js                     # Light/Dark mode toggling & localStorage persistence
│   │   ├── navigation.js                # Smooth scrolling, scroll-spy, and mobile drawer handler
│   │   ├── projects.js                  # Dynamic project card rendering and category filtering
│   │   ├── modal.js                     # WAI-ARIA accessible project details dialog
│   │   ├── github.js                    # Public GitHub REST API integration and graceful fallback
│   │   ├── contact.js                   # Client-side validation and transparent mailto action
│   │   ├── components.js                # ComponentLoader: fetches & assembles /components/ into #app
│   │   └── app.js                       # Main orchestrator initializing modules after DOM assembly
│   │
│   ├── images/
│   │   ├── profile.jpg                  # Primary portrait photo (hero section)
│   │   ├── og-preview.png               # Open Graph & social media preview banner
│   │   │
│   │   └── projects/
│   │       ├── cup/                     # Celestine University of the Pacific screenshots
│   │       │   └── preview.jpg
│   │       ├── inventory/               # Inventory Management System screenshots
│   │       │   └── preview.jpg
│   │       ├── library/                 # Library Management System screenshots
│   │       │   └── preview.jpg
│   │       ├── sneakerhub/              # UI SneakerHub screenshots
│   │       │   └── preview.jpg
│   │       ├── hotel/                   # Hotel Reservation Management System screenshots
│   │       │   └── preview.jpg
│   │       └── smartspace/              # SmartSpace 3D room planning screenshots
│   │           └── preview.jpg
│   │
│   └── documents/
│       └── Karl-Evan-Tabunda-Resume.pdf # Printable PDF resume
```

---

## How to Run the Website Locally

Because this project is built entirely with standard HTML5, CSS3, and JavaScript (no Node build step, no npm dependencies, no server framework):

### Option 1: Direct Browser File (Zero Setup)
Double-click `index.html` or open it in any modern web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local Web Server (Recommended for API Testing)
If you have Python installed:
```bash
# In the Tabunda-sample2 root folder:
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

If you are running XAMPP:
1. Ensure this folder resides in `C:\xampp\htdocs\Tabunda-sample2`.
2. Start the Apache module in the XAMPP Control Panel.
3. Open `http://localhost/Tabunda-sample2` in your browser.

---

## Where to Edit Personal Information

All personal details, bios, social links, and academic milestones are maintained in:
- **`assets/js/data.js`** inside the `PORTFOLIO_DATA.personal` object:
  - `name`: Karl Evan Tabunda
  - `school`: National College of Science and Technology (NCST)
  - `graduationYear`: 2027
  - `email`: tabunda.karlevan@ncst.edu.ph
  - `github`: https://github.com/Lollipop0-0
  - `linkedin`: Profile URL
- Static meta tags and JSON-LD structured data in **`index.html`** should also be updated if personal metadata changes.

---

## Where to Edit Project Data

All projects are structured as JavaScript objects in **`assets/js/data.js`**:
- **Featured Project**: `PORTFOLIO_DATA.featuredProject` (Celestine University of the Pacific).
- **Archive Projects**: `PORTFOLIO_DATA.projects` array. Each object supports:
  - `id`: Unique identifier (e.g. `"02"`)
  - `title`: Project title
  - `badgeNumber`: Editorial number prefix
  - `category`: `"personal"` or `"collaborative"`
  - `teamLabel`: Attribution label (e.g., `"Collaborative Project — Yakuzokai Team"` or `"My Project"`)
  - `technologies`: Array of tech stack pills (e.g., `["PHP", "MySQL", "JavaScript"]`)
  - `repository`: Full GitHub repository URL
  - `image`: Relative path to project preview screenshot
  - `highlights`: Array of architectural bullet points shown in the modal dialog

---

## Where to Place Project Screenshots

Project screenshots should be saved in their respective directories under `assets/images/projects/`:
- Celestine University of the Pacific: `assets/images/projects/cup/preview.jpg`
- Inventory Management System: `assets/images/projects/inventory/preview.jpg`
- Library Management System: `assets/images/projects/library/preview.jpg`
- UI SneakerHub: `assets/images/projects/sneakerhub/preview.jpg`
- Hotel Reservation Management: `assets/images/projects/hotel/preview.jpg`
- SmartSpace: `assets/images/projects/smartspace/preview.jpg`

Recommended aspect ratio is **16:9** (e.g., 1280×720 or 1920×1080) for sharp rendering.

---

## Where to Place Profile Photos

- **Main Hero Portrait**: Save as `assets/images/profile.jpg` (ideal ratio 4:5 or 1:1 square, minimum 600×600 px).
- **Social Media Share Banner**: Save as `assets/images/og-preview.png` (1200×630 px).

---

## GitHub API Integration & Behavior

The portfolio connects to the public **GitHub REST API v3** from the browser (`assets/js/github.js`):
- Endpoint `https://api.github.com/users/Lollipop0-0` fetches real user metadata (avatar, follower count, public repo count).
- Endpoint `https://api.github.com/users/Lollipop0-0/events/public` fetches real recent public commits, push events, and repo updates.
- Endpoint `https://api.github.com/users/Lollipop0-0/repos` analyzes language distribution across active repositories.
- **Session Caching**: API responses are cached in `sessionStorage` for 15 minutes to reduce unnecessary network traffic and respect rate limits.

---

## GitHub API Limitations & Fallbacks

- **No Simulated Activity**: In strict adherence to integrity standards, the website **never fabricates** a GitHub contribution heatmap, commit streaks, or synthetic activity statistics.
- **Rate Limit Resilience**: Unauthenticated client-side requests to GitHub's public API are limited to 60 requests per hour per IP. When the rate limit is reached or the user is offline, the website displays a graceful fallback notice:
  > *"GitHub public activity is temporarily unavailable due to public API rate limits."*
  with a direct link to Karl's GitHub profile (`https://github.com/Lollipop0-0`).

---

## Contact Form Behavior

Because this website operates as a pure frontend project without an active backend server, database, or third-party submission service:
1. **Client-Side Validation**: Checks that Name, Email, and Message meet required formats and character lengths.
2. **Transparent Submission**: Instead of faking a "Message Sent Successfully to Server" alert, submitting the form prepares a pre-filled `mailto:` link opening the user's default desktop or mobile email client directly addressed to `tabunda.karlevan@ncst.edu.ph`.
3. **Manual Fallback**: An on-screen status message displays the recipient address and a direct click-to-email fallback in case the user's browser blocks automated mailto protocol handlers.

---

## Theme Switching & Persistence

- Supports **Light Theme** (clean academic editorial) and **Dark Theme** (deep slate tech aesthetic).
- Preferences are saved in `localStorage` under the key `ket_portfolio_theme`.
- If no saved preference exists, the site dynamically detects the user's system OS preference via `prefers-color-scheme: dark`.
- An inline anti-flash script in the `<head>` of `index.html` ensures the proper theme attribute is set before styles render, avoiding flash of incorrect theme (FOUC).

---

## Accessibility Features

- **Semantic HTML5 Elements**: Proper landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- **Focus Management**: Focusable elements have visible high-contrast focus rings (`:focus-visible`).
- **Skip Link**: Accessible keyboard shortcut allowing screen reader and keyboard users to jump directly to `#main-content`.
- **Accessible Modal**: Follows WAI-ARIA dialog practices with `role="dialog"`, `aria-modal="true"`, focus trapping (`Tab` / `Shift+Tab`), `Escape` key dismissal, backdrop click closing, body scroll locking, and automatic focus restoration upon exit.
- **Mobile Menu Drawer**: Accessible drawer with `aria-expanded` and keyboard navigation.
- **Prefers-Reduced-Motion**: Respects user operating system accessibility settings by turning off smooth scrolling and non-essential micro-animations.

---

## Troubleshooting

1. **GitHub section shows "Activity temporarily unavailable":**
   - The public GitHub API rate limit (60 requests/hour) may have been exceeded on your IP. The session cache will clear automatically after 15 minutes, or you can click the direct profile link.
2. **Theme toggle not saving after page reload:**
   - Verify that your browser is not in private/incognito mode with `localStorage` disabled.
3. **Contact form does not open email program:**
   - Make sure your operating system has a default email handler assigned (e.g., Mail, Outlook, Thunderbird, or browser handler for Gmail). Alternatively, use the direct email link `tabunda.karlevan@ncst.edu.ph`.
4. **Modal does not close with Escape:**
   - Ensure the modal or an element within the modal dialog has active focus.
