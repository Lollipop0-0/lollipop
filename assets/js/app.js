/**
 * Karl Evan Tabunda - Main Application Orchestrator
 * Coordinates all modules on DOMContentLoaded.
 */

// Purge Netlify HUD / "Powered by Netlify" injected floating badge
(function purgeNetlifyBadge() {
  const removeHud = () => {
    const targets = document.querySelectorAll(
      '#nl-badge-frame, #nl-hud-frame, iframe[id^="nl-"], iframe[title="Powered by Netlify"], iframe[title="Netlify"], script[src*="/scripts/hud"]'
    );
    targets.forEach(el => el.remove());
  };
  removeHud();
  if (typeof MutationObserver !== "undefined") {
    const observer = new MutationObserver(() => removeHud());
    if (document.documentElement) {
      observer.observe(document.documentElement, { childList: true, subtree: true });
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        removeHud();
        observer.observe(document.documentElement, { childList: true, subtree: true });
      });
    }
  }
})();

document.addEventListener("DOMContentLoaded", async () => {
  // 0. Initialize Site Preloader (Stickman Runner)
  if (window.PreloaderManager) {
    window.PreloaderManager.init();
    window.PreloaderManager.setProgress(25);
  }

  try {
    // 1. Asynchronously load and assemble all component templates into #app
    if (window.ComponentLoader) {
      await window.ComponentLoader.loadAll("#app");
    }
    if (window.PreloaderManager) {
      window.PreloaderManager.setProgress(70);
    }

    // 1.5. Initialize Web Audio Synthesizer (SoundManager)
    if (window.SoundManager) {
      window.SoundManager.init();
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
    initHeroWordRotator();
    initHeroInteractiveAvatar();
    initClickBurst();

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

    // 10.5. Initialize Autonomous Guide Tour (Bryl Lim inspired)
    if (window.GuideManager) {
      window.GuideManager.init();
    }

    // 10.6. Initialize Portfolio Chatbot
    if (window.PortfolioChat) {
      window.PortfolioChat.init();
    }

    // 10.7. Initialize Floating Action Button (FAB) Hub & Visitor Invitation
    if (window.PortfolioFab) {
      window.PortfolioFab.init();
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
  } finally {
    // 13. Complete Preloader & Reveal Website
    if (window.PreloaderManager) {
      window.PreloaderManager.complete();
    }
  }
});

/**
 * Render Selected Projects (Homepage 02 — SELECTED WORK / Work Gallery)
 * Faithfully implements the signature 3D Interactive Album Cover Flow from
 * https://richardmiculob-portfolio.vercel.app/ on desktop, and the tilted
 * interactive card peek stack on mobile with dynamic info panel transitions.
 */
function renderSelectedProjects() {
  const albumContainer = document.getElementById("work-album-inner");
  const mobileStack = document.getElementById("work-mobile-stack");
  const infoContainer = document.getElementById("work-info");

  if (!window.PORTFOLIO_DATA || !Array.isArray(window.PORTFOLIO_DATA.projects)) return;

  // Selected projects sequence (5 projects matching the 5 3D cover flow positions):
  // 1. SmartSpace (06) - Collaborative Three.js & Laravel
  // 2. Hotel Reservation Management System (05) - PHP & MySQL
  // 3. Inventory Management System (02) - PHP & MySQL & JS
  // 4. Library Management System (03) - PHP & MySQL & Bootstrap
  // 5. UI SneakerHub (04) - E-Commerce Storefront HTML, CSS & JS
  const selectedIds = ["06", "05", "02", "03", "04"];

  const selectedProjects = selectedIds
    .map(id => window.PORTFOLIO_DATA.projects.find(p => p.id === id))
    .filter(Boolean);

  const N = selectedProjects.length;
  if (!N) return;

  let activeIndex = 0;

  // 1. Render Desktop 3D Album items into #work-album-inner
  if (albumContainer) {
    albumContainer.innerHTML = selectedProjects.map((project, idx) => `
      <div class="work-album-item" data-album-index="${idx}" data-project-id="${escapeHtml(project.id)}" role="button" tabindex="0" aria-label="View ${escapeHtml(project.title)}">
        <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}" class="work-album-img" width="1376" height="768" loading="lazy" decoding="async" draggable="false" style="aspect-ratio: 16 / 9;">
      </div>
    `).join("");
  }

  // 2. Render Mobile Stack items into #work-mobile-stack
  if (mobileStack) {
    mobileStack.innerHTML = selectedProjects.map((project, idx) => `
      <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}" class="stacked-image" data-stack-index="${idx}" data-project-id="${escapeHtml(project.id)}" width="1376" height="860" loading="lazy" decoding="async" draggable="false" style="aspect-ratio: 16 / 10;">
    `).join("");
  }

  const albumItems = albumContainer ? Array.from(albumContainer.querySelectorAll(".work-album-item")) : [];
  const stackImages = mobileStack ? Array.from(mobileStack.querySelectorAll(".stacked-image")) : [];

  /**
   * Update 3D album transforms on desktop and stacked image styles on mobile
   */
  function updateAlbum(animateInfo = true) {
    const activeProject = selectedProjects[activeIndex];
    if (!activeProject) return;

    // --- Update Desktop 3D Album ---
    albumItems.forEach((item, idx) => {
      // Calculate circular distance in range [-floor(N/2), floor(N/2)]
      let diff = idx - activeIndex;
      while (diff > N / 2) diff -= N;
      while (diff < -N / 2) diff += N;

      item.classList.remove("work-album-item-center");

      if (diff === 0) {
        // Active Center Card
        item.style.transform = "translate(-50%, -50%) scale(1)";
        item.style.zIndex = "5";
        item.style.opacity = "1";
        item.style.pointerEvents = "auto";
        item.classList.add("work-album-item-center");
        item.setAttribute("aria-current", "true");
      } else if (diff === -1) {
        // Near Left Card
        item.style.transform = "translate(calc(-50% - 220px), -50%) scale(0.72)";
        item.style.zIndex = "4";
        item.style.opacity = "0.85";
        item.style.pointerEvents = "auto";
        item.removeAttribute("aria-current");
      } else if (diff === 1) {
        // Near Right Card
        item.style.transform = "translate(calc(-50% + 220px), -50%) scale(0.72)";
        item.style.zIndex = "4";
        item.style.opacity = "0.85";
        item.style.pointerEvents = "auto";
        item.removeAttribute("aria-current");
      } else if (diff === -2) {
        // Far Left Card
        item.style.transform = "translate(calc(-50% - 370px), -50%) scale(0.55)";
        item.style.zIndex = "3";
        item.style.opacity = "0.32";
        item.style.pointerEvents = "auto";
        item.removeAttribute("aria-current");
      } else if (diff === 2) {
        // Far Right Card
        item.style.transform = "translate(calc(-50% + 370px), -50%) scale(0.55)";
        item.style.zIndex = "3";
        item.style.opacity = "0.32";
        item.style.pointerEvents = "auto";
        item.removeAttribute("aria-current");
      } else {
        // Offscreen / Hidden
        const dir = diff > 0 ? 460 : -460;
        item.style.transform = `translate(calc(-50% + ${dir}px), -50%) scale(0.4)`;
        item.style.zIndex = "1";
        item.style.opacity = "0";
        item.style.pointerEvents = "none";
        item.removeAttribute("aria-current");
      }
    });

    // --- Update Mobile Stack ---
    stackImages.forEach((img, idx) => {
      let mDiff = (idx - activeIndex + N) % N;
      img.classList.remove("stacked-image-front");

      if (mDiff === 0) {
        // Active Front Card
        img.style.setProperty("--tx", "0px");
        img.style.setProperty("--ty", "0px");
        img.style.setProperty("--rot", "0deg");
        img.style.setProperty("--sc", "1");
        img.style.setProperty("--op", "1");
        img.style.zIndex = "30";
        img.classList.add("stacked-image-front");
      } else if (mDiff === 1) {
        // Second Card peek (Right tilt)
        img.style.setProperty("--tx", "12px");
        img.style.setProperty("--ty", "-7.6px");
        img.style.setProperty("--rot", "-2.7deg");
        img.style.setProperty("--sc", "0.94");
        img.style.setProperty("--op", "0.75");
        img.style.zIndex = "20";
      } else if (mDiff === 2) {
        // Third Card peek (Left tilt)
        img.style.setProperty("--tx", "14px");
        img.style.setProperty("--ty", "17.6px");
        img.style.setProperty("--rot", "6.6deg");
        img.style.setProperty("--sc", "0.88");
        img.style.setProperty("--op", "0.55");
        img.style.zIndex = "10";
      } else if (mDiff === N - 1) {
        // Exiting / Previous Card
        img.style.setProperty("--tx", "106px");
        img.style.setProperty("--ty", "-44px");
        img.style.setProperty("--rot", "18deg");
        img.style.setProperty("--sc", "0.88");
        img.style.setProperty("--op", "0");
        img.style.zIndex = "5";
      } else {
        // Deep Background Card
        img.style.setProperty("--tx", "106px");
        img.style.setProperty("--ty", "-44px");
        img.style.setProperty("--rot", "18deg");
        img.style.setProperty("--sc", "0.8");
        img.style.setProperty("--op", "0");
        img.style.zIndex = "2";
      }
    });

    // --- Update Dynamic Project Info Box ---
    if (infoContainer) {
      if (animateInfo) {
        infoContainer.style.animation = "none";
        // Force reflow
        void infoContainer.offsetWidth;
        infoContainer.style.animation = "";
      }

      const isCollab = activeProject.category === "collaborative" || activeProject.isCollaborative;
      const techPills = (activeProject.technologies || []).slice(0, 4)
        .map(t => `<span class="work-info-pill">${escapeHtml(t)}</span>`)
        .join("");

      const status = window.ErrorState ? window.ErrorState.getRepositoryStatus(activeProject) : { type: "public" };
      const isPrivate = status.type === "private";

      const repoBtnHtml = isPrivate
        ? `<span class="btn btn-sm btn-outline btn-disabled" title="Private Repository" aria-label="Private Repository">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
             <span>Private Repo</span>
           </span>`
        : `<a href="${escapeHtml(activeProject.repository)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline work-repo-link" aria-label="GitHub repository for ${escapeHtml(activeProject.title)}">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
             <span>View Repository ↗</span>
           </a>`;

      infoContainer.innerHTML = `
        <div class="work-info-meta">
          <span class="work-info-badge ${isCollab ? "badge-collab" : ""}">${isCollab ? "Collaborative" : "Personal"}</span>
          ${techPills}
        </div>
        <h3 class="work-info-title">${escapeHtml(activeProject.title)}</h3>
        <p class="work-info-desc">${escapeHtml(activeProject.longDescription || activeProject.description)}</p>
        <div class="work-info-actions">
          <button type="button" class="btn btn-sm btn-primary" data-modal-project="${escapeHtml(activeProject.id)}" aria-label="View case study for ${escapeHtml(activeProject.title)}">
            <span>View Case Study →</span>
          </button>
          <span class="work-info-repo-wrap" data-project-id="${escapeHtml(activeProject.id)}">
            ${repoBtnHtml}
          </span>
        </div>
      `;

      // Repository status check verification
      if (window.ErrorState && typeof window.ErrorState.checkRepository === "function" && activeProject.repository) {
        window.ErrorState.checkRepository(activeProject.repository, activeProject).then(newStatus => {
          const repoWrap = infoContainer.querySelector(`.work-info-repo-wrap[data-project-id="${activeProject.id}"]`);
          if (repoWrap && window.ErrorState) {
            repoWrap.innerHTML = window.ErrorState.renderAction(activeProject, newStatus);
          }
        }).catch(() => {});
      }
    }
  }

  // Initial layout mounting
  updateAlbum(false);

  // Desktop Card Click Handling
  albumItems.forEach(item => {
    item.addEventListener("click", () => {
      const idx = parseInt(item.getAttribute("data-album-index"), 10);
      if (idx === activeIndex) {
        // Clicking center card triggers case study modal
        const projectId = item.getAttribute("data-project-id");
        if (window.ModalManager && typeof window.ModalManager.open === "function") {
          window.ModalManager.open(projectId, item);
        }
      } else {
        activeIndex = idx;
        updateAlbum(true);
      }
    });

    item.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        item.click();
      }
    });
  });

  // Mobile Stack Click/Tap Handling (Cycle to next)
  if (mobileStack) {
    mobileStack.addEventListener("click", () => {
      activeIndex = (activeIndex + 1) % N;
      updateAlbum(true);
    });

    mobileStack.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % N;
        updateAlbum(true);
      }
    });

    // Touch Swipe Gesture for Mobile Stack
    let touchStartX = 0;
    let touchStartY = 0;

    mobileStack.addEventListener("touchstart", e => {
      if (e.touches && e.touches.length) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    mobileStack.addEventListener("touchend", e => {
      if (!e.changedTouches || !e.changedTouches.length) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) {
          activeIndex = (activeIndex + 1) % N;
        } else {
          activeIndex = (activeIndex - 1 + N) % N;
        }
        updateAlbum(true);
      }
    }, { passive: true });
  }

  // Desktop Prev / Next Arrow Buttons
  const prevBtn = document.getElementById("work-album-prev");
  const nextBtn = document.getElementById("work-album-next");

  if (prevBtn) {
    prevBtn.addEventListener("click", e => {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + N) % N;
      updateAlbum(true);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", e => {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % N;
      updateAlbum(true);
    });
  }

  // Keyboard Left / Right Navigation when focusing the album container
  const albumRegion = document.getElementById("work-album");
  if (albumRegion) {
    albumRegion.setAttribute("tabindex", "0");
    albumRegion.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        activeIndex = (activeIndex - 1 + N) % N;
        updateAlbum(true);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % N;
        updateAlbum(true);
      }
    });
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

