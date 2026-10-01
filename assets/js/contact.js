/**
 * Karl Evan Tabunda - Contact Form & Docked Modal Module
 * Directly delivers user inquiries to tabunda.karlevan@ncst.edu.ph via FormSubmit AJAX service.
 * Includes docked bottom-right interactive popup window, minimize/restore,
 * client-side input validation, loading states, success confirmation,
 * and resilient mailto fallback if network is unreachable.
 */

const ContactManager = (() => {
  let form = null;
  let nameInput = null;
  let emailInput = null;
  let messageInput = null;
  let submitBtn = null;
  let statusArea = null;

  // Modal elements
  let modal = null;
  let openBtn = null;
  let closeBtn = null;
  let minimizeBtn = null;
  let modalHeader = null;

  const TARGET_EMAIL = "tabunda.karlevan@ncst.edu.ph";
  const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${TARGET_EMAIL}`;

  /**
   * Validate standard email pattern
   */
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  /**
   * Clear error state from an input
   */
  function clearFieldError(input) {
    input.classList.remove("has-error");
    input.removeAttribute("aria-invalid");
    const errorEl = document.getElementById(`${input.id}-error`);
    if (errorEl) {
      errorEl.textContent = "";
      errorEl.style.display = "none";
    }
  }

  /**
   * Set error state on an input
   */
  function setFieldError(input, message) {
    input.classList.add("has-error");
    input.setAttribute("aria-invalid", "true");
    const errorEl = document.getElementById(`${input.id}-error`);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = "block";
    }
  }

  /**
   * Validate entire form inputs
   */
  function validate() {
    let isValid = true;

    // Validate Name
    if (!nameInput || !nameInput.value.trim()) {
      if (nameInput) setFieldError(nameInput, "Please enter your name.");
      isValid = false;
    } else if (nameInput.value.trim().length < 2) {
      setFieldError(nameInput, "Name must be at least 2 characters.");
      isValid = false;
    } else {
      clearFieldError(nameInput);
    }

    // Validate Email
    if (!emailInput || !emailInput.value.trim()) {
      if (emailInput) setFieldError(emailInput, "Please enter your email address.");
      isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      setFieldError(emailInput, "Please enter a valid email address.");
      isValid = false;
    } else {
      clearFieldError(emailInput);
    }

    // Validate Message
    if (!messageInput || !messageInput.value.trim()) {
      if (messageInput) setFieldError(messageInput, "Please enter your message.");
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      setFieldError(messageInput, "Message should be at least 10 characters.");
      isValid = false;
    } else {
      clearFieldError(messageInput);
    }

    return isValid;
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
   * Set submit button loading state
   */
  function setLoading(isLoading) {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    if (isLoading) {
      submitBtn.innerHTML = `
        <span class="matrix-spinner" style="width: 14px; height: 14px; border-width: 2px;" aria-hidden="true"></span>
        <span>Sending message...</span>
      `;
    } else {
      submitBtn.innerHTML = `
        <span>SEND MESSAGE</span>
        <span class="btn-arrow" aria-hidden="true">→</span>
      `;
    }
  }

  /**
   * Open the docked modal
   */
  function openModal() {
    if (!modal) {
      modal = document.getElementById("contact-modal");
    }
    if (!modal) return;

    modal.style.display = "flex";
    modal.classList.remove("is-minimized");
    if (nameInput) {
      setTimeout(() => {
        nameInput.focus();
      }, 60);
    }
  }

  /**
   * Close the docked modal
   */
  function closeModal() {
    if (!modal) {
      modal = document.getElementById("contact-modal");
    }
    if (!modal) return;
    modal.style.display = "none";
  }

  /**
   * Toggle minimize state of the docked modal
   */
  function toggleMinimize() {
    if (!modal) {
      modal = document.getElementById("contact-modal");
    }
    if (!modal) return;
    modal.classList.toggle("is-minimized");
  }

  /**
   * Handle form submission — directly delivers message to TARGET_EMAIL
   */
  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) {
      const firstError = form.querySelector(".has-error");
      if (firstError) firstError.focus();
      return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    setLoading(true);

    if (statusArea) {
      statusArea.innerHTML = "";
    }

    let errorTitle = "Direct delivery could not be completed online.";
    let errorExplanation = `Please <a href="#" class="direct-mail-btn fallback-link">click here to send via your email client</a> directly to <code>${TARGET_EMAIL}</code>.`;

    try {
      const response = await fetch(FORMSUBMIT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message,
          _subject: `New Portfolio Inquiry from ${name}`,
          _template: "table",
          _captcha: "false"
        })
      });

      const statusCode = response.status;
      const result = await response.json().catch(() => ({}));

      if (response.ok && (result.success === "true" || result.success === true || result.message)) {
        // Success: Message sent directly to Karl Evan's email
        if (statusArea) {
          statusArea.innerHTML = `
            <div class="contact-notice contact-notice-success" role="status" style="margin-top: 14px; padding: 12px 14px; border-radius: 8px; background: rgba(34, 197, 94, 0.12); border: 1px solid rgba(34, 197, 94, 0.3); color: var(--primary); font-size: 13px; display: flex; gap: 10px; align-items: flex-start;">
              <div class="contact-notice-icon" style="color: #22c55e; flex-shrink: 0; margin-top: 2px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div class="contact-notice-content">
                <p style="margin: 0; font-weight: 600;">Message sent directly to Karl Evan!</p>
                <p style="margin: 4px 0 0 0; color: var(--secondary); font-size: 12px;">Thank you, <strong>${escapeHtml(name)}</strong>. Your message has been delivered to <code>${TARGET_EMAIL}</code>.</p>
              </div>
            </div>
          `;
        }
        form.reset();
        return;
      }

      // Diagnose specific HTTP status code
      if (statusCode === 429) {
        errorTitle = "Rate limit reached (429)";
        errorExplanation = `Too many message attempts. Please wait a few moments or <a href="#" class="direct-mail-btn fallback-link">send directly via email</a>.`;
      } else if (statusCode === 400) {
        errorTitle = "Invalid request format (400)";
        errorExplanation = `The submission could not be processed. You can <a href="#" class="direct-mail-btn fallback-link">send directly via email</a>.`;
      } else if (statusCode >= 500) {
        errorTitle = `Service temporarily unavailable (${statusCode})`;
        errorExplanation = `The delivery service is experiencing downtime. Please <a href="#" class="direct-mail-btn fallback-link">send directly via email</a>.`;
      } else {
        errorTitle = `Unable to send message (${statusCode || "Client Error"})`;
      }

      throw new Error(result.message || `HTTP ${statusCode}`);
    } catch (err) {
      console.warn("Direct message delivery fallback engaged:", err.message);

      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(
        `Hello Karl,\n\n${message}\n\n---\nSender: ${name}\nEmail: ${email}`
      );
      const mailtoUrl = `mailto:${TARGET_EMAIL}?subject=${subject}&body=${body}`;

      if (statusArea) {
        statusArea.innerHTML = `
          <div class="contact-notice contact-notice-error" role="status" style="margin-top: 14px; padding: 12px 14px; border-radius: 8px; background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.3); color: var(--primary); font-size: 13px; display: flex; gap: 10px; align-items: flex-start;">
            <div class="contact-notice-icon" style="color: #ef4444; flex-shrink: 0; margin-top: 2px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div class="contact-notice-content">
              <p style="margin: 0; font-weight: 600;">${escapeHtml(errorTitle)}</p>
              <p style="margin: 4px 0 0 0; color: var(--secondary); font-size: 12px;">${errorExplanation}</p>
            </div>
          </div>
        `;

        const fallbackLink = statusArea.querySelector(".fallback-link");
        if (fallbackLink) {
          fallbackLink.setAttribute("href", mailtoUrl);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  /**
   * Initialize contact form and docked modal events
   */
  function init() {
    form = document.getElementById("contact-form");
    nameInput = document.getElementById("contact-name");
    emailInput = document.getElementById("contact-email");
    messageInput = document.getElementById("contact-message");
    statusArea = document.getElementById("contact-status");
    submitBtn = form ? form.querySelector('button[type="submit"]') : null;

    // Modal elements
    modal = document.getElementById("contact-modal");
    openBtn = document.getElementById("open-contact-modal-btn");
    closeBtn = document.getElementById("contact-modal-close-btn");
    minimizeBtn = document.getElementById("contact-modal-minimize-btn");
    modalHeader = document.getElementById("contact-modal-header");

    if (openBtn) {
      openBtn.addEventListener("click", openModal);
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeModal();
      });
    }

    if (minimizeBtn) {
      minimizeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleMinimize();
      });
    }

    if (modalHeader) {
      modalHeader.addEventListener("click", (e) => {
        if (e.target.closest(".contact-modal-controls")) return;
        toggleMinimize();
      });
    }

    // Global Escape key handler to close modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal && modal.style.display === "flex") {
        closeModal();
      }
    });

    if (!form) return;

    form.addEventListener("submit", handleSubmit);

    // Live validation clearing on input
    [nameInput, emailInput, messageInput].forEach(input => {
      if (input) {
        input.addEventListener("input", () => clearFieldError(input));
      }
    });
  }

  return {
    init,
    validate,
    open: openModal,
    close: closeModal,
    toggleMinimize
  };
})();

if (typeof window !== "undefined") {
  window.ContactManager = ContactManager;
}
