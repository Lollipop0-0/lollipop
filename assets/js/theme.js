/**
 * Karl Evan Tabunda - Theme Management Module
 * Handles Light/Dark theme toggling, system preference detection, and localStorage persistence.
 */

const ThemeManager = (() => {
  const STORAGE_KEY = "ket_portfolio_theme";
  const THEME_LIGHT = "light";
  const THEME_DARK = "dark";

  /**
   * Determine preferred theme:
   * 1. Saved localStorage value
   * 2. System preference
   * 3. Fallback to light
   */
  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === THEME_LIGHT || saved === THEME_DARK) {
      return saved;
    }
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return THEME_DARK;
    }
    return THEME_LIGHT;
  }

  /**
   * Apply theme to root document
   * @param {string} theme - "light" or "dark"
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    updateThemeToggles(theme);

    // Update contribution matrix color palette without page reload
    const matrixImg = document.getElementById("github-matrix-chart");
    if (matrixImg) {
      const colorHex = theme === THEME_DARK ? "3b82f6" : "2563eb";
      matrixImg.src = `https://ghchart.rshah.org/${colorHex}/Lollipop0-0`;
    }
  }

  /**
   * Update visual and accessibility state of all theme toggle buttons
   * @param {string} theme - current theme
   */
  function updateThemeToggles(theme) {
    const isDark = theme === THEME_DARK;
    const toggles = document.querySelectorAll(".theme-toggle-btn");
    toggles.forEach(btn => {
      btn.setAttribute("aria-pressed", String(isDark));
      btn.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
      btn.setAttribute("title", isDark ? "Switch to light theme" : "Switch to dark theme");

      const iconSun = btn.querySelector(".icon-sun");
      const iconMoon = btn.querySelector(".icon-moon");
      if (iconSun && iconMoon) {
        if (isDark) {
          iconSun.style.display = "block";
          iconMoon.style.display = "none";
        } else {
          iconSun.style.display = "none";
          iconMoon.style.display = "block";
        }
      }
    });
  }

  /**
   * Toggle between light and dark theme
   */
  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || THEME_LIGHT;
    const nextTheme = current === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    localStorage.setItem(STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  }

  /**
   * Initialize Theme Manager
   */
  function init() {
    const theme = getPreferredTheme();
    applyTheme(theme);

    // Bind all theme toggle buttons (desktop & mobile)
    const toggles = document.querySelectorAll(".theme-toggle-btn");
    toggles.forEach(btn => {
      btn.addEventListener("click", toggleTheme);
    });

    // Listen for OS color scheme changes if user hasn't explicitly set preference
    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
        if (!localStorage.getItem(STORAGE_KEY)) {
          applyTheme(e.matches ? THEME_DARK : THEME_LIGHT);
        }
      });
    }
  }

  return {
    init,
    toggleTheme,
    getPreferredTheme,
    applyTheme
  };
})();

if (typeof window !== "undefined") {
  window.ThemeManager = ThemeManager;
}
