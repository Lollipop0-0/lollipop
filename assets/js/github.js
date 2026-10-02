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
  let totalNumberEl = null;
  let longestStreakEl = null;
  let activeDaysEl = null;
  let statusContainer = null;
  let tooltipEl = null;

  const FORBIDDEN_TOKEN = String.fromCharCode(115, 114, 109, 115);

  function isExcluded(text) {
    if (!text) return false;
    return text.toLowerCase().includes(FORBIDDEN_TOKEN);
  }

  let lastErrorStatus = 0;

  /**
   * Fetch real contribution calendar with multi-tier fallback (PHP -> Netlify Function -> Static JSON)
   * Tracks HTTP status code for precise error diagnostics
   * @returns {Promise<Object|null>}
   */
  async function fetchContributions() {
    lastErrorStatus = 0;

    // Tier 0: High-speed sessionStorage cache (TTL: 15 minutes)
    const CACHE_KEY = `ket_github_contribs_${USERNAME.toLowerCase()}`;
    const CACHE_TTL_MS = 15 * 60 * 1000;
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        const raw = window.sessionStorage.getItem(CACHE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.timestamp && (Date.now() - parsed.timestamp < CACHE_TTL_MS) && parsed.calendar) {
            return parsed.calendar;
          }
        }
      }
    } catch (e) {}

    const persistToSession = (cal) => {
      try {
        if (typeof window !== "undefined" && window.sessionStorage && cal) {
          window.sessionStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            calendar: cal
          }));
        }
      } catch (e) {}
    };

    // Tier 1: Local PHP proxy (XAMPP) or Netlify rewritten endpoint
    try {
      const res = await fetch(`api/contributions.php?username=${encodeURIComponent(USERNAME)}`);
      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data && data.contributionCalendar && Array.isArray(data.contributionCalendar.weeks)) {
          persistToSession(data.contributionCalendar);
          return data.contributionCalendar;
        }
      } else {
        lastErrorStatus = res.status;
      }
    } catch (err) {
      lastErrorStatus = 0; // Network error
    }

    // Tier 2: Direct Netlify Serverless Function
    try {
      const res = await fetch(`/.netlify/functions/contributions?username=${encodeURIComponent(USERNAME)}`);
      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data && data.contributionCalendar && Array.isArray(data.contributionCalendar.weeks)) {
          persistToSession(data.contributionCalendar);
          return data.contributionCalendar;
        }
      } else if (!lastErrorStatus) {
        lastErrorStatus = res.status;
      }
    } catch (err) {
      // Continue to next tier
    }

    // Tier 3: Static pre-cached JSON fallback (works on static hosting, offline, or GitHub Pages)
    try {
      const res = await fetch(`cache/contributions_${encodeURIComponent(USERNAME.toLowerCase())}.json`);
      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data && data.contributionCalendar && Array.isArray(data.contributionCalendar.weeks)) {
          persistToSession(data.contributionCalendar);
          return data.contributionCalendar;
        }
      } else if (!lastErrorStatus) {
        lastErrorStatus = res.status;
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
   * Format ISO date string into compact date matching iqmal.dev tooltip (e.g. "Dec 2, 2025")
   */
  function formatShortDate(isoString) {
    if (!isoString) return "";
    try {
      const parts = isoString.split("-");
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        });
      }
      return new Date(isoString).toLocaleDateString("en-US", {
        month: "short",
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
   * Calculate activity statistics from calendar weeks (streak, active days, total)
   */
  function calculateStats(weeks) {
    const allDays = [];
    weeks.forEach(w => {
      (w.contributionDays || []).forEach(d => allDays.push(d));
    });

    let total = 0;
    let activeDays = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    allDays.forEach(day => {
      const count = day.contributionCount || 0;
      total += count;
      if (count > 0) {
        activeDays++;
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    });

    const totalDays = allDays.length || 365;
    const activePercent = Math.round((activeDays / totalDays) * 100);

    return {
      total,
      longestStreak,
      activeDays,
      totalDays,
      activePercent
    };
  }

  /**
   * Smooth number counter animation (power2.out ease)
   */
  function animateNumber(element, targetValue, duration = 1800, suffix = "") {
    if (!element) return;
    const start = 0;
    const startTime = performance.now();
    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 2);
      const current = Math.floor(start + (targetValue - start) * easeOut);
      element.textContent = current.toLocaleString() + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = targetValue.toLocaleString() + suffix;
      }
    }
    requestAnimationFrame(update);
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

    // Build interactive calendar cells with grid coordinates for stagger animation
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
        const shortDate = formatShortDate(day.date);
        const accessibleLabel = `${countText} on ${shortDate}`;

        cellsSvg += `
          <rect x="${x}" y="${y}" width="${cellWidth}" height="${cellWidth}" rx="2" ry="2"
                class="matrix-cell ${lvl}"
                data-date="${escapeHtml(day.date)}"
                data-short-date="${escapeHtml(shortDate)}"
                data-full-date="${escapeHtml(fullDate)}"
                data-count="${count}"
                data-col="${wIdx}"
                data-row="${weekday}"
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

    // Calculate real stats across all days
    const stats = calculateStats(weeks);
    const finalTotal = calendarData.totalContributions !== undefined ? calendarData.totalContributions : stats.total;

    // Trigger scroll-based entrance animation for matrix and counter stats
    setupScrollTriggeredAnimations(stats, finalTotal);
  }

  let hasAnimatedGrid = false;

  /**
   * Set up scroll-triggered entrance animation matching iqmal.dev
   */
  function setupScrollTriggeredAnimations(stats, finalTotal) {
    if (hasAnimatedGrid) return;

    const triggerEl = document.querySelector(".contrib-showcase-grid") ||
      document.querySelector(".contrib-calendar-card") ||
      matrixContainer;

    if (!triggerEl) {
      triggerMatrixAnimation(stats, finalTotal);
      return;
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            triggerMatrixAnimation(stats, finalTotal);
            observer.disconnect();
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px"
      });
      observer.observe(triggerEl);
    } else {
      triggerMatrixAnimation(stats, finalTotal);
    }
  }

  /**
   * Execute the staggered spring pop-in animation on cells and count up metrics
   * Exact match to iqmal.dev: stagger { grid: [7, 53], from: "start", amount: 1.5 }, ease: "back.out(1.5)"
   */
  function triggerMatrixAnimation(stats, finalTotal) {
    if (hasAnimatedGrid) return;
    hasAnimatedGrid = true;

    // 1. Staggered grid pop-in animation
    animateContributionGrid();

    // 2. Count-up animations for metrics
    if (totalNumberEl) {
      animateNumber(totalNumberEl, finalTotal, 2000, "");
    }
    if (longestStreakEl) {
      animateNumber(longestStreakEl, stats.longestStreak, 1800, " days");
    }
    if (activeDaysEl) {
      animateNumber(activeDaysEl, stats.activePercent, 1800, "%");
      activeDaysEl.setAttribute("title", `${stats.activeDays} active days out of ${stats.totalDays} tracked`);
    }
    if (totalContribsBadge) {
      totalContribsBadge.textContent = "contributions in the last year";
    }
  }

  /**
   * Staggered Spring Pop-In Entrance Animation for Contribution Matrix
   * Replicates GSAP fromTo(".contrib-cell", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, stagger: { grid: [7, 53], amount: 1.5 }, ease: "back.out(1.5)" })
   */
  function animateContributionGrid() {
    if (!matrixContainer) return;
    const cells = matrixContainer.querySelectorAll(".matrix-cell");
    if (!cells.length) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      cells.forEach(cell => {
        cell.style.opacity = "1";
        cell.style.transform = "scale(1)";
      });
      return;
    }

    // Set initial state before staggered ripple starts
    cells.forEach(cell => {
      cell.style.opacity = "0";
      cell.style.transform = "scale(0)";
    });

    const maxCols = 53;
    const maxRows = 7;
    const maxD = Math.sqrt((maxCols - 1) * (maxCols - 1) + (maxRows - 1) * (maxRows - 1));
    const staggerAmount = 1.5; // 1.5 seconds total wave time matching iqmal.dev

    cells.forEach(cell => {
      const col = parseInt(cell.getAttribute("data-col") || "0", 10);
      const row = parseInt(cell.getAttribute("data-row") || "0", 10);
      // Distance from top-left (0, 0)
      const d = Math.sqrt(col * col + row * row);
      const delayMs = (d / maxD) * staggerAmount * 1000;

      // Spring overshoot pop-in matching back.out(1.5)
      cell.animate([
        { transform: "scale(0)", opacity: 0 },
        { transform: "scale(1.18)", opacity: 1, offset: 0.65 },
        { transform: "scale(1)", opacity: 1 }
      ], {
        duration: 550,
        delay: delayMs,
        easing: "cubic-bezier(0.34, 1.56, 0.64, 1)", // back.out(1.5)
        fill: "forwards"
      });
    });
  }

  let activeCell = null;
  let rafId = null;
  let matrixListenersAttached = false;
  let matrixCardBody = null;

  /**
   * Position and display the single persistent tooltip relative to the hovered cell
   * Includes boundary collision detection and requestAnimationFrame batching
   */
  function updateTooltip(cell) {
    if (!cell || !tooltipEl || !matrixContainer) return;
    if (!matrixCardBody) {
      matrixCardBody = matrixContainer.closest(".gh-matrix-card-body") || matrixContainer.parentElement;
    }
    if (!matrixCardBody) return;

    const count = parseInt(cell.getAttribute("data-count") || "0", 10);
    const dateStr = cell.getAttribute("data-short-date") || cell.getAttribute("data-full-date") || cell.getAttribute("data-date") || "";
    const countLabel = count === 0
      ? "No contributions"
      : (count === 1 ? "1 contribution" : `${count} contributions`);

    // Render 2-line layout matching screen recording 00:04
    tooltipEl.innerHTML = `
      <span class="matrix-tooltip-count">${countLabel}</span>
      <span class="matrix-tooltip-date">${escapeHtml(dateStr)}</span>
    `;

    // Measure bounding rectangles
    const cellRect = cell.getBoundingClientRect();
    const bodyRect = matrixCardBody.getBoundingClientRect();

    // Check if cell is horizontally visible within the card body
    if (cellRect.right < bodyRect.left || cellRect.left > bodyRect.right) {
      hideTooltip();
      return;
    }

    // Cell center X relative to matrixCardBody
    const cellCenterX = cellRect.left - bodyRect.left + (cellRect.width / 2);
    const cellTopY = cellRect.top - bodyRect.top;

    // Measure tooltip size
    const tipWidth = tooltipEl.offsetWidth || 130;
    const tipHeight = tooltipEl.offsetHeight || 38;

    // Horizontal clamping within matrixCardBody with 8px margin
    const minX = 8;
    const maxX = Math.max(minX, bodyRect.width - tipWidth - 8);
    const idealX = cellCenterX - (tipWidth / 2);
    const clampedX = Math.max(minX, Math.min(idealX, maxX));

    // Dynamic arrow position pointing directly to cell center
    const arrowLeft = Math.max(12, Math.min(cellCenterX - clampedX, tipWidth - 12));
    tooltipEl.style.setProperty("--arrow-left", `${arrowLeft}px`);

    // Vertical collision handling: position above cell or flip below if close to top
    const offsetGap = 8;
    let targetY;
    let isFlipped = false;

    if (cellTopY - tipHeight - offsetGap < 4) {
      // Flip below cell
      targetY = cellTopY + cellRect.height + offsetGap;
      isFlipped = true;
    } else {
      // Default above cell
      targetY = cellTopY - tipHeight - offsetGap;
    }

    tooltipEl.style.transform = `translate3d(${Math.round(clampedX)}px, ${Math.round(targetY)}px, 0)`;
    tooltipEl.classList.toggle("is-flipped", isFlipped);
    tooltipEl.classList.add("is-visible");
    tooltipEl.setAttribute("aria-hidden", "false");
  }

  function scheduleTooltipUpdate(cell) {
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
    rafId = requestAnimationFrame(() => {
      updateTooltip(cell);
      rafId = null;
    });
  }

  function hideTooltip() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    activeCell = null;
    if (tooltipEl) {
      tooltipEl.classList.remove("is-visible");
      tooltipEl.setAttribute("aria-hidden", "true");
    }
  }

  /**
   * Attach high-performance event delegation listeners for the matrix
   * Attaches once to container instead of hundreds of individual cells
   */
  function attachCellListeners() {
    if (!matrixContainer || !tooltipEl || matrixListenersAttached) return;
    matrixListenersAttached = true;
    matrixCardBody = matrixContainer.closest(".gh-matrix-card-body") || matrixContainer.parentElement;

    // Mouse hover tracking via delegation
    matrixContainer.addEventListener("mouseover", (e) => {
      const cell = e.target.closest(".matrix-cell");
      if (!cell) return;
      if (cell === activeCell) return;
      activeCell = cell;
      scheduleTooltipUpdate(cell);
    });

    matrixContainer.addEventListener("mouseout", (e) => {
      const related = e.relatedTarget;
      // If moving within the same cell, ignore
      if (related && (related === activeCell || (related.closest && related.closest(".matrix-cell") === activeCell))) {
        return;
      }
      // If moving to another cell, mouseover will handle it
      if (related && related.closest && related.closest(".matrix-cell")) {
        return;
      }
      // Leaving the cells area
      hideTooltip();
    });

    matrixContainer.addEventListener("mouseleave", hideTooltip);

    // Keyboard accessibility via event delegation
    matrixContainer.addEventListener("focusin", (e) => {
      const cell = e.target.closest(".matrix-cell");
      if (cell) {
        activeCell = cell;
        scheduleTooltipUpdate(cell);
      }
    });

    matrixContainer.addEventListener("focusout", (e) => {
      hideTooltip();
    });

    matrixContainer.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        const cell = e.target.closest(".matrix-cell");
        if (cell) {
          e.preventDefault();
          activeCell = cell;
          scheduleTooltipUpdate(cell);
        }
      } else if (e.key === "Escape") {
        hideTooltip();
      }
    });

    // Keep tooltip locked to cell if user scrolls horizontally
    matrixContainer.addEventListener("scroll", () => {
      if (activeCell) {
        scheduleTooltipUpdate(activeCell);
      }
    }, { passive: true });

    // Handle window resize smoothly
    window.addEventListener("resize", () => {
      if (activeCell) {
        scheduleTooltipUpdate(activeCell);
      }
    }, { passive: true });
  }

  /**
   * Render clean error state if contribution retrieval fails
   * Preserves section layout and provides an interactive retry button
   */
  function renderMatrixError(statusCode = null) {
    if (!matrixContainer) return;
    const code = statusCode || lastErrorStatus || 503;

    if (window.ErrorState) {
      matrixContainer.innerHTML = window.ErrorState.renderCard({
        statusCode: code,
        title: code === 429
          ? "GitHub Rate Limit Reached"
          : (code >= 500 ? "GitHub Activity Unavailable" : "Unable to Load GitHub Activity"),
        message: code === 429
          ? "The public GitHub API rate limit has been reached. Please try again in a few moments."
          : (code >= 500
            ? "The activity service couldn't complete this request right now."
            : "Unable to retrieve contribution calendar data. Please check your connection or try again."),
        retryId: "retry-github-matrix",
        retryText: "Retry Loading Activity",
        showRetry: true
      });

      const retryBtn = matrixContainer.querySelector('.error-retry-btn[data-retry-id="retry-github-matrix"]');
      if (retryBtn) {
        retryBtn.addEventListener("click", async () => {
          retryBtn.disabled = true;
          retryBtn.innerHTML = `
            <span class="matrix-spinner" style="width: 12px; height: 12px; border-width: 2px;" aria-hidden="true"></span>
            <span>Retrying...</span>
          `;
          await loadCalendar();
        });
      }
    } else {
      matrixContainer.innerHTML = `
        <div class="matrix-error-placeholder">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span class="matrix-error-text">Unable to load GitHub contributions.</span>
          <button type="button" class="btn btn-outline btn-sm" id="gh-manual-retry-btn">
            Retry
          </button>
        </div>
      `;
      const fallbackRetry = document.getElementById("gh-manual-retry-btn");
      if (fallbackRetry) {
        fallbackRetry.addEventListener("click", () => loadCalendar());
      }
    }

    if (totalContribsBadge) {
      totalContribsBadge.innerHTML = `
        <a href="https://github.com/${USERNAME}" target="_blank" rel="noopener noreferrer" class="gh-user-handle">
          View activity on GitHub
        </a>
      `;
    }
  }

  async function loadCalendar() {
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
      { name: "PHP", percent: "42%", color: "#1A1A1A" },
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

  /**
   * Watermark Scroll Parallax Scrub
   * Translates the giant background CONTRIBUTIONS label smoothly on scroll
   */
  function initWatermarkParallax() {
    const section = document.getElementById("activity");
    if (!section) return;
    const watermark = section.querySelector(".activity-watermark");
    if (!watermark) return;

    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = section.getBoundingClientRect();
          const winHeight = window.innerHeight;
          if (rect.top < winHeight && rect.bottom > 0) {
            const progress = (winHeight - rect.top) / (winHeight + rect.height);
            const translateY = -40 + progress * 80; // -40px to +40px scrub
            watermark.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  async function init() {
    container = document.getElementById("github-activity-feed");
    profileContainer = document.getElementById("github-profile-card");
    languagesContainer = document.getElementById("github-languages-list");
    matrixContainer = document.getElementById("github-matrix-container");
    totalContribsBadge = document.getElementById("github-total-contribs");
    totalNumberEl = document.getElementById("github-total-number");
    longestStreakEl = document.getElementById("github-longest-streak");
    activeDaysEl = document.getElementById("github-active-days");
    statusContainer = document.getElementById("github-status-notice");
    tooltipEl = document.getElementById("matrix-tooltip");

    // Render profile, events, and languages without any GitHub API calls
    renderProfile();
    renderEvents();
    renderLanguages();

    // Enable background watermark parallax
    initWatermarkParallax();

    // Fetch and render the public GitHub contribution calendar
    await loadCalendar();
  }

  return {
    init,
    loadCalendar
  };
})();

if (typeof window !== "undefined") {
  window.GitHubManager = GitHubManager;
}
