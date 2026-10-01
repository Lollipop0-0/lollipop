/**
 * Karl Evan Tabunda - Site Preloader Module
 * Coordinates the animated stickman loading screen lifecycle before the website opens.
 */

const PreloaderManager = (() => {
  let preloaderEl = null;
  let progressBar = null;
  let percentText = null;
  let isDone = false;
  let simulatedProgress = 15;
  let progressInterval = null;
  let startTime = Date.now();
  const MIN_DISPLAY_TIME = 1200; // Optimal duration to showcase the running stickman
  const MAX_SAFETY_TIMEOUT = 3500; // Fallback so the user is never blocked

  const prefersReducedMotion = () => {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  };

  const init = () => {
    preloaderEl = document.getElementById("site-preloader");
    if (!preloaderEl) return;

    startTime = Date.now();
    isDone = false;
    simulatedProgress = 20;

    progressBar = document.getElementById("preloader-progress-bar");
    percentText = document.getElementById("preloader-percent");

    setProgress(20);

    // Smooth incremental progress creep while components and resources load
    progressInterval = setInterval(() => {
      if (simulatedProgress < 85 && !isDone) {
        simulatedProgress += Math.floor(Math.random() * 8) + 4;
        setProgress(Math.min(simulatedProgress, 85));
      }
    }, 120);

    // Fallback timer to guarantee dismissal
    setTimeout(() => {
      if (!isDone) {
        complete();
      }
    }, MAX_SAFETY_TIMEOUT);
  };

  const setProgress = (percent) => {
    const clamped = Math.min(100, Math.max(0, Math.round(percent)));
    if (progressBar) {
      progressBar.style.width = `${clamped}%`;
      progressBar.setAttribute("aria-valuenow", clamped);
    }
    if (percentText) {
      percentText.textContent = `${clamped}%`;
    }
  };

  const complete = () => {
    if (isDone || !preloaderEl) return;
    isDone = true;

    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }

    setProgress(100);

    const elapsed = Date.now() - startTime;
    // Guaranteed visible duration of 1.0s to 1.2s so the stickman running animation is always seen
    const remainingDelay = Math.max(900, MIN_DISPLAY_TIME - elapsed);

    setTimeout(() => {
      preloaderEl.classList.add("is-hiding");
      document.body.classList.add("page-ready");

      const hideDelay = prefersReducedMotion() ? 100 : 550;
      setTimeout(() => {
        preloaderEl.classList.add("is-hidden");
        preloaderEl.setAttribute("aria-hidden", "true");
        window.dispatchEvent(new CustomEvent("preloader:complete"));
      }, hideDelay);
    }, remainingDelay);
  };

  return {
    init,
    setProgress,
    complete
  };
})();

// Self-expose to window
if (typeof window !== "undefined") {
  window.PreloaderManager = PreloaderManager;
}
