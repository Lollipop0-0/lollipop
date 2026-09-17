/**
 * Karl Evan Tabunda - Contact Form Module
 * Implements client-side form validation and explicit mailto action.
 * Strictly adheres to truthful frontend UX: never fabricates server receipt.
 */

const ContactManager = (() => {
  let form = null;
  let nameInput = null;
  let emailInput = null;
  let messageInput = null;
  let statusArea = null;

  const TARGET_EMAIL = "tabunda.karlevan@ncst.edu.ph";

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
   * Validate entire form
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
   * Handle form submission
   */
  function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) {
      // Focus first error field
      const firstError = form.querySelector(".has-error");
      if (firstError) firstError.focus();
      return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(
      `Hello Karl,\n\n${message}\n\n---\nSender: ${name}\nEmail: ${email}`
    );

    const mailtoUrl = `mailto:${TARGET_EMAIL}?subject=${subject}&body=${body}`;

    // Display clear, honest instructions to user
    if (statusArea) {
      statusArea.innerHTML = `
        <div class="contact-notice contact-notice-success" role="status">
          <div class="contact-notice-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </div>
          <div class="contact-notice-content">
            <p><strong>Launching your email client...</strong></p>
            <p>Since this is a static site without a backend, your default mail client is opening with your message pre-addressed to <code>${TARGET_EMAIL}</code>.</p>
            <p class="contact-notice-manual">If your email client didn't open automatically, <a href="${mailtoUrl}" class="direct-mail-btn">click here to send email</a> or copy the address directly.</p>
          </div>
        </div>
      `;
    }

    // Trigger mailto link
    window.location.href = mailtoUrl;
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
