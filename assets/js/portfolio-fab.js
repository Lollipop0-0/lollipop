/**
 * Karl Evan Tabunda - Floating Action Button (FAB) Hub & Visitor Invitation Module
 * Connects the existing Tour Guide walkthrough and the new Portfolio Chatbot
 * through a unified, accessible floating hub in the bottom-right corner.
 */

const PortfolioFab = (() => {
  const STORAGE_DISMISSED_KEY = "ket_fab_invite_dismissed";

  let wrapEl = null;
  let fabBtn = null;
  let menuEl = null;
  let inviteCardEl = null;
  let isMenuOpen = false;
  let isInviteVisible = false;
  let initialized = false;

  const playSound = (type) => {
    if (!window.SoundManager) return;
    try {
      if (type === "pop" && typeof window.SoundManager.playPop === "function") {
        window.SoundManager.playPop();
      } else if (type === "close" && typeof window.SoundManager.playClose === "function") {
        window.SoundManager.playClose();
      } else if (type === "tick" && typeof window.SoundManager.playTick === "function") {
        window.SoundManager.playTick();
      }
    } catch (e) {}
  };

  const isInviteDismissed = () => {
    try {
      return localStorage.getItem(STORAGE_DISMISSED_KEY) === "1" ||
             sessionStorage.getItem(STORAGE_DISMISSED_KEY) === "1";
    } catch (e) {
      return false;
    }
  };

  const markInviteDismissed = () => {
    try {
      localStorage.setItem(STORAGE_DISMISSED_KEY, "1");
      sessionStorage.setItem(STORAGE_DISMISSED_KEY, "1");
    } catch (e) {}
    if (fabBtn) {
      fabBtn.classList.add("has-dismissed");
    }
  };

  function buildDOM() {
    if (wrapEl) return;

    wrapEl = document.createElement("div");
    wrapEl.id = "portfolioFabWrap";

    wrapEl.innerHTML = `
      <!-- Visitor Invitation / Notification Card -->
      <div id="visitorInviteNotification" class="visitor-invite-card" role="region" aria-label="Welcome invitation">
        <div class="visitor-invite-header">
          <span class="visitor-invite-badge">Welcome</span>
          <button type="button" class="visitor-invite-close" id="inviteCloseBtn" aria-label="Dismiss welcome invitation">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <h3 class="visitor-invite-title">Hey! 👋 Welcome to my portfolio.</h3>
        <p class="visitor-invite-copy">
          Want me to show you around?<br>
          I can take you on a quick tour, or you can talk to me and ask anything you'd like to know.
        </p>
        <div class="visitor-invite-actions">
          <button type="button" class="visitor-invite-btn visitor-invite-btn-primary" id="inviteTourBtn">
            <span>🧭</span>
            <span>Tour My Portfolio</span>
          </button>
          <button type="button" class="visitor-invite-btn visitor-invite-btn-secondary" id="inviteChatBtn">
            <span>🤖</span>
            <span>Chat With Me</span>
          </button>
        </div>
      </div>

      <!-- Expanded Action Menu -->
      <nav id="fabActionMenu" class="fab-action-menu" aria-label="Quick actions" role="menu">
        <button type="button" class="fab-action-btn" id="fabMenuTourBtn" role="menuitem">
          <span class="fab-action-icon">🧭</span>
          <span class="fab-action-label">Tour My Portfolio</span>
        </button>
        <button type="button" class="fab-action-btn" id="fabMenuChatBtn" role="menuitem">
          <span class="fab-action-icon">🤖</span>
          <span class="fab-action-label">Chat With Me</span>
        </button>
      </nav>

      <!-- Main Floating Action Button (FAB) -->
      <button
        type="button"
        id="portfolioFab"
        class="portfolio-fab"
        aria-label="Interactive guide and assistant menu"
        aria-expanded="false"
        aria-haspopup="true"
        title="Interactive Guide & Chat"
      >
        <div class="fab-icon-wrap" aria-hidden="true">
          <!-- Sparkles Icon (Open state) -->
          <svg class="fab-icon-open" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2l2.4 5 5 2.4-5 2.4-2.4 5-2.4-5-5-2.4 5-2.4z"></path>
            <path d="M19 15l1.2 2.5 2.5 1.2-2.5 1.2-1.2 2.5-1.2-2.5-2.5-1.2 2.5-1.2z"></path>
          </svg>
          <!-- Close Icon (Collapsed state) -->
          <svg class="fab-icon-close" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
        <span class="fab-badge-dot" aria-hidden="true"></span>
      </button>
    `;

    document.body.appendChild(wrapEl);

    fabBtn = wrapEl.querySelector("#portfolioFab");
    menuEl = wrapEl.querySelector("#fabActionMenu");
    inviteCardEl = wrapEl.querySelector("#visitorInviteNotification");

    if (isInviteDismissed()) {
      fabBtn.classList.add("has-dismissed");
    }

    bindEvents();
  }

  function bindEvents() {
    // 1. FAB Toggle
    fabBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      // If chat is open, clicking FAB closes chat
      if (window.PortfolioChat && window.PortfolioChat.isOpen()) {
        window.PortfolioChat.close();
        return;
      }
      toggleMenu();
    });

    // 2. Action Menu Buttons
    const menuTourBtn = wrapEl.querySelector("#fabMenuTourBtn");
    menuTourBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeMenu();
      handleLaunchTour();
    });

    const menuChatBtn = wrapEl.querySelector("#fabMenuChatBtn");
    menuChatBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeMenu();
      handleLaunchChat();
    });

    // 3. Visitor Invitation Buttons
    const inviteTourBtn = wrapEl.querySelector("#inviteTourBtn");
    inviteTourBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dismissInvite();
      handleLaunchTour();
    });

    const inviteChatBtn = wrapEl.querySelector("#inviteChatBtn");
    inviteChatBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dismissInvite();
      handleLaunchChat();
    });

    const inviteCloseBtn = wrapEl.querySelector("#inviteCloseBtn");
    inviteCloseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      playSound("close");
      dismissInvite();
    });

    // 4. Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (isMenuOpen && !wrapEl.contains(e.target)) {
        closeMenu();
      }
    });

    // 5. Close menu on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (isMenuOpen) {
          closeMenu();
        } else if (isInviteVisible) {
          dismissInvite();
        }
      }
    });
  }

  function handleLaunchTour() {
    playSound("pop");
    // If user is not on index.html (e.g. projects.html or about.html), redirect with ?tour query
    const path = window.location.pathname;
    const isHomePage = path.endsWith("index.html") || path.endsWith("/") || path === "" || path.endsWith("/lollipop") || path.endsWith("/lollipop/");

    if (!isHomePage) {
      window.location.href = "index.html?tour=1";
      return;
    }

    if (window.GuideManager && typeof window.GuideManager.start === "function") {
      window.GuideManager.start();
    }
  }

  function handleLaunchChat() {
    playSound("pop");
    if (window.PortfolioChat) {
      window.PortfolioChat.open();
    }
  }

  function openMenu() {
    if (isMenuOpen) return;
    hideInvite();
    isMenuOpen = true;
    menuEl.classList.add("is-open");
    fabBtn.classList.add("is-active");
    fabBtn.setAttribute("aria-expanded", "true");
    playSound("pop");
  }

  function closeMenu() {
    if (!isMenuOpen) return;
    isMenuOpen = false;
    menuEl.classList.remove("is-open");
    fabBtn.classList.remove("is-active");
    fabBtn.setAttribute("aria-expanded", "false");
    playSound("close");
  }

  function toggleMenu() {
    if (isMenuOpen) closeMenu();
    else openMenu();
  }

  function showInvite() {
    if (!inviteCardEl || isInviteDismissed() || isInviteVisible) return;
    // Don't show invite if tour is currently running
    if (window.GuideManager && typeof window.GuideManager.isRunning === "function" && window.GuideManager.isRunning()) {
      return;
    }
    isInviteVisible = true;
    inviteCardEl.classList.add("is-visible");
    playSound("pop");
  }

  function hideInvite() {
    if (!inviteCardEl || !isInviteVisible) return;
    isInviteVisible = false;
    inviteCardEl.classList.remove("is-visible");
  }

  function dismissInvite() {
    hideInvite();
    markInviteDismissed();
  }

  function onChatClosed() {
    if (fabBtn) {
      fabBtn.focus();
    }
  }

  function hideAllForTour() {
    if (wrapEl) {
      wrapEl.style.display = "none";
    }
    closeMenu();
    hideInvite();
    if (window.PortfolioChat && window.PortfolioChat.isOpen()) {
      window.PortfolioChat.close();
    }
  }

  function restoreAfterTour() {
    if (wrapEl) {
      wrapEl.style.display = "flex";
    }
  }

  function init() {
    if (initialized) return;
    initialized = true;

    buildDOM();

    // Check query params for forced tour or invite
    const urlParams = new URLSearchParams(window.location.search);
    const hasTourParam = urlParams.has("tour");
    const hasInviteParam = urlParams.has("ask") || urlParams.has("invite");

    const scheduleGreeting = () => {
      if (hasTourParam) {
        // Guided tour launched via URL param
        setTimeout(() => {
          handleLaunchTour();
        }, 600);
      } else if (hasInviteParam || !isInviteDismissed()) {
        // Show friendly visitor invitation after short delay
        setTimeout(() => {
          showInvite();
        }, 700);
      }
    };

    if (document.body.classList.contains("page-ready")) {
      scheduleGreeting();
    } else {
      window.addEventListener("preloader:complete", scheduleGreeting, { once: true });
    }
  }

  return {
    init,
    openMenu,
    closeMenu,
    toggleMenu,
    showInvite,
    hideInvite,
    dismissInvite,
    onChatClosed,
    hideAllForTour,
    restoreAfterTour,
    isMenuOpen: () => isMenuOpen
  };
})();

if (typeof window !== "undefined") {
  window.PortfolioFab = PortfolioFab;
}
