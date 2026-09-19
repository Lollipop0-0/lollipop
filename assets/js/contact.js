/**
 * Karl Evan Tabunda - Contact Form Module
 * Directly delivers user inquiries to tabunda.karlevan@ncst.edu.ph via FormSubmit AJAX service.
 * Includes client-side input validation, loading states, success confirmation,
 * and resilient mailto fallback if network is unreachable.
 */

const ContactManager = (() => {
  let form = null;
  let nameInput = null;
  let emailInput = null;
  let messageInput = null;
  let submitBtn = null;
  let statusArea = null;

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
    if (!nameInput.value.trim()) {
      setFieldError(nameInput, "Please enter your name.");
      isValid = false;
    } else if (nameInput.value.trim().length < 2) {
      setFieldError(nameInput, "Name must be at least 2 characters.");
      isValid = false;
    } else {
      clearFieldError(nameInput);
    }

    // Validate Email
    if (!emailInput.value.trim()) {
      setFieldError(emailInput, "Please enter your email address.");
      isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      setFieldError(emailInput, "Please enter a valid email address.");
      isValid = false;
    } else {
      clearFieldError(emailInput);
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      setFieldError(messageInput, "Please enter your message.");
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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
        <span>Send Message</span>
      `;
    }
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
            <div class="contact-notice contact-notice-success" role="status">
              <div class="contact-notice-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div class="contact-notice-content">
                <p><strong>Message sent directly to Karl Evan!</strong></p>
                <p>Thank you, <strong>${escapeHtml(name)}</strong>. Your message has been delivered to <code>${TARGET_EMAIL}</code>. I'll get back to you shortly.</p>
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
          <div class="contact-notice contact-notice-error" role="status">
            <div class="contact-notice-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div class="contact-notice-content">
              <p><strong>${escapeHtml(errorTitle)}</strong></p>
              <p>${errorExplanation}</p>
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
   * Initialize contact form events
   */
  function init() {
    form = document.getElementById("contact-form");
    nameInput = document.getElementById("contact-name");
    emailInput = document.getElementById("contact-email");
    messageInput = document.getElementById("contact-message");
    statusArea = document.getElementById("contact-status");
    submitBtn = form ? form.querySelector('button[type="submit"]') : null;

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
    validate
  };
})();

if (typeof window !== "undefined") {
  window.ContactManager = ContactManager;
}
