/* ---------- custom cursor (dot only) ---------- */
(() => {
  const dot = document.getElementById('cursorDot');
  if (!dot) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let dx = mx, dy = my;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
  });

  const tick = () => {
    // tiny easing so it feels smooth, not laggy
    dx += (mx - dx) * 0.35;
    dy += (my - dy) * 0.35;
    dot.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  };
  tick();

  const hoverables = 'a, button, .track-card, .video-card, .timeline-item, .card-tilt, .social-cell, .polaroid';
  document.querySelectorAll(hoverables).forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('hover'));
    el.addEventListener('mouseleave', () => dot.classList.remove('hover'));
  });
})();

/* ---------- reveal on scroll ---------- */
(() => {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || '0', 10);
        setTimeout(() => entry.target.classList.add('in'), delay);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  els.forEach(el => io.observe(el));
})();

/* ---------- track / video card glow follow ---------- */
(() => {
  document.querySelectorAll('.track-card, .video-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });
})();

/* ---------- duración real (audio + video) ---------- */
(() => {
  const fmt = (s) => {
    if (!isFinite(s) || s <= 0) return '—:—';
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return `${m}:${r.toString().padStart(2, '0')}`;
  };

  // audios -> el botón tiene data-src y la duración va en el .track-duration de su card
  document.querySelectorAll('.play-btn[data-src]').forEach(btn => {
    const src = btn.dataset.src && btn.dataset.src.trim();
    if (!src) return;
    const target = btn.closest('.track-card')?.querySelector('.track-duration');
    if (!target) return;
    const probe = new Audio();
    probe.preload = 'metadata';
    probe.addEventListener('loadedmetadata', () => {
      target.textContent = fmt(probe.duration);
    });
    probe.src = src;
  });

  // videos -> leer la duración del propio <video>
  document.querySelectorAll('.video-card').forEach(card => {
    const video = card.querySelector('video');
    const target = card.querySelector('.track-duration');
    if (!video || !target) return;
    const set = () => { target.textContent = fmt(video.duration); };
    if (video.readyState >= 1) set();
    else video.addEventListener('loadedmetadata', set);
  });
})();

/* ---------- card tilt ---------- */
(() => {
  document.querySelectorAll('.card-tilt').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-2px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ---------- play preview ----------
   - Si el botón tiene `data-src` con ruta a un mp3, lo reproduce de verdad.
   - Si no, hace solo la animación visual.
*/
(() => {
  let currentBtn = null;
  let currentAudio = null;

  const stop = (btn, audio) => {
    btn.classList.remove('playing');
    btn.querySelector('span').textContent = 'play preview';
    const wave = btn.closest('.track-card')?.querySelector('.waveform');
    wave?.classList.remove('animating');
    if (audio) { audio.pause(); audio.currentTime = 0; }
  };

  document.querySelectorAll('.play-btn').forEach(btn => {
    const src = btn.dataset.src && btn.dataset.src.trim();
    let audio = null;
    if (src) {
      audio = new Audio(src);
      audio.preload = 'none';
      audio.addEventListener('ended', () => stop(btn, audio));
    }

    btn.addEventListener('click', () => {
      const wave = btn.closest('.track-card')?.querySelector('.waveform');
      const isPlaying = btn.classList.contains('playing');

      // detener el anterior
      if (currentBtn && currentBtn !== btn) {
        stop(currentBtn, currentAudio);
      }

      if (isPlaying) {
        stop(btn, audio);
        currentBtn = null;
        currentAudio = null;
      } else {
        btn.classList.add('playing');
        wave?.classList.add('animating');
        btn.querySelector('span').textContent = 'pause · demo';
        if (audio) {
          audio.currentTime = 0;
          audio.play().catch(() => { /* el usuario podría no haber interactuado aún */ });
        }
        currentBtn = btn;
        currentAudio = audio;
      }
    });
  });
})();

/* ---------- konami easter egg: shiba army ---------- */
(() => {
  const seq = ['arrowup','arrowup','arrowdown','arrowdown','arrowleft','arrowright','arrowleft','arrowright','b','a'];
  let idx = 0;

  const norm = (k) => (k || '').toLowerCase();

  window.addEventListener('keydown', (e) => {
    const key = norm(e.key);
    if (key === seq[idx]) {
      idx++;
      if (idx === seq.length) {
        idx = 0;
        spawnShibas();
      }
    } else {
      // permitir reiniciar la secuencia si la primera tecla coincide
      idx = (key === seq[0]) ? 1 : 0;
    }
  });

  function spawnShibas() {
    const original = document.querySelector('.shiba');
    if (!original) return;

    // mensaje en consola para confirmación
    console.log('%c🐕 ¡shiba storm! 🐕', 'color:#ff1f8f;font-size:18px;font-weight:bold');

    const total = 24;
    for (let i = 0; i < total; i++) {
      const clone = original.cloneNode(true);
      // anular la animación del original para que la transición funcione
      clone.style.animation = 'none';
      clone.style.position = 'fixed';
      clone.style.left = (Math.random() * 95) + 'vw';
      clone.style.top = '-200px';
      clone.style.height = (60 + Math.random() * 60) + 'px';
      clone.style.width = 'auto';
      clone.style.maxWidth = 'none';
      clone.style.zIndex = '60';
      clone.style.pointerEvents = 'none';
      clone.style.willChange = 'transform';
      clone.style.transform = 'translateY(0) rotate(0deg)';
      const dur = 4 + Math.random() * 5;
      clone.style.transition = `transform ${dur}s linear, opacity 1s`;
      document.body.appendChild(clone);

      // forzar reflow para que la transición se aplique
      void clone.getBoundingClientRect();

      // arrancar caída con un pequeño escalonamiento
      const stagger = i * 60;
      setTimeout(() => {
        clone.style.transform =
          `translateY(${window.innerHeight + 300}px) rotate(${Math.random() * 720 - 360}deg)`;
      }, stagger);

      setTimeout(() => clone.remove(), dur * 1000 + stagger + 400);
    }
  }
})();
