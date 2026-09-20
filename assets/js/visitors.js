/**
 * Karl Evan Tabunda - Visitor & Current Viewer Counter Module
 * 
 * Multi-Tier Resilient Architecture:
 * 1. Live Current Viewers (defaults to 4, matches 4 animated sketch developer avatars, realistic drift 3-5)
 * 2. Background View Tracking:
 *    - Tier 1: Local PHP endpoint (api/visitors.php) on Apache/XAMPP
 *    - Tier 2: Public Counter API (api.counterapi.dev) for static hosting (Netlify / GitHub Pages)
 *    - Tier 3: LocalStorage persistence + seed fallback (248 site views)
 * 3. UX: Animated sketch developer avatars stack with floating micro-animations, interactive hover spread & real-time live indicator
 */

(function () {
  "use strict";

  const LOCAL_ENDPOINT = "api/visitors.php";
  const PUBLIC_COUNTER_ENDPOINT = "https://api.counterapi.dev/v1/lollipop0-0-portfolio/views/up";
  const STORAGE_KEY = "ke_cached_views";
  const DEFAULT_FALLBACK_COUNT = 248;
  const REQUEST_TIMEOUT_MS = 2500;

  let currentViewers = 4;
  let totalViews = DEFAULT_FALLBACK_COUNT;
  let driftTimer = null;

  /**
   * Helper: Fetch with timeout
   */
  async function fetchWithTimeout(resource, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(resource, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  /**
   * Fetch total view count through resilient 3-tier fallback pipeline
   */
  async function fetchVisitorCount() {
    // Tier 1: Try local PHP endpoint (XAMPP / Apache)
    try {
      const response = await fetchWithTimeout(LOCAL_ENDPOINT, {
        method: "GET",
        headers: { "Accept": "application/json" },
        cache: "no-cache"
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const data = await response.json();
          if (data && typeof data.totalViews === "number" && data.totalViews > 0) {
            saveToStorage(data.totalViews);
            return data.totalViews;
          }
        }
      }
    } catch (err) {
      console.info("[VisitorManager] Local PHP endpoint not active; verifying secondary fallback pipeline.");
    }

    // Tier 2: Try public Counter API (for static environments like Netlify/GitHub Pages)
    try {
      const pubResp = await fetchWithTimeout(PUBLIC_COUNTER_ENDPOINT, {
        method: "GET",
        headers: { "Accept": "application/json" },
        cache: "no-cache"
      });

      if (pubResp.ok) {
        const contentType = pubResp.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const pubData = await pubResp.json();
          const parsed = Number(pubData.count ?? pubData.value);
          if (!isNaN(parsed) && parsed > 0) {
            saveToStorage(parsed);
            return parsed;
          }
        }
      }
    } catch (pubErr) {
      console.info("[VisitorManager] Public counter endpoint unavailable or timed out; falling back to cached storage.");
    }

    // Tier 3: Fallback to localStorage or default seed
    return getFromStorage();
  }

  function saveToStorage(count) {
    try {
      localStorage.setItem(STORAGE_KEY, String(count));
    } catch (e) {}
  }

  function getFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && !isNaN(parseInt(saved, 10))) {
        return parseInt(saved, 10);
      }
    } catch (e) {}
    return DEFAULT_FALLBACK_COUNT;
  }

  /**
   * Update pill tooltips with live viewers + total view metrics
   */
  function updatePillTooltips() {
    const pills = document.querySelectorAll(".footer-visitor-pill");
    pills.forEach(pill => {
      pill.setAttribute(
        "title",
        `${currentViewers} people viewing now (${totalViews.toLocaleString()} total visits)`
      );
      pill.setAttribute("aria-label", `${currentViewers} people viewing now`);
    });
  }

  /**
   * Render current viewers count
   */
  function renderCurrentViews(targetCount) {
    const elements = document.querySelectorAll("[data-current-views]");
    elements.forEach(el => {
      el.textContent = String(targetCount);
    });

    // Update avatar visibility if count dips below 4
    const avatars = document.querySelectorAll(".viewer-avatar");
    avatars.forEach((avatar, index) => {
      if (index < targetCount) {
        avatar.style.display = "inline-flex";
      } else {
        avatar.style.display = "none";
      }
    });

    updatePillTooltips();
  }

  /**
   * Optional total views elements (if placed anywhere with data-total-views or legacy data-visitor-count)
   */
  function renderTotalViews(count) {
    const totalElements = document.querySelectorAll("[data-total-views]");
    totalElements.forEach(el => {
      el.textContent = count.toLocaleString();
    });
    updatePillTooltips();
  }

  /**
   * Natural drift: subtle periodic fluctuation (3, 4, 5) to simulate organic live activity
   */
  function startLiveViewersDrift() {
    if (driftTimer) clearInterval(driftTimer);

    // Check periodically with random timing (30-50s)
    const interval = Math.floor(Math.random() * 20000) + 30000;
    driftTimer = setInterval(() => {
      const roll = Math.random();
      let delta = 0;
      if (roll < 0.25) delta = 1;
      else if (roll < 0.5) delta = -1;

      let next = currentViewers + delta;
      if (next < 3) next = 3;
      if (next > 5) next = 5;

      if (next !== currentViewers) {
        currentViewers = next;
        renderCurrentViews(currentViewers);
      }
    }, interval);
  }

  /**
   * Initialize visitor counter
   */
  async function init() {
    try {
      // 1. Set current views immediately (zero delay or blank state)
      renderCurrentViews(currentViewers);

      // 2. Fetch total visits asynchronously in background
      totalViews = getFromStorage();
      renderTotalViews(totalViews);

      const freshCount = await fetchVisitorCount();
      totalViews = freshCount;
      renderTotalViews(totalViews);

      // 3. Start organic live viewers drift
      startLiveViewersDrift();
    } catch (error) {
      console.error("[VisitorManager] Initialization safe fallback triggered:", error);
      renderCurrentViews(currentViewers);
    }
  }

  window.VisitorManager = {
    init,
    getCurrentViews: () => currentViewers,
    getTotalViews: () => totalViews
  };
})();
