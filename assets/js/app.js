/**
 * Karl Evan Tabunda - Main Application Orchestrator
 * Coordinates all modules on DOMContentLoaded.
 */

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // 1. Asynchronously load and assemble all component templates into #app
    if (window.ComponentLoader) {
      await window.ComponentLoader.loadAll("#app");
    }

    // 2. Initialize Theme (Light / Dark)
    if (window.ThemeManager) {
      window.ThemeManager.init();
    }

    // 3. Initialize Navigation (Smooth Scroll, Scrollspy, Mobile Drawer)
    if (window.NavigationManager) {
      window.NavigationManager.init();
    }

    // 4. Render Tech Stack, Journey, Figuring Out lists
    renderTechStack();
    renderJourney();
    renderFiguringOut();

    // 5. Initialize Projects (Archive filtering, card rendering)
    if (window.ProjectsManager) {
      window.ProjectsManager.init();
    }

    // 6. Initialize Modal (Accessible project details modal)
    if (window.ModalManager) {
      window.ModalManager.init();
    }

    // 7. Initialize GitHub API integration
    if (window.GitHubManager) {
      window.GitHubManager.init();
    }

    // 8. Initialize Contact Form Validation
    if (window.ContactManager) {
      window.ContactManager.init();
    }

    // 9. Initialize Portfolio Command Search
    if (window.SearchManager) {
      window.SearchManager.init();
    }

    // 9. Back to Top Smooth Scroll
    const backToTopBtn = document.getElementById("back-to-top");
    if (backToTopBtn) {
      backToTopBtn.addEventListener("click", e => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    // 10. Copyright Year
    const yearEl = document.getElementById("copyright-year");
    if (yearEl) {
      yearEl.textContent = "2026";
    }
  } catch (err) {
    console.error("Application initialization error:", err);
  }
});

/**
 * Render Tech Stack Categories
 */
function renderTechStack() {
  const container = document.getElementById("tech-stack-container");
  if (!container || !window.PORTFOLIO_DATA || !window.PORTFOLIO_DATA.techStack) return;

  const stack = window.PORTFOLIO_DATA.techStack;
  let html = "";

  for (const [category, skills] of Object.entries(stack)) {
    const itemsHtml = skills.map(s => `
      <li class="stack-item">
        <span class="stack-item-bullet">•</span>
        <span class="stack-item-name">${escapeHtml(s.name)}</span>
      </li>
    `).join("");

    html += `
      <div class="stack-category-card">
        <div class="stack-category-header">
          <span class="stack-category-indicator"></span>
          <h4 class="stack-category-title">${escapeHtml(category)}</h4>
        </div>
        <ul class="stack-items-list">
          ${itemsHtml}
        </ul>
      </div>
    `;
  }

  container.innerHTML = html;
}

/**
 * Render Development Journey Timeline
 */
function renderJourney() {
  const container = document.getElementById("journey-timeline");
  if (!container || !window.PORTFOLIO_DATA || !window.PORTFOLIO_DATA.developmentJourney) return;

  const journey = window.PORTFOLIO_DATA.developmentJourney;
  const html = journey.map(item => `
    <div class="journey-item">
      <div class="journey-node">
        <span class="journey-step-badge">${escapeHtml(item.step)}</span>
        <div class="journey-line"></div>
      </div>
      <div class="journey-body">
        <h4 class="journey-title">${escapeHtml(item.title)}</h4>
        <p class="journey-desc">${escapeHtml(item.desc)}</p>
      </div>
    </div>
  `).join("");

  container.innerHTML = html;
}

/**
 * Render Currently Figuring Things Out Section
 */
function renderFiguringOut() {
  const container = document.getElementById("figuring-out-list");
  if (!container || !window.PORTFOLIO_DATA || !window.PORTFOLIO_DATA.figuringOut) return;

  const topics = window.PORTFOLIO_DATA.figuringOut;
  const html = topics.map(t => `
    <li class="figuring-item">
      <div class="figuring-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      <div class="figuring-content">
        <span class="figuring-title">${escapeHtml(t.title)}</span>
        <span class="figuring-status">${escapeHtml(t.status)}</span>
      </div>
    </li>
  `).join("");

  container.innerHTML = html;
}

/**
 * Escape HTML utility
 */
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
