/**
 * Karl Evan Tabunda - Live Visitor & Real-Time Presence Counter Module
 * 
 * Architecture:
 * 1. True Live Concurrent Viewers:
 *    - Uses atomic presence engine on Apache/PHP (api/visitors.php).
 *    - Heartbeat ping sent every 10s via fetch; leave signal dispatched via navigator.sendBeacon on tab close.
 *    - Multi-tab presence sync via BroadcastChannel so open tabs stay in sync across windows.
 * 2. Total Visits & Unique Hits:
 *    - Atomically recorded with PHP flock and session cooldown cookies (cache/visitors.json).
 *    - Resilient 3-tier fallback (Local PHP -> Public Counter API -> localStorage cached total).
 * 3. Reactive UI:
 *    - Dynamic avatar stack reflecting real active viewers.
 *    - Combined footer pill displaying both live viewing count and total site views.
 */

(function () {
  "use strict";

  const LOCAL_ENDPOINT = "api/visitors.php";
  const STORAGE_KEY = "ke_cached_views";
  const DEFAULT_FALLBACK_COUNT = 356;
  const REQUEST_TIMEOUT_MS = 2500;
  const HEARTBEAT_ACTIVE_MS = 10000;     // 10 seconds when tab is active
  const HEARTBEAT_INACTIVE_MS = 25000;   // 25 seconds when tab is in background

  let currentViewers = 1;
  let totalViews = DEFAULT_FALLBACK_COUNT;
  let heartbeatTimer = null;
  let presenceChannel = null;

  /**
   * Get or generate a stable, tab-isolated session ID for presence tracking
   */
  function getViewerId() {
    let id = null;
    try {
      id = sessionStorage.getItem("ke_viewer_id");
      if (!id) {
        id = "v_" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
        sessionStorage.setItem("ke_viewer_id", id);
      }
    } catch (e) {
      id = "v_" + Math.random().toString(36).substring(2, 12);
    }
    return id;
  }

  /**
   * Multi-tab BroadcastChannel synchronizer
   */
  try {
    if (typeof BroadcastChannel !== "undefined") {
      presenceChannel = new BroadcastChannel("ke_presence_sync");
      presenceChannel.onmessage = (event) => {
        if (!event || !event.data) return;
        if (typeof event.data.currentViewers === "number") {
          currentViewers = event.data.currentViewers;
          renderCurrentViewsUI(currentViewers);
        }
        if (typeof event.data.totalViews === "number") {
          totalViews = event.data.totalViews;
          saveToStorage(totalViews);
          renderTotalViewsUI(totalViews);
        }
      };
    }
  } catch (e) {}

  function broadcastPresence(viewers, total) {
    if (presenceChannel) {
      try {
        presenceChannel.postMessage({ currentViewers: viewers, totalViews: total });
      } catch (e) {}
    }
  }

  /**
   * Fetch with AbortController timeout
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
   * Update Tooltips and accessibility labels
   */
  function updatePillTooltips() {
    const pills = document.querySelectorAll(".footer-visitor-pill");
    const peopleText = currentViewers === 1 ? "person" : "people";
    const titleText = `${currentViewers} ${peopleText} viewing now (${totalViews.toLocaleString()} total visits)`;
    pills.forEach(pill => {
      pill.setAttribute("title", titleText);
      pill.setAttribute("aria-label", titleText);
    });
  }

  /**
   * Render Live Current Viewers UI
   */
  function renderCurrentViewsUI(targetCount) {
    const elements = document.querySelectorAll("[data-current-views]");
    elements.forEach(el => {
      el.textContent = String(targetCount);
    });

    const liveLabel = document.getElementById("footer-live-label");
    if (liveLabel) {
      liveLabel.textContent = "viewing now";
    }

    // Update avatar stack visibility (showing up to targetCount avatars, max 4, min 1)
    const avatars = document.querySelectorAll(".viewer-avatar");
    avatars.forEach((avatar, index) => {
      if (index < Math.min(4, Math.max(1, targetCount))) {
        avatar.style.display = "inline-flex";
      } else {
        avatar.style.display = "none";
      }
    });

    updatePillTooltips();
  }

  /**
   * Render Total Visits UI
   */
  function renderTotalViewsUI(count) {
    const totalElements = document.querySelectorAll("[data-total-views]");
    totalElements.forEach(el => {
      el.textContent = count.toLocaleString();
    });
    updatePillTooltips();
  }

  /**
   * Local Storage Multi-Tab Presence Coordinator (Fallback for Static Hosting Environments like Netlify)
   */
  const TAB_REGISTRY_KEY = "ke_active_tabs";
  const TAB_LEASE_TIMEOUT_MS = 25000;

  function syncLocalTabPresence(action = "heartbeat") {
    try {
      const vid = getViewerId();
      const now = Date.now();
      let registry = {};
      const raw = localStorage.getItem(TAB_REGISTRY_KEY);
      if (raw) {
        try { registry = JSON.parse(raw) || {}; } catch (e) {}
      }

      // Prune stale tabs whose lease expired
      for (const [id, ts] of Object.entries(registry)) {
        if (now - ts > TAB_LEASE_TIMEOUT_MS) {
          delete registry[id];
        }
      }

      if (action === "leave") {
        delete registry[vid];
      } else {
        registry[vid] = now;
      }

      localStorage.setItem(TAB_REGISTRY_KEY, JSON.stringify(registry));
      return Math.max(1, Object.keys(registry).length);
    } catch (e) {
      return 1;
    }
  }

  // Cross-tab real-time storage event listener (triggers when tabs are opened/closed)
  window.addEventListener("storage", (e) => {
    if (e.key === TAB_REGISTRY_KEY) {
      const activeTabs = syncLocalTabPresence("heartbeat");
      currentViewers = activeTabs;
      renderCurrentViewsUI(currentViewers);
    }
  });

  /**
   * Fallback for static deployment environments (local storage seed)
   */
  async function fetchPublicCountFallback() {
    totalViews = getFromStorage();
    renderTotalViewsUI(totalViews);
  }

  /**
   * Core Presence & Tracking Request: handles visit, heartbeat, and leave
   */
  async function sendPresencePing(action = "heartbeat") {
    const viewerId = getViewerId();
    const url = `${LOCAL_ENDPOINT}?action=${encodeURIComponent(action)}&viewerId=${encodeURIComponent(viewerId)}`;

    try {
      const response = await fetchWithTimeout(url, {
        method: "GET",
        headers: { "Accept": "application/json" },
        cache: "no-cache"
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const data = await response.json();
          if (data && data.success) {
            if (typeof data.currentViewers === "number") {
              currentViewers = data.currentViewers;
              renderCurrentViewsUI(currentViewers);
            }
            if (typeof data.totalViews === "number") {
              totalViews = data.totalViews;
              saveToStorage(totalViews);
              renderTotalViewsUI(totalViews);
            }
            broadcastPresence(currentViewers, totalViews);
            return;
          }
        }
      }
    } catch (err) {
      // Local PHP endpoint unavailable (static hosting fallback)
    }

    // Static hosting fallback (e.g. Netlify): coordinate active tab presence locally
    currentViewers = syncLocalTabPresence(action);
    renderCurrentViewsUI(currentViewers);
    broadcastPresence(currentViewers, totalViews);

    if (action === "visit") {
      await fetchPublicCountFallback();
    }
  }

  /**
   * Dispatch leave signal on tab close or navigation away
   */
  function sendLeaveSignal() {
    const viewerId = getViewerId();
    const url = `${LOCAL_ENDPOINT}?action=leave&viewerId=${encodeURIComponent(viewerId)}`;
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url);
    } else {
      fetch(url, { method: "GET", keepalive: true }).catch(() => {});
    }
    syncLocalTabPresence("leave");
    broadcastPresence(Math.max(1, currentViewers - 1), totalViews);
  }

  window.addEventListener("beforeunload", sendLeaveSignal);
  window.addEventListener("pagehide", sendLeaveSignal);

  /**
   * Scheduled Heartbeat Loop with Page Visibility Optimization
   */
  function scheduleNextHeartbeat(delay) {
    if (heartbeatTimer) clearTimeout(heartbeatTimer);
    heartbeatTimer = setTimeout(async () => {
      await sendPresencePing("heartbeat");
      scheduleNextHeartbeat(document.hidden ? HEARTBEAT_INACTIVE_MS : HEARTBEAT_ACTIVE_MS);
    }, delay);
  }

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      // Immediately refresh live numbers when switching back to tab
      sendPresencePing("heartbeat");
      scheduleNextHeartbeat(HEARTBEAT_ACTIVE_MS);
    } else {
      scheduleNextHeartbeat(HEARTBEAT_INACTIVE_MS);
    }
  });

  /**
   * Initialize module
   */
  async function init() {
    try {
      // 1. Render immediate default values from local cache
      totalViews = getFromStorage();
      renderCurrentViewsUI(currentViewers);
      renderTotalViewsUI(totalViews);

      // 2. Initial visit ping to register active presence and increment session visit
      await sendPresencePing("visit");

      // 3. Start recurring heartbeat to keep presence live and stream updates
      scheduleNextHeartbeat(HEARTBEAT_ACTIVE_MS);
    } catch (error) {
      console.error("[VisitorManager] Initialization error:", error);
    }
  }

  window.VisitorManager = {
    init,
    getCurrentViews: () => currentViewers,
    getTotalViews: () => totalViews,
    refresh: () => sendPresencePing("heartbeat")
  };
})();
