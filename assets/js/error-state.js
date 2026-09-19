/**
 * Karl Evan Tabunda - Reusable Error State & HTTP Status Module
 * 
 * Handles 4xx client errors, 5xx server errors, network connection failures,
 * and repository access states (public, private, not-found, rate-limited).
 * 
 * Adheres strictly to the portfolio's vanilla JavaScript architecture,
 * developer-oriented aesthetic, and token-based design system.
 */

const ErrorState = (() => {
  "use strict";

  // In-memory cache for checked repository statuses: { [repoUrl]: { status, statusCode, type, checkedAt } }
  const repoStatusMemoryCache = new Map();
  const STORAGE_KEY = "ke_repo_status_cache";
  const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes cache to strictly respect GitHub rate limits

  /**
   * Read persistent status cache from sessionStorage
   */
  function readSessionCache() {
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        const raw = window.sessionStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          const now = Date.now();
          // Filter expired items
          const valid = {};
          for (const [k, v] of Object.entries(parsed)) {
            if (v && v.checkedAt && now - v.checkedAt < CACHE_TTL_MS) {
              valid[k] = v;
              repoStatusMemoryCache.set(k, v);
            }
          }
          return valid;
        }
      }
    } catch (e) {
      // Ignore storage errors (private mode, quota exceeded)
    }
    return {};
  }

  /**
   * Save entry to persistent status cache
   */
  function writeSessionCache(repoUrl, statusData) {
    try {
      repoStatusMemoryCache.set(repoUrl, statusData);
      if (typeof window !== "undefined" && window.sessionStorage) {
        const current = readSessionCache();
        current[repoUrl] = statusData;
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      }
    } catch (e) {
      // Ignore storage errors
    }
  }

  // Pre-load sessionStorage cache
  if (typeof window !== "undefined") {
    readSessionCache();
  }

  /**
   * Standard error specifications by HTTP status code
   */
  function getErrorInfo(statusCode, context = {}) {
    const code = parseInt(statusCode, 10) || 0;

    switch (code) {
      case 400:
        return {
          statusCode: 400,
          type: "client",
          title: "Bad Request",
          message: context.message || "The request could not be processed due to invalid syntax.",
          badge: "400 BAD REQUEST"
        };
      case 401:
        return {
          statusCode: 401,
          type: "client",
          title: "Authentication Required",
          message: context.message || "Access requires authorization credentials or elevated permissions.",
          badge: "401 UNAUTHORIZED"
        };
      case 403:
        return {
          statusCode: 403,
          type: "private",
          title: "Private Repository",
          message: context.message || "This repository isn't publicly accessible.",
          badge: "403 ACCESS RESTRICTED"
        };
      case 404:
        return {
          statusCode: 404,
          type: "not-found",
          title: context.isPage ? "Page Not Found" : "Repository Not Found",
          message: context.isPage
            ? "The page you're looking for doesn't exist."
            : "This project may have been moved, renamed, or is not publicly available.",
          badge: context.isPage ? "404 NOT FOUND" : "404 NOT FOUND"
        };
      case 429:
        return {
          statusCode: 429,
          type: "rate-limit",
          title: "Rate Limited",
          message: context.message || "API rate limit reached. Please try again in a few moments.",
          badge: "429 RATE LIMITED"
        };
      case 500:
        return {
          statusCode: 500,
          type: "server",
          title: "Something Went Wrong",
          message: context.message || "The service couldn't complete this request right now.",
          badge: "500 SERVER ERROR"
        };
      case 502:
        return {
          statusCode: 502,
          type: "server",
          title: "Bad Gateway",
          message: context.message || "Upstream service response was invalid or unreachable.",
          badge: "502 BAD GATEWAY"
        };
      case 503:
        return {
          statusCode: 503,
          type: "server",
          title: "Service Unavailable",
          message: context.message || "The service is temporarily offline or undergoing maintenance.",
          badge: "503 SERVICE UNAVAILABLE"
        };
      case 504:
        return {
          statusCode: 504,
          type: "server",
          title: "Gateway Timeout",
          message: context.message || "The request timed out waiting for upstream server response.",
          badge: "504 GATEWAY TIMEOUT"
        };
      default:
        if (code >= 400 && code < 500) {
          return {
            statusCode: code,
            type: "client",
            title: "Client Error",
            message: context.message || `The request encountered an issue (HTTP ${code}).`,
            badge: `${code} CLIENT ERROR`
          };
        }
        if (code >= 500 && code < 600) {
          return {
            statusCode: code,
            type: "server",
            title: "Something Went Wrong",
            message: context.message || "The service couldn't complete this request right now.",
            badge: `${code} SERVER ERROR`
          };
        }
        // Network connection error / offline
        return {
          statusCode: 0,
          type: "network",
          title: "Connection Error",
          message: context.message || "Unable to establish a connection. Please check your network connection.",
          badge: "OFFLINE / NETWORK ERROR"
        };
    }
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
   * Return SVG icon based on error type
   */
  function getIconSvg(type) {
    switch (type) {
      case "private":
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`;
      case "not-found":
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
      case "rate-limit":
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
      case "network":
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path><path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>`;
      case "server":
      default:
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    }
  }

  /**
   * Render a card-style error state component (for inside sections such as GitHub matrix or component failures)
   * @param {Object} options
   * @returns {string} HTML markup
   */
  function renderCard(options = {}) {
    const statusCode = options.statusCode || 500;
    const info = getErrorInfo(statusCode, options);
    const title = options.title || info.title;
    const message = options.message || info.message;
    const type = options.type || info.type;
    const badge = options.badge || info.badge;
    const retryId = options.retryId || "";
    const retryText = options.retryText || "Retry";
    const showRetry = options.showRetry !== false;

    return `
      <div class="error-state-card error-type-${escapeHtml(type)}" role="alert" aria-live="polite">
        <div class="error-state-icon" aria-hidden="true">
          ${getIconSvg(type)}
        </div>
        <div class="error-state-body">
          <div class="error-state-header">
            <span class="error-state-badge">${escapeHtml(badge)}</span>
            <h4 class="error-state-title">${escapeHtml(title)}</h4>
          </div>
          <p class="error-state-message">${escapeHtml(message)}</p>
          ${showRetry ? `
            <div class="error-state-actions">
              <button type="button" class="btn btn-sm btn-outline error-retry-btn" ${retryId ? `data-retry-id="${escapeHtml(retryId)}"` : ""}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                <span>${escapeHtml(retryText)}</span>
              </button>
            </div>
          ` : ""}
        </div>
      </div>
    `;
  }

  /**
   * Render action element for project cards (Selected Work / Currently Building)
   * Returns either an active repository anchor or a disabled status pill
   * 
   * @param {Object} project - Project object from PORTFOLIO_DATA
   * @param {Object} statusOverride - Optional known status override
   * @returns {string} HTML markup
   */
  function renderAction(project, statusOverride = null) {
    if (!project) return "";
    const repoUrl = project.repository || "";

    // Determine status from override, project metadata, or cache
    const status = statusOverride || getRepositoryStatus(project);

    if (status.type === "private") {
      return `
        <button type="button" class="selected-repo-status status-private" disabled title="This repository isn't publicly accessible." aria-label="Private Repository">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          <span>Private Repository</span>
        </button>
      `;
    }

    if (status.type === "not-found") {
      return `
        <button type="button" class="selected-repo-status status-unavailable" disabled title="This project may have been moved, renamed, or is not publicly available." aria-label="Repository Unavailable">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <span>Repository Unavailable</span>
        </button>
      `;
    }

    if (status.type === "rate-limit") {
      return `
        <button type="button" class="selected-repo-status status-rate-limit" disabled title="Rate limit reached. Please try again later." aria-label="Rate Limited">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span>Rate Limited</span>
        </button>
      `;
    }

    // Default public link
    return `
      <a href="${escapeHtml(repoUrl)}" target="_blank" rel="noopener noreferrer" class="selected-repo-link" aria-label="GitHub repository for ${escapeHtml(project.title)}" title="GitHub Repository">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
      </a>
    `;
  }

  /**
   * Render action group inside ModalManager (Repository & Links area)
   * 
   * @param {Object} project
   * @param {Object} statusOverride
   * @returns {string} HTML markup
   */
  function renderModalAction(project, statusOverride = null) {
    if (!project) return "";
    const repoUrl = project.repository || "";
    const status = statusOverride || getRepositoryStatus(project);

    if (status.type === "private") {
      return `
        <div class="modal-repo-status-wrap">
          <div class="modal-btn-group">
            <span class="btn btn-sm btn-disabled btn-private-repo" title="This repository isn't publicly accessible." aria-label="Private Repository">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span>Private Repository</span>
            </span>
            ${project.liveUrl ? `
              <a href="${escapeHtml(project.liveUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
                <span>Live Demo</span>
              </a>
            ` : ""}
          </div>
          <p class="modal-repo-status-note">
            <span class="status-indicator-dot status-dot-warning" aria-hidden="true"></span>
            <span><strong>Private Repository:</strong> This repository isn't publicly accessible.</span>
          </p>
        </div>
      `;
    }

    if (status.type === "not-found") {
      return `
        <div class="modal-repo-status-wrap">
          <div class="modal-btn-group">
            <span class="btn btn-sm btn-disabled btn-unavailable-repo" title="This project may have been moved, renamed, or is not publicly available." aria-label="Repository Unavailable">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span>Repository Unavailable</span>
            </span>
            ${project.liveUrl ? `
              <a href="${escapeHtml(project.liveUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
                <span>Live Demo</span>
              </a>
            ` : ""}
          </div>
          <p class="modal-repo-status-note">
            <span class="status-indicator-dot status-dot-muted" aria-hidden="true"></span>
            <span><strong>Repository Not Found:</strong> This project may have been moved, renamed, or is not publicly available.</span>
          </p>
        </div>
      `;
    }

    // Default public repo link
    return `
      <div class="modal-btn-group">
        <a href="${escapeHtml(repoUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
          <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          <span>GitHub Repository</span>
        </a>
        ${project.liveUrl ? `
          <a href="${escapeHtml(project.liveUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
            <span>Live Demo</span>
          </a>
        ` : ""}
      </div>
    `;
  }

  /**
   * Determine repository status synchronously from metadata or cache
   * 
   * Strict Rule: Only describe a repository as definitively private if
   * available metadata confirms it, or if access was explicitly denied (403).
   * Do NOT classify 404 as private automatically.
   */
  function getRepositoryStatus(project) {
    if (!project) return { type: "public", statusCode: 200 };

    // 1. Explicit project metadata
    if (project.isPrivate === true || project.repoStatus === "private") {
      return { type: "private", statusCode: 403, confirmedByMeta: true };
    }

    if (project.repoStatus === "unavailable" || project.repoStatus === "not-found") {
      return { type: "not-found", statusCode: 404 };
    }

    // 2. Cached status from recent verification
    const repoUrl = project.repository;
    if (repoUrl && repoStatusMemoryCache.has(repoUrl)) {
      const cached = repoStatusMemoryCache.get(repoUrl);
      if (cached && Date.now() - cached.checkedAt < CACHE_TTL_MS) {
        return cached;
      }
    }

    return { type: "public", statusCode: 200 };
  }

  /**
   * Parse owner/repo slug from GitHub URL
   */
  function parseRepoSlug(url) {
    if (!url || typeof url !== "string") return null;
    const match = url.match(/github\.com\/([^/]+)\/([^/#?]+)/i);
    if (match && match[1] && match[2]) {
      return `${match[1]}/${match[2]}`;
    }
    return null;
  }

  /**
   * Asynchronously verify repository status against GitHub API
   * Handles 401, 403, 404, 429, 5xx, and network errors.
   * Caches results to prevent rate limit exhaustion.
   * 
   * @param {string} repoUrl
   * @param {Object} metadata
   * @returns {Promise<Object>}
   */
  async function checkRepository(repoUrl, metadata = {}) {
    // If metadata confirms private, respect immediately
    if (metadata.isPrivate === true || metadata.repoStatus === "private") {
      const res = { type: "private", statusCode: 403, confirmedByMeta: true, checkedAt: Date.now() };
      writeSessionCache(repoUrl, res);
      return res;
    }

    // Check memory / session cache
    if (repoStatusMemoryCache.has(repoUrl)) {
      const cached = repoStatusMemoryCache.get(repoUrl);
      if (cached && Date.now() - cached.checkedAt < CACHE_TTL_MS) {
        return cached;
      }
    }

    const slug = parseRepoSlug(repoUrl);
    if (!slug) {
      return { type: "public", statusCode: 200, checkedAt: Date.now() };
    }

    try {
      const response = await fetch(`https://api.github.com/repos/${slug}`, {
        method: "GET",
        headers: {
          "Accept": "application/vnd.github.v3+json"
        }
      });

      const statusCode = response.status;
      let statusResult;

      if (response.ok) {
        // Public repository verified
        statusResult = {
          type: "public",
          statusCode: 200,
          checkedAt: Date.now()
        };
      } else if (statusCode === 403) {
        // Forbidden: Access denied, potentially private repo
        statusResult = {
          type: "private",
          statusCode: 403,
          title: "Private Repository",
          message: "This repository isn't publicly accessible.",
          checkedAt: Date.now()
        };
      } else if (statusCode === 401) {
        // Unauthorized
        statusResult = {
          type: "client",
          statusCode: 401,
          title: "Authentication Required",
          message: "Authentication is required to view this repository.",
          checkedAt: Date.now()
        };
      } else if (statusCode === 404) {
        // 404: Not Found. Strictly do NOT classify as private unless metadata confirms it!
        statusResult = {
          type: "not-found",
          statusCode: 404,
          title: "Repository Not Found",
          message: "This project may have been moved, renamed, or is not publicly available.",
          checkedAt: Date.now()
        };
      } else if (statusCode === 429) {
        // Rate limited
        statusResult = {
          type: "rate-limit",
          statusCode: 429,
          title: "Rate Limited",
          message: "GitHub API rate limit reached. Please try again later.",
          checkedAt: Date.now()
        };
      } else if (statusCode >= 500) {
        // 5xx Server error
        statusResult = {
          type: "server",
          statusCode: statusCode,
          title: "Something Went Wrong",
          message: "The service couldn't complete this request right now.",
          checkedAt: Date.now()
        };
      } else {
        // Generic client error
        statusResult = {
          type: "client",
          statusCode: statusCode,
          title: "Client Error",
          message: `Repository request encountered HTTP error ${statusCode}.`,
          checkedAt: Date.now()
        };
      }

      writeSessionCache(repoUrl, statusResult);
      return statusResult;
    } catch (networkError) {
      // Network failure / offline
      const netResult = {
        type: "network",
        statusCode: 0,
        title: "Connection Error",
        message: "Unable to verify repository status. Please check your network connection.",
        checkedAt: Date.now()
      };
      // Do not cache network failures aggressively so retry works
      return netResult;
    }
  }

  /**
   * Render a full-page custom 404 or 500 view (for router or component mounting failure)
   * 
   * @param {Object} options
   * @returns {string} HTML markup
   */
  function renderPage(options = {}) {
    const statusCode = options.statusCode || 404;
    const is404 = statusCode === 404;
    const badge = is404 ? "HTTP 404 · ROUTE NOT FOUND" : `HTTP ${statusCode} · SERVER ERROR`;
    const title = options.title || (is404 ? "Lost in the codebase?" : "Something Went Wrong");
    const message = options.message || (is404
      ? "The file, repository, or page you were looking for doesn't exist, was relocated, or took an unmapped route."
      : "The service couldn't complete this request right now.");
    const showHome = options.showHome !== false;
    const showRetry = options.showRetry === true;

    return `
      <section class="error-showcase-section" aria-labelledby="error-showcase-title">
        <div class="container error-showcase-container">
          <div class="error-showcase-card">
            <!-- Decorative Masking Tape at Top -->
            <div class="tape-strip tape-top-center" aria-hidden="true"></div>

            <!-- Watermark Numeral -->
            <div class="error-watermark-num" aria-hidden="true">${escapeHtml(String(statusCode))}</div>

            <!-- Content Layout -->
            <div class="error-showcase-content">
              <div class="error-status-pill">
                <span class="status-dot status-dot-warning" aria-hidden="true"></span>
                <span>${escapeHtml(badge)}</span>
              </div>

              <h1 id="error-showcase-title" class="error-showcase-title">${escapeHtml(title)}</h1>

              <p class="error-showcase-desc">${escapeHtml(message)}</p>

              <!-- Developer Terminal Card -->
              <div class="error-code-terminal" aria-label="Route failure debug snippet">
                <div class="terminal-dots" aria-hidden="true">
                  <span class="terminal-dot dot-red"></span>
                  <span class="terminal-dot dot-yellow"></span>
                  <span class="terminal-dot dot-green"></span>
                  <span class="terminal-title">routing_exception.log</span>
                </div>
                <pre class="terminal-code"><code><span class="code-tag">&lt;?php</span>
<span class="code-comment">// HTTP ${statusCode} Exception Handler</span>
$request_path = <span class="code-func">$_SERVER</span>[<span class="code-string">'REQUEST_URI'</span>];

<span class="code-keyword">if</span> (!Router::<span class="code-func">exists</span>($request_path)) {
    <span class="code-keyword">return</span> Response::<span class="code-func">status</span>(<span class="code-number">${statusCode}</span>)
        -&gt;<span class="code-func">suggest</span>([<span class="code-string">'/'</span>, <span class="code-string">'/about.html'</span>]);
}
<span class="code-tag">?&gt;</span></code></pre>
              </div>

              <!-- Handwritten Annotation -->
              <div class="handwritten-note error-doodle" aria-hidden="true">
                don't worry, here's the way back ⤸
              </div>

              <!-- Action Choices -->
              <div class="error-showcase-actions">
                ${showHome ? `
                  <a href="index.html" class="btn btn-primary error-action-btn">
                    <span>Back to Home</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </a>
                ` : ""}
                <a href="index.html#selected-work" class="btn btn-secondary error-action-btn">
                  <span>View Selected Work</span>
                </a>
                ${showRetry ? `
                  <button type="button" class="btn btn-outline error-action-btn error-page-retry-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                    <span>Try Again</span>
                  </button>
                ` : ""}
              </div>

              <!-- Quick Destinations -->
              <div class="error-quick-destinations" aria-label="Suggested Destinations">
                <span class="error-quick-label">Or jump directly to:</span>
                <div class="error-quick-links">
                  <a href="index.html#currently-building" class="error-quick-link">Currently Building</a>
                  <span class="error-link-dot" aria-hidden="true">•</span>
                  <a href="index.html#selected-work" class="error-quick-link">Selected Work</a>
                  <span class="error-link-dot" aria-hidden="true">•</span>
                  <a href="index.html#activity" class="error-quick-link">Activity</a>
                  <span class="error-link-dot" aria-hidden="true">•</span>
                  <a href="about.html" class="error-quick-link">About Karl</a>
                  <span class="error-link-dot" aria-hidden="true">•</span>
                  <a href="index.html#contact" class="error-quick-link">Contact</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  return {
    getErrorInfo,
    renderCard,
    renderAction,
    renderModalAction,
    getRepositoryStatus,
    checkRepository,
    renderPage,
    escapeHtml
  };
})();

if (typeof window !== "undefined") {
  window.ErrorState = ErrorState;
}
