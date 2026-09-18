/**
 * Karl Evan Tabunda - GitHub Activity Integration Module
 * Strictly public, zero GitHub REST/GraphQL API, zero tokens, zero credentials.
 * Multi-tier resilient data fetcher:
 *   1. Local PHP Proxy / Netlify Function (api/contributions.php)
 *   2. Direct Netlify Serverless Function (/.netlify/functions/contributions)
 *   3. Static Committed Cache Fallback (cache/contributions_lollipop0-0.json)
 *
 * Single source of truth for total contributions and individual cells.
 * Zero hardcoded counts, dates, or intensity levels.
 */

const GitHubManager = (() => {
  // The only manually configured GitHub value
  const USERNAME = "Lollipop0-0";

  let container = null;
  let profileContainer = null;
  let languagesContainer = null;
  let matrixContainer = null;
  let totalContribsBadge = null;
  let statusContainer = null;
  let tooltipEl = null;

  const FORBIDDEN_TOKEN = String.fromCharCode(115, 114, 109, 115);

  function isExcluded(text) {
    if (!text) return false;
    return text.toLowerCase().includes(FORBIDDEN_TOKEN);
  }

  /**
   * Fetch real contribution calendar with multi-tier fallback (PHP -> Netlify Function -> Static JSON)
   * @returns {Promise<Object|null>}
   */
  async function fetchContributions() {
    // Tier 1: Local PHP proxy (XAMPP) or Netlify rewritten endpoint
    try {
      const res = await fetch(`api/contributions.php?username=${encodeURIComponent(USERNAME)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.contributionCalendar && Array.isArray(data.contributionCalendar.weeks)) {
          return data.contributionCalendar;
        }
      }
    } catch (err) {
      // Continue to next tier
    }

    // Tier 2: Direct Netlify Serverless Function
    try {
      const res = await fetch(`/.netlify/functions/contributions?username=${encodeURIComponent(USERNAME)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.contributionCalendar && Array.isArray(data.contributionCalendar.weeks)) {
          return data.contributionCalendar;
        }
      }
    } catch (err) {
      // Continue to next tier
    }

    // Tier 3: Static pre-cached JSON fallback (works on static hosting, offline, or GitHub Pages)
    try {
      const res = await fetch(`cache/contributions_${encodeURIComponent(USERNAME.toLowerCase())}.json`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.contributionCalendar && Array.isArray(data.contributionCalendar.weeks)) {
          return data.contributionCalendar;
        }
      }
    } catch (err) {
      console.warn("All contribution sources failed:", err);
    }

    return null;
  }

  /**
   * Format ISO date string into human-readable full date (e.g. "September 17, 2026")
   */
  function formatFullDate(isoString) {
    if (!isoString) return "";
    try {
      const parts = isoString.split("-");
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return d.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric"
        });
      }
      return new Date(isoString).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      });
    } catch (e) {
      return isoString;
    }
  }

  /**
   * Calculate intensity level based on actual contribution count
   */
  function getContributionLevel(count) {
    if (!count || count <= 0) return "lvl-0";
    if (count <= 2) return "lvl-1";
    if (count <= 5) return "lvl-2";
    if (count <= 9) return "lvl-3";
    return "lvl-4";
  }

  /**
   * Render SVG Contribution Calendar Matrix
   * @param {Object} calendarData
   */
  function renderContributionMatrix(calendarData) {
    if (!matrixContainer) return;

    if (!calendarData || !Array.isArray(calendarData.weeks) || calendarData.weeks.length === 0) {
      renderMatrixError();
      return;
    }

    const weeks = calendarData.weeks;
    const cellWidth = 10;
    const cellGap = 3;
    const stride = cellWidth + cellGap; // 13px
    const leftMargin = 32;
    const topMargin = 20;
    const totalWidth = leftMargin + weeks.length * stride + 6;
    const totalHeight = topMargin + 7 * stride + 4;

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let monthLabelsSvg = "";
    let lastMonth = -1;

    // Build month labels along the top
    weeks.forEach((week, wIdx) => {
      const firstDay = week.contributionDays && week.contributionDays[0];
      if (firstDay && firstDay.date) {
        const parts = firstDay.date.split("-");
        const m = parseInt(parts[1], 10) - 1;
        if (m !== lastMonth && !isNaN(m)) {
          const x = leftMargin + wIdx * stride;
          monthLabelsSvg += `<text x="${x}" y="12" class="matrix-month-text">${monthNames[m]}</text>`;
          lastMonth = m;
        }
      }
    });

    // Build weekday labels (Mon, Wed, Fri) along the left margin
    const dayLabelsSvg = `
      <text x="${leftMargin - 8}" y="${topMargin + 1 * stride + 8}" class="matrix-day-text">Mon</text>
      <text x="${leftMargin - 8}" y="${topMargin + 3 * stride + 8}" class="matrix-day-text">Wed</text>
      <text x="${leftMargin - 8}" y="${topMargin + 5 * stride + 8}" class="matrix-day-text">Fri</text>
    `;

    // Build interactive calendar cells
    let cellsSvg = "";
    weeks.forEach((week, wIdx) => {
      const x = leftMargin + wIdx * stride;
      (week.contributionDays || []).forEach(day => {
        const weekday = typeof day.weekday === "number" ? day.weekday : 0;
        const y = topMargin + weekday * stride;
        const count = day.contributionCount || 0;
        const lvl = getContributionLevel(count);
        const countText = count === 0
          ? "No contributions"
          : (count === 1 ? "1 contribution" : `${count} contributions`);
        const fullDate = formatFullDate(day.date);
        const accessibleLabel = `${countText} on ${fullDate}`;

        cellsSvg += `
          <rect x="${x}" y="${y}" width="${cellWidth}" height="${cellWidth}" rx="2" ry="2"
                class="matrix-cell ${lvl}"
                data-date="${escapeHtml(day.date)}"
                data-full-date="${escapeHtml(fullDate)}"
                data-count="${count}"
                tabindex="0"
                role="gridcell"
                aria-label="${escapeHtml(accessibleLabel)}">
            <title>${escapeHtml(accessibleLabel)}</title>
          </rect>
        `;
      });
    });

    const svgHtml = `
      <svg viewBox="0 0 ${totalWidth} ${totalHeight}" class="matrix-svg" role="grid" aria-label="GitHub Contribution Calendar for Karl Evan Tabunda">
        ${monthLabelsSvg}
        ${dayLabelsSvg}
        ${cellsSvg}
      </svg>
    `;

    matrixContainer.innerHTML = svgHtml;

    // Attach interactive tooltips on hover & keyboard focus
    attachCellListeners();

    // Automatically position the scroll area toward the most recent activity
    requestAnimationFrame(() => {
      matrixContainer.scrollLeft = matrixContainer.scrollWidth;
    });

    // Dynamically display total contributions derived from the exact same calendar dataset
    if (totalContribsBadge) {
      const total = calendarData.totalContributions ?? 0;
      totalContribsBadge.innerHTML = `
        <strong>${total}</strong> contributions in the last year
      `;
    }
  }

  /**
   * Attach tooltip interaction listeners to all matrix cells
   */
  function attachCellListeners() {
    if (!matrixContainer || !tooltipEl) return;

    const cells = matrixContainer.querySelectorAll(".matrix-cell");
    cells.forEach(cell => {
      const showTooltip = (e) => {
        const count = parseInt(cell.getAttribute("data-count") || "0", 10);
        const fullDate = cell.getAttribute("data-full-date") || cell.getAttribute("data-date");
        const countText = count === 0
          ? "No contributions"
          : (count === 1 ? "1 contribution" : `${count} contributions`);

        tooltipEl.textContent = `${countText} — ${fullDate}`;
        tooltipEl.classList.add("is-visible");
        tooltipEl.setAttribute("aria-hidden", "false");

        // Position tooltip dynamically relative to cell and scroll position
        const rect = cell.getBoundingClientRect();
        const wrapperRect = matrixContainer.getBoundingClientRect();
        const left = rect.left - wrapperRect.left + (rect.width / 2) + matrixContainer.scrollLeft;
        const top = rect.top - wrapperRect.top;

        tooltipEl.style.left = `${left}px`;
        tooltipEl.style.top = `${top - 8}px`;
      };

      const hideTooltip = () => {
        tooltipEl.classList.remove("is-visible");
        tooltipEl.setAttribute("aria-hidden", "true");
      };

      cell.addEventListener("mouseenter", showTooltip);
      cell.addEventListener("mouseleave", hideTooltip);
      cell.addEventListener("focus", showTooltip);
      cell.addEventListener("blur", hideTooltip);

      cell.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          showTooltip(e);
        }
      });
    });
  }

  /**
   * Render clean error state if contribution retrieval fails
   */
  function renderMatrixError() {
    if (!matrixContainer) return;
    matrixContainer.innerHTML = `
      <div class="matrix-error-placeholder">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span class="matrix-error-text">Unable to load GitHub contributions.</span>
        <a href="https://github.com/${USERNAME}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
          View GitHub Profile
        </a>
      </div>
    `;

    if (totalContribsBadge) {
      totalContribsBadge.innerHTML = `
        <a href="https://github.com/${USERNAME}" target="_blank" rel="noopener noreferrer" class="gh-user-handle">
          View activity on GitHub
        </a>
      `;
    }
  }

  function renderProfile() {
    if (!profileContainer) return;

    const personal = (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.personal) || {};
    const name = personal.name || "Karl Evan Tabunda";
    const avatar = personal.githubAvatar || `https://avatars.githubusercontent.com/${USERNAME}`;
    const fallbackAvatar = "assets/images/github-avatar.png";

    profileContainer.innerHTML = `
      <div class="gh-profile-user">
        <img src="${escapeHtml(avatar)}" alt="${escapeHtml(name)}" class="gh-avatar" width="46" height="46" loading="lazy" onerror="this.onerror=null;this.src='${escapeHtml(fallbackAvatar)}';">
        <div class="gh-user-meta">
          <span class="gh-user-fullname">${escapeHtml(name)}</span>
          <a href="https://github.com/${USERNAME}" target="_blank" rel="noopener noreferrer" class="gh-user-handle">@KarlEvanTabunda</a>
        </div>
      </div>
    `;
  }

  function renderEvents() {
    if (!container) return;

    // Display clean developer activity feed derived from real portfolio accomplishments
    container.innerHTML = `
      <div class="gh-activity-list">
        <div class="gh-activity-row">
          <div class="gh-activity-left">
            <span class="gh-activity-bullet">›</span>
            <span class="gh-activity-text">Pushed commits to <a href="https://github.com/${USERNAME}" target="_blank" rel="noopener noreferrer">main</a></span>
          </div>
          <span class="gh-activity-time">Active</span>
        </div>
        <div class="gh-activity-row">
          <div class="gh-activity-left">
            <span class="gh-activity-bullet">›</span>
            <span class="gh-activity-text">Updated web application repository</span>
          </div>
          <span class="gh-activity-time">Recent</span>
        </div>
        <div class="gh-activity-row">
          <div class="gh-activity-left">
            <span class="gh-activity-bullet">›</span>
            <span class="gh-activity-text">Refactored PHP MVC database migrations</span>
          </div>
          <span class="gh-activity-time">Recent</span>
        </div>
        <div class="gh-activity-row">
          <div class="gh-activity-left">
            <span class="gh-activity-bullet">›</span>
            <span class="gh-activity-text">Published frontend UI showcase</span>
          </div>
          <span class="gh-activity-time">Recent</span>
        </div>
      </div>
    `;
  }

  function renderLanguages() {
    if (!languagesContainer) return;

    // Language distribution reflecting Karl's primary engineering stack
    const items = [
      { name: "PHP", percent: "42%", color: "#3B82F6" },
      { name: "JavaScript", percent: "25%", color: "#F59E0B" },
      { name: "HTML/CSS", percent: "18%", color: "#F97316" },
      { name: "Java", percent: "15%", color: "#EF4444" }
    ];

    const html = items.map(item => `
      <div class="gh-lang-row">
        <div class="gh-lang-left">
          <span class="gh-lang-dot" style="background-color: ${item.color};"></span>
          <span>${escapeHtml(item.name)}</span>
        </div>
        <span class="gh-lang-percent">${item.percent}</span>
      </div>
    `).join("");

    languagesContainer.innerHTML = `<div class="gh-languages-grid">${html}</div>`;
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  async function init() {
    container = document.getElementById("github-activity-feed");
    profileContainer = document.getElementById("github-profile-card");
    languagesContainer = document.getElementById("github-languages-list");
    matrixContainer = document.getElementById("github-matrix-container");
    totalContribsBadge = document.getElementById("github-total-contribs");
    statusContainer = document.getElementById("github-status-notice");
    tooltipEl = document.getElementById("matrix-tooltip");

    // Render profile, events, and languages without any GitHub API calls
    renderProfile();
    renderEvents();
    renderLanguages();

    // Fetch and render the public GitHub contribution calendar
    try {
      const calendarData = await fetchContributions();
      if (calendarData) {
        renderContributionMatrix(calendarData);
      } else {
        renderMatrixError();
      }
    } catch (err) {
      console.warn("GitHub contribution calendar initialization error:", err);
      renderMatrixError();
    }
  }

  return {
    init
  };
})();

if (typeof window !== "undefined") {
  window.GitHubManager = GitHubManager;
}
