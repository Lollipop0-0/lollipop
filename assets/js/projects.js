/**
 * Karl Evan Tabunda - Projects Rendering and Filtering Module
 * Handles client-side category filtering, accessibility attributes, and dynamic card generation.
 */

const ProjectsManager = (() => {
  let container = null;
  let filterButtons = [];

  let currentFilter = "all";

  /**
   * Render project card HTML
   * @param {Object} project
   */
  function createProjectCardHtml(project) {
    const techPills = (project.technologies || [])
      .map(t => `<span class="tech-pill-sm">${escapeHtml(t)}</span>`)
      .join("");

    const isCollaborative = project.category === "collaborative" || project.isCollaborative;
    const badgeClass = isCollaborative ? "badge-collaborative" : "badge-personal";
    const badgeText = isCollaborative ? "Collaborative Project" : "My Project";

    // Clean display repo string
    const repoDisplay = project.repository.replace("https://github.com/", "");

    return `
      <article class="project-card" data-category="${escapeHtml(project.category)}" data-id="${escapeHtml(project.id)}">
        <div class="project-card-image-wrap">
          <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)} preview" class="project-card-img" loading="lazy">
          <div class="project-card-overlay">
            <button type="button" class="btn btn-sm btn-glass" data-modal-project="${escapeHtml(project.id)}" aria-label="View details for ${escapeHtml(project.title)}">
              <span>View Details</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
            </button>
            <a href="${escapeHtml(project.repository)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-glass-icon" aria-label="GitHub Repository for ${escapeHtml(project.title)}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>
        </div>

        <div class="project-card-content">
          <div class="project-card-meta">
            <span class="project-card-number">${escapeHtml(project.badgeNumber)}</span>
            <span class="project-badge ${badgeClass}">${badgeText}</span>
          </div>

          <h3 class="project-card-title">
            <button type="button" class="project-title-link" data-modal-project="${escapeHtml(project.id)}">
              ${escapeHtml(project.title)}
            </button>
          </h3>

          <div class="project-card-repo-slug">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            <span>${escapeHtml(repoDisplay)}</span>
          </div>

          <p class="project-card-desc">${escapeHtml(project.description)}</p>

          <div class="project-card-footer">
            <div class="project-card-tech">${techPills}</div>
          </div>
        </div>
      </article>
    `;
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

  /**
   * Render projects based on current filter
   */
  function render() {
    if (!container) return;

    const allProjects = (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.projects) || [];

    // Filter projects strictly by category
    const filtered = allProjects.filter(project => {
      if (currentFilter === "all") return true;
      if (currentFilter === "personal" || currentFilter === "my-projects") {
        return project.category === "personal";
      }
      if (currentFilter === "collaborative" || currentFilter === "team-projects") {
        return project.category === "collaborative" || project.isCollaborative;
      }
      return true;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="no-projects-message">
          <p>No projects match this category filter.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(createProjectCardHtml).join("");
  }

  /**
   * Set filter category
   * @param {string} filter
   */
  function setFilter(filter) {
    currentFilter = filter;

    filterButtons.forEach(btn => {
      const btnFilter = btn.getAttribute("data-filter");
      const isMatch = btnFilter === filter;
      btn.classList.toggle("is-active", isMatch);
      btn.setAttribute("aria-selected", String(isMatch));
    });

    render();
  }

  /**
   * Initialize projects module
   */
  function init() {
    container = document.getElementById("projects-grid");
    filterButtons = document.querySelectorAll(".filter-btn");

    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter") || "all";
        setFilter(filter);
      });
    });

    render();
  }

  return {
    init,
    render,
    setFilter
  };
})();

if (typeof window !== "undefined") {
  window.ProjectsManager = ProjectsManager;
}
