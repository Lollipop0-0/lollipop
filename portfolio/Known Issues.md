# Known Issues & Edge Cases

This document tracks known limitations, environmental quirks, and technical workarounds in the portfolio codebase.

---

## 1. Unauthenticated GitHub API Rate Limiting
- **Description**: GitHub limits unauthenticated requests to 60 requests per hour per public IP address.
- **Affected Components**: `assets/js/github.js` (fetching user stats and language breakdowns).
- **Workaround & Mitigation**:
  - `GitHubManager` caches API responses in `sessionStorage` for 15 minutes.
  - If rate limits are exceeded (`403 Forbidden` / `API rate limit exceeded`), the UI gracefully falls back to displaying a polite rate limit notice and links directly to Karl's GitHub profile.
  - Contribution matrix calendar uses a three-tier resilient fallback, falling back to committed static cache (`cache/contributions_lollipop0-0.json`) if network or serverless endpoints fail.

---

## 2. Browser Mailto Protocol Handler Inactivity
- **Description**: On systems where no default desktop email application (e.g. Outlook, Apple Mail, Thunderbird) or webmail handler is configured, clicking `mailto:` links may produce no visible reaction.
- **Affected Components**: `components/contact.html`, `assets/js/contact.js`.
- **Workaround & Mitigation**:
  - `contact.js` automatically renders a prominent fallback card directly on screen displaying Karl's email address (`tabunda.karlevan@ncst.edu.ph`) with an explicit "Copy to Clipboard" action button.

---

## 3. Local File Protocol (`file://`) CORS Restriction
- **Description**: When `index.html` is opened directly via double-clicking in file explorer (`file:///path/index.html`), browser security restrictions block `fetch()` requests used by `ComponentLoader` to load partials from `components/*.html`.
- **Affected Components**: `assets/js/components.js`.
- **Workaround & Mitigation**:
  - The project must be served via a local HTTP server such as Apache on XAMPP (`http://localhost/lollipop/`) or `python -m http.server 8000`.

---

## 4. Headless Automation Environment Playwright 404 Driver
- **Description**: In certain local agent sandboxes, automated browser subagents attempting to fetch Playwright driver archives encounter network/version 404 errors (`playwright-1.57.0-win32_x64.zip`).
- **Mitigation**:
  - Visual verification should be performed using the local browser at `http://localhost/lollipop/`, supported by automated Node CLI syntax and data validation scripts.

---

## Cross References
- Decisions: [[Technical Decisions]]
- Architecture: [[Architecture]]
- Rules: [[Project Rules]]
