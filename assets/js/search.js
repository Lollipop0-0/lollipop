/**
 * Karl Evan Tabunda - Portfolio Command Search Module
 * Inspired by refined, minimal search command bars (e.g. Bryl's minimalist style).
 * Supports fuzzy/keyword search across Projects, Stack, Journey, About, Activity, and Contact.
 * Keyboard shortcut: Ctrl+K (Windows/Linux) / Cmd+K (Mac), Arrow navigation, Escape to close.
 */

const SearchManager = (() => {
  let modalBackdrop = null;
  let searchInput = null;
  let resultsContainer = null;
  let clearBtn = null;
  let closeBtn = null;
  let desktopTrigger = null;
  let mobileTrigger = null;
  let kbdShortcut = null;
  let countBadge = null;

  let selectedIndex = 0;
  let currentResults = [];

  // Search Index Data
  const SEARCH_ITEMS = [
    // --- Projects ---
    {
      id: "proj-cup",
      type: "project",
      badge: "Project",
      title: "Celestine University of the Pacific",
      desc: "Flagship University Admissions & Enrollment Management System",
      keywords: ["cup", "celestine", "university", "admissions", "enrollment", "php", "mvc", "mysql", "bootstrap", "featured", "yakuzokai", "collaborative"],
      action: () => openProjectModal("01")
    },
    {
      id: "proj-inventory",
      type: "project",
      badge: "Project",
      title: "Inventory Management System",
      desc: "Stock tracking, automated low-inventory alerts, and receipt generation",
      keywords: ["inventory", "stock", "warehouse", "tracking", "php", "mysql", "javascript", "crud", "management"],
      action: () => openProjectModal("02")
    },
    {
      id: "proj-library",
      type: "project",
      badge: "Project",
      title: "Library Management System",
      desc: "Book cataloging, borrowing/return workflows, and patron fine tracking",
      keywords: ["library", "book", "borrowing", "patron", "catalog", "php", "mysql", "bootstrap"],
      action: () => openProjectModal("03")
    },
    {
      id: "proj-sneakerhub",
      type: "project",
      badge: "Project",
      title: "UI SneakerHub",
      desc: "Responsive sneaker marketplace storefront with dynamic cart & filter preview",
      keywords: ["sneakerhub", "sneaker", "shoes", "ecommerce", "storefront", "cart", "html", "css", "javascript", "frontend"],
      action: () => openProjectModal("04")
    },
    {
      id: "proj-hotel",
      type: "project",
      badge: "Project",
      title: "Hotel Reservation Management System",
      desc: "Room availability checker, guest billing, and reservation booking engine",
      keywords: ["hotel", "reservation", "booking", "room", "guest", "billing", "php", "mysql", "bootstrap"],
      action: () => openProjectModal("05")
    },
    {
      id: "proj-smartspace",
      type: "project",
      badge: "Project",
      title: "SmartSpace",
      desc: "3D Room Planning & Furniture Visualizer powered by Three.js",
      keywords: ["smartspace", "3d", "room", "furniture", "threejs", "visualizer", "javascript", "php", "mysql", "collaborative", "yakuzokai"],
      action: () => openProjectModal("06")
    },

    // --- Sections ---
    {
      id: "sec-home",
      type: "section",
      badge: "Section",
      title: "Home / Hero",
      desc: "Karl Evan Tabunda - IT Student Developer at NCST Philippines",
      keywords: ["home", "hero", "intro", "karl", "evan", "tabunda", "student", "developer", "ncst"],
      action: () => scrollToSection("home")
    },
    {
      id: "sec-about",
      type: "section",
      badge: "Page",
      title: "About Me",
      desc: "Background, narrative introduction, journey milestones, and tech stack",
      keywords: ["about", "me", "bio", "education", "focus", "interests", "learning", "ncst", "bsit", "story", "stack", "journey"],
      action: () => { window.location.href = "about.html"; }
    },
    {
      id: "sec-work",
      type: "section",
      badge: "Section",
      title: "Work & Featured Projects",
      desc: "Explore featured software, personal apps, and collaborative systems",
      keywords: ["work", "projects", "portfolio", "archive", "featured", "software", "applications", "selected work"],
      action: () => scrollToSection("selected-work")
    },
    {
      id: "page-projects",
      type: "section",
      badge: "Page",
      title: "Projects & Archive Page",
      desc: "Comprehensive archive and gallery of all 6 software projects with real-time category filters",
      keywords: ["projects", "archive", "gallery", "case studies", "works", "systems", "filter"],
      action: () => { window.location.href = "projects.html"; }
    },
    {
      id: "sec-activity",
      type: "section",
      badge: "Section",
      title: "Code Activity",
      desc: "Live GitHub contribution matrix, commit activity, and repository breakdown",
      keywords: ["activity", "code", "github", "matrix", "contributions", "commits", "repos", "languages"],
      action: () => scrollToSection("activity")
    },
    {
      id: "sec-stack",
      type: "section",
      badge: "Section",
      title: "Things I Build With",
      desc: "Languages, web tech, software, databases, dev tools, and design environments",
      keywords: ["stack", "tech", "skills", "tools", "languages", "technologies", "software"],
      action: () => scrollToSection("stack")
    },
    {
      id: "sec-certificates",
      type: "section",
      badge: "Section",
      title: "Certificates & Certifications",
      desc: "Verified Sololearn course credentials in JavaScript, HTML, CSS, and C++",
      keywords: ["certificates", "certifications", "credentials", "sololearn", "courses", "verified", "degrees", "diploma"],
      action: () => scrollToSection("certificates")
    },
    {
      id: "page-certificates",
      type: "section",
      badge: "Page",
      title: "Certificates Archive Page",
      desc: "Comprehensive showcase of verified course credentials in JavaScript, HTML, CSS, and C++ from Sololearn",
      keywords: ["certificates", "certifications", "credentials", "sololearn", "courses", "verified", "archive", "page"],
      action: () => { window.location.href = "certificates.html"; }
    },
    {
      id: "sec-journey",
      type: "section",
      badge: "Section",
      title: "Development Journey",
      desc: "Key technical milestones from fundamentals to full management systems",
      keywords: ["journey", "milestones", "timeline", "development", "figuring", "learning"],
      action: () => scrollToSection("journey")
    },
    {
      id: "sec-contact",
      type: "section",
      badge: "Section",
      title: "Contact / Let's Build Something",
      desc: "Send an email inquiry, connect on GitHub, LinkedIn, or Facebook",
      keywords: ["contact", "email", "hire", "message", "linkedin", "github", "facebook", "form"],
      action: () => scrollToSection("contact")
    },

    // --- Tech Stack & Skills ---
    {
      id: "tech-php",
      type: "tech",
      badge: "Stack",
      title: "PHP & MVC Architecture",
      desc: "Backend application development, OOP principles, and clean routing",
      keywords: ["php", "mvc", "backend", "oop", "architecture", "routing", "server"],
      action: () => scrollToSection("stack")
    },
    {
      id: "tech-mysql",
      type: "tech",
      badge: "Stack",
      title: "MySQL & MariaDB",
      desc: "Relational database schema design, indexing, foreign keys, and queries",
      keywords: ["mysql", "mariadb", "sql", "database", "schema", "relations", "queries"],
      action: () => scrollToSection("stack")
    },
    {
      id: "tech-js",
      type: "tech",
      badge: "Stack",
      title: "JavaScript & DOM Manipulation",
      desc: "Modern ES6+ Vanilla JS, asynchronous APIs, and interactive UI logic",
      keywords: ["javascript", "js", "frontend", "dom", "es6", "vanilla", "ajax", "fetch"],
      action: () => scrollToSection("stack")
    },
    {
      id: "tech-java",
      type: "tech",
      badge: "Stack",
      title: "Java & Desktop Applications",
      desc: "Object-oriented programming, desktop UI development, and data structures",
      keywords: ["java", "oop", "desktop", "software", "swing", "classes"],
      action: () => scrollToSection("stack")
    },
    {
      id: "tech-cpp",
      type: "tech",
      badge: "Stack",
      title: "C++ Programming",
      desc: "Foundational programming concepts, memory management, and algorithms",
      keywords: ["c++", "cpp", "cplusplus", "programming", "algorithms", "memory"],
      action: () => scrollToSection("stack")
    },
    {
      id: "tech-figma",
      type: "tech",
      badge: "Design",
      title: "UI/UX & Figma",
      desc: "Modern user interface prototyping, design systems, and component states",
      keywords: ["figma", "ui", "ux", "design", "wireframes", "prototype", "components"],
      action: () => scrollToSection("stack")
    },
    {
      id: "tech-git",
      type: "tech",
      badge: "Tool",
      title: "Git & GitHub Workflows",
      desc: "Version control, branching, pull requests, and team collaboration",
      keywords: ["git", "github", "version", "control", "repository", "commits"],
      action: () => scrollToSection("stack")
    },
    {
      id: "tech-gemini",
      type: "tech",
      badge: "AI",
      title: "Google Gemini",
      desc: "AI assistant for code reasoning, planning, architectural review, and problem-solving",
      keywords: ["gemini", "ai", "google", "artificial intelligence", "llm", "assistant", "stack"],
      action: () => scrollToSection("stack")
    },
    {
      id: "tech-codex",
      type: "tech",
      badge: "AI",
      title: "Codex",
      desc: "AI code generation, agentic development, and workflow automation",
      keywords: ["codex", "openai", "ai", "code generation", "llm", "agent", "stack"],
      action: () => scrollToSection("stack")
    },

    // --- Currently Figuring Things Out ---
    {
      id: "fig-auth",
      type: "learning",
      badge: "Learning",
      title: "Authentication & Role-Based Access",
      desc: "Currently implementing secure user authentication and RBAC workflows",
      keywords: ["auth", "authentication", "roles", "rbac", "security", "permissions", "sessions"],
      action: () => scrollToSection("journey")
    },
    {
      id: "fig-payment",
      type: "learning",
      badge: "Learning",
      title: "Payment Workflows",
      desc: "Exploring payment processing, transaction handling, and receipt generation",
      keywords: ["payment", "transactions", "checkout", "billing", "money"],
      action: () => scrollToSection("journey")
    },

    // --- Certificates ---
    {
      id: "cert-search-cpp",
      type: "cert",
      badge: "Certificate",
      title: "Introduction to C++ Certificate",
      desc: "Sololearn Verified Credential (ID: CC-KDC4AZEG) — Issued 18 Mar 2025",
      keywords: ["c++", "cpp", "certificate", "sololearn", "kdc4azeg", "credential", "verified"],
      action: () => openCertificateModal("cert-cpp")
    },
    {
      id: "cert-search-html",
      type: "cert",
      badge: "Certificate",
      title: "Introduction to HTML Certificate",
      desc: "Sololearn Verified Credential (ID: CC-NHB7RE2H) — Issued 20 Feb 2025",
      keywords: ["html", "html5", "certificate", "sololearn", "nhb7re2h", "credential", "verified"],
      action: () => openCertificateModal("cert-html")
    },
    {
      id: "cert-search-css",
      type: "cert",
      badge: "Certificate",
      title: "Introduction to CSS Certificate",
      desc: "Sololearn Verified Credential (ID: CC-T8NGLTB4) — Issued 17 Mar 2025",
      keywords: ["css", "css3", "certificate", "sololearn", "t8ngltb4", "credential", "verified"],
      action: () => openCertificateModal("cert-css")
    },
    {
      id: "cert-search-js",
      type: "cert",
      badge: "Certificate",
      title: "Introduction to JavaScript Certificate",
      desc: "Sololearn Verified Credential (ID: CC-C8KJA5GY) — Issued 17 May 2025",
      keywords: ["javascript", "js", "certificate", "sololearn", "c8kja5gy", "credential", "verified"],
      action: () => openCertificateModal("cert-javascript")
    }
  ];

  const PROJECT_ID_MAP = {
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

  function openProjectModal(projectId) {
    close();
    const canonicalId = PROJECT_ID_MAP[projectId] || projectId;
    const targetSection = document.getElementById("selected-work") ||
      document.getElementById("projects-gallery-section") ||
      document.getElementById("featured-project");

    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }

    setTimeout(() => {
      if (window.ModalManager && typeof window.ModalManager.open === "function") {
        window.ModalManager.open(canonicalId);
      }
    }, 250);
  }

  function openCertificateModal(certId) {
    close();
    const certSection = document.getElementById("certificates") ||
      document.getElementById("certificates-gallery-section") ||
      document.getElementById("certificates-page-hero");

    if (certSection) {
      certSection.scrollIntoView({ behavior: "smooth" });
    }

    setTimeout(() => {
      if (window.ModalManager && typeof window.ModalManager.openCertificate === "function") {
        window.ModalManager.openCertificate(certId);
      } else {
        window.location.href = "certificates.html";
      }
    }, 250);
  }

  function scrollToSection(sectionId) {
    close();
    // Normalize aliases
    let target = sectionId;
    if (target === "work") target = "selected-work";

    const el = document.getElementById(target) ||
      (target === "selected-work" ? document.getElementById("projects") : null);

    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      const aboutSections = ["about-intro", "journey", "stack"];
      if (aboutSections.includes(target)) {
        window.location.href = `about.html#${target}`;
      } else if (target === "about") {
        window.location.href = "about.html";
      } else if (target === "certificates") {
        window.location.href = `certificates.html`;
      } else if (target === "selected-work" || target === "projects") {
        window.location.href = `index.html#selected-work`;
      } else {
        window.location.href = `index.html#${target}`;
      }
    }
  }

  function open() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.add("is-open");
    modalBackdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (searchInput) {
      searchInput.value = "";
      // Immediately focus and retry across animation frame & timer
      searchInput.focus();
      requestAnimationFrame(() => {
        searchInput.focus();
      });
      setTimeout(() => searchInput.focus(), 50);
    }
    renderResults("");
  }

  function close() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove("is-open");
    modalBackdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (desktopTrigger) {
      desktopTrigger.focus();
    }
  }

  function renderResults(query) {
    if (!resultsContainer) return;

    const trimmed = (query || "").trim().toLowerCase();
    selectedIndex = 0;

    if (!trimmed) {
      // Default: show quick jump suggestions
      currentResults = SEARCH_ITEMS.slice(0, 7);
      if (countBadge) countBadge.textContent = "Quick Jump";
    } else {
      const tokens = trimmed.split(/\s+/);
      currentResults = SEARCH_ITEMS.filter(item => {
        const textToSearch = `${item.title} ${item.desc} ${item.badge} ${(item.keywords || []).join(" ")}`.toLowerCase();
        return tokens.every(token => textToSearch.includes(token));
      });
      if (countBadge) {
        countBadge.textContent = `${currentResults.length} match${currentResults.length === 1 ? "" : "es"}`;
      }
    }

    if (currentResults.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-empty-state">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" style="opacity: 0.5;">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span class="search-empty-title">No results found for "${escapeHtml(query)}"</span>
          <span class="search-empty-desc">Try searching for <strong>Projects</strong>, <strong>PHP</strong>, <strong>MySQL</strong>, <strong>About</strong>, or <strong>Contact</strong>.</span>
        </div>
      `;
      return;
    }

    const html = currentResults.map((item, idx) => {
      const isSel = idx === selectedIndex ? "is-selected" : "";
      const iconSvg = getItemIcon(item.type);
      return `
        <div class="search-result-item ${isSel}" data-index="${idx}" role="option" aria-selected="${idx === selectedIndex}">
          <div class="search-item-left">
            <div class="search-item-icon">${iconSvg}</div>
            <div class="search-item-info">
              <span class="search-item-title">${escapeHtml(item.title)}</span>
              <span class="search-item-desc">${escapeHtml(item.desc)}</span>
            </div>
          </div>
          <span class="search-item-badge">${escapeHtml(item.badge)}</span>
        </div>
      `;
    }).join("");

    resultsContainer.innerHTML = html;

    // Attach click events to result rows
    const rows = resultsContainer.querySelectorAll(".search-result-item");
    rows.forEach(row => {
      row.addEventListener("click", () => {
        const idx = parseInt(row.getAttribute("data-index"), 10);
        executeItem(idx);
      });
      row.addEventListener("mouseenter", () => {
        const idx = parseInt(row.getAttribute("data-index"), 10);
        setSelectedIndex(idx);
      });
    });
  }

  function setSelectedIndex(idx) {
    selectedIndex = idx;
    const rows = resultsContainer ? resultsContainer.querySelectorAll(".search-result-item") : [];
    rows.forEach((r, i) => {
      if (i === selectedIndex) {
        r.classList.add("is-selected");
        r.setAttribute("aria-selected", "true");
        r.scrollIntoView({ block: "nearest", behavior: "smooth" });
      } else {
        r.classList.remove("is-selected");
        r.setAttribute("aria-selected", "false");
      }
    });
  }

  function executeItem(idx) {
    if (idx >= 0 && idx < currentResults.length) {
      const item = currentResults[idx];
      if (item && typeof item.action === "function") {
        item.action();
      }
    }
  }

  function getItemIcon(type) {
    switch (type) {
      case "project":
        return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`;
      case "cert":
        return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>`;
      case "section":
        return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>`;
      case "tech":
        return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`;
      case "learning":
        return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>`;
      default:
        return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function updateKbdHint() {
    if (!kbdShortcut) return;
    const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    kbdShortcut.textContent = isMac ? "⌘ K" : "Ctrl K";
  }

  function init() {
    modalBackdrop = document.getElementById("portfolio-search-modal");
    searchInput = document.getElementById("portfolio-search-input");
    resultsContainer = document.getElementById("portfolio-search-results");
    clearBtn = document.getElementById("search-clear-btn");
    closeBtn = document.getElementById("search-close-btn");
    desktopTrigger = document.getElementById("portfolio-search-trigger");
    mobileTrigger = document.getElementById("mobile-search-trigger");
    kbdShortcut = document.getElementById("search-kbd-shortcut");
    countBadge = document.getElementById("search-count-badge");

    updateKbdHint();

    if (desktopTrigger) {
      desktopTrigger.addEventListener("click", open);
    }

    if (mobileTrigger) {
      mobileTrigger.addEventListener("click", () => {
        // Close mobile drawer if open
        const drawer = document.getElementById("mobile-drawer");
        const backdrop = document.querySelector(".mobile-nav-backdrop");
        if (drawer) drawer.classList.remove("is-open");
        if (backdrop) backdrop.classList.remove("is-visible");
        open();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", close);
    }

    if (modalBackdrop) {
      modalBackdrop.addEventListener("click", (e) => {
        if (e.target === modalBackdrop) {
          close();
        }
      });
    }

    if (clearBtn && searchInput) {
      clearBtn.addEventListener("click", () => {
        searchInput.value = "";
        clearBtn.style.display = "none";
        searchInput.focus();
        renderResults("");
      });
    }

    let searchDebounceTimer = null;
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const val = searchInput.value;
        if (clearBtn) {
          clearBtn.style.display = val.length > 0 ? "flex" : "none";
        }
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
          renderResults(val);
        }, 120);
      });

      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          if (currentResults.length > 0) {
            setSelectedIndex((selectedIndex + 1) % currentResults.length);
          }
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          if (currentResults.length > 0) {
            setSelectedIndex((selectedIndex - 1 + currentResults.length) % currentResults.length);
          }
        } else if (e.key === "Enter") {
          e.preventDefault();
          executeItem(selectedIndex);
        } else if (e.key === "Escape") {
          e.preventDefault();
          close();
        }
      });
    }

    // Global keyboard listener for Ctrl+K / Cmd+K and Escape
    window.addEventListener("keydown", (e) => {
      const isK = e.key === "k" || e.key === "K";
      const hasModifier = e.ctrlKey || e.metaKey;

      if (hasModifier && isK) {
        e.preventDefault();
        if (modalBackdrop && modalBackdrop.classList.contains("is-open")) {
          close();
        } else {
          open();
        }
      } else if (e.key === "Escape") {
        if (modalBackdrop && modalBackdrop.classList.contains("is-open")) {
          e.preventDefault();
          close();
        }
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
  window.SearchManager = SearchManager;
}
