/**
 * Karl Evan Tabunda - Autonomous Guide Tour & Guide Prompt Module
 * Faithfully adapts the signature autonomous guide cursor & floating replay prompt
 * from Bryl Lim (https://www.bryllim.com/) with full Mobile Drawer & Post-Preload Invitation support.
 *
 * Features:
 * - Post-preload friendly invitation card asking visitors if they would like a tour
 * - Responsive desktop & mobile support with autonomous minimum-jerk spring physics
 * - Seamless mobile drawer guidance: automatically opens the navbar on mobile, guides
 *   through navigation links without navigating away, and closes when returning to top bar
 * - Dynamic speech bubble with realistic human typing cadence & punctuation pauses
 * - Floating glassmorphic #guidePrompt with replay ("take the tour again") & dismiss
 * - Tactile acoustic UI feedback integration (SoundManager pops, ticks, and chimes)
 * - Session-based persistence (sessionStorage) & ?tour query override to replay anytime
 */

const GuideManager = (() => {
  const STORAGE_SEEN_KEY = "ket_guide_tour_seen";
  const STORAGE_CHOICE_KEY = "ket_guide_tour_choice";
  const STORAGE_PROMPT_KEY = "ket_guide_tour_prompt";

  const store = {
    get(k) {
      try {
        return sessionStorage.getItem(k);
      } catch (e) {
        return null;
      }
    },
    set(k, v) {
      try {
        sessionStorage.setItem(k, v);
      } catch (e) {}
    }
  };

  const isSupported = () => {
    if (typeof window === "undefined") return false;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return false;
    }
    return true;
  };

  const isMobile = () => {
    return window.innerWidth <= 868;
  };

  let root = null;
  let prompt = null;
  let invite = null;
  let clickGuard = null;
  let stopWrap = null;
  let stopBtn = null;
  let tag = null;
  let nameEl = null;
  let clip = null;
  let inner = null;
  let measure = null;
  let caret = null;
  let paused = false;

  const graphemes = typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const rand = (min, max) => min + Math.random() * (max - min);

  const openMoreDropdown = () => {
    if (window.NavigationManager && typeof window.NavigationManager.openMoreDropdown === "function") {
      window.NavigationManager.openMoreDropdown();
    } else {
      const menu = document.getElementById("more-dropdown-menu");
      const wrap = document.getElementById("more-dropdown-wrap");
      const trigger = document.getElementById("more-dropdown-trigger");
      if (menu) {
        menu.removeAttribute("hidden");
        menu.classList.add("is-open");
      }
      if (wrap) wrap.classList.add("is-open");
      if (trigger) trigger.setAttribute("aria-expanded", "true");
    }
  };

  const closeMoreDropdown = () => {
    if (window.NavigationManager && typeof window.NavigationManager.closeMoreDropdown === "function") {
      window.NavigationManager.closeMoreDropdown();
    } else {
      const menu = document.getElementById("more-dropdown-menu");
      const wrap = document.getElementById("more-dropdown-wrap");
      const trigger = document.getElementById("more-dropdown-trigger");
      if (menu) {
        menu.classList.remove("is-open");
        setTimeout(() => {
          if (menu && !menu.classList.contains("is-open")) menu.setAttribute("hidden", "");
        }, 160);
      }
      if (wrap) wrap.classList.remove("is-open");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    }
  };

  // Tour steps tailored for Karl Evan's portfolio (Desktop & Mobile Adaptive)
  const steps = [
    {
      name: "home",
      els: () => [
        document.querySelector('[data-guide="hero-name"]') ||
        document.querySelector('[data-guide="nav-home"]') ||
        document.getElementById("hero-title")
      ],
      at: "above",
      free: true,
      text: "Hi! I'm Karl Evan, welcome to my website! 👋"
    },
    {
      name: "profile",
      els: () => [
        document.querySelector('[data-guide="avatar"]') ||
        document.getElementById("hero-photo-interactive")
      ],
      at: "top",
      text: "Hover over or tap my portrait to reveal interactive character reactions."
    },
    {
      name: "menu",
      // Exclusively guides the mobile menu button on mobile devices before entering the drawer
      skip: () => !isMobile(),
      els: () => [
        document.querySelector('[data-guide="mobile-menu-toggle"]') ||
        document.getElementById("mobile-menu-toggle") ||
        document.querySelector(".mobile-menu-toggle")
      ],
      at: "below",
      text: "Tap the menu toggle anytime to open navigation links and explore pages.",
      after: async () => {
        if (isMobile() && window.NavigationManager) {
          if (window.SoundManager && typeof window.SoundManager.playPop === "function") {
            window.SoundManager.playPop();
          }
          window.NavigationManager.openDrawer();
          await sleep(400);
        }
      }
    },
    {
      name: "about",
      before: async () => {
        // Ensure drawer is open on mobile
        if (isMobile() && window.NavigationManager && !document.getElementById("mobile-drawer")?.classList.contains("is-open")) {
          window.NavigationManager.openDrawer();
          await sleep(350);
        }
      },
      els: () => isMobile()
        ? [document.querySelector('.mobile-nav-links a[href*="about"]') || document.querySelector('[data-guide="hero-about"]')]
        : [document.querySelector('[data-guide="nav-about"]') || document.querySelector('[data-guide="hero-about"]') || document.querySelector('.desktop-nav a[href*="about"]')],
      at: "below",
      text: "Wanna know more about me? Check out my story and journey here."
    },
    {
      name: "projects",
      els: () => isMobile()
        ? [document.querySelector('.mobile-nav-links a[href*="projects"]')]
        : [document.querySelector('[data-guide="nav-projects"]') || document.querySelector('.desktop-nav a[href*="projects"]')],
      at: "below",
      text: "Here are my featured web applications, systems, and case studies."
    },
    {
      name: "certificates",
      els: () => isMobile()
        ? [document.querySelector('.mobile-nav-links a[href*="certificates"]') || document.querySelector('[data-guide="nav-certificates"]')]
        : [document.querySelector('[data-guide="nav-certificates"]') || document.querySelector('.desktop-nav a[href*="certificates"]') || document.getElementById("certificates")],
      at: "below",
      text: "Explore my verified programming certifications and course credentials."
    },
    {
      name: "more",
      before: async () => {
        if (!isMobile()) {
          openMoreDropdown();
          await sleep(250);
        }
      },
      els: () => isMobile()
        ? [document.querySelector('.mobile-nav-group-title') || document.querySelector('.mobile-nav-group')]
        : [document.querySelector('[data-guide="nav-more"]') || document.getElementById("more-dropdown-trigger")],
      at: "below",
      text: "Under More, you'll find additional details on my workstation gear and tech stack."
    },
    {
      name: "gear",
      before: async () => {
        if (!isMobile()) {
          openMoreDropdown();
          await sleep(150);
        }
      },
      els: () => isMobile()
        ? [document.querySelector('.mobile-nav-sublink[href*="gear"]') || document.querySelector('[data-guide="nav-gear"]')]
        : [document.getElementById("more-link-gear") || document.querySelector('[data-guide="nav-gear"]')],
      at: "below",
      text: "Gear: Check out my workstation setup, hardware, and dev tools."
    },
    {
      name: "stack",
      before: async () => {
        if (!isMobile()) {
          openMoreDropdown();
          await sleep(150);
        }
      },
      els: () => isMobile()
        ? [document.querySelector('.mobile-nav-sublink[href*="tech-stack"]') || document.querySelector('[data-guide="nav-stack"]')]
        : [document.getElementById("more-link-stack") || document.querySelector('[data-guide="nav-stack"]')],
      at: "below",
      text: "Tech Stack: Explore the languages, frameworks, databases, and AI tools I build with.",
      after: async () => {
        if (!isMobile()) {
          closeMoreDropdown();
          await sleep(200);
        }
      }
    },
    {
      name: "search",
      before: async () => {
        closeMoreDropdown();
        // On mobile: smoothly close the navbar drawer to guide them through header controls
        if (isMobile() && window.NavigationManager && document.getElementById("mobile-drawer")?.classList.contains("is-open")) {
          window.NavigationManager.closeDrawer();
          await sleep(350);
        }
      },
      els: () => [
        document.querySelector('[data-guide="search-trigger"]') ||
        document.getElementById("portfolio-search-trigger")
      ],
      at: "below",
      text: "Quickly search across my projects, stack, and milestones with Ctrl+K."
    },
    {
      name: "theme",
      els: () => [
        document.querySelector('[data-guide="theme-toggle"]') ||
        document.getElementById("theme-toggle-btn")
      ],
      at: "below",
      text: "Switch between crisp light mode, obsidian dark mode, or follow your system theme."
    },
    {
      name: "music",
      els: () => [
        document.querySelector('[data-guide="music-toggle"]') ||
        document.getElementById("music-toggle-btn")
      ],
      at: "below",
      text: "You can toggle procedural lo-fi ambient music and acoustic sounds here."
    },
    {
      name: "hire",
      els: () => isMobile()
        ? [document.querySelector('.hero-secondary-links a[href*="contact"]') || document.querySelector('.mobile-menu-toggle')]
        : [document.querySelector('[data-guide="nav-hire"]') || document.querySelector(".nav-resume-btn")],
      at: "below",
      text: "Looking for a developer? Let's connect and work together!"
    },
    {
      name: "farewell",
      before: async () => {
        closeMoreDropdown();
        if (isMobile() && window.NavigationManager && document.getElementById("mobile-drawer")?.classList.contains("is-open")) {
          window.NavigationManager.closeDrawer();
          await sleep(300);
        }
      },
      free: true,
      text: "Enjoy exploring my work! Scroll around and make yourself at home. ✌️"
    }
  ];

  // Motion physics & spring constants
  const goal = { x: 0, y: 0 };
  const shown = { x: 0, y: 0, vx: 0, vy: 0 };
  const SPRING = 190;
  const DAMPING = 2 * Math.sqrt(SPRING) * 0.82;
  const waiters = [];

  let clock = 0;
  let last = 0;
  let running = false;
  let away = false;
  let move = null;
  let rest = null;
  let hovered = null;
  let typing = false;
  let tremor = 1;
  let initialized = false;

  function ensureDOMElements() {
    if (root && prompt && invite && clickGuard && stopWrap) return true;

    // Autonomous Cursor
    root = document.getElementById("guideCursor");
    if (!root) {
      root = document.createElement("div");
      root.id = "guideCursor";
      root.setAttribute("aria-hidden", "true");
      root.innerHTML = `
        <svg class="gc-arrow" viewBox="0 0 24 24" fill="none">
          <path class="gc-rim" d="M5.5 5.5l3.9 11.7 2.2-5.6 5.6-2.2-11.7-3.9z"/>
          <path class="gc-body" d="M5.5 5.5l3.9 11.7 2.2-5.6 5.6-2.2-11.7-3.9z"/>
        </svg>
        <div class="gc-tag">
          <span class="gc-name">Karl</span>
          <div class="gc-clip"><div class="gc-text" data-gc-text></div></div>
          <div class="gc-text gc-measure" data-gc-measure></div>
          <span class="gc-caret"></span>
        </div>
      `;
      document.body.appendChild(root);
    }

    // Floating Replay Prompt Pill
    prompt = document.getElementById("guidePrompt");
    if (!prompt) {
      prompt = document.createElement("div");
      prompt.id = "guidePrompt";
      prompt.innerHTML = `
        <button type="button" class="gp-replay" data-guide-replay title="Replay portfolio guide tour">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M13 8a5 5 0 11-1.6-3.7M13 2.5v2.6h-2.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>take the tour again</span>
        </button>
        <button type="button" class="gp-dismiss" data-guide-dismiss aria-label="Dismiss tour prompt" title="Dismiss">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </button>
      `;
      document.body.appendChild(prompt);
    }

    // Post-Preload Tour Invitation Modal Card (Clean, Minimal, Non-AI Dialog)
    invite = document.getElementById("guideInvite");
    if (!invite) {
      invite = document.createElement("div");
      invite.id = "guideInvite";
      invite.setAttribute("role", "dialog");
      invite.setAttribute("aria-modal", "true");
      invite.setAttribute("aria-label", "Tour guide invitation");
      invite.innerHTML = `
        <div class="gi-backdrop" data-invite-backdrop></div>
        <div class="gi-card">
          <button type="button" class="gi-close-btn" data-invite-close aria-label="Dismiss tour invitation">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div class="gi-body">
            <h3 class="gi-title">Want a quick tour?</h3>
            <p class="gi-desc">I can show you around the key sections and features.</p>
          </div>
          <div class="gi-actions">
            <button type="button" class="gi-btn gi-btn-secondary" data-invite-decline>
              No, thanks
            </button>
            <button type="button" class="gi-btn gi-btn-primary" data-invite-accept>
              Yes, guide me
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(invite);
    }

    // Click Guard Barrier Overlay (Prevents user from clicking underlying elements during tour)
    clickGuard = document.getElementById("guideClickGuard");
    if (!clickGuard) {
      clickGuard = document.createElement("div");
      clickGuard.id = "guideClickGuard";
      clickGuard.className = "guide-click-guard";
      clickGuard.setAttribute("aria-hidden", "true");
      document.body.appendChild(clickGuard);
    }

    if (clickGuard && !clickGuard._hasBarrier) {
      clickGuard._hasBarrier = true;
      const blockBarrierEvent = (e) => {
        if (!running) return;
        e.preventDefault();
        e.stopPropagation();
      };
      ["click", "mousedown", "mouseup", "pointerdown", "pointerup", "touchstart", "touchend", "touchmove", "contextmenu", "dblclick"].forEach(evt => {
        clickGuard.addEventListener(evt, blockBarrierEvent, { capture: true, passive: false });
      });
    }

    // Dedicated Floating Stop Button
    stopWrap = document.getElementById("guideStopWrap");
    if (!stopWrap) {
      stopWrap = document.createElement("div");
      stopWrap.id = "guideStopWrap";
      stopWrap.className = "guide-stop-wrap";
      stopWrap.setAttribute("aria-hidden", "true");
      stopWrap.innerHTML = `
        <button type="button" id="guideStopBtn" class="guide-stop-btn" aria-label="Stop tour" title="Stop guided tour">
          <span class="guide-stop-dot"></span>
          <span class="guide-stop-label">Stop Guide</span>
          <svg class="guide-stop-x" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      `;
      document.body.appendChild(stopWrap);
    }

    stopBtn = stopWrap.querySelector("#guideStopBtn");
    if (stopBtn && !stopBtn._hasListener) {
      stopBtn._hasListener = true;
      const onStopTrigger = (e) => {
        e.preventDefault();
        e.stopPropagation();
        promptStopConfirmation();
      };
      stopBtn.addEventListener("click", onStopTrigger);
      stopBtn.addEventListener("touchend", onStopTrigger, { passive: false });
    }

    tag = root.querySelector(".gc-tag");
    nameEl = root.querySelector(".gc-name");
    clip = root.querySelector(".gc-clip");
    inner = root.querySelector("[data-gc-text]");
    measure = root.querySelector("[data-gc-measure]");
    caret = root.querySelector(".gc-caret");

    // Replay & Dismiss event listeners
    const replayBtn = prompt.querySelector("[data-guide-replay]");
    if (replayBtn && !replayBtn._hasListener) {
      replayBtn._hasListener = true;
      replayBtn.addEventListener("click", () => {
        if (window.SoundManager && typeof window.SoundManager.playPop === "function") {
          window.SoundManager.playPop();
        }
        prompt.classList.remove("is-on");
        hideInvite();
        start();
      });
    }

    const dismissBtn = prompt.querySelector("[data-guide-dismiss]");
    if (dismissBtn && !dismissBtn._hasListener) {
      dismissBtn._hasListener = true;
      dismissBtn.addEventListener("click", () => {
        if (window.SoundManager && typeof window.SoundManager.playClose === "function") {
          window.SoundManager.playClose();
        }
        store.set(STORAGE_PROMPT_KEY, "off");
        prompt.classList.remove("is-on");
        stop();
      });
    }

    // Invitation Accept & Decline event listeners
    const acceptBtn = invite.querySelector("[data-invite-accept]");
    if (acceptBtn && !acceptBtn._hasListener) {
      acceptBtn._hasListener = true;
      acceptBtn.addEventListener("click", () => {
        if (window.SoundManager && typeof window.SoundManager.playPop === "function") {
          window.SoundManager.playPop();
        }
        hideInvite();
        store.set(STORAGE_SEEN_KEY, "1");
        store.set(STORAGE_CHOICE_KEY, "yes");
        start();
      });
    }

    const handleDecline = () => {
      if (window.SoundManager && typeof window.SoundManager.playClose === "function") {
        window.SoundManager.playClose();
      }
      hideInvite();
      store.set(STORAGE_SEEN_KEY, "1");
      store.set(STORAGE_CHOICE_KEY, "no");
      showPrompt();
    };

    const declineBtn = invite.querySelector("[data-invite-decline]");
    if (declineBtn && !declineBtn._hasListener) {
      declineBtn._hasListener = true;
      declineBtn.addEventListener("click", handleDecline);
    }

    const closeBtn = invite.querySelector("[data-invite-close]");
    if (closeBtn && !closeBtn._hasListener) {
      closeBtn._hasListener = true;
      closeBtn.addEventListener("click", handleDecline);
    }

    const backdropEl = invite.querySelector("[data-invite-backdrop]");
    if (backdropEl && !backdropEl._hasListener) {
      backdropEl._hasListener = true;
      backdropEl.addEventListener("click", handleDecline);
    }

    // Keyboard support: Escape cancels invite if visible, or prompts stop tour if running
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (invite && invite.classList.contains("is-visible")) {
          handleDecline();
        } else if (running && !document.querySelector(".swal2-container")) {
          promptStopConfirmation();
        }
      }
    });

    return true;
  }

  // ============================================================================
  // Complete User Interaction Lock During Tour
  // Prevents the visitor from doing anything (clicking links/buttons/cards,
  // scrolling wheel/touch/keys, typing keyboard shortcuts like Ctrl+K or M,
  // focusing, context menu) EXCEPT clicking the Stop Guide button (#guideStopBtn)
  // or interacting with the SweetAlert2 confirmation dialog.
  // ============================================================================
  let interactionsLocked = false;

  const isAllowedInteractionTarget = (target) => {
    if (!target || !(target instanceof Node)) return false;
    try {
      // Allow interactions inside the Stop Guide button container
      if (stopWrap && (target === stopWrap || (typeof stopWrap.contains === "function" && stopWrap.contains(target)))) {
        return true;
      }
      // Allow interactions inside SweetAlert2 modal / container
      if (typeof target.closest === "function" && target.closest(".swal2-container")) {
        return true;
      }
    } catch (_) {
      return false;
    }
    return false;
  };

  const handleBlockedPointer = (e) => {
    if (!running) return;
    if (isAllowedInteractionTarget(e.target)) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    return false;
  };

  const handleBlockedScroll = (e) => {
    if (!running) return;
    if (isAllowedInteractionTarget(e.target)) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    return false;
  };

  const handleBlockedKey = (e) => {
    if (!running) return;

    // If SweetAlert2 dialog is visible, allow keyboard navigation inside it
    if (document.querySelector(".swal2-container")) {
      return;
    }

    // Allow Escape to prompt stop confirmation
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      promptStopConfirmation();
      return false;
    }

    // Block ALL other keyboard shortcuts and navigation keys (Ctrl+K, M, Tab, Space, Enter, Arrows, etc.)
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    return false;
  };

  const handleBlockedFocus = (e) => {
    if (!running) return;
    if (!e.target || e.target === window || e.target === document || !(e.target instanceof HTMLElement)) return;
    if (isAllowedInteractionTarget(e.target)) return;

    if (typeof e.target.blur === "function") {
      e.target.blur();
    }
  };

  const POINTER_EVENTS = [
    "click",
    "mousedown",
    "mouseup",
    "pointerdown",
    "pointerup",
    "touchstart",
    "touchend",
    "touchmove",
    "contextmenu",
    "dblclick",
    "auxclick"
  ];

  const SCROLL_EVENTS = [
    "wheel",
    "touchmove"
  ];

  const KEY_EVENTS = [
    "keydown",
    "keyup",
    "keypress"
  ];

  function lockUserInteractions() {
    if (interactionsLocked) return;
    interactionsLocked = true;

    document.documentElement.classList.add("tour-locked");
    document.body.classList.add("tour-locked");

    if (document.activeElement && typeof document.activeElement.blur === "function") {
      document.activeElement.blur();
    }

    POINTER_EVENTS.forEach((evt) => {
      window.addEventListener(evt, handleBlockedPointer, { capture: true, passive: false });
    });

    SCROLL_EVENTS.forEach((evt) => {
      window.addEventListener(evt, handleBlockedScroll, { capture: true, passive: false });
    });

    KEY_EVENTS.forEach((evt) => {
      window.addEventListener(evt, handleBlockedKey, { capture: true, passive: false });
    });

    window.addEventListener("focus", handleBlockedFocus, { capture: true });
    window.addEventListener("dragstart", handleBlockedPointer, { capture: true, passive: false });
    window.addEventListener("selectstart", handleBlockedPointer, { capture: true, passive: false });
  }

  function unlockUserInteractions() {
    if (!interactionsLocked) return;
    interactionsLocked = false;

    document.documentElement.classList.remove("tour-locked");
    document.body.classList.remove("tour-locked");

    POINTER_EVENTS.forEach((evt) => {
      window.removeEventListener(evt, handleBlockedPointer, { capture: true, passive: false });
    });

    SCROLL_EVENTS.forEach((evt) => {
      window.removeEventListener(evt, handleBlockedScroll, { capture: true, passive: false });
    });

    KEY_EVENTS.forEach((evt) => {
      window.removeEventListener(evt, handleBlockedKey, { capture: true, passive: false });
    });

    window.removeEventListener("focus", handleBlockedFocus, { capture: true });
    window.removeEventListener("dragstart", handleBlockedPointer, { capture: true, passive: false });
    window.removeEventListener("selectstart", handleBlockedPointer, { capture: true, passive: false });
  }

  // SweetAlert2 Confirmation Dialog for Stopping the Guide
  function promptStopConfirmation() {
    if (!running || document.querySelector(".swal2-container")) return;

    if (window.SoundManager && typeof window.SoundManager.playPop === "function") {
      window.SoundManager.playPop();
    }

    paused = true;

    if (typeof window.Swal === "undefined") {
      if (window.confirm("Stop the guided tour?")) {
        paused = false;
        stop();
      } else {
        paused = false;
      }
      return;
    }

    window.Swal.fire({
      title: "Stop the tour?",
      text: "Are you sure you want to stop the guided walkthrough?",
      icon: "warning",
      iconColor: "#ef4444",
      showCancelButton: true,
      confirmButtonText: "Yes, stop tour",
      cancelButtonText: "Keep watching",
      reverseButtons: true,
      focusCancel: true,
      allowOutsideClick: false,
      allowEscapeKey: true,
      customClass: {
        container: "ket-swal-container",
        popup: "ket-swal-popup",
        title: "ket-swal-title",
        htmlContainer: "ket-swal-text",
        confirmButton: "ket-swal-btn ket-swal-confirm-danger",
        cancelButton: "ket-swal-btn ket-swal-cancel",
        actions: "ket-swal-actions"
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        if (window.SoundManager && typeof window.SoundManager.playClose === "function") {
          window.SoundManager.playClose();
        }
        paused = false;
        stop();
      } else {
        paused = false;
      }
    });
  }

  function frame(now) {
    if (!running) return;

    if (paused) {
      last = now;
      requestAnimationFrame(frame);
      return;
    }

    if (!last) last = now;
    const dt = Math.min(now - last, 100);
    last = now;
    clock += dt;

    if (move) {
      const u = Math.min((clock - move.t0) / move.dur, 1);
      // Quintic minimum-jerk trajectory (smooth human-like acceleration & deceleration)
      const p = 10 * Math.pow(u, 3) - 15 * Math.pow(u, 4) + 6 * Math.pow(u, 5);
      const to = move.to();
      const base = {
        x: move.from.x + (to.x - move.from.x) * p,
        y: move.from.y + (to.y - move.from.y) * p
      };

      // Asymmetric bow curve
      const bow = Math.sin(Math.PI * Math.pow(u, move.skew)) * move.b1 + Math.sin(2 * Math.PI * u) * move.b2;
      goal.x = base.x + move.nx * bow;
      goal.y = base.y + move.ny * bow;

      if (u >= 1) {
        goal.x = to.x;
        goal.y = to.y;
        const done = move.done;
        move = null;
        done();
      }
    } else if (rest) {
      const target = rest.fn();
      goal.x = target.x;
      goal.y = target.y;
    }

    // Numerical spring integration
    const hops = Math.ceil(dt / 12);
    const h = dt / hops / 1000;
    for (let i = 0; i < hops; i++) {
      shown.vx += (SPRING * (goal.x - shown.x) - DAMPING * shown.vx) * h;
      shown.vy += (SPRING * (goal.y - shown.y) - DAMPING * shown.vy) * h;
      shown.x += shown.vx * h;
      shown.y += shown.vy * h;
    }

    // Natural resting hand tremor (decays to 0 when typing)
    tremor += ((typing ? 0 : 1) - tremor) * Math.min(dt / 280, 1);
    const x = shown.x + (Math.sin(clock / 830 + 1.3) * 1.5 + Math.sin(clock / 310 + 4.1) * 0.6 + Math.sin(clock / 127) * 0.22) * tremor;
    const y = shown.y + (Math.cos(clock / 1010 + 0.4) * 1.3 + Math.sin(clock / 370 + 2.2) * 0.55 + Math.cos(clock / 141 + 5) * 0.2) * tremor;

    root.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;

    for (let i = waiters.length - 1; i >= 0; i--) {
      if (waiters[i].at <= clock) {
        waiters.splice(i, 1)[0].done();
      }
    }

    requestAnimationFrame(frame);
  }

  const sleep = (ms) => new Promise(done => waiters.push({ at: clock + ms, done }));

  function glide(to, dur) {
    return new Promise(done => {
      const from = { x: goal.x, y: goal.y };
      const target = to();
      const dx = target.x - from.x;
      const dy = target.y - from.y;
      const dist = Math.hypot(dx, dy) || 1;
      const b1 = Math.min(dist * rand(0.08, 0.28), 64) * (Math.random() < 0.5 ? -1 : 1);
      const b2 = Math.random() < 0.3 ? -b1 * rand(0.3, 0.8) : b1 * rand(0.4, 1.1);
      move = { from, to, t0: clock, dur, skew: rand(0.72, 0.94), nx: -dy / dist, ny: dx / dist, b1, b2, done };
    });
  }

  async function moveTo(to, opts = {}) {
    const off = { x: rand(-2, 2), y: rand(-1, 1) };
    const aim = opts.direct ? to : () => {
      const t = to();
      return { x: t.x + off.x, y: t.y + off.y };
    };

    const target = aim();
    const dx = target.x - goal.x;
    const dy = target.y - goal.y;
    const dist = Math.hypot(dx, dy) || 1;
    const dur = (opts.dur || clamp(210 + Math.sqrt(dist) * 25, 330, 950)) * rand(0.9, 1.12);
    const roll = Math.random();

    if (opts.direct || dist < 150 || roll > 0.65) {
      return glide(aim, dur);
    }

    // Human over/undershoot with slight correction
    const miss = clamp(dist * rand(0.025, 0.05), 5, 20) * (roll < 0.4 ? 1 : -1);
    const drift = rand(-0.4, 0.4) * miss;
    const ox = (dx / dist) * miss - (dy / dist) * drift;
    const oy = (dy / dist) * miss + (dx / dist) * drift;

    await glide(() => {
      const t = aim();
      return { x: t.x + ox, y: t.y + oy };
    }, dur);

    await sleep(rand(40, 100));
    await glide(aim, rand(130, 220));
  }

  function visible(el) {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    if (!r.width || r.top < -10 || r.bottom > window.innerHeight + 10) return false;
    return true;
  }

  function anchor(el, at) {
    return () => {
      const r = el.getBoundingClientRect();
      let targetX = r.left + r.width / 2;
      let targetY = r.top + r.height / 2;

      if (at === "above") {
        targetX = r.left + Math.min(32, r.width * 0.35);
        targetY = Math.max(16, r.top - 18);
      } else if (at === "below") {
        targetX = r.left + r.width / 2;
        targetY = r.bottom + 8;
      } else if (at === "top") {
        targetX = r.left + r.width * 0.5;
        targetY = r.top + Math.min(36, r.height * 0.2);
      } else if (at === "right") {
        targetX = r.right + 8;
        targetY = r.top + r.height / 2;
      }

      return {
        x: clamp(targetX, 20, window.innerWidth - 28),
        y: clamp(targetY, 20, window.innerHeight - 30)
      };
    };
  }

  function openSpace(fx, fy) {
    return () => ({
      x: clamp(window.innerWidth * fx, 24, window.innerWidth - 30),
      y: clamp(window.innerHeight * fy, 40, window.innerHeight - 60)
    });
  }

  function setHover(el) {
    if (hovered) hovered.classList.remove("gc-hover");
    hovered = el || null;
    if (hovered) {
      hovered.classList.add("gc-hover");
      if (window.SoundManager && typeof window.SoundManager.playHover === "function") {
        window.SoundManager.playHover();
      }
    }
  }

  function compose(text) {
    const parts = graphemes
      ? Array.from(graphemes.segment(text), s => s.segment)
      : Array.from(text);

    const chars = parts.map(part => {
      const span = document.createElement("span");
      span.className = "gc-ch";
      span.textContent = part;
      return span;
    });

    measure.replaceChildren(...chars);
    const boxes = chars.map(span => ({
      right: span.offsetLeft + span.offsetWidth,
      top: span.offsetTop,
      bottom: span.offsetTop + span.offsetHeight
    }));

    return {
      parts,
      chars,
      boxes,
      width: Math.ceil(measure.getBoundingClientRect().width),
      height: measure.offsetHeight
    };
  }

  function place(point, layout, prefer) {
    const w = Math.max(nameEl.offsetWidth, layout.width) + 24;
    const h = nameEl.offsetHeight + layout.height + 12;

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    // Check vertical positioning
    const fitsBelow = point.y + 18 + h + 12 <= screenH;
    const fitsAbove = point.y - h - 14 >= 10;
    const isUp = fitsAbove && (prefer === "above" || !fitsBelow);

    // Calculate desired vertical screen position
    let idealScreenY = isUp ? (point.y - h - 6) : (point.y + 18);
    let clampedScreenY = clamp(idealScreenY, 12, screenH - h - 12);
    let offsetY = clampedScreenY - point.y;

    // Calculate desired horizontal screen position
    let idealScreenX = point.x + 16;
    // If placing on the right overflows screen right edge:
    if (idealScreenX + w > screenW - 14) {
      // Try placing to the left of the pointer arrow
      idealScreenX = point.x - w - 6;
    }
    // Strictly clamp within viewport so the bubble NEVER overflows left or right edge!
    let clampedScreenX = clamp(idealScreenX, 14, Math.max(14, screenW - w - 14));
    let offsetX = clampedScreenX - point.x;

    const isLeft = offsetX < 0;
    root.classList.toggle("is-up", isUp);
    root.classList.toggle("is-left", isLeft);

    // Apply exact boundary-clamped transform
    tag.style.transform = `translate3d(${offsetX.toFixed(1)}px, ${offsetY.toFixed(1)}px, 0)`;
  }

  async function type(layout) {
    inner.style.width = `${layout.width}px`;
    inner.replaceChildren(...layout.chars, caret);
    tag.classList.add("is-talking", "is-typing");
    typing = true;

    const pace = rand(0.85, 1.2);
    let width = 0;

    for (let i = 0; i < layout.chars.length; i++) {
      const box = layout.boxes[i];
      const part = layout.parts[i];
      layout.chars[i].classList.add("is-on");
      width = Math.max(width, box.right);

      clip.style.width = `${Math.ceil(width)}px`;
      clip.style.height = `${Math.ceil(box.bottom)}px`;
      caret.style.transform = `translate3d(${box.right}px, ${box.top}px, 0)`;

      let delay = (part === " " ? 18 : 28) * rand(0.7, 1.3) * pace;
      if (",;".includes(part)) delay += 120;
      if (".!?".includes(part)) delay += 240;

      await sleep(delay);
    }

    typing = false;
    tag.classList.remove("is-typing");
  }

  function hush() {
    clip.style.width = "0px";
    clip.style.height = "0px";
    tag.classList.remove("is-talking", "is-typing");
  }

  async function say(step) {
    if (typeof step.skip === "function" && step.skip()) {
      return;
    }

    if (typeof step.before === "function") {
      await step.before();
    }

    const rawEls = step.els ? step.els() : [];
    // Ensure element is scrolled smoothly into viewport if needed
    if (rawEls.length && rawEls[0] && typeof rawEls[0].scrollIntoView === "function") {
      const r = rawEls[0].getBoundingClientRect();
      if (r.top < 40 || r.bottom > window.innerHeight - 40) {
        rawEls[0].scrollIntoView({ behavior: "smooth", block: "center" });
        await sleep(280);
      }
    }

    const els = step.els ? step.els().filter(visible) : [];
    if (!els.length && !step.free) return;

    const points = els.length
      ? els.map(el => anchor(el, step.at))
      : [openSpace(rand(0.44, 0.56), rand(0.42, 0.52))];

    const layout = compose(step.text);
    hush();
    place(points[0](), layout, els.length ? step.at : null);
    setHover(els[0]);

    await moveTo(points[0]);
    await sleep(rand(60, 140));
    await type(layout);

    if (points.length > 1) {
      await sleep(rand(550, 800));
      for (let i = 1; i < points.length; i++) {
        await sleep(rand(90, 190));
        setHover(els[i]);
        await moveTo(points[i], { dur: rand(240, 340) });
      }
      await sleep(rand(550, 750));
    } else {
      await sleep((850 + layout.chars.length * 20) * rand(0.95, 1.15));
    }

    setHover(null);

    if (typeof step.after === "function") {
      await step.after();
    }
  }

  function showInvite() {
    if (window.PortfolioFab && typeof window.PortfolioFab.showInvite === "function") {
      window.PortfolioFab.showInvite();
      return;
    }
    if (!ensureDOMElements() || !isSupported()) return;
    if (store.get(STORAGE_SEEN_KEY) === "1") {
      showPrompt();
      return;
    }
    if (invite) {
      invite.classList.add("is-visible");
      if (window.SoundManager && typeof window.SoundManager.playPop === "function") {
        window.SoundManager.playPop();
      }
    }
  }

  function hideInvite() {
    if (window.PortfolioFab && typeof window.PortfolioFab.hideInvite === "function") {
      window.PortfolioFab.hideInvite();
    }
    if (!invite) return;
    invite.classList.remove("is-visible");
  }

  function showPrompt() {
    if (window.PortfolioFab && typeof window.PortfolioFab.restoreAfterTour === "function") {
      window.PortfolioFab.restoreAfterTour();
      return;
    }
    if (!ensureDOMElements() || !isSupported()) return;
    if (prompt && store.get(STORAGE_PROMPT_KEY) !== "off") {
      prompt.classList.add("is-on");
    }
  }

  async function run() {
    await sleep(400);
    root.classList.add("is-here");
    if (clickGuard) clickGuard.classList.add("is-active");
    if (stopWrap) stopWrap.classList.add("is-visible");
    store.set(STORAGE_SEEN_KEY, "1");

    for (const step of steps) {
      if (!running) break;
      await say(step);
    }

    if (!running) return;

    // Tour finished: smoothly exit off the right edge of viewport
    hush();
    await sleep(rand(300, 500));
    closeMoreDropdown();
    if (isMobile() && window.NavigationManager && document.getElementById("mobile-drawer")?.classList.contains("is-open")) {
      window.NavigationManager.closeDrawer();
      await sleep(250);
    }
    const exit = { x: window.innerWidth + 90, y: window.innerHeight * rand(0.25, 0.45) };
    await moveTo(() => exit, { direct: true });
    root.classList.remove("is-here");

    unlockUserInteractions();
    if (clickGuard) clickGuard.classList.remove("is-active");
    if (stopWrap) stopWrap.classList.remove("is-visible");

    await sleep(500);
    running = false;
    if (window.PortfolioFab && typeof window.PortfolioFab.restoreAfterTour === "function") {
      window.PortfolioFab.restoreAfterTour();
    }
    showPrompt();
  }

  function start() {
    if (!ensureDOMElements() || !isSupported()) return;
    if (running) return;

    if (window.PortfolioFab && typeof window.PortfolioFab.hideAllForTour === "function") {
      window.PortfolioFab.hideAllForTour();
    }

    hideInvite();
    if (prompt) prompt.classList.remove("is-on");

    if (window.scrollY > 0) {
      window.scrollTo(0, 0);
    }

    running = true;
    paused = false;
    move = rest = null;
    goal.x = shown.x = window.innerWidth + 40;
    goal.y = shown.y = window.innerHeight * rand(0.4, 0.6);
    shown.vx = shown.vy = 0;
    root.classList.remove("is-up", "is-left");
    root.style.transform = `translate3d(${goal.x}px, ${goal.y}px, 0)`;

    // Lock all interactions & activate click barrier & show dedicated stop button
    lockUserInteractions();
    if (clickGuard) clickGuard.classList.add("is-active");
    if (stopWrap) stopWrap.classList.add("is-visible");

    requestAnimationFrame(now => {
      last = now;
      frame(now);
    });

    run();
  }

  function stop() {
    running = false;
    paused = false;
    waiters.length = 0;

    // Unlock all interactions & deactivate click barrier & hide dedicated stop button
    unlockUserInteractions();
    if (clickGuard) clickGuard.classList.remove("is-active");
    if (stopWrap) stopWrap.classList.remove("is-visible");

    if (hovered) hovered.classList.remove("gc-hover");
    hovered = null;
    hush();
    if (root) root.classList.remove("is-here");
    if (isMobile() && window.NavigationManager && document.getElementById("mobile-drawer")?.classList.contains("is-open")) {
      window.NavigationManager.closeDrawer();
    }
    closeMoreDropdown();
    if (window.PortfolioFab && typeof window.PortfolioFab.restoreAfterTour === "function") {
      window.PortfolioFab.restoreAfterTour();
    }
    showPrompt();
  }

  function init() {
    if (initialized) return;
    initialized = true;

    if (!isSupported()) return;

    ensureDOMElements();

    // If PortfolioFab is present, PortfolioFab coordinates the visitor invitation and tour queries
    if (window.PortfolioFab) {
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const hasTourParam = urlParams.has("tour");
    const hasAskParam = urlParams.has("ask") || urlParams.has("invite");
    const userChoice = store.get(STORAGE_CHOICE_KEY);

    const triggerTour = () => {
      if (hasTourParam) {
        setTimeout(() => {
          start();
        }, 500);
      } else if (hasAskParam || !userChoice) {
        setTimeout(() => {
          showInvite();
        }, 450);
      } else {
        showPrompt();
      }
    };

    // If preloader is already finished, present invitation directly
    if (document.body.classList.contains("page-ready")) {
      triggerTour();
    } else {
      // Wait for preloader stickman runner to complete
      window.addEventListener("preloader:complete", () => {
        triggerTour();
      }, { once: true });
    }
  }

  return {
    init,
    start,
    stop,
    confirmStop: promptStopConfirmation,
    showInvite,
    hideInvite,
    showPrompt,
    isRunning: () => running
  };
})();

if (typeof window !== "undefined") {
  window.GuideManager = GuideManager;
}
