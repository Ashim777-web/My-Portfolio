// =============================================================
// Mobile navigation
// =============================================================
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  const close = document.querySelector('.mobile-menu-close');
  if (!toggle || !menu) return;

  const open = () => { menu.classList.add('open'); document.body.style.overflow = 'hidden'; menu.querySelector('a,button').focus(); };
  const shut = () => { menu.classList.remove('open'); document.body.style.overflow = ''; toggle.focus(); };

  toggle.addEventListener('click', open);
  if (close) close.addEventListener('click', shut);
  menu.addEventListener('keydown', (e) => { if (e.key === 'Escape') shut(); });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', shut));
})();

// =============================================================
// Category filters (Projects / Labs / Write-ups)
// =============================================================
(function () {
  const bars = document.querySelectorAll('.filter-bar');
  bars.forEach(bar => {
    const pills = bar.querySelectorAll('.filter-pill');
    const targetSelector = bar.dataset.target;
    const items = targetSelector ? document.querySelectorAll(targetSelector) : [];
    const emptyState = document.querySelector(bar.dataset.empty || '');

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const cat = pill.dataset.filter;
        let visibleCount = 0;

        items.forEach(item => {
          const tags = (item.dataset.category || '').split(',');
          const show = cat === 'all' || tags.includes(cat);
          item.classList.toggle('hidden', !show);
          if (show) visibleCount++;
        });

        if (emptyState) emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      });
    });
  });
})();

// =============================================================
// Scroll reveal (single subtle pass, respects reduced motion)
// =============================================================
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach(el => observer.observe(el));
})();

// =============================================================
// Hero terminal type-in (plays once on load)
// =============================================================
(function () {
  const el = document.querySelector('[data-typewriter]');
  if (!el) return;
  const text = el.dataset.typewriter;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    el.textContent = text;
    return;
  }

  let i = 0;
  el.textContent = '';
  function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(type, 35);
    }
  }
  setTimeout(type, 400);
})();

// =============================================================
// Reading progress bar (article pages)
// =============================================================
(function () {
  const bar = document.querySelector('.reading-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

// =============================================================
// Table of contents active-section highlight
// =============================================================
(function () {
  const toc = document.querySelector('.toc');
  if (!toc) return;
  const links = toc.querySelectorAll('a');
  const targets = Array.from(links).map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  if (!targets.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = '#' + entry.target.id;
      const link = toc.querySelector(`a[href="${id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  targets.forEach(t => observer.observe(t));
})();

// =============================================================
// Copy-to-clipboard (code blocks + contact email)
// =============================================================
(function () {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const value = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(value);
        const original = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(() => { btn.textContent = original; }, 1500);
      } catch (e) { /* clipboard unavailable, fail silently */ }
    });
  });
})();
