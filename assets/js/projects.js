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

    const status = window.ErrorState ? window.ErrorState.getRepositoryStatus(project) : { type: "public" };
    const isPrivate = status.type === "private";
    const isNotFound = status.type === "not-found";

    let repoActionHtml = `
      <a href="${escapeHtml(project.repository)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-glass-icon" aria-label="GitHub Repository for ${escapeHtml(project.title)}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
      </a>
    `;

    let repoSlugHtml = `
      <div class="project-card-repo-slug">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
        <span>${escapeHtml(repoDisplay)}</span>
      </div>
    `;

    if (isPrivate) {
      repoActionHtml = `
        <span class="btn btn-sm btn-glass-icon btn-private-overlay" title="Private Repository — This repository isn't publicly accessible." aria-label="Private Repository">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        </span>
      `;
      repoSlugHtml = `
        <div class="project-card-repo-slug">
          <span class="selected-repo-status status-private">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <span>Private Repository</span>
          </span>
        </div>
      `;
    } else if (isNotFound) {
      repoActionHtml = `
        <span class="btn btn-sm btn-glass-icon btn-unavailable-overlay" title="Repository Unavailable — This project may have been moved, renamed, or is not publicly available." aria-label="Repository Unavailable">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </span>
      `;
      repoSlugHtml = `
        <div class="project-card-repo-slug">
          <span class="selected-repo-status status-unavailable">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <span>Repository Unavailable</span>
          </span>
        </div>
      `;
    }

    return `
      <article class="project-card" data-category="${escapeHtml(project.category)}" data-id="${escapeHtml(project.id)}">
        <div class="project-card-image-wrap">
          <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)} preview" class="project-card-img" width="1376" height="768" loading="lazy" decoding="async">
          <div class="project-card-overlay">
            <button type="button" class="btn btn-sm btn-glass" data-modal-project="${escapeHtml(project.id)}" aria-label="View details for ${escapeHtml(project.title)}">
              <span>View Details</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
            </button>
            ${repoActionHtml}
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

          ${repoSlugHtml}

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

    // Background repository verification for rendered archive cards
    if (window.ErrorState && typeof window.ErrorState.checkRepository === "function") {
      filtered.forEach(project => {
        if (!project.repository) return;
        window.ErrorState.checkRepository(project.repository, project).then(status => {
          if (status.type !== "public") {
            const card = container.querySelector(`.project-card[data-id="${project.id}"]`);
            if (card) {
              const overlayWrap = card.querySelector(".project-card-overlay");
              const slugWrap = card.querySelector(".project-card-repo-slug");
              if (overlayWrap) {
                const existingBtn = overlayWrap.querySelector("a[href*='github.com'], .btn-private-overlay, .btn-unavailable-overlay");
                if (existingBtn) {
                  if (status.type === "private") {
                    existingBtn.outerHTML = `<span class="btn btn-sm btn-glass-icon btn-private-overlay" title="Private Repository — This repository isn't publicly accessible." aria-label="Private Repository"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></span>`;
                  } else if (status.type === "not-found") {
                    existingBtn.outerHTML = `<span class="btn btn-sm btn-glass-icon btn-unavailable-overlay" title="Repository Unavailable — This project may have been moved, renamed, or is not publicly available." aria-label="Repository Unavailable"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg></span>`;
                  }
                }
              }
              if (slugWrap) {
                if (status.type === "private") {
                  slugWrap.innerHTML = `<span class="selected-repo-status status-private"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> <span>Private Repository</span></span>`;
                } else if (status.type === "not-found") {
                  slugWrap.innerHTML = `<span class="selected-repo-status status-unavailable"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> <span>Repository Unavailable</span></span>`;
                }
              }
            }
          }
        }).catch(() => {});
      });
    }
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

  /**
   * Dedicated Projects Archive Page Initialization (projects.html)
   */
  function initProjectsPage() {
    const galleryContainer = document.getElementById("projects-gallery-grid");
    if (!galleryContainer || !window.PORTFOLIO_DATA) return;

    // Collect all projects: 01 (CUP), 06 (SmartSpace), 05 (Hotel), 02 (Inventory), 03 (Library), 04 (SneakerHub)
    const allProjects = [];
    if (window.PORTFOLIO_DATA.featuredProject) {
      allProjects.push(window.PORTFOLIO_DATA.featuredProject);
    }
    if (Array.isArray(window.PORTFOLIO_DATA.projects)) {
      const order = ["01", "06", "05", "02", "03", "04"];
      const remaining = [...window.PORTFOLIO_DATA.projects].sort((a, b) => {
        const idxA = order.indexOf(a.id);
        const idxB = order.indexOf(b.id);
        return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
      });
      allProjects.push(...remaining);
    }

    const uniqueProjects = Array.from(new Map(allProjects.map(p => [p.id, p])).values());

    // Update count badges
    const countAllEl = document.getElementById("count-all");
    const countCollabEl = document.getElementById("count-collaborative");
    const countPersonalEl = document.getElementById("count-personal");
    const countBackendEl = document.getElementById("count-backend");
    const countFrontendEl = document.getElementById("count-frontend");

    const collabCount = uniqueProjects.filter(p => p.category === "collaborative" || p.isCollaborative).length;
    const personalCount = uniqueProjects.filter(p => p.category === "personal" && !p.isCollaborative).length;
    const backendCount = uniqueProjects.filter(p => (p.technologies || []).some(t => ["PHP", "MySQL", "Laravel"].includes(t))).length;
    const frontendCount = uniqueProjects.filter(p => (p.technologies || []).some(t => ["Three.js", "HTML", "CSS"].includes(t))).length;

    if (countAllEl) countAllEl.textContent = String(uniqueProjects.length);
    if (countCollabEl) countCollabEl.textContent = String(collabCount);
    if (countPersonalEl) countPersonalEl.textContent = String(personalCount);
    if (countBackendEl) countBackendEl.textContent = String(backendCount);
    if (countFrontendEl) countFrontendEl.textContent = String(frontendCount);

    let activeFilter = "all";
    let searchQuery = "";

    const filterBtns = document.querySelectorAll(".projects-filter-group .filter-btn");
    const searchInput = document.getElementById("projects-page-search-input") || document.getElementById("projects-page-search-field");
    const searchClearBtn = document.getElementById("projects-search-clear");
    const emptyState = document.getElementById("projects-gallery-empty");
    const statusCountEl = document.getElementById("projects-showing-count");
    const resetBtn = document.getElementById("projects-reset-filter-btn");

    function filterAndRender() {
      const filtered = uniqueProjects.filter(p => {
        // Category filter
        let matchesCategory = true;
        if (activeFilter === "collaborative") {
          matchesCategory = p.category === "collaborative" || p.isCollaborative;
        } else if (activeFilter === "personal") {
          matchesCategory = p.category === "personal" && !p.isCollaborative;
        } else if (activeFilter === "backend") {
          matchesCategory = (p.technologies || []).some(t => ["PHP", "MySQL", "Laravel"].includes(t));
        } else if (activeFilter === "frontend") {
          matchesCategory = (p.technologies || []).some(t => ["Three.js", "HTML", "CSS"].includes(t));
        }

        if (!matchesCategory) return false;

        // Search text query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const title = (p.title || "").toLowerCase();
          const desc = (p.description || "").toLowerCase();
          const tagline = (p.tagline || "").toLowerCase();
          const techs = (p.technologies || []).join(" ").toLowerCase();
          const highlights = (p.highlights || []).join(" ").toLowerCase();

          return title.includes(q) || desc.includes(q) || tagline.includes(q) || techs.includes(q) || highlights.includes(q);
        }

        return true;
      });

      if (statusCountEl) {
        statusCountEl.textContent = `Showing ${filtered.length} of ${uniqueProjects.length} projects`;
      }

      if (filtered.length === 0) {
        galleryContainer.innerHTML = "";
        if (emptyState) emptyState.style.display = "block";
        return;
      }

      if (emptyState) emptyState.style.display = "none";

      galleryContainer.innerHTML = filtered.map(createProjectCardHtml).join("");

      // Background repo check
      if (window.ErrorState && typeof window.ErrorState.checkRepository === "function") {
        filtered.forEach(project => {
          if (!project.repository) return;
          window.ErrorState.checkRepository(project.repository, project).then(status => {
            if (status.type !== "public") {
              const card = galleryContainer.querySelector(`.project-card[data-id="${project.id}"]`);
              if (card) {
                const overlayWrap = card.querySelector(".project-card-overlay");
                const slugWrap = card.querySelector(".project-card-repo-slug");
                if (overlayWrap) {
                  const existingBtn = overlayWrap.querySelector("a[href*='github.com'], .btn-private-overlay, .btn-unavailable-overlay");
                  if (existingBtn) {
                    if (status.type === "private") {
                      existingBtn.outerHTML = `<span class="btn btn-sm btn-glass-icon btn-private-overlay" title="Private Repository — This repository isn't publicly accessible." aria-label="Private Repository"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></span>`;
                    } else if (status.type === "not-found") {
                      existingBtn.outerHTML = `<span class="btn btn-sm btn-glass-icon btn-unavailable-overlay" title="Repository Unavailable — This project may have been moved, renamed, or is not publicly available." aria-label="Repository Unavailable"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg></span>`;
                    }
                  }
                }
                if (slugWrap) {
                  if (status.type === "private") {
                    slugWrap.innerHTML = `<span class="selected-repo-status status-private"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> <span>Private Repository</span></span>`;
                  } else if (status.type === "not-found") {
                    slugWrap.innerHTML = `<span class="selected-repo-status status-unavailable"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> <span>Repository Unavailable</span></span>`;
                  }
                }
              }
            }
          }).catch(() => {});
        });
      }
    }

    // Category button clicks
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        activeFilter = btn.getAttribute("data-filter") || "all";
        filterBtns.forEach(b => {
          const isMatch = b === btn;
          b.classList.toggle("is-active", isMatch);
          b.setAttribute("aria-selected", String(isMatch));
        });
        filterAndRender();
      });
    });

    // Real-time search filter input
    let projectSearchTimer = null;
    if (searchInput) {
      searchInput.addEventListener("input", e => {
        searchQuery = e.target.value;
        if (searchClearBtn) {
          searchClearBtn.style.display = searchQuery ? "flex" : "none";
        }
        clearTimeout(projectSearchTimer);
        projectSearchTimer = setTimeout(() => {
          filterAndRender();
        }, 120);
      });
    }

    if (searchClearBtn && searchInput) {
      searchClearBtn.addEventListener("click", () => {
        searchInput.value = "";
        searchQuery = "";
        searchClearBtn.style.display = "none";
        searchInput.focus();
        filterAndRender();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        activeFilter = "all";
        searchQuery = "";
        if (searchInput) searchInput.value = "";
        if (searchClearBtn) searchClearBtn.style.display = "none";
        filterBtns.forEach(b => {
          const isAll = b.getAttribute("data-filter") === "all";
          b.classList.toggle("is-active", isAll);
          b.setAttribute("aria-selected", String(isAll));
        });
        filterAndRender();
      });
    }

    // Initial render
    filterAndRender();
  }

  return {
    init,
    initProjectsPage,
    render,
    setFilter
  };
})();

if (typeof window !== "undefined") {
  window.ProjectsManager = ProjectsManager;
}
