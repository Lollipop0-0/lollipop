/**
 * Karl Evan Tabunda - Visitor & Viewer Counter Module
 * 
 * Multi-Tier Resilient Architecture:
 * 1. Tier 1: Local PHP endpoint (api/visitors.php) on Apache/XAMPP
 * 2. Tier 2: Public Counter API (api.counterapi.dev) for static hosting (Netlify / GitHub Pages)
 *    - Guarded with strict timeout and validation; never assumed guaranteed
 * 3. Tier 3: LocalStorage persistence + seed fallback (248 site views)
 * 4. UX: Smooth cubic ease-out numeric animation into global footer badge
 */

(function () {
  "use strict";

  const LOCAL_ENDPOINT = "api/visitors.php";
  const PUBLIC_COUNTER_ENDPOINT = "https://api.counterapi.dev/v1/lollipop0-0-portfolio/views/up";
  const STORAGE_KEY = "ke_cached_views";
  const DEFAULT_FALLBACK_COUNT = 248;
  const REQUEST_TIMEOUT_MS = 2500;

  let currentCount = null;

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
   * Fetch view count through resilient 3-tier fallback pipeline
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
      // Expected when deployed statically or PHP runtime is absent
      console.info("[VisitorManager] Local PHP endpoint not active; verifying secondary fallback pipeline.");
    }

    // Tier 2: Try public Counter API (for static environments like Netlify/GitHub Pages)
    // NOTE: Treated as non-guaranteed; verified and gracefully bypassed if unreachable or invalid
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
      // Public CounterAPI failed or timed out; gracefully proceed to Tier 3
      console.info("[VisitorManager] Public counter endpoint unavailable or timed out; falling back to cached storage.");
    }

    // Tier 3: Fallback to localStorage or default seed
    return getFromStorage();
  }

  function saveToStorage(count) {
    try {
      localStorage.setItem(STORAGE_KEY, String(count));
    } catch (e) {
      // Storage might be restricted in incognito/embedded frames
    }
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
   * Smoothly animate number count in target elements
   */
  function renderCount(targetCount) {
    const countElements = document.querySelectorAll("[data-visitor-count]");
    if (!countElements.length) return;

    const start = Math.max(0, targetCount - 30);
    const duration = 900; // 0.9s
    const startTime = performance.now();

    function step(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      // Ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = Math.floor(start + (targetCount - start) * ease);

      countElements.forEach(el => {
        el.textContent = val.toLocaleString();
      });

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        countElements.forEach(el => {
          el.textContent = targetCount.toLocaleString();
        });
      }
    }

    requestAnimationFrame(step);
  }

  /**
   * Initialize visitor counter
   */
  async function init() {
    try {
      // 1. Initial render with cached value immediately (zero layout shift/blank text)
      const initialCached = getFromStorage();
      const countElements = document.querySelectorAll("[data-visitor-count]");
      countElements.forEach(el => {
        el.textContent = initialCached.toLocaleString();
      });

      // 2. Fetch fresh count through resilient pipeline
      const freshCount = await fetchVisitorCount();
      currentCount = freshCount;

      // 3. Smooth animation to latest count
      renderCount(freshCount);
    } catch (error) {
      console.error("[VisitorManager] Initialization safe fallback triggered:", error);
      const fallback = getFromStorage();
      const countElements = document.querySelectorAll("[data-visitor-count]");
      countElements.forEach(el => {
        el.textContent = fallback.toLocaleString();
      });
    }
  }

  window.VisitorManager = {
    init,
    getCount: () => currentCount || getFromStorage()
  };
})();
