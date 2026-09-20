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
    verifyCurrentlyBuildingRepo();
    renderTechStack();
    renderCertificates();
    renderJourney();
    renderFiguringOut();

    // 4.5. Initialize Scroll Reveal for dynamically rendered cards
    if (window.NavigationManager && typeof window.NavigationManager.initScrollReveal === "function") {
      window.NavigationManager.initScrollReveal();
    }

    // 5. Initialize Projects (Archive filtering, card rendering, and dedicated projects page)
    if (window.ProjectsManager) {
      window.ProjectsManager.init();
      if (typeof window.ProjectsManager.initProjectsPage === "function") {
        window.ProjectsManager.initProjectsPage();
      }
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

      // Hook up 404 error page search trigger if present
      const errorSearchBtn = document.getElementById("error-search-btn");
      if (errorSearchBtn) {
        errorSearchBtn.addEventListener("click", () => {
          window.SearchManager.open();
        });
      }
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
 * Render Selected Projects (Homepage 02 — SELECTED WORK)
 * Shows the selected projects: SmartSpace, Hotel Management System,
 * Inventory Management System, Library-Management-System, and UI-SneakerHub.
 * Celestine University of the Pacific is strictly excluded (shown ONLY in 01 — Currently Building).
 */
function renderSelectedProjects() {
  const container = document.getElementById("selected-projects-grid");
  if (!container || !window.PORTFOLIO_DATA || !Array.isArray(window.PORTFOLIO_DATA.projects)) return;

  // Selected projects in exact requested sequence:
  // 1. SmartSpace (06)
  // 2. Hotel Management System (05)
  // 3. Inventory Management System (02)
  // 4. Library Management System (03)
  // 5. UI-SneakerHub (04)
  const selectedIds = ["06", "05", "02", "03", "04"];

  const selectedProjects = selectedIds
    .map(id => window.PORTFOLIO_DATA.projects.find(p => p.id === id))
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
            <div class="selected-project-actions">
              <span class="selected-repo-action-wrap" data-project-id="${escapeHtml(project.id)}">
                ${window.ErrorState ? window.ErrorState.renderAction(project) : `
                  <a href="${escapeHtml(project.repository)}" target="_blank" rel="noopener noreferrer" class="selected-repo-link" aria-label="GitHub repository for ${escapeHtml(project.title)}" title="GitHub Repository">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                  </a>
                `}
              </span>
              <button type="button" class="selected-project-link" data-modal-project="${escapeHtml(project.id)}" aria-label="View case study for ${escapeHtml(project.title)}">
                <span>View Case Study →</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join("");

  container.innerHTML = html;

  // Render 3D fanned card deck for mobile view (< 768px)
  renderMobileProjectsDeck(selectedProjects);

  // Background repository status check for selected projects
  if (window.ErrorState && typeof window.ErrorState.checkRepository === "function") {
    selectedProjects.forEach(project => {
      if (!project.repository) return;
      window.ErrorState.checkRepository(project.repository, project).then(status => {
        const wrap = container.querySelector(`.selected-repo-action-wrap[data-project-id="${project.id}"]`);
        if (wrap && window.ErrorState) {
          wrap.innerHTML = window.ErrorState.renderAction(project, status);
        }
      }).catch(() => {});
    });
  }
}

/**
 * Render and initialize the interactive 3D fanned card deck for mobile view
 * Matching the mobile app card deck design reference:
 * - Active center card with bracket badge, outline pill, app icon, title, description, and dual app-store style buttons
 * - Tilted peek cards on left (-7.5deg) and right (+7.5deg) with smooth 3D perspective transitions
 * - Swipe gestures, side-card tap navigation, and pagination dots
 * @param {Array<Object>} selectedProjects
 */
function renderMobileProjectsDeck(selectedProjects) {
  const deckWrapper = document.getElementById("mobile-projects-deck");
  if (!deckWrapper || !selectedProjects || !selectedProjects.length) return;

  const N = selectedProjects.length;
  let activeIndex = 0;

  const cardsHtml = selectedProjects.map((project, idx) => {
    const isCollab = project.category === "collaborative" || project.isCollaborative;
    const bracketBadge = `<span class="deck-pill-bracket">&lt; #${escapeHtml(project.badgeNumber || project.id)} ${isCollab ? "COLLABORATIVE" : "PERSONAL"} &gt;</span>`;

    const tag1 = project.tagline ? project.tagline.split("&")[0].split("—")[0].trim() : (isCollab ? "TEAM PROJECT" : "SOLO SYSTEM");
    const techLead = (project.technologies || []).slice(0, 2).join(" + ");

    const outlineBadge1 = `<span class="deck-pill-outline">${escapeHtml(tag1)}</span>`;
    const outlineBadge2 = techLead ? `<span class="deck-pill-outline">${escapeHtml(techLead)}</span>` : "";

    const status = window.ErrorState ? window.ErrorState.getRepositoryStatus(project) : { type: "public" };
    const isPrivate = status.type === "private";

    const repoBtnHtml = isPrivate
      ? `<span class="deck-action-btn deck-action-disabled" title="Private Repository — This repository isn't publicly accessible." aria-label="Private Repository">
           <svg class="deck-action-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
           <div class="deck-action-text">
             <span class="deck-action-sub">REPOSITORY</span>
             <span class="deck-action-main">Private</span>
           </div>
         </span>`
      : `<a href="${escapeHtml(project.repository)}" target="_blank" rel="noopener noreferrer" class="deck-action-btn" aria-label="GitHub Repository for ${escapeHtml(project.title)}">
           <svg class="deck-action-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
           <div class="deck-action-text">
             <span class="deck-action-sub">REPOSITORY</span>
             <span class="deck-action-main">GitHub Repo</span>
           </div>
         </a>`;

    return `
      <article class="mobile-deck-card" data-deck-index="${idx}" data-project-id="${escapeHtml(project.id)}">
        <div class="mobile-deck-badges">
          ${bracketBadge}
          ${outlineBadge1}
          ${outlineBadge2}
        </div>

        <div class="mobile-deck-identity">
          <div class="mobile-deck-icon-wrap">
            <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)} icon" class="mobile-deck-icon" loading="lazy">
          </div>
          <div class="mobile-deck-title-group">
            <h3 class="mobile-deck-title">${escapeHtml(project.title)}</h3>
            <span class="mobile-deck-tagline">${escapeHtml(project.tagline || "")}</span>
          </div>
        </div>

        <p class="mobile-deck-desc">${escapeHtml(project.description)}</p>

        <div class="mobile-deck-actions">
          ${repoBtnHtml}
          <button type="button" class="deck-action-btn deck-action-primary" data-modal-project="${escapeHtml(project.id)}" aria-label="View case study for ${escapeHtml(project.title)}">
            <svg class="deck-action-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <div class="deck-action-text">
              <span class="deck-action-sub">EXPLORE</span>
              <span class="deck-action-main">View Details</span>
            </div>
          </button>
        </div>
      </article>
    `;
  }).join("");

  const dotsHtml = selectedProjects.map((_, i) =>
    `<button type="button" class="mobile-deck-dot ${i === 0 ? "is-active" : ""}" data-dot-index="${i}" aria-label="Go to project slide ${i + 1}"></button>`
  ).join("");

  deckWrapper.innerHTML = `
    <div class="mobile-deck-stage" id="mobile-deck-stage">
      ${cardsHtml}
    </div>
    <div class="mobile-deck-controls">
      <button type="button" class="mobile-deck-nav-btn prev-btn" id="mobile-deck-prev" aria-label="Previous project">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      <div class="mobile-deck-dots" id="mobile-deck-dots">
        ${dotsHtml}
      </div>
      <button type="button" class="mobile-deck-nav-btn next-btn" id="mobile-deck-next" aria-label="Next project">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    </div>
    <div class="mobile-deck-hint">
      <span>Swipe or tap side cards to explore</span>
    </div>
  `;

  const cards = deckWrapper.querySelectorAll(".mobile-deck-card");
  const dots = deckWrapper.querySelectorAll(".mobile-deck-dot");
  const prevBtn = deckWrapper.querySelector("#mobile-deck-prev");
  const nextBtn = deckWrapper.querySelector("#mobile-deck-next");
  const stage = deckWrapper.querySelector("#mobile-deck-stage");

  function updateDeck() {
    cards.forEach((card, idx) => {
      card.classList.remove("is-active", "is-prev", "is-next", "is-hidden-prev", "is-hidden-next");

      const prevIdx = (activeIndex - 1 + N) % N;
      const nextIdx = (activeIndex + 1) % N;

      if (idx === activeIndex) {
        card.classList.add("is-active");
      } else if (idx === prevIdx) {
        card.classList.add("is-prev");
      } else if (idx === nextIdx) {
        card.classList.add("is-next");
      } else {
        const diff = (idx - activeIndex + N) % N;
        if (diff > N / 2) {
          card.classList.add("is-hidden-prev");
        } else {
          card.classList.add("is-hidden-next");
        }
      }
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle("is-active", idx === activeIndex);
    });
  }

  // Initial deck layout
  updateDeck();

  function goPrev() {
    activeIndex = (activeIndex - 1 + N) % N;
    updateDeck();
  }

  function goNext() {
    activeIndex = (activeIndex + 1) % N;
    updateDeck();
  }

  if (prevBtn) prevBtn.addEventListener("click", goPrev);
  if (nextBtn) nextBtn.addEventListener("click", goNext);

  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const idx = parseInt(dot.getAttribute("data-dot-index"), 10);
      if (!isNaN(idx)) {
        activeIndex = idx;
        updateDeck();
      }
    });
  });

  // Tap on side cards brings them to center
  cards.forEach(card => {
    card.addEventListener("click", e => {
      if (card.classList.contains("is-prev")) {
        e.preventDefault();
        goPrev();
      } else if (card.classList.contains("is-next")) {
        e.preventDefault();
        goNext();
      }
    });
  });

  // Touch Swipe Gesture Support
  let touchStartX = 0;
  let touchStartY = 0;

  if (stage) {
    stage.addEventListener("touchstart", e => {
      if (e.touches && e.touches.length) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    stage.addEventListener("touchend", e => {
      if (!e.changedTouches || !e.changedTouches.length) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) {
          goNext();
        } else {
          goPrev();
        }
      }
    }, { passive: true });
  }
}

