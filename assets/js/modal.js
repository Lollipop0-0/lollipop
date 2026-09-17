/**
 * Karl Evan Tabunda - Accessible Project Modal Module
 * Implements WAI-ARIA dialog pattern with focus trap, Escape key dismiss, and focus restoration.
 */

const ModalManager = (() => {
  let modal = null;
  let modalBackdrop = null;
  let closeBtn = null;
  let modalTitle = null;
  let modalBody = null;

  let lastFocusedElement = null;
  let focusableElements = [];

  /**
   * Populate modal with project details and display it
   * @param {string} projectId - ID matching project in PORTFOLIO_DATA
   * @param {HTMLElement} triggerElement - Element that triggered the modal
   */
  function open(projectId, triggerElement) {
    if (!modal) return;
    lastFocusedElement = triggerElement || document.activeElement;

    // Retrieve project data (check featured project or archive projects)
    let project = null;
    if (window.PORTFOLIO_DATA) {
      if (window.PORTFOLIO_DATA.featuredProject && window.PORTFOLIO_DATA.featuredProject.id === projectId) {
        project = window.PORTFOLIO_DATA.featuredProject;
      } else if (Array.isArray(window.PORTFOLIO_DATA.projects)) {
        project = window.PORTFOLIO_DATA.projects.find(p => p.id === projectId);
      }
    }

    if (!project) return;

    renderProjectContent(project);

    modal.classList.add("is-active");
    if (modalBackdrop) modalBackdrop.classList.add("is-active");
    document.body.classList.add("modal-locked");
    modal.setAttribute("aria-hidden", "false");

    // Setup focus trap
    updateFocusableElements();
    if (closeBtn) {
      closeBtn.focus();
    }
  }

  /**
   * Render structured project details inside modal body
   * @param {Object} project
   */
  function renderProjectContent(project) {
    if (modalTitle) {
      modalTitle.textContent = `${project.badgeNumber || ""} — ${project.title}`;
    }

    if (!modalBody) return;

    const techBadges = (project.technologies || [])
      .map(t => `<span class="tech-pill">${escapeHtml(t)}</span>`)
      .join("");

    const highlightsList = (project.highlights || [])
      .map(h => `<li><span class="bullet-icon">✦</span> <span>${escapeHtml(h)}</span></li>`)
      .join("");

    const teamBadge = project.category === "collaborative"
      ? `<span class="badge badge-collaborative">${escapeHtml(project.teamLabel || "Collaborative Project")}</span>`
      : `<span class="badge badge-personal">${escapeHtml(project.teamLabel || "Personal Project")}</span>`;

    modalBody.innerHTML = `
      <div class="modal-project-header">
        <div class="modal-badges-row">
          ${teamBadge}
          <span class="badge badge-subtle">${escapeHtml(project.tagline || "")}</span>
        </div>
        <p class="modal-project-summary">${escapeHtml(project.longDescription || project.description)}</p>
      </div>

      <div class="modal-media-wrapper">
        <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)} preview screenshot" class="modal-project-img" loading="lazy">
      </div>

      <div class="modal-details-grid">
        <div class="modal-detail-col">
          <h4 class="modal-section-heading">Key Architecture & Features</h4>
          <ul class="modal-feature-list">
            ${highlightsList}
          </ul>
        </div>

        <div class="modal-detail-col">
          <h4 class="modal-section-heading">Technologies Used</h4>
          <div class="modal-tech-list">
            ${techBadges}
          </div>

          <div class="modal-actions-area">
            <h4 class="modal-section-heading">Repository & Links</h4>
            <div class="modal-btn-group">
              <a href="${escapeHtml(project.repository)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                <span>GitHub Repository</span>
              </a>
              ${project.liveUrl ? `
                <a href="${escapeHtml(project.liveUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
                  <span>Live Demo</span>
                </a>
              ` : ""}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Escape HTML to prevent injection
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
   * Refresh array of focusable elements in modal
   */
  function updateFocusableElements() {
    if (!modal) return;
    focusableElements = Array.from(
      modal.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
    );
  }

  /**
   * Close modal and restore focus to trigger button
   */
  function close() {
    if (!modal || !modal.classList.contains("is-active")) return;
    modal.classList.remove("is-active");
    if (modalBackdrop) modalBackdrop.classList.remove("is-active");
    document.body.classList.remove("modal-locked");
    modal.setAttribute("aria-hidden", "true");

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  /**
   * Trap focus within modal while open
   */
  function handleKeyDown(e) {
    if (!modal.classList.contains("is-active")) return;

    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }

    if (e.key === "Tab") {
      updateFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }

  /**
   * Initialize modal listeners
   */
  function init() {
    modal = document.getElementById("project-modal");
    modalBackdrop = document.getElementById("modal-backdrop");
    closeBtn = document.getElementById("modal-close-btn");
    modalTitle = document.getElementById("modal-title");
    modalBody = document.getElementById("modal-body");

    if (!modal) return;

    if (closeBtn) {
      closeBtn.addEventListener("click", close);
    }

    if (modalBackdrop) {
      modalBackdrop.addEventListener("click", close);
    }

    document.addEventListener("keydown", handleKeyDown);

    // Global listener for elements requesting modal
    document.addEventListener("click", e => {
      const trigger = e.target.closest("[data-modal-project]");
      if (trigger) {
        e.preventDefault();
        const projectId = trigger.getAttribute("data-modal-project");
        open(projectId, trigger);
      }
    });
  }

  return {
    init,
    open,
    close
  };
})();

if (typeof window !== "undefined") {
  window.ModalManager = ModalManager;
}
