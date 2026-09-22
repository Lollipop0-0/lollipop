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

    if (modal) modal.classList.remove("modal-cert-mode");

    // Slug alias map for backwards compatibility and resilient linking
    const SLUG_TO_ID_MAP = {
      cup: "01",
      "01": "01",
      inventory: "02",
      "02": "02",
      library: "03",
      "03": "03",
      sneakerhub: "04",
      "04": "04",
      hotel: "05",
      "05": "05",
      smartspace: "06",
      "06": "06"
    };
    const targetId = SLUG_TO_ID_MAP[projectId] || projectId;

    // Retrieve project data (check featured project or archive projects)
    let project = null;
    if (window.PORTFOLIO_DATA) {
      if (window.PORTFOLIO_DATA.featuredProject && (window.PORTFOLIO_DATA.featuredProject.id === targetId || window.PORTFOLIO_DATA.featuredProject.id === projectId)) {
        project = window.PORTFOLIO_DATA.featuredProject;
      } else if (Array.isArray(window.PORTFOLIO_DATA.projects)) {
        project = window.PORTFOLIO_DATA.projects.find(p => p.id === targetId || p.id === projectId);
      }
    }

    if (!project) return;

    renderProjectContent(project);

    // Asynchronously verify repository if not already verified
    if (window.ErrorState && typeof window.ErrorState.checkRepository === "function" && project.repository) {
      window.ErrorState.checkRepository(project.repository, project).then(status => {
        const repoContainer = document.getElementById("modal-repo-action-container");
        if (repoContainer && modal && modal.classList.contains("is-active")) {
          repoContainer.innerHTML = window.ErrorState.renderModalAction(project, status);
        }
      }).catch(() => {});
    }

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
   * Populate modal with certificate details and display it
   * @param {string} certId - ID matching certificate in PORTFOLIO_DATA.certificates
   * @param {HTMLElement} triggerElement - Element that triggered the modal
   */
  function openCertificate(certId, triggerElement) {
    if (!modal) return;
    lastFocusedElement = triggerElement || document.activeElement;

    let cert = null;
    if (window.PORTFOLIO_DATA && Array.isArray(window.PORTFOLIO_DATA.certificates)) {
      cert = window.PORTFOLIO_DATA.certificates.find(c => c.id === certId);
    }

    if (!cert) return;

    modal.classList.add("modal-cert-mode");
    renderCertificateContent(cert);

    modal.classList.add("is-active");
    if (modalBackdrop) modalBackdrop.classList.add("is-active");
    document.body.classList.add("modal-locked");
    modal.setAttribute("aria-hidden", "false");

    updateFocusableElements();
    if (closeBtn) {
      closeBtn.focus();
    }
  }

  /**
   * Render structured certificate details inside modal body
   * Side-by-side 2-column split layout matching user design
   * @param {Object} cert
   */
  function renderCertificateContent(cert) {
    if (modalTitle) {
      modalTitle.textContent = `Certificate — ${cert.title}`;
    }

    if (!modalBody) return;

    const skillBadges = (cert.skills || [])
      .map(s => `<span class="tech-pill">${escapeHtml(s)}</span>`)
      .join("");

    modalBody.innerHTML = `
      <div class="modal-split-layout modal-cert-split-layout">
        <!-- Left Side: Certificate Preview Image, Actions & Key Competencies -->
        <div class="modal-split-media-col modal-cert-media-col">
          <a href="${escapeHtml(cert.image)}" target="_blank" rel="noopener noreferrer" class="modal-media-wrapper modal-cert-preview-frame modal-preview-zoomable" title="Click to view full high-res certificate image">
            <img src="${escapeHtml(cert.image)}" alt="${escapeHtml(cert.title)} Certificate preview" class="modal-cert-img" width="1024" height="722" loading="lazy" decoding="async">
            <div class="modal-preview-zoom-overlay">
              <span class="modal-preview-zoom-pill">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                View High-Res
              </span>
            </div>
          </a>
          <div class="modal-btn-group modal-split-btn-group modal-cert-btn-group">
            <a href="${escapeHtml(cert.image)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
              <svg class="btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              <span>View Full Image</span>
            </a>
            <a href="${escapeHtml(cert.image)}" download="${escapeHtml(cert.id)}.png" class="btn btn-secondary btn-sm">
              <svg class="btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              <span>Download</span>
            </a>
          </div>

          <div class="modal-detail-block modal-media-tags-block">
            <h4 class="modal-section-heading">Key Competencies Tested</h4>
            <div class="modal-tech-list">
              ${skillBadges}
            </div>
          </div>
        </div>

        <!-- Right Side: Structured Details & Credential Information -->
        <div class="modal-split-info-col modal-cert-info-col">
          <div class="modal-badges-row">
            <span class="badge badge-collaborative">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right: 4px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
              ${escapeHtml(cert.issuer)} Verified
            </span>
            <span class="badge badge-subtle">Issued: ${escapeHtml(cert.issueDate)}</span>
          </div>

          <p class="modal-project-summary modal-cert-summary">${escapeHtml(cert.description)}</p>

          <div class="modal-detail-block">
            <h4 class="modal-section-heading">Credential Information</h4>
            <ul class="modal-feature-list">
              <li><span class="bullet-icon">✦</span> <span><strong>Course:</strong> ${escapeHtml(cert.title)}</span></li>
              <li><span class="bullet-icon">✦</span> <span><strong>Issuing Body:</strong> ${escapeHtml(cert.issuer)}</span></li>
              <li><span class="bullet-icon">✦</span> <span><strong>Certificate ID:</strong> <code class="cert-code-highlight">${escapeHtml(cert.credentialId)}</code></span></li>
              <li><span class="bullet-icon">✦</span> <span><strong>Issue Date:</strong> ${escapeHtml(cert.issueDate)}</span></li>
              <li><span class="bullet-icon">✦</span> <span><strong>Signatory:</strong> Yeva Hyusyan (Chief Executive Officer)</span></li>
            </ul>
          </div>
        </div>
      </div>
    `;
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

    const liveBtnHtml = project.liveUrl
      ? `<a href="${escapeHtml(project.liveUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
           <svg class="btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
           <span>Live Demo</span>
         </a>`
      : "";

    modalBody.innerHTML = `
      <div class="modal-split-layout modal-project-split-layout">
        <!-- Left Side: Project Screenshot, Actions & Technologies Used -->
        <div class="modal-split-media-col">
          <a href="${escapeHtml(project.image)}" target="_blank" rel="noopener noreferrer" class="modal-media-wrapper modal-preview-zoomable" title="Click to view full screenshot">
            <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)} preview screenshot" class="modal-project-img" width="1376" height="768" loading="lazy" decoding="async">
            <div class="modal-preview-zoom-overlay">
              <span class="modal-preview-zoom-pill">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                View Full Size
              </span>
            </div>
          </a>

          <div class="modal-media-actions-area">
            <div id="modal-repo-action-container">
              ${window.ErrorState ? window.ErrorState.renderModalAction(project) : `
                <div class="modal-btn-group modal-split-btn-group">
                  <a href="${escapeHtml(project.repository)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                    <svg class="btn-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    <span>GitHub Repository</span>
                  </a>
                  ${liveBtnHtml}
                </div>
              `}
            </div>
          </div>

          <div class="modal-detail-block modal-media-tags-block">
            <h4 class="modal-section-heading">Technologies Used</h4>
            <div class="modal-tech-list">
              ${techBadges}
            </div>
          </div>
        </div>

        <!-- Right Side: Badges, Summary & Architecture Features -->
        <div class="modal-split-info-col">
          <div class="modal-badges-row">
            ${teamBadge}
            <span class="badge badge-subtle">${escapeHtml(project.tagline || "")}</span>
          </div>

          <p class="modal-project-summary">${escapeHtml(project.longDescription || project.description)}</p>

          <div class="modal-detail-block">
            <h4 class="modal-section-heading">Key Architecture & Features</h4>
            <ul class="modal-feature-list">
              ${highlightsList}
            </ul>
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
    modal.classList.remove("modal-cert-mode");
    document.body.classList.remove("modal-locked");
    modal.setAttribute("aria-hidden", "true");

    // Check if the trigger was a certificate card in the auto-scrolling marquee
    const isCertCard = lastFocusedElement && lastFocusedElement.closest && (
      lastFocusedElement.closest("[data-modal-certificate]") ||
      lastFocusedElement.closest(".cert-marquee-container")
    );

    if (isCertCard) {
      // Blur the certificate card so :focus-within does not keep the carousel paused,
      // allowing the animation to continue immediately upon closing.
      if (typeof lastFocusedElement.blur === "function") {
        lastFocusedElement.blur();
      }
      if (document.activeElement && typeof document.activeElement.blur === "function") {
        document.activeElement.blur();
      }
      lastFocusedElement = null;

      // Force resume on the marquee container so the carousel continues scrolling
      const marqueeContainer = document.getElementById("cert-marquee-container");
      if (marqueeContainer) {
        marqueeContainer.classList.add("is-resuming");
        setTimeout(() => {
          marqueeContainer.classList.remove("is-resuming");
        }, 1200);
      }
    } else if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
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

    // Global listener for elements requesting project or certificate modal
    document.addEventListener("click", e => {
      const projTrigger = e.target.closest("[data-modal-project]");
      if (projTrigger) {
        e.preventDefault();
        const projectId = projTrigger.getAttribute("data-modal-project");
        open(projectId, projTrigger);
        return;
      }

      const certTrigger = e.target.closest("[data-modal-certificate]");
      if (certTrigger) {
        e.preventDefault();
        const certId = certTrigger.getAttribute("data-modal-certificate");
        openCertificate(certId, certTrigger);
        return;
      }
    });

    // Handle Enter/Space on focused certificate card
    document.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        const certTrigger = document.activeElement ? document.activeElement.closest("[data-modal-certificate]") : null;
        if (certTrigger && modal && !modal.classList.contains("is-active")) {
          e.preventDefault();
          const certId = certTrigger.getAttribute("data-modal-certificate");
          openCertificate(certId, certTrigger);
        }
      }
    });
  }

  return {
    init,
    open,
    openCertificate,
    close
  };
})();

if (typeof window !== "undefined") {
  window.ModalManager = ModalManager;
}
