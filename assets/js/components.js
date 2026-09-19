/**
 * Karl Evan Tabunda - Component Loader Module
 * Asynchronously fetches and mounts HTML partials into the application shell (#app).
 * Zero frameworks, pure Vanilla JavaScript.
 */

const ComponentLoader = (() => {
  // Homepage manifest: Hero → 01 Currently Building → 02 Selected Work → Original GitHub Recent Activity → About Preview → Original Message/Contact → Footer
  const HOMEPAGE_MANIFEST = [
    { name: "header", path: "components/header.html", isMainChild: false },
    { name: "hero", path: "components/hero.html", isMainChild: true },
    { name: "currently-building", path: "components/currently-building-section.html", isMainChild: true },
    { name: "selected-work", path: "components/selected-work.html", isMainChild: true },
    { name: "activity", path: "components/activity.html", isMainChild: true },
    { name: "about-preview", path: "components/about-preview.html", isMainChild: true },
    { name: "contact", path: "components/contact.html", isMainChild: true },
    { name: "footer", path: "components/footer.html", isMainChild: false },
    { name: "project-modal", path: "components/project-modal.html", isMainChild: false }
  ];

  // Dedicated About page manifest: Detailed personal narrative, secondary background, milestones, stack, certificates
  const ABOUT_MANIFEST = [
    { name: "header", path: "components/header.html", isMainChild: false },
    { name: "about-hero", path: "components/about-page-hero.html", isMainChild: true },
    { name: "journey", path: "components/journey.html", isMainChild: true },
    { name: "stack", path: "components/stack.html", isMainChild: true },
    { name: "certificates", path: "components/certificates.html", isMainChild: true },
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
    const isAboutPage = appEl.getAttribute("data-page") === "about" ||
      window.location.pathname.endsWith("about.html") ||
      window.location.pathname.endsWith("/about");

    const manifest = isAboutPage ? ABOUT_MANIFEST : HOMEPAGE_MANIFEST;

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
    ABOUT_MANIFEST
  };
})();

if (typeof window !== "undefined") {
  window.ComponentLoader = ComponentLoader;
}