let activeTechName = null;

/**
 * Find all projects and verified credentials that use a given technology
 */
function findToolConnections(toolName, toolKey) {
  if (typeof window === "undefined" || !window.PORTFOLIO_DATA) return [];
  const normalizedSearch = (toolName || "").toLowerCase().trim();
  const searchKey = (toolKey || "").toLowerCase().trim();
  const isJava = normalizedSearch === "java" || searchKey === "java";
  const isJavaScript = normalizedSearch === "javascript" || searchKey === "javascript" || normalizedSearch === "js" || searchKey === "js";
  const results = [];

  const matchesTech = (techList) => {
    if (!Array.isArray(techList)) return false;
    return techList.some(t => {
      const normT = (t || "").toLowerCase().trim();

      // Strict disambiguation: Java is NOT JavaScript!
      if (isJava) {
        if (normT === "javascript" || normT === "js" || normT.includes("javascript")) {
          return false;
        }
        return normT === "java" || normT === "java oop" || normT === "java swing" || normT === "java se";
      }

      if (isJavaScript) {
        if (normT === "java") {
          return false;
        }
        return normT === "javascript" || normT === "js" || normT.includes("javascript");
      }

      return normT === normalizedSearch ||
             normT === searchKey ||
             normT.includes(normalizedSearch) ||
             normalizedSearch.includes(normT) ||
             (normalizedSearch === "php" && normT.includes("php")) ||
             (normalizedSearch.includes("mysql") && normT.includes("mysql")) ||
             (normalizedSearch === "mvc architecture" && normT === "mvc") ||
             (normalizedSearch === "html5" && normT.includes("html")) ||
             (normalizedSearch === "css3" && normT.includes("css")) ||
             (normalizedSearch.includes("three") && normT.includes("three")) ||
             (normalizedSearch.includes("bootstrap") && normT.includes("bootstrap")) ||
             (normalizedSearch.includes("laravel") && normT.includes("laravel"));
    });
  };

  // 1. Featured project
  const fp = window.PORTFOLIO_DATA.featuredProject;
  if (fp && matchesTech(fp.technologies)) {
    results.push({
      type: "project",
      id: fp.id,
      title: fp.title,
      badge: fp.badgeNumber || "01",
      tagline: fp.tagline,
      description: fp.description,
      category: fp.teamLabel || "Featured Project",
      technologies: fp.technologies,
      image: fp.image,
      isFeatured: true
    });
  }

  // 2. Standard projects
  const projs = window.PORTFOLIO_DATA.projects || [];
  projs.forEach(p => {
    if (matchesTech(p.technologies)) {
      results.push({
        type: "project",
        id: p.id,
        title: p.title,
        badge: p.badgeNumber || p.id,
        tagline: p.tagline,
        description: p.description,
        category: p.teamLabel || "Project",
        technologies: p.technologies,
        image: p.image,
        isFeatured: false
      });
    }
  });

  // 3. Sololearn Certificates
  const certs = window.PORTFOLIO_DATA.certificates || [];
  certs.forEach(c => {
    // If searching for Java, do NOT match JavaScript certificates
    if (isJava) {
      const titleLower = (c.title || "").toLowerCase();
      if (titleLower.includes("javascript") || c.id === "cert-javascript") {
        return;
      }
    }
    if (matchesTech(c.skills) || (!isJava && c.title && c.title.toLowerCase().includes(normalizedSearch))) {
      results.push({
        type: "certificate",
        id: c.id,
        title: c.title,
        badge: "VERIFIED",
        tagline: `${c.issuer} Certified Credential`,
        description: c.description,
        category: "Official Certification",
        technologies: c.skills,
        credentialId: c.credentialId,
        image: c.image
      });
    }
  });

  return results;
}

