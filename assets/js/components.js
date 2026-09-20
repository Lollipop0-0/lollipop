/**
 * Karl Evan Tabunda - Component Loader Module
 * Asynchronously fetches and mounts HTML partials into the application shell (#app).
 * Zero frameworks, pure Vanilla JavaScript.
 */

const ComponentLoader = (() => {
  // Homepage manifest: Hero (Home) → 01 Currently Building & 02 Selected Work (Projects) → 03 Certificates → 04 GitHub Activity → 05 Contact → Footer
  const HOMEPAGE_MANIFEST = [
    { name: "header", path: "components/header.html", isMainChild: false },
    { name: "hero", path: "components/hero.html", isMainChild: true },
    { name: "currently-building", path: "components/currently-building-section.html", isMainChild: true },
    { name: "selected-work", path: "components/selected-work.html", isMainChild: true },
    { name: "certificates", path: "components/certificates.html", isMainChild: true },
    { name: "activity", path: "components/activity.html", isMainChild: true },
    { name: "contact", path: "components/contact.html", isMainChild: true },
    { name: "footer", path: "components/footer.html", isMainChild: false },
    { name: "project-modal", path: "components/project-modal.html", isMainChild: false }
  ];

  // Dedicated About page manifest: Narrative hero, journey, stack
  const ABOUT_MANIFEST = [
    { name: "header", path: "components/header.html", isMainChild: false },
    { name: "about-hero", path: "components/about-page-hero.html", isMainChild: true },
    { name: "journey", path: "components/journey.html", isMainChild: true },
    { name: "stack", path: "components/stack.html", isMainChild: true },
    { name: "footer", path: "components/footer.html", isMainChild: false },
    { name: "project-modal", path: "components/project-modal.html", isMainChild: false }
  ];

  // Dedicated Projects archive page manifest: Header, projects-hero, projects-gallery, footer, project-modal
  const PROJECTS_MANIFEST = [
    { name: "header", path: "components/header.html", isMainChild: false },
    { name: "projects-hero", path: "components/projects-hero.html", isMainChild: true },
    { name: "projects-gallery", path: "components/projects-gallery.html", isMainChild: true },
    { name: "footer", path: "components/footer.html", isMainChild: false },
    { name: "project-modal", path: "components/project-modal.html", isMainChild: false }
  ];

  // Dedicated Certificates archive page manifest: Header, certificates-hero, certificates-gallery, footer, project-modal
  const CERTIFICATES_MANIFEST = [
    { name: "header", path: "components/header.html", isMainChild: false },
    { name: "certificates-hero", path: "components/certificates-hero.html", isMainChild: true },
    { name: "certificates-gallery", path: "components/certificates-gallery.html", isMainChild: true },
    { name: "footer", path: "components/footer.html", isMainChild: false },
    { name: "project-modal", path: "components/project-modal.html", isMainChild: false }
  ];

  // Dedicated 404 error page manifest: Header, custom branded 404 error showcase, footer
  const ERROR_404_MANIFEST = [
    { name: "header", path: "components/header.html", isMainChild: false },
    { name: "error-404", path: "components/error-404.html", isMainChild: true },
    { name: "footer", path: "components/footer.html", isMainChild: false },
    { name: "project-modal", path: "components/project-modal.html", isMainChild: false }
  ];

  /**
   * Fetch a single component HTML template
   * @param {string} path
   * @returns {Promise<string>}
   */
  async function fetchComponent(path) {
    const res = await fetch(path);
    if (!res.ok) {
      throw new Error(`Failed to load component: ${path} (${res.status})`);
    }
    return await res.text();
  }

  /**
   * Load and assemble all components into the target container (#app)
   * @param {string|HTMLElement} targetSelector - Target mounting element (default: "#app")
   * @returns {Promise<void>}
   */
  async function loadAll(targetSelector = "#app") {
    const appEl = typeof targetSelector === "string"
      ? document.querySelector(targetSelector)
      : targetSelector;

    if (!appEl) {
      console.error(`ComponentLoader: Target element "${targetSelector}" not found.`);
      return;
    }

    // Determine active page manifest
    const is404Page = appEl.getAttribute("data-page") === "404" ||
      window.location.pathname.endsWith("404.html") ||
      window.location.pathname.endsWith("/404");

    const isAboutPage = appEl.getAttribute("data-page") === "about" ||
      window.location.pathname.endsWith("about.html") ||
      window.location.pathname.endsWith("/about");

    const isProjectsPage = appEl.getAttribute("data-page") === "projects" ||
      window.location.pathname.endsWith("projects.html") ||
      window.location.pathname.endsWith("/projects");

    const isCertificatesPage = appEl.getAttribute("data-page") === "certificates" ||
      window.location.pathname.endsWith("certificates.html") ||
      window.location.pathname.endsWith("/certificates");

    const manifest = is404Page
      ? ERROR_404_MANIFEST
      : (isAboutPage
          ? ABOUT_MANIFEST
          : (isProjectsPage
              ? PROJECTS_MANIFEST
              : (isCertificatesPage
                  ? CERTIFICATES_MANIFEST
                  : HOMEPAGE_MANIFEST)));

    try {
      // Fetch all components concurrently
      const loadedContents = await Promise.all(
        manifest.map(async (comp) => {
          const html = await fetchComponent(comp.path);
          return { ...comp, html };
        })
      );

      // Separate main content sections from header/footer/modals
      let headerHtml = "";
      let mainChildrenHtml = "";
      let footerHtml = "";
      let modalHtml = "";

      loadedContents.forEach((comp) => {
        if (comp.name === "header") {
          headerHtml = comp.html;
        } else if (comp.name === "footer") {
          footerHtml = comp.html;
        } else if (comp.name === "project-modal") {
          modalHtml = comp.html;
        } else if (comp.isMainChild) {
          mainChildrenHtml += `\n${comp.html}\n`;
        }
      });

      // Construct assembled DOM string with semantic <main id="main-content"> landmark
      const assembledMarkup = `
        ${headerHtml}
        <main id="main-content">
          ${mainChildrenHtml}
        </main>
        ${footerHtml}
        ${modalHtml}
      `;

      appEl.innerHTML = assembledMarkup;

      // Handle in-page hash scroll if arriving with an anchor (e.g., #work)
      if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          setTimeout(() => {
            targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
        }
      }
    } catch (err) {
      console.error("ComponentLoader: Error assembling components:", err);
      const is404 = err.message && err.message.includes("404");
      const statusCode = is404 ? 404 : 500;

      if (window.ErrorState) {
        appEl.innerHTML = window.ErrorState.renderPage({
          statusCode: statusCode,
          title: is404 ? "Page Component Not Found" : "Something Went Wrong",
          message: is404
            ? "A required portfolio template could not be located on the server."
            : "The application encountered an unexpected issue assembling page components.",
          showHome: true,
          showRetry: !is404
        });

        const retryBtn = appEl.querySelector(".error-page-retry-btn");
        if (retryBtn) {
          retryBtn.addEventListener("click", () => {
            retryBtn.disabled = true;
            retryBtn.innerHTML = "<span>Retrying...</span>";
            loadAll(targetSelector).catch(() => {});
          });
        }
      } else {
        appEl.innerHTML = `
          <section class="error-page-section">
            <div class="error-page-card">
              <span class="error-page-kicker">${statusCode} ERROR</span>
              <h2 class="error-page-title">${is404 ? "Page Not Found" : "Something Went Wrong"}</h2>
              <p class="error-page-subtitle">Unable to load website components. Please make sure you are running through a local web server.</p>
              <a href="index.html" class="btn btn-primary">Back Home</a>
            </div>
          </section>
        `;
      }
      throw err;
    }
  }

  return {
    loadAll,
    fetchComponent,
    HOMEPAGE_MANIFEST,
    ABOUT_MANIFEST,
    ERROR_404_MANIFEST
  };
})();

if (typeof window !== "undefined") {
  window.ComponentLoader = ComponentLoader;
}
