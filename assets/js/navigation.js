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
        const href = link.getAttribute("href");
        if (href === "about.html" || href === "/about" || href.endsWith("/about.html") || href.includes("components/about")) {
          link.classList.add("is-active");
          link.setAttribute("aria-current", "page");
        } else {
          link.classList.remove("is-active");
          link.removeAttribute("aria-current");
        }
      });
      return;
    }

    // On homepage, dynamically detect current active section
    const allSections = sections && sections.length ? sections : document.querySelectorAll("section[id], header[id]");
    const allLinks = navLinks && navLinks.length ? navLinks : document.querySelectorAll(".nav-link, .mobile-nav-link");

    const scrollPosition = window.scrollY + 160;
    const isAtBottom = (window.innerHeight + Math.round(window.scrollY)) >= (document.documentElement.scrollHeight - 60);

    let currentSectionId = "";

    if (isAtBottom) {
      currentSectionId = "contact";
    } else {
      allSections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          currentSectionId = section.getAttribute("id");
        }
      });
    }

    // Map currently-building section to Work in nav
    if (currentSectionId === "currently-building") {
      currentSectionId = "selected-work";
    }

    if (currentSectionId) {
      allLinks.forEach(link => {
        const href = link.getAttribute("href") || "";
        const hashIndex = href.indexOf("#");
        const linkHash = hashIndex !== -1 ? href.substring(hashIndex + 1) : "";

        if (
          href === `#${currentSectionId}` ||
          href === `index.html#${currentSectionId}` ||
          linkHash === currentSectionId
        ) {
          link.classList.add("is-active");
          link.setAttribute("aria-current", "page");
        } else {
          link.classList.remove("is-active");
          link.removeAttribute("aria-current");
        }
      });
    }

    // Add subtle shadow and elevated border when scrolled
    if (header) {
      if (window.scrollY > 20) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
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
        scrollToTarget(targetId);
      } else if (isDrawerOpen) {
        closeDrawer();
      }
    });

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
  }

  return {
    init,
    openDrawer,
    closeDrawer,
    scrollToTarget
  };
})();

if (typeof window !== "undefined") {
  window.NavigationManager = NavigationManager;
}