/**
 * Filter and display projects in the <USED-IN-PROJECTS/> stage
 */
function filterTechProjects(toolName, toolKey, toolNote) {
  const stage = document.getElementById("stack-projects-stage");
  const pill = document.getElementById("stack-active-tool-pill");
  const countEl = document.getElementById("stack-active-tool-count");
  const container = document.getElementById("stack-matching-projects");
  if (!stage || !container) return;

  if (activeTechName === toolName) {
    clearTechFilter();
    return;
  }

  activeTechName = toolName;

  document.querySelectorAll(".stack-chip").forEach(chip => {
    const isThis = chip.getAttribute("data-name") === toolName;
    chip.classList.toggle("is-active", isThis);
    chip.setAttribute("aria-pressed", isThis ? "true" : "false");
  });

  if (pill) pill.textContent = toolName;

  const matches = findToolConnections(toolName, toolKey);

  if (countEl) {
    if (matches.length > 0) {
      countEl.textContent = `${matches.length} connected ${matches.length === 1 ? 'project / credential' : 'projects & credentials'}`;
    } else {
      countEl.textContent = "Applied in active coursework & exploratory workflows";
    }
  }

  if (matches.length === 0) {
    container.innerHTML = `
      <div class="stack-coursework-card">
        <div class="stack-card-top">
          <span class="stack-card-badge font-mono">&lt;ACTIVE-COMPETENCY/&gt;</span>
          <span class="stack-card-category font-mono">DEVELOPMENT WORKFLOW</span>
        </div>
        <h4 class="stack-card-title">${escapeHtml(toolName)} in Daily Practice</h4>
        <p class="stack-card-desc">
          ${escapeHtml(toolNote || 'Applied across coursework laboratory environments, modern interface experimentation, backend prototyping, and engineering toolchains at NCST.')}
        </p>
        <div class="stack-card-meta">
          <span class="stack-card-status-dot"></span>
          <span>Verified active developer toolchain &amp; practical competence</span>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = matches.map(m => {
      const isCert = m.type === "certificate";
      return `
        <div class="stack-project-card">
          <div class="stack-card-top">
            <span class="stack-card-badge font-mono">${escapeHtml(m.badge)}</span>
            <span class="stack-card-category font-mono">${escapeHtml(m.category)}</span>
          </div>
          <h4 class="stack-card-title">${escapeHtml(m.title)}</h4>
          ${m.tagline ? `<p class="stack-card-tagline">${escapeHtml(m.tagline)}</p>` : ''}
          <p class="stack-card-desc">${escapeHtml(m.description)}</p>
          <div class="stack-card-tech-tags">
            ${(m.technologies || []).map(t => {
              const normTag = t.toLowerCase();
              let isMatch = false;
              if ((toolName || '').toLowerCase() === "java") {
                isMatch = (normTag === "java" || normTag === "java oop" || normTag === "java swing");
              } else if ((toolName || '').toLowerCase() === "javascript") {
                isMatch = (normTag === "javascript" || normTag === "js");
              } else {
                isMatch = normTag.includes((toolName || '').toLowerCase()) ||
                          (toolName || '').toLowerCase().includes(normTag);
              }
              return `<span class="stack-card-tech-tag font-mono ${isMatch ? 'is-highlight' : ''}">${escapeHtml(t)}</span>`;
            }).join('')}
          </div>
          <div class="stack-card-actions">
            ${!isCert ? `
              <button type="button" class="stack-card-btn stack-card-btn-primary" data-modal-project="${escapeHtml(m.id)}" onclick="if(window.ModalManager){(window.ModalManager.openModal||window.ModalManager.open)('${escapeHtml(m.id)}', this);}">
                <span>View Details</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            ` : `
              <button type="button" class="stack-card-btn stack-card-btn-primary" data-modal-certificate="${escapeHtml(m.id)}" onclick="if(window.ModalManager){(window.ModalManager.openCertificate||window.ModalManager.open)('${escapeHtml(m.id)}', this);}">
                <span>View Credential</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            `}
          </div>
        </div>
      `;
    }).join("");
  }

  stage.removeAttribute("hidden");

  try {
    const isReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stage.scrollIntoView({ behavior: isReduced ? "auto" : "smooth", block: "nearest" });
  } catch (e) {}
}

/**
 * Clear technology filter and hide <USED-IN-PROJECTS/> panel
 */
function clearTechFilter() {
  activeTechName = null;
  const stage = document.getElementById("stack-projects-stage");
  if (stage) stage.setAttribute("hidden", "");

  document.querySelectorAll(".stack-chip").forEach(chip => {
    chip.classList.remove("is-active");
    chip.setAttribute("aria-pressed", "false");
  });
}

/**
 * Render Tech Stack Categories & Interactive Atlas
 */
function renderTechStack() {
  const container = document.getElementById("tech-stack-container");
  if (!container || !window.PORTFOLIO_DATA || !window.PORTFOLIO_DATA.techStack) return;

  const stackData = window.PORTFOLIO_DATA.techStack;
  let categories = stackData.categories;

  if (!categories || !Array.isArray(categories)) {
    categories = Object.entries(stackData).map(([catName, tools], idx) => ({
      id: catName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      idx: String(idx + 1).padStart(2, "0"),
      title: catName,
      tag: `<${catName.toLowerCase().replace(/[^a-z0-9]/g, "-")}/>`,
      tools: Array.isArray(tools) ? tools.map(t => ({ name: t.name, key: t.name.toLowerCase() })) : []
    }));
  }

  let totalTools = 0;
  categories.forEach(c => { totalTools += (c.tools ? c.tools.length : 0); });
  const totalCountEl = document.getElementById("stack-total-tools");
  if (totalCountEl) totalCountEl.textContent = `${totalTools} tools`;

  let html = "";

  categories.forEach(cat => {
    const tools = cat.tools || [];
    const chipsHtml = tools.map(tool => {
      const toolKey = tool.key || tool.name.toLowerCase().replace(/[^a-z0-9]/g, "");
      const svgIcon = (typeof window.getToolSvg === "function") ? window.getToolSvg(toolKey, tool.name) : "";
      const matches = findToolConnections(tool.name, toolKey);
      const matchCount = matches.length;

      return `
        <button type="button"
                class="stack-chip"
                data-tech="${escapeHtml(toolKey)}"
                data-name="${escapeHtml(tool.name)}"
                data-note="${escapeHtml(tool.note || '')}"
                aria-pressed="false"
                title="${escapeHtml(tool.name)}${tool.note ? ' — ' + escapeHtml(tool.note) : ''}">
          <span class="stack-chip-pulse" aria-hidden="true"></span>
          <span class="stack-chip-icon">${svgIcon}</span>
          <span class="stack-chip-name">${escapeHtml(tool.name)}</span>
          ${matchCount > 0 ? `<span class="stack-chip-badge" title="${matchCount} connected project${matchCount > 1 ? 's' : ''}">${matchCount}</span>` : ''}
        </button>
      `;
    }).join("");

    html += `
      <div class="stack-category-group" id="stack-cat-${escapeHtml(cat.id || cat.idx)}">
        <div class="stack-category-title-bar">
          <div class="stack-category-kicker-wrap">
            <span class="stack-category-idx">${escapeHtml(cat.idx || "01")}</span>
            <h3 class="stack-category-tag">${escapeHtml(cat.tag || '<' + cat.title.toLowerCase() + '/>')}</h3>
          </div>
          <div class="stack-category-line" aria-hidden="true"></div>
          <span class="stack-category-count">${tools.length} tools</span>
        </div>
        <div class="stack-chips-wrap">
          ${chipsHtml}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  container.onclick = (e) => {
    const chip = e.target.closest(".stack-chip");
    if (!chip) return;
    const name = chip.getAttribute("data-name");
    const key = chip.getAttribute("data-tech");
    const note = chip.getAttribute("data-note");
    filterTechProjects(name, key, note);
  };

  const closeBtn = document.getElementById("stack-projects-close-btn");
  if (closeBtn) {
    closeBtn.onclick = () => clearTechFilter();
  }

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const techParam = urlParams.get("tech");
    if (techParam) {
      const targetChip = container.querySelector(`.stack-chip[data-tech="${techParam.toLowerCase()}"], .stack-chip[data-name="${techParam}"]`);
      if (targetChip) {
        setTimeout(() => {
          targetChip.click();
        }, 150);
      }
    }
  } catch (e) {}
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
          <img src="${escapeHtml(cert.image)}" alt="${escapeHtml(cert.title)} Sololearn Certificate" class="cert-img-thumb" width="1024" height="722" loading="lazy" decoding="async" style="aspect-ratio: 16 / 11;">
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

/**
 * Hero Word Rotator (Flip / Blur Text Animation)
 * Cycles roles with electric blue-to-purple gradient, smooth blur, and translation physics.
 * Adheres to reference design from Screen Recording 2026-09-21 022846.mp4.
 */
function initHeroWordRotator() {
  const wordEl = document.getElementById("hero-rotating-word");
  if (!wordEl) return;

  const wrapper = wordEl.closest(".hero-rotator-wrapper");
  const roles = (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.personal && Array.isArray(window.PORTFOLIO_DATA.personal.rotatingRoles))
    ? window.PORTFOLIO_DATA.personal.rotatingRoles
    : ["IT Student", "Software Developer", "Backend Developer", "Web Developer"];

  if (roles.length < 2) return;

  let currentIndex = 0;
  let isPaused = false;
  let timeoutId = null;

  // Pause when user hovers over intro text
  const heroIntro = wordEl.closest(".hero-intro");
  if (heroIntro) {
    heroIntro.addEventListener("mouseenter", () => { isPaused = true; });
    heroIntro.addEventListener("mouseleave", () => { isPaused = false; });
  }

  // Pre-measure role widths using off-screen canvas to eliminate forced synchronous reflows
  const roleWidths = [];
  function measureRoleWidths() {
    if (!wordEl) return;
    const computed = window.getComputedStyle(wordEl);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.font = `${computed.fontWeight || '700'} ${computed.fontSize || '16px'} ${computed.fontFamily || 'Inter, sans-serif'}`;
      roles.forEach((role, i) => {
        roleWidths[i] = Math.ceil(ctx.measureText(role).width) + 2;
      });
    }
  }
  measureRoleWidths();

  // Initialize wrapper width to match initial role
  if (wrapper) {
    const initW = roleWidths[0] || wordEl.offsetWidth;
    wrapper.style.width = `${initW}px`;
  }

  // Handle window resize dynamically
  window.addEventListener("resize", () => {
    measureRoleWidths();
    if (wrapper) {
      const curW = roleWidths[currentIndex] || (wordEl ? wordEl.offsetWidth : 0);
      if (curW > 0) wrapper.style.width = `${curW}px`;
    }
  }, { passive: true });

  function rotate() {
    if (isPaused) {
      timeoutId = setTimeout(rotate, 800);
      return;
    }

    const nextIndex = (currentIndex + 1) % roles.length;
    const nextRole = roles[nextIndex];

    // Phase 1: Exit - slide up slightly, blur, fade out
    wordEl.classList.remove("is-entering-prep");
    wordEl.classList.add("is-exiting");

    setTimeout(() => {
      // Phase 2: Swap content while invisible, position below
      wordEl.textContent = nextRole;
      wordEl.classList.remove("is-exiting");
      wordEl.classList.add("is-entering-prep");

      // Animate container width smoothly without forcing layout reflow
      if (wrapper) {
        const targetWidth = roleWidths[nextIndex] || wordEl.offsetWidth;
        wrapper.style.width = `${targetWidth}px`;
      }

      // Phase 3: In next frames, animate to resting state (slide up, unblur, fade in)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          wordEl.classList.remove("is-entering-prep");
          currentIndex = nextIndex;
          timeoutId = setTimeout(rotate, 2800);
        });
      });
    }, 280);
  }

  // Page Visibility API: pause when tab hidden, resume cleanly when focused
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (timeoutId) clearTimeout(timeoutId);
    } else {
      if (!isPaused) timeoutId = setTimeout(rotate, 1200);
    }
  });

  // Initial delay before first rotation (~2.8s)
  timeoutId = setTimeout(rotate, 2800);
}

