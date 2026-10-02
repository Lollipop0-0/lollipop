/**
 * Karl Evan Tabunda - Sound & Ambient Music Manager (Web Audio API Synthesizer)
 * Tactile acoustic UI feedback inspired by Naphier Node (naphiernode.vercel.app)
 * and generative warm ambient lo-fi chord progressions.
 * Zero external audio assets; runs 100% procedurally with zero network overhead.
 */
window.SoundManager = (function () {
  let ctx = null;
  let isUnlocked = false;
  let lastHoverTime = 0;
  const hoverCooldownMs = 75;
  let isMuted = true; // Default OFF for visitor comfort & browser autoplay policies
  let isMusicPlaying = false;
  let chordIndex = 0;
  let musicLoopTimeout = null;
  let musicGainNode = null;
  let masterFilter = null;
  let activeNodes = [];
  const CHORD_DURATION = 4.2; // Seconds per ambient chord

  // Neo-Soul / Lo-Fi Jazz Ambient Chord Progression:
  // 1: Dmaj9 | 2: Bm9 | 3: Gmaj7(#11) | 4: A13sus4
  const CHORDS = [
    { bass: 73.42, notes: [146.83, 220.00, 277.18, 329.63, 369.99] },
    { bass: 61.74, notes: [123.47, 185.00, 220.00, 277.18, 293.66] },
    { bass: 49.00, notes: [98.00, 146.83, 185.00, 246.94, 277.18] },
    { bass: 55.00, notes: [110.00, 164.81, 196.00, 246.94, 293.66] }
  ];

  function init() {
    try {
      const stored = localStorage.getItem("ket_portfolio_sound");
      if (stored === "active") {
        isMuted = false;
      } else {
        isMuted = true;
      }
    } catch (e) {
      isMuted = true;
    }

    initUnlockListener();
    bindEvents();
    updateUI();

    // If user previously activated sound, resume on their first gesture
    if (!isMuted) {
      const resumeOnGesture = () => {
        if (!isMuted && !isMusicPlaying) {
          startAmbientMusic();
          updateUI();
        }
        window.removeEventListener("pointerdown", resumeOnGesture);
        window.removeEventListener("keydown", resumeOnGesture);
        window.removeEventListener("touchstart", resumeOnGesture);
      };
      window.addEventListener("pointerdown", resumeOnGesture, { passive: true });
      window.addEventListener("keydown", resumeOnGesture, { passive: true });
      window.addEventListener("touchstart", resumeOnGesture, { passive: true });
    }
  }

  function getContext() {
    if (!ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        ctx = new AudioCtx();
      }
    }
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function initUnlockListener() {
    if (isUnlocked || typeof window === "undefined") return;
    const unlock = () => {
      isUnlocked = true;
      const c = getContext();
      if (c && c.state === "suspended") {
        c.resume().catch(() => {});
      }
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
    };
    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("keydown", unlock, { passive: true });
    window.addEventListener("touchstart", unlock, { passive: true });
  }

  /**
   * Generative Ambient Music Synthesizer
   */
  function startAmbientMusic() {
    if (isMusicPlaying) return;
    const audioCtx = getContext();
    if (!audioCtx) return;

    // Support optional custom audio tag if present in markup
    const customAudio = document.getElementById("bg-music-audio");
    if (customAudio) {
      customAudio.play().catch(() => {});
      isMusicPlaying = true;
      isMuted = false;
      return;
    }

    if (!musicGainNode) {
      musicGainNode = audioCtx.createGain();
      masterFilter = audioCtx.createBiquadFilter();
      masterFilter.type = "lowpass";
      masterFilter.frequency.setValueAtTime(1050, audioCtx.currentTime);
      masterFilter.Q.setValueAtTime(1.0, audioCtx.currentTime);

      musicGainNode.connect(masterFilter);
      masterFilter.connect(audioCtx.destination);
    }

    isMusicPlaying = true;
    isMuted = false;

    const now = audioCtx.currentTime;
    musicGainNode.gain.cancelScheduledValues(now);
    musicGainNode.gain.setValueAtTime(0.0001, now);
    musicGainNode.gain.linearRampToValueAtTime(0.045, now + 0.8);

    chordIndex = 0;
    scheduleNextChord();
  }

  function scheduleNextChord() {
    if (!isMusicPlaying) return;
    const audioCtx = getContext();
    if (!audioCtx || audioCtx.state === "closed") return;

    const chord = CHORDS[chordIndex];
    const now = audioCtx.currentTime;
    const dur = CHORD_DURATION;

    // 1. Warm Analog Bass Voice
    try {
      const bassOsc = audioCtx.createOscillator();
      const bassGain = audioCtx.createGain();
      const bassFilt = audioCtx.createBiquadFilter();

      bassFilt.type = "lowpass";
      bassFilt.frequency.setValueAtTime(170, now);

      bassOsc.type = "sine";
      bassOsc.frequency.setValueAtTime(chord.bass, now);

      bassGain.gain.setValueAtTime(0.0001, now);
      bassGain.gain.linearRampToValueAtTime(0.032, now + 0.5);
      bassGain.gain.setValueAtTime(0.032, now + dur - 1.2);
      bassGain.gain.linearRampToValueAtTime(0.0001, now + dur + 0.5);

      bassOsc.connect(bassFilt);
      bassFilt.connect(bassGain);
      bassGain.connect(musicGainNode);

      bassOsc.start(now);
      bassOsc.stop(now + dur + 0.6);
      activeNodes.push(bassOsc, bassGain, bassFilt);
    } catch (e) {}

    // 2. Polyphonic Lo-Fi Rhodes / Pad Chord Voices
    chord.notes.forEach((freq, idx) => {
      try {
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const noteGain = audioCtx.createGain();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(freq, now);
        osc1.detune.setValueAtTime(-3.5, now);

        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(freq, now);
        osc2.detune.setValueAtTime(3.5, now);

        const targetGain = 0.016 - (idx * 0.0018);
        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.linearRampToValueAtTime(targetGain, now + 0.7 + (idx * 0.04));
        noteGain.gain.setValueAtTime(targetGain, now + dur - 1.2);
        noteGain.gain.linearRampToValueAtTime(0.0001, now + dur + 0.6);

        osc1.connect(noteGain);
        osc2.connect(noteGain);
        noteGain.connect(musicGainNode);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + dur + 0.7);
        osc2.stop(now + dur + 0.7);
        activeNodes.push(osc1, osc2, noteGain);
      } catch (e) {}
    });

    chordIndex = (chordIndex + 1) % CHORDS.length;

    // Prune node references
    if (activeNodes.length > 50) {
      activeNodes = activeNodes.slice(-25);
    }

    // Schedule next chord to overlap seamlessly
    musicLoopTimeout = setTimeout(() => {
      if (isMusicPlaying) {
        scheduleNextChord();
      }
    }, (dur - 0.3) * 1000);
  }

  function stopAmbientMusic() {
    isMusicPlaying = false;
    if (musicLoopTimeout) {
      clearTimeout(musicLoopTimeout);
      musicLoopTimeout = null;
    }

    const customAudio = document.getElementById("bg-music-audio");
    if (customAudio) {
      customAudio.pause();
    }

    if (musicGainNode && ctx && ctx.state !== "closed") {
      const now = ctx.currentTime;
      musicGainNode.gain.cancelScheduledValues(now);
      musicGainNode.gain.setValueAtTime(musicGainNode.gain.value, now);
      musicGainNode.gain.linearRampToValueAtTime(0.0001, now + 0.45);
    }
  }

  /**
   * Tactile Mechanical Click (Triangle wave + lowpass filter)
   */
  function playClick() {
    if (isMuted) return;
    try {
      const audioCtx = getContext();
      if (!audioCtx || audioCtx.state === "closed") return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1600, audioCtx.currentTime);

      osc.type = "triangle";
      osc.frequency.setValueAtTime(580, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(240, audioCtx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {}
  }

  /**
   * Subtle Micro-Tick for UI Hovers (Sine wave, 25ms duration)
   */
  function playHover() {
    if (isMuted) return;
    const now = Date.now();
    if (now - lastHoverTime < hoverCooldownMs) return;
    lastHoverTime = now;
    try {
      const audioCtx = getContext();
      if (!audioCtx || audioCtx.state === "closed") return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(2200, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, audioCtx.currentTime + 0.025);

      gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.025);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.025);
    } catch (e) {}
  }

  /**
   * Harmonic Dual Sine Chime for Theme Switching (440Hz/660Hz -> 880Hz/1320Hz)
   */
  function playTheme() {
    if (isMuted) return;
    try {
      const audioCtx = getContext();
      if (!audioCtx || audioCtx.state === "closed") return;
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc1.type = "sine";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
      osc2.frequency.setValueAtTime(660, audioCtx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);

      osc1.start(audioCtx.currentTime);
      osc2.start(audioCtx.currentTime);
      osc1.stop(audioCtx.currentTime + 0.1);
      osc2.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  }

  /**
   * Modal / Palette Open Sound (Ascending 480Hz -> 880Hz)
   */
  function playOpen() {
    if (isMuted) return;
    try {
      const audioCtx = getContext();
      if (!audioCtx || audioCtx.state === "closed") return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(480, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.045, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.06);
    } catch (e) {}
  }

  /**
   * Modal / Palette Close Sound (Descending 780Hz -> 420Hz)
   */
  function playClose() {
    if (isMuted) return;
    try {
      const audioCtx = getContext();
      if (!audioCtx || audioCtx.state === "closed") return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(780, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(420, audioCtx.currentTime + 0.055);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.055);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.055);
    } catch (e) {}
  }

  /**
   * Harmonized Pop for Navigation Clicks
   */
  function playNavigate() {
    if (isMuted) return;
    try {
      const audioCtx = getContext();
      if (!audioCtx || audioCtx.state === "closed") return;
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc1.type = "sine";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(520, audioCtx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(650, audioCtx.currentTime + 0.07);
      osc2.frequency.setValueAtTime(780, audioCtx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(975, audioCtx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.07);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);

      osc1.start(audioCtx.currentTime);
      osc2.start(audioCtx.currentTime);
      osc1.stop(audioCtx.currentTime + 0.07);
      osc2.stop(audioCtx.currentTime + 0.07);
    } catch (e) {}
  }

  /**
   * Cheerful Ascending Activation Chime (C5 -> E5 -> G5 -> B5)
   */
  function playActivationChime() {
    try {
      const audioCtx = getContext();
      if (!audioCtx || audioCtx.state === "closed") return;
      const notes = [523.25, 659.25, 783.99, 987.77];
      const start = audioCtx.currentTime;

      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start + (i * 0.04));

        gain.gain.setValueAtTime(0.04, start + (i * 0.04));
        gain.gain.exponentialRampToValueAtTime(0.0001, start + (i * 0.04) + 0.12);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(start + (i * 0.04));
        osc.stop(start + (i * 0.04) + 0.13);
      });
    } catch (e) {}
  }

  /**
   * Subtle Soft Mute Pop
   */
  function playMutePop() {
    try {
      const audioCtx = getContext();
      if (!audioCtx || audioCtx.state === "closed") return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(360, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, audioCtx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {}
  }

  /**
   * Main Toggle Handler (Toggles Background Music + Sound Effects)
   */
  function toggleMusic() {
    const audioCtx = getContext();
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }

    if (isMusicPlaying) {
      // Turn OFF
      playMutePop();
      isMuted = true;
      stopAmbientMusic();
      try {
        localStorage.setItem("ket_portfolio_sound", "muted");
      } catch (e) {}
      updateUI();
      return false;
    } else {
      // Turn ON
      isMuted = false;
      startAmbientMusic();
      playActivationChime();
      try {
        localStorage.setItem("ket_portfolio_sound", "active");
      } catch (e) {}
      updateUI();
      return true;
    }
  }

  function toggleMute() {
    return toggleMusic();
  }

  /**
   * Update UI button states and animated equalizer bars
   */
  function updateUI() {
    const isPlaying = isMusicPlaying && !isMuted;

    // 1. Desktop Header Toggle Button
    const desktopBtns = document.querySelectorAll(".music-toggle-btn, #music-toggle-btn");
    desktopBtns.forEach(btn => {
      btn.setAttribute("aria-pressed", isPlaying ? "true" : "false");
      btn.classList.toggle("is-active", isPlaying);
      const title = isPlaying ? "Sound & Music: ON (Click or press 'M' to mute)" : "Sound & Music: OFF (Click or press 'M' to play)";
      btn.setAttribute("title", title);
      btn.setAttribute("aria-label", title);

      const bars = btn.querySelector(".music-bars");
      const iconMuted = btn.querySelector(".music-icon-muted");
      if (bars) bars.style.display = isPlaying ? "inline-flex" : "none";
      if (iconMuted) iconMuted.style.display = isPlaying ? "none" : "block";
    });

    // 2. Mobile Drawer Toggle Button
    const mobileBtns = document.querySelectorAll("#mobile-music-toggle-btn, .mobile-music-toggle-btn");
    mobileBtns.forEach(btn => {
      btn.setAttribute("aria-pressed", isPlaying ? "true" : "false");
      btn.classList.toggle("is-active", isPlaying);
      const statusText = btn.querySelector(".mobile-toggle-status");
      if (statusText) {
        statusText.textContent = isPlaying ? "ON" : "OFF";
      }
    });
  }

  function bindEvents() {
    // Delegated click listener so dynamically rendered header components are always captured
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("#music-toggle-btn, .music-toggle-btn, #mobile-music-toggle-btn, .mobile-music-toggle-btn");
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        toggleMusic();
      }
    });

    // Keyboard shortcut: Press 'M' to toggle music & sound
    window.addEventListener("keydown", (e) => {
      if (e.key === "m" || e.key === "M") {
        const tag = (e.target && e.target.tagName) ? e.target.tagName.toUpperCase() : "";
        if (tag === "INPUT" || tag === "TEXTAREA" || (e.target && e.target.isContentEditable)) {
          return;
        }
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        e.preventDefault();
        toggleMusic();
      }
    });
  }

  return {
    init,
    playClick,
    playHover,
    playTheme,
    playOpen,
    playClose,
    playNavigate,
    playActivationChime,
    startAmbientMusic,
    stopAmbientMusic,
    toggleMusic,
    toggleMute,
    updateUI,
    isMuted: () => isMuted,
    isMusicPlaying: () => isMusicPlaying
  };
})();
