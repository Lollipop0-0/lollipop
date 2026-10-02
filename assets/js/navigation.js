/**
 * Karl Evan Tabunda - Navigation Module
 * Handles smooth section scrolling, active scroll-spy, and mobile drawer accessibility.
 */

const NavigationManager = (() => {
  let header = null;
  let mobileToggle = null;
  let mobileDrawer = null;
  let mobileBackdrop = null;
  let closeDrawerBtn = null;
  let navLinks = [];
  let sections = [];
  let moreDropdownWrap = null;
  let moreTrigger = null;
  let moreMenu = null;

  let isDrawerOpen = false;

  /**
   * Open the mobile navigation drawer with keyboard focus trap
   */
  function openDrawer() {
    if (!mobileDrawer) return;
    isDrawerOpen = true;
    mobileDrawer.classList.add("is-open");
    if (mobileBackdrop) mobileBackdrop.classList.add("is-visible");
    document.body.classList.add("drawer-locked");

    if (mobileToggle) {
      mobileToggle.setAttribute("aria-expanded", "true");
    }

    // Focus the first link or close button inside drawer
    const firstFocusable = mobileDrawer.querySelector("button, a");
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 50);
    }
  }

  /**
   * Close the mobile navigation drawer
   */
  function closeDrawer() {
    if (!mobileDrawer || !isDrawerOpen) return;
    isDrawerOpen = false;
    mobileDrawer.classList.remove("is-open");
    if (mobileBackdrop) mobileBackdrop.classList.remove("is-visible");
    document.body.classList.remove("drawer-locked");

    if (mobileToggle) {
      mobileToggle.setAttribute("aria-expanded", "false");
      mobileToggle.focus();
    }
  }

  /**
   * Toggle the mobile drawer
   */
  function toggleDrawer() {
    if (isDrawerOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }

  /**
   * Open the "More" dropdown menu
   */
  function openMoreDropdown() {
    if (!moreMenu || !moreTrigger) return;
    moreMenu.removeAttribute("hidden");
    moreMenu.classList.add("is-open");
    if (moreDropdownWrap) moreDropdownWrap.classList.add("is-open");
    moreTrigger.setAttribute("aria-expanded", "true");
  }

  /**
   * Close the "More" dropdown menu
   */
  function closeMoreDropdown() {
    if (!moreMenu || !moreTrigger) return;
    moreMenu.classList.remove("is-open");
    if (moreDropdownWrap) moreDropdownWrap.classList.remove("is-open");
    moreTrigger.setAttribute("aria-expanded", "false");
    setTimeout(() => {
      if (moreTrigger && moreTrigger.getAttribute("aria-expanded") === "false") {
        moreMenu.setAttribute("hidden", "");
      }
    }, 160);
  }

  /**
   * Toggle the "More" dropdown menu
   */
  function toggleMoreDropdown() {
    if (moreTrigger && moreTrigger.getAttribute("aria-expanded") === "true") {
      closeMoreDropdown();
    } else {
      openMoreDropdown();
    }
  }

  /**
   * Smoothly scroll to a section by target ID
   * @param {string} targetId
   */
  function scrollToTarget(targetId) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    // Use CSS scroll-behavior: smooth with scroll-margin-top
    targetElement.scrollIntoView({ behavior: "smooth", block: "start" });

    // Update history state without full page reload
    if (history.pushState) {
      history.pushState(null, "", `#${targetId}`);
    }
  }

  /**
   * Update active nav link based on current scroll position (Scroll-Spy)
   */
  function updateActiveLink() {
    const is404Page = window.location.pathname.endsWith("404.html") ||
      (document.getElementById("app") && document.getElementById("app").getAttribute("data-page") === "404");

    if (is404Page) {
      navLinks.forEach(link => {
        link.classList.remove("is-active");
        link.removeAttribute("aria-current");
      });
      return;
    }

    const isAboutPage = window.location.pathname.endsWith("about.html") ||
      (document.getElementById("app") && document.getElementById("app").getAttribute("data-page") === "about");

    if (isAboutPage) {
      navLinks.forEach(link => {
        const href = link.getAttribute("href") || "";
        if (href === "about.html" || href === "/about" || href.endsWith("/about.html") || href.includes("components/about")) {
          link.classList.add("is-active");
          link.setAttribute("aria-current", "page");
        } else {
          link.classList.remove("is-active");
          link.removeAttribute("aria-current");
        }
      });
      if (moreTrigger) {
        moreTrigger.classList.remove("is-active");
        moreTrigger.removeAttribute("aria-current");
      }
      const gearItem = document.getElementById("more-link-gear");
      if (gearItem) gearItem.classList.remove("is-active");
      const stackItem = document.getElementById("more-link-stack");
      if (stackItem) stackItem.classList.remove("is-active");
      return;
    }

    const isProjectsPage = window.location.pathname.endsWith("projects.html") ||
      (document.getElementById("app") && document.getElementById("app").getAttribute("data-page") === "projects");

    if (isProjectsPage) {
      navLinks.forEach(link => {
        const href = link.getAttribute("href") || "";
        if (href === "projects.html" || href === "/projects" || href.endsWith("/projects.html")) {
          link.classList.add("is-active");
          link.setAttribute("aria-current", "page");
        } else {
          link.classList.remove("is-active");
          link.removeAttribute("aria-current");
        }
      });
      if (moreTrigger) {
        moreTrigger.classList.remove("is-active");
        moreTrigger.removeAttribute("aria-current");
      }
      const gearItem = document.getElementById("more-link-gear");
      if (gearItem) gearItem.classList.remove("is-active");
      const stackItem = document.getElementById("more-link-stack");
      if (stackItem) stackItem.classList.remove("is-active");
      return;
    }

    const isCertificatesPage = window.location.pathname.endsWith("certificates.html") ||
      (document.getElementById("app") && document.getElementById("app").getAttribute("data-page") === "certificates");

    if (isCertificatesPage) {
      navLinks.forEach(link => {
        const href = link.getAttribute("href") || "";
        if (href === "certificates.html" || href === "/certificates" || href.endsWith("/certificates.html")) {
          link.classList.add("is-active");
          link.setAttribute("aria-current", "page");
        } else {
          link.classList.remove("is-active");
          link.removeAttribute("aria-current");
        }
      });
      if (moreTrigger) {
        moreTrigger.classList.remove("is-active");
        moreTrigger.removeAttribute("aria-current");
      }
      const gearItem = document.getElementById("more-link-gear");
      if (gearItem) gearItem.classList.remove("is-active");
      const stackItem = document.getElementById("more-link-stack");
      if (stackItem) stackItem.classList.remove("is-active");
      return;
    }

    const isGearPage = window.location.pathname.endsWith("gear.html") ||
      (document.getElementById("app") && document.getElementById("app").getAttribute("data-page") === "gear");

    if (isGearPage) {
      navLinks.forEach(link => {
        const href = link.getAttribute("href") || "";
        if (href === "gear.html" || href === "/gear" || href.endsWith("/gear.html")) {
          link.classList.add("is-active");
          link.setAttribute("aria-current", "page");
        } else {
          link.classList.remove("is-active");
          link.removeAttribute("aria-current");
        }
      });
      if (moreTrigger) {
        moreTrigger.classList.add("is-active");
        moreTrigger.setAttribute("aria-current", "page");
      }
      const gearItem = document.getElementById("more-link-gear");
      if (gearItem) gearItem.classList.add("is-active");
      const stackItem = document.getElementById("more-link-stack");
      if (stackItem) stackItem.classList.remove("is-active");
      return;
    }

    const isTechStackPage = window.location.pathname.endsWith("tech-stack.html") ||
      (document.getElementById("app") && document.getElementById("app").getAttribute("data-page") === "tech-stack");

    if (isTechStackPage) {
      navLinks.forEach(link => {
        const href = link.getAttribute("href") || "";
        if (href === "tech-stack.html" || href === "/tech-stack" || href.endsWith("/tech-stack.html")) {
          link.classList.add("is-active");
          link.setAttribute("aria-current", "page");
        } else {
          link.classList.remove("is-active");
          link.removeAttribute("aria-current");
        }
      });
      if (moreTrigger) {
        moreTrigger.classList.add("is-active");
        moreTrigger.setAttribute("aria-current", "page");
      }
      const gearItem = document.getElementById("more-link-gear");
      if (gearItem) gearItem.classList.remove("is-active");
      const stackItem = document.getElementById("more-link-stack");
      if (stackItem) stackItem.classList.add("is-active");
      return;
    }

    // On homepage, Home navigation link remains active
    const allLinks = navLinks && navLinks.length ? navLinks : document.querySelectorAll(".nav-link, .mobile-nav-link");
    allLinks.forEach(link => {
      const href = link.getAttribute("href") || "";
      if (
        href === "index.html#home" ||
        href === "#home" ||
        href === "index.html" ||
        href.endsWith("/index.html") ||
        href === "/"
      ) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("is-active");
        link.removeAttribute("aria-current");
      }
    });
    if (moreTrigger) {
      moreTrigger.classList.remove("is-active");
      moreTrigger.removeAttribute("aria-current");
    }
    const gearItem = document.getElementById("more-link-gear");
    if (gearItem) gearItem.classList.remove("is-active");
    const stackItem = document.getElementById("more-link-stack");
    if (stackItem) stackItem.classList.remove("is-active");

    // Batch read layout metrics upfront to prevent forced synchronous reflows
    const currentScrollY = window.scrollY || window.pageYOffset || 0;
    const windowH = window.innerHeight;
    const docH = document.documentElement.scrollHeight;
    const maxScroll = docH - windowH;
    const scrollPercent = maxScroll > 0 ? (currentScrollY / maxScroll) * 100 : 0;

    // Add subtle shadow and elevated border when scrolled
    if (header) {
      if (currentScrollY > 20) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    }

    // Smoothly hide hero scroll indicator when scrolled down
    const scrollIndicator = document.getElementById("hero-scroll-indicator");
    if (scrollIndicator) {
      if (currentScrollY > 60) {
        scrollIndicator.classList.add("is-scrolled-hidden");
      } else {
        scrollIndicator.classList.remove("is-scrolled-hidden");
      }
    }

    // Update top reading scroll progress bar
    const progressBar = document.getElementById("scroll-progress-bar");
    if (progressBar) {
      progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
    }
  }

  /**
   * Initialize navigation events
   */
  function init() {
    header = document.querySelector(".site-header");
    mobileToggle = document.querySelector(".mobile-menu-toggle");
    mobileDrawer = document.querySelector(".mobile-nav-drawer");
    mobileBackdrop = document.querySelector(".mobile-nav-backdrop");
    closeDrawerBtn = document.querySelector(".mobile-nav-close");
    navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");
    sections = document.querySelectorAll("section[id], header[id]");

    // Ensure About navigation always targets root about.html (guard against static host pretty-url rewrites)
    document.querySelectorAll('a[href*="components/about"]').forEach(link => {
      link.setAttribute("href", "about.html");
    });

    // More dropdown bindings
    moreDropdownWrap = document.getElementById("more-dropdown-wrap");
    moreTrigger = document.getElementById("more-dropdown-trigger");
    moreMenu = document.getElementById("more-dropdown-menu");

    let dropdownHoverTimer = null;
    if (moreDropdownWrap) {
      moreDropdownWrap.addEventListener("mouseenter", () => {
        clearTimeout(dropdownHoverTimer);
        openMoreDropdown();
      });
      moreDropdownWrap.addEventListener("mouseleave", () => {
        dropdownHoverTimer = setTimeout(() => {
          closeMoreDropdown();
        }, 120);
      });
    }

    if (moreTrigger) {
      moreTrigger.addEventListener("click", e => {
        e.stopPropagation();
        toggleMoreDropdown();
      });

      // Keyboard support for More button
      moreTrigger.addEventListener("keydown", e => {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openMoreDropdown();
          const firstItem = moreMenu ? moreMenu.querySelector(".nav-dropdown-item") : null;
          if (firstItem) firstItem.focus();
        }
      });
    }

    if (moreMenu) {
      moreMenu.addEventListener("keydown", e => {
        if (e.key === "Escape") {
          closeMoreDropdown();
          if (moreTrigger) moreTrigger.focus();
        }
      });
    }

    // Close More dropdown when clicking outside
    document.addEventListener("click", e => {
      if (moreDropdownWrap && !moreDropdownWrap.contains(e.target)) {
        closeMoreDropdown();
      }
    });

    // Mobile toggle & close bindings
    if (mobileToggle) {
      mobileToggle.addEventListener("click", toggleDrawer);
    }
    if (closeDrawerBtn) {
      closeDrawerBtn.addEventListener("click", closeDrawer);
    }
    if (mobileBackdrop) {
      mobileBackdrop.addEventListener("click", closeDrawer);
    }

    // Handle Escape key inside mobile drawer
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && isDrawerOpen) {
        closeDrawer();
      }
    });

    // Smooth scroll for in-page anchor links
    document.addEventListener("click", e => {
      const anchor = e.target.closest('a[href*="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return;

      const targetId = href.substring(hashIndex + 1);
      const targetElement = document.getElementById(targetId);

      // If target element exists on current page, smooth scroll to it
      if (targetElement) {
        e.preventDefault();
        if (isDrawerOpen) {
          closeDrawer();
        }
        closeMoreDropdown();
        scrollToTarget(targetId);
      } else if (isDrawerOpen) {
        closeDrawer();
      }
    });

    window.addEventListener("hashchange", updateActiveLink, { passive: true });

    // Scroll-spy listener throttled with requestAnimationFrame
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveLink();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Initial check
    updateActiveLink();

    // Initial scroll reveal scan
    initScrollReveal();
  }

  let scrollObserver = null;

  /**
   * Initialize or re-scan elements for IntersectionObserver scroll reveal
   */
  function initScrollReveal() {
    // Select elements that should reveal on scroll
    const selectors = [
      ".scroll-reveal",
      // Section headers & kicker titles
      ".section-header-row",
      ".section-header-bar",
      ".section-title-wrap",
      ".cert-header-centered",
      ".cb-section-text",
      ".contact-heading-group",
      ".about-hero-header",
      ".about-bio-block",
      // Currently building section
      ".cb-compact-card",
      // Selected projects & view all button
      ".selected-project-card",
      ".section-footer-action",
      // GitHub Activity cards
      ".activity-matrix-card",
      ".activity-feed-card",
      // Verified Certificates
      ".cert-marquee-container",
      ".certificates-grid .certificate-card",
      // Contact section
      ".contact-left-col",
      ".contact-form-card",
      // About page timeline, figuring out, tech stack, and snapshot cards
      ".journey-item",
      ".figuring-out-card",
      ".stack-section-header",
      ".stack-category-group",
      ".snapshot-card"
    ];

    const targets = document.querySelectorAll(selectors.join(", "));
    if (!targets.length) return;

    // Graceful fallback if IntersectionObserver is unsupported
    if (!("IntersectionObserver" in window)) {
      targets.forEach(el => el.classList.add("is-revealed"));
      return;
    }

    // Disconnect any existing observer if re-initializing
    if (scrollObserver) {
      scrollObserver.disconnect();
    }

    scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
        } else {
          entry.target.classList.remove("is-revealed");
        }
      });
    }, {
      root: null,
      rootMargin: "80px 0px -40px 0px",
      threshold: 0.05
    });

    targets.forEach(el => {
      el.classList.add("scroll-reveal");
      scrollObserver.observe(el);
    });
  }

  return {
    init,
    openDrawer,
    closeDrawer,
    scrollToTarget,
    initScrollReveal
  };
})();

if (typeof window !== "undefined") {
  window.NavigationManager = NavigationManager;
}