/**
 * Interactive Hero Character Easter Egg
 * Enables touch / tap toggle on mobile devices and keyboard triggers (Enter / Space)
 * for the 4 coordinated visual states (Light Default, Light Shy Hover, Dark Night Default, Dark Sleep Hover).
 */
function initHeroInteractiveAvatar() {
  const heroCard = document.getElementById("hero-photo-interactive");
  if (!heroCard) return;

  // Toggle active state on tap/click for mobile & touchscreens
  heroCard.addEventListener("click", (e) => {
    heroCard.classList.toggle("is-active");
  });

  // Keyboard accessibility
  heroCard.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      heroCard.classList.toggle("is-active");
    }
  });

  // Reset active state when clicking outside
  document.addEventListener("click", (e) => {
    if (!heroCard.contains(e.target)) {
      heroCard.classList.remove("is-active");
    }
  });
}

/**
 * Click Burst Particle Interaction (Adopted from marwieang.com)
 * Spawns 5 radial sparks radiating from the pointer on mouse click with tactile acoustic feedback.
 */
function initClickBurst() {
  if (typeof window === "undefined") {
    return;
  }

  const angles = [135, 180, 225, 270, 315];
  const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.addEventListener("pointerdown", (e) => {
    if (e.button !== undefined && e.button !== 0) return;

    // Tactile acoustic UI feedback (Web Audio synthesizer)
    if (window.SoundManager) {
      window.SoundManager.playClick();
    }

    if (prefersReducedMotion) return;

    const burst = document.createElement("div");
    burst.className = "click-burst";
    burst.style.left = `${e.clientX}px`;
    burst.style.top = `${e.clientY}px`;
    for (const angle of angles) {
      const spark = document.createElement("span");
      spark.style.setProperty("--a", `${angle - 90}deg`);
      burst.appendChild(spark);
    }
    document.body.appendChild(burst);
    setTimeout(() => {
      burst.remove();
    }, 500);
  });

  // Tactile micro-tick acoustic feedback on hovering interactive elements
  document.addEventListener("mouseover", (e) => {
    if (!e.target || !e.target.closest) return;
    const interactive = e.target.closest("a, button, .btn, .nav-link, .nav-dropdown-item, .project-card, .gear-card, .naphier-tech-card, .cert-marquee-item, .card");
    if (interactive && !interactive.contains(e.relatedTarget)) {
      if (window.SoundManager) {
        window.SoundManager.playHover();
      }
    }
  }, { passive: true });
}