/**
 * Verify Currently Building section repository status
 */
function verifyCurrentlyBuildingRepo() {
  const cbRepoBtn = document.querySelector(".cb-compact-actions a[href*='github.com']");
  if (!cbRepoBtn || !window.PORTFOLIO_DATA) return;

  const featProj = window.PORTFOLIO_DATA.featuredProject;
  if (!featProj || !featProj.repository) return;

  if (window.ErrorState && typeof window.ErrorState.checkRepository === "function") {
    window.ErrorState.checkRepository(featProj.repository, featProj).then(status => {
      if (status.type === "private") {
        cbRepoBtn.outerHTML = `
          <span class="btn btn-sm btn-outline btn-disabled btn-private-repo" title="This repository isn't publicly accessible." aria-label="Private Repository">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <span>Private Repository</span>
          </span>
        `;
      } else if (status.type === "not-found") {
        cbRepoBtn.outerHTML = `
          <span class="btn btn-sm btn-outline btn-disabled btn-unavailable-repo" title="This project may have been moved, renamed, or is not publicly available." aria-label="Repository Unavailable">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <span>Repository Unavailable</span>
          </span>
        `;
      }
    }).catch(() => {});
  }
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
 * Render Verified Certificates Grid or Infinite Marquee Track
 */
function renderCertificates() {
  const track = document.getElementById("certificates-track");
  const grid = document.getElementById("certificates-grid");
  if ((!track && !grid) || !window.PORTFOLIO_DATA || !Array.isArray(window.PORTFOLIO_DATA.certificates)) return;

  const certs = window.PORTFOLIO_DATA.certificates;
  if (!certs.length) return;

  const buildCards = (list, isAriaHidden = false) => list.map(cert => {
    const skillsHtml = (cert.skills || [])
      .map(s => `<span class="cert-skill-tag">${escapeHtml(s)}</span>`)
      .join("");

    return `
      <article class="certificate-card" data-modal-certificate="${escapeHtml(cert.id)}" role="button" tabindex="${isAriaHidden ? "-1" : "0"}" aria-label="View ${escapeHtml(cert.title)} certificate details">
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

  if (track) {
    // 2 synchronized marquee groups each with 2 sets of certs = 8 cards per group.
    const setCards = buildCards([...certs, ...certs], false);
    const cloneCards = buildCards([...certs, ...certs], true);

    track.innerHTML = `
      <div class="cert-marquee-group">${setCards}</div>
      <div class="cert-marquee-group" aria-hidden="true">${cloneCards}</div>
    `;
  }

  if (grid) {
    grid.innerHTML = buildCards(certs, false);
  }
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
