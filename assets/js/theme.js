/**
 * Karl Evan Tabunda - Theme Management Module
 * Supports 3-State Theme Preferences: Light (☀️), Dark (🌙), and System (🖥️)
 * Features dynamic Circular Reveal animation using clip-path and native View Transitions.
 */

const ThemeManager = (() => {
  const STORAGE_KEY = "ket_portfolio_theme";
  const PREF_LIGHT = "light";
  const PREF_DARK = "dark";
  const PREF_SYSTEM = "system";

  let isTransitioning = false;
  let activeTransitionCleanup = null;
  let isMenuOpen = false;

  /**
   * Get user stored preference ('light', 'dark', or 'system')
   * Defaults to 'system' if not explicitly stored.
   * @returns {string}
   */
  function getPreference() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === PREF_LIGHT || saved === PREF_DARK || saved === PREF_SYSTEM) {
        return saved;
      }
    } catch (e) {
      // localStorage may be disabled
    }
    return PREF_SYSTEM;
  }

  /**
   * Determine whether the OS currently prefers dark mode
   * @returns {boolean}
   */
  function isSystemDark() {
    return Boolean(
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }

  /**
   * Calculate effective theme ('light' or 'dark') given a preference
   * @param {string} preference - 'light' | 'dark' | 'system'
   * @returns {string} - 'light' | 'dark'
   */
  function getEffectiveTheme(preference) {
    if (preference === PREF_DARK) return PREF_DARK;
    if (preference === PREF_LIGHT) return PREF_LIGHT;
    return isSystemDark() ? PREF_DARK : PREF_LIGHT;
  }

  /**
   * Determine preferred theme (compatibility alias for getEffectiveTheme)
   * @returns {string} - 'light' | 'dark'
   */
  function getPreferredTheme() {
    return getEffectiveTheme(getPreference());
  }

  /**
   * Calculate dynamic coordinates (x, y) originating from trigger element
   * Falls back safely to center of viewport if element not visible/provided.
   * @param {HTMLElement|null} el
   * @returns {{x: number, y: number}}
   */
  function getOriginCoordinates(el) {
    if (el && typeof el.getBoundingClientRect === "function") {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
      }
    }

    const toggleBtn = document.querySelector(".theme-toggle-btn");
    if (toggleBtn && typeof toggleBtn.getBoundingClientRect === "function") {
      const rect = toggleBtn.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
      }
    }

    // Fallback to center of viewport
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };
  }

  /**
   * Calculate maximum radius to guarantee complete viewport coverage from (x, y)
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  function calculateMaxRadius(x, y) {
    const maxX = Math.max(x, window.innerWidth - x);
    const maxY = Math.max(y, window.innerHeight - y);
    return Math.hypot(maxX, maxY);
  }

  /**
   * Apply theme attribute directly to DOM and update contribution matrix
   * @param {string} effectiveTheme - "light" or "dark"
   */
  function applyThemeToDom(effectiveTheme) {
    document.documentElement.setAttribute("data-theme", effectiveTheme);

    // Update contribution matrix chart color palette dynamically
    const matrixImg = document.getElementById("github-matrix-chart");
    if (matrixImg) {
      const colorHex = effectiveTheme === PREF_DARK ? "3b82f6" : "2563eb";
      matrixImg.src = `https://ghchart.rshah.org/${colorHex}/Lollipop0-0`;
    }
  }

  /**
   * Update visual UI state (toggle button icons, aria attributes, dropdown radio checks)
   * @param {string} preference - 'light' | 'dark' | 'system'
   * @param {string} effectiveTheme - 'light' | 'dark'
   */
  function updateUI(preference, effectiveTheme) {
    document.documentElement.setAttribute("data-theme-preference", preference);

    // Update Toggle Buttons
    const toggles = document.querySelectorAll(".theme-toggle-btn");
    toggles.forEach((btn) => {
      const iconSun = btn.querySelector(".icon-sun");
      const iconMoon = btn.querySelector(".icon-moon");
      const iconSystem = btn.querySelector(".icon-system");

      if (iconSun && iconMoon) {
        if (preference === PREF_SYSTEM && iconSystem) {
          iconSun.style.display = "none";
          iconMoon.style.display = "none";
          iconSystem.style.display = "block";
        } else if (effectiveTheme === PREF_DARK) {
          iconSun.style.display = "none";
          iconMoon.style.display = "block";
          if (iconSystem) iconSystem.style.display = "none";
        } else {
          iconSun.style.display = "block";
          iconMoon.style.display = "none";
          if (iconSystem) iconSystem.style.display = "none";
        }
      }

      const prefLabel = preference === PREF_SYSTEM
        ? `System (${effectiveTheme === PREF_DARK ? "Dark" : "Light"})`
        : (preference === PREF_DARK ? "Dark" : "Light");

      btn.setAttribute("aria-label", `Theme: ${prefLabel}`);
      btn.setAttribute("title", `Theme: ${prefLabel}`);
    });

    // Update Dropdown Items
    const dropdownItems = document.querySelectorAll(".theme-dropdown-item");
    dropdownItems.forEach((item) => {
      const val = item.getAttribute("data-theme-value");
      const isSelected = val === preference;
      item.setAttribute("aria-checked", String(isSelected));
      if (isSelected) {
        item.classList.add("is-selected");
      } else {
        item.classList.remove("is-selected");
      }
    });

    // Update "Currently Dark / Light" status hint in dropdown
    const statusHint = document.getElementById("theme-system-status");
    if (statusHint) {
      statusHint.textContent = `Currently ${effectiveTheme === PREF_DARK ? "Dark" : "Light"}`;
    }
  }

  /**
   * Set user theme preference and smoothly transition with circular reveal if effective theme changes
   * @param {string} newPreference - 'light' | 'dark' | 'system'
   * @param {HTMLElement|null} triggerEl - Element triggering the change for coordinate origin
   */
  function setTheme(newPreference, triggerEl = null) {
    if (newPreference !== PREF_LIGHT && newPreference !== PREF_DARK && newPreference !== PREF_SYSTEM) {
      newPreference = PREF_SYSTEM;
    }

    const currentEffective = document.documentElement.getAttribute("data-theme") || getEffectiveTheme(getPreference());
    const nextEffective = getEffectiveTheme(newPreference);

    // Persist preference
    try {
      localStorage.setItem(STORAGE_KEY, newPreference);
    } catch (e) {
      // Ignored if storage full/disabled
    }

    // 1. If effective theme does not change, only update preference indicators (Requirement #7)
    if (currentEffective === nextEffective) {
      updateUI(newPreference, nextEffective);
      closeDropdown(false);
      return;
    }

    // 2. Check prefers-reduced-motion (Requirement #13)
    const prefersReducedMotion = Boolean(
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );

    if (prefersReducedMotion) {
      applyThemeToDom(nextEffective);
      updateUI(newPreference, nextEffective);
      closeDropdown(true);
      return;
    }

    // 3. Rapid clicking protection: cancel any ongoing active transition
    if (activeTransitionCleanup) {
      activeTransitionCleanup();
      activeTransitionCleanup = null;
    }

    // Calculate dynamic origin coordinates and maximum viewport radius
    const { x, y } = getOriginCoordinates(triggerEl);
    const radius = Math.ceil(calculateMaxRadius(x, y));

    document.documentElement.style.setProperty("--theme-reveal-x", `${x}px`);
    document.documentElement.style.setProperty("--theme-reveal-y", `${y}px`);
    document.documentElement.style.setProperty("--theme-reveal-r", `${radius}px`);

    // Suppress child CSS property transitions (background, border, color) during snapshotting
    // to prevent browser rasterization pause / perceived lag
    document.documentElement.classList.add("theme-transitioning");

    // Close dropdown instantly so it is not captured mid-fade
    closeDropdown(true);

    // 4. Circular Reveal via native View Transitions API if supported
    if (typeof document.startViewTransition === "function") {
      isTransitioning = true;
      try {
        const transition = document.startViewTransition(() => {
          applyThemeToDom(nextEffective);
          updateUI(newPreference, nextEffective);
        });

        // Trigger hardware-accelerated circular reveal immediately when transition is ready
        transition.ready.then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${radius}px at ${x}px ${y}px)`
              ]
            },
            {
              duration: 1050,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              pseudoElement: "::view-transition-new(root)"
            }
          );
        });

        let cleaned = false;
        const cleanup = () => {
          if (cleaned) return;
          cleaned = true;
          document.documentElement.classList.remove("theme-transitioning");
          isTransitioning = false;
          activeTransitionCleanup = null;
        };

        activeTransitionCleanup = () => {
          if (cleaned) return;
          cleaned = true;
          document.documentElement.classList.remove("theme-transitioning");
          isTransitioning = false;
          applyThemeToDom(nextEffective);
          updateUI(newPreference, nextEffective);
        };

        transition.finished.then(cleanup, cleanup);
      } catch (err) {
        document.documentElement.classList.remove("theme-transitioning");
        isTransitioning = false;
        applyThemeToDom(nextEffective);
        updateUI(newPreference, nextEffective);
      }
    } else {
      // 5. Fallback Circular Reveal Overlay for browsers without View Transitions
      executeFallbackReveal(newPreference, nextEffective, x, y, radius);
    }
  }

  /**
   * Fallback Circular Reveal using .theme-transition overlay element
   */
  function executeFallbackReveal(newPreference, nextEffective, x, y, radius) {
    isTransitioning = true;

    // Remove any existing transition overlay
    const oldOverlay = document.querySelector(".theme-transition");
    if (oldOverlay && oldOverlay.parentNode) {
      oldOverlay.parentNode.removeChild(oldOverlay);
    }

    const overlay = document.createElement("div");
    overlay.className = "theme-transition";
    overlay.style.backgroundColor = nextEffective === PREF_DARK ? "#0B0F19" : "#FBFBFA";
    document.body.appendChild(overlay);

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      document.documentElement.classList.remove("theme-transitioning");
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
      isTransitioning = false;
      activeTransitionCleanup = null;
    };

    activeTransitionCleanup = cleanup;

    // Apply new theme state immediately so the DOM reflects target theme behind the circle
    applyThemeToDom(nextEffective);
    updateUI(newPreference, nextEffective);

    // Expand circle immediately without artificial delay
    requestAnimationFrame(() => {
      overlay.classList.add("active");
      setTimeout(cleanup, 1070);
    });
  }

  /**
   * Open the theme dropdown menu
   */
  function openDropdown() {
    const dropdown = document.getElementById("theme-dropdown");
    const toggleBtn = document.getElementById("theme-toggle-btn");
    if (!dropdown || !toggleBtn) return;

    dropdown.removeAttribute("hidden");
    dropdown.classList.add("is-open");
    toggleBtn.setAttribute("aria-expanded", "true");
    isMenuOpen = true;

    // Focus current selected item
    const selectedItem = dropdown.querySelector(".theme-dropdown-item.is-selected") ||
      dropdown.querySelector(".theme-dropdown-item");
    if (selectedItem) {
      selectedItem.focus();
    }
  }

  /**
   * Close the theme dropdown menu
   * @param {boolean} [instant=false]
   */
  function closeDropdown(instant = false) {
    const dropdown = document.getElementById("theme-dropdown");
    const toggleBtn = document.getElementById("theme-toggle-btn");
    if (!dropdown || !toggleBtn) return;

    dropdown.classList.remove("is-open");
    toggleBtn.setAttribute("aria-expanded", "false");
    isMenuOpen = false;

    if (instant) {
      dropdown.setAttribute("hidden", "");
    } else {
      setTimeout(() => {
        if (!isMenuOpen) {
          dropdown.setAttribute("hidden", "");
        }
      }, 160);
    }
  }

  /**
   * Toggle the theme dropdown menu
   */
  function toggleDropdown() {
    if (isMenuOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }

  /**
   * Cycle theme toggle (Dark -> Light -> System -> Dark) for keyboard or direct click
   * @param {HTMLElement|null} triggerEl
   */
  function toggleTheme(triggerEl = null) {
    const pref = getPreference();
    let nextPref;
    if (pref === PREF_DARK) {
      nextPref = PREF_LIGHT;
    } else if (pref === PREF_LIGHT) {
      nextPref = PREF_SYSTEM;
    } else {
      nextPref = PREF_DARK;
    }
    setTheme(nextPref, triggerEl);
  }

  /**
   * Apply theme helper (compatibility alias)
   * @param {string} theme - "light" or "dark"
   */
  function applyTheme(theme) {
    setTheme(theme);
  }

  /**
   * Bind event listeners for dropdown, buttons, keyboard, and OS color scheme changes
   */
  function bindEvents() {
    const toggleBtn = document.getElementById("theme-toggle-btn");
    const dropdown = document.getElementById("theme-dropdown");

    if (toggleBtn) {
      toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleDropdown();
      });

      toggleBtn.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openDropdown();
        }
      });
    }

    // Bind dropdown items
    if (dropdown) {
      const items = Array.from(dropdown.querySelectorAll(".theme-dropdown-item"));

      items.forEach((item, index) => {
        item.addEventListener("click", (e) => {
          e.stopPropagation();
          const chosenPref = item.getAttribute("data-theme-value");
          setTheme(chosenPref, toggleBtn);
          if (toggleBtn) toggleBtn.focus();
        });

        item.addEventListener("keydown", (e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            const next = items[(index + 1) % items.length];
            next.focus();
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            const prev = items[(index - 1 + items.length) % items.length];
            prev.focus();
          } else if (e.key === "Escape") {
            e.preventDefault();
            closeDropdown();
            if (toggleBtn) toggleBtn.focus();
          } else if (e.key === "Home") {
            e.preventDefault();
            items[0].focus();
          } else if (e.key === "End") {
            e.preventDefault();
            items[items.length - 1].focus();
          }
        });
      });
    }

    // Close dropdown on outside click
    document.addEventListener("click", (e) => {
      if (isMenuOpen) {
        const wrap = document.getElementById("theme-menu-wrap");
        if (wrap && !wrap.contains(e.target)) {
          closeDropdown();
        }
      }
    });

    // Close dropdown on Escape globally
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        closeDropdown();
        if (toggleBtn) toggleBtn.focus();
      }
    });

    // OS Color Scheme Change Listener (Requirements #2 and #8)
    if (window.matchMedia) {
      const osSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleOsChange = (e) => {
        const pref = getPreference();
        // If user explicitly selected Light or Dark, DO NOT respond to OS changes! (Requirement #2)
        if (pref !== PREF_SYSTEM) {
          return;
        }

        const currentEffective = document.documentElement.getAttribute("data-theme") || (e.matches ? PREF_LIGHT : PREF_DARK);
        const nextEffective = e.matches ? PREF_DARK : PREF_LIGHT;

        if (currentEffective !== nextEffective) {
          // Automatic Circular Reveal transition from theme control (Requirement #8)
          const targetToggle = document.getElementById("theme-toggle-btn");
          setTheme(PREF_SYSTEM, targetToggle);
        } else {
          updateUI(PREF_SYSTEM, nextEffective);
        }
      };

      if (typeof osSchemeQuery.addEventListener === "function") {
        osSchemeQuery.addEventListener("change", handleOsChange);
      } else if (typeof osSchemeQuery.addListener === "function") {
        osSchemeQuery.addListener(handleOsChange);
      }
    }
  }

  /**
   * Initialize Theme Manager
   */
  function init() {
    const preference = getPreference();
    const effectiveTheme = getEffectiveTheme(preference);

    // Apply directly without animation on initial boot
    applyThemeToDom(effectiveTheme);
    updateUI(preference, effectiveTheme);

    // Bind controls
    bindEvents();
  }

  return {
    init,
    setTheme,
    toggleTheme,
    getPreference,
    getEffectiveTheme,
    getPreferredTheme,
    applyTheme,
    openDropdown,
    closeDropdown
  };
})();

if (typeof window !== "undefined") {
  window.ThemeManager = ThemeManager;
}
