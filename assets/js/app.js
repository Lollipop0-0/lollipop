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

    // 4. Render Selected Projects, Tech Stack, Journey, Figuring Out, and Certificates lists
    renderSelectedProjects();
    renderTechStack();
    renderCertificates();
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

    // 10. Initialize Visitor & Viewer Counter
    if (window.VisitorManager) {
      window.VisitorManager.init();
    }

    // 11. Back to Top Smooth Scroll
    const backToTopBtn = document.getElementById("back-to-top");
    if (backToTopBtn) {
      backToTopBtn.addEventListener("click", e => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    // 12. Copyright Year
    const yearEl = document.getElementById("copyright-year");
    if (yearEl) {
      yearEl.textContent = "2026";
    }
  } catch (err) {
    console.error("Application initialization error:", err);
  }
});

/**
 * Render Selected Projects (Homepage 01 — SELECTED WORK)
 * Shows 3-4 compact project cards with one-line descriptions, tech tags, and case study triggers.
 */
function renderSelectedProjects() {
  const container = document.getElementById("selected-projects-grid");
  if (!container || !window.PORTFOLIO_DATA) return;

  // Curated 4 selected projects: 01 CUP, 02 Inventory, 06 SmartSpace, 04 SneakerHub
  const selectedIds = ["01", "02", "06", "04"];
  const allProjects = [];

  if (window.PORTFOLIO_DATA.featuredProject) {
    allProjects.push(window.PORTFOLIO_DATA.featuredProject);
  }
  if (Array.isArray(window.PORTFOLIO_DATA.projects)) {
    allProjects.push(...window.PORTFOLIO_DATA.projects);
  }

  const selectedProjects = selectedIds
    .map(id => allProjects.find(p => p.id === id))
    .filter(Boolean);

  const html = selectedProjects.map(project => {
    const techPills = (project.technologies || []).slice(0, 4)
      .map(t => `<span class="tech-pill-sm">${escapeHtml(t)}</span>`)
      .join("");

    const isCollaborative = project.category === "collaborative" || project.isCollaborative;
    const badgeText = isCollaborative ? "Collaborative" : "Personal";

    return `
      <article class="selected-project-card">
        <div class="selected-project-media">
          <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)} preview" class="selected-project-img" loading="lazy">
          <div class="selected-project-hover-overlay">
            <button type="button" class="btn btn-sm btn-glass" data-modal-project="${escapeHtml(project.id)}" aria-label="View case study for ${escapeHtml(project.title)}">
              <span>View Case Study</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
        <div class="selected-project-body">
          <div class="selected-project-header">
            <h3 class="selected-project-title">
              <button type="button" class="selected-project-title-btn" data-modal-project="${escapeHtml(project.id)}">
                ${escapeHtml(project.title)}
              </button>
            </h3>
            <span class="selected-project-badge">${badgeText}</span>
          </div>
          <p class="selected-project-desc">${escapeHtml(project.description)}</p>
          <div class="selected-project-footer">
            <div class="selected-project-tech">${techPills}</div>
            <button type="button" class="selected-project-link" data-modal-project="${escapeHtml(project.id)}" aria-label="View case study for ${escapeHtml(project.title)}">
              <span>View Case Study →</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  container.innerHTML = html;
}

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
 * Render Verified Certificates Grid
 */
function renderCertificates() {
  const container = document.getElementById("certificates-grid");
  if (!container || !window.PORTFOLIO_DATA || !Array.isArray(window.PORTFOLIO_DATA.certificates)) return;

  const certs = window.PORTFOLIO_DATA.certificates;
  const html = certs.map(cert => {
    const skillsHtml = (cert.skills || [])
      .map(s => `<span class="cert-skill-tag">${escapeHtml(s)}</span>`)
      .join("");

    return `
      <article class="certificate-card" data-modal-certificate="${escapeHtml(cert.id)}" role="button" tabindex="0" aria-label="View ${escapeHtml(cert.title)} certificate details">
        <div class="cert-card-media">
          <img src="${escapeHtml(cert.image)}" alt="${escapeHtml(cert.title)} Sololearn Certificate" class="cert-img-thumb" loading="lazy">
          <div class="cert-media-badge">
            <span class="cert-gold-star">★</span>
            <span>Completed</span>
          </div>
          <div class="cert-media-hover-overlay">
            <span class="cert-inspect-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              Inspect Credential
            </span>
          </div>
        </div>

        <div class="cert-card-content">
          <div class="cert-meta-row">
            <span class="cert-verified-pill">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              ${escapeHtml(cert.issuer)}
            </span>
            <span class="cert-date-text">${escapeHtml(cert.issueDate)}</span>
          </div>

          <h3 class="cert-card-title">${escapeHtml(cert.title)}</h3>
          <p class="cert-card-description">${escapeHtml(cert.description)}</p>

          <div class="cert-skills-group">
            ${skillsHtml}
          </div>

          <div class="cert-card-footer">
            <div class="cert-id-info">
              <span class="cert-id-muted">ID:</span>
              <code class="cert-id-code">${escapeHtml(cert.credentialId)}</code>
            </div>
            <span class="cert-view-link">
              <span>Inspect</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </span>
          </div>
        </div>
      </article>
    `;
  }).join("");

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
