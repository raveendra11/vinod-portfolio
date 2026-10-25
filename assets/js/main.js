/* Vinod Kumar Pujari · portfolio
   Small, dependency-free enhancements. The page is fully usable without this file. */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  var mq = function (q) { return window.matchMedia ? window.matchMedia(q) : { matches: false }; };
  var reduceMotion = mq('(prefers-reduced-motion: reduce)').matches;
  var STORAGE_KEY = 'vkp-theme';

  function storageGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function storageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* private mode, blocked storage */ }
  }

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.querySelector('[data-theme-toggle]');
  var darkQuery = mq('(prefers-color-scheme: dark)');
  var themeMetas = document.querySelectorAll('meta[name="theme-color"]');
  var THEME_COLORS = { light: '#F8FAFC', dark: '#0B1120' };

  function currentTheme() {
    var forced = root.getAttribute('data-theme');
    if (forced === 'light' || forced === 'dark') return forced;
    return darkQuery.matches ? 'dark' : 'light';
  }

  function syncThemeUI() {
    var theme = currentTheme();
    var next = theme === 'dark' ? 'light' : 'dark';
    if (themeBtn) {
      themeBtn.setAttribute('aria-label', 'Switch to ' + next + ' theme');
      themeBtn.setAttribute('title', 'Switch to ' + next + ' theme');
    }
    // When the visitor has overridden the system theme, keep browser chrome in step.
    if (root.hasAttribute('data-theme')) {
      for (var i = 0; i < themeMetas.length; i++) {
        themeMetas[i].setAttribute('content', THEME_COLORS[theme]);
      }
    }
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      if (!reduceMotion) {
        root.classList.add('theme-switching');
        window.setTimeout(function () { root.classList.remove('theme-switching'); }, 400);
      }
      root.setAttribute('data-theme', next);
      storageSet(STORAGE_KEY, next);
      syncThemeUI();
    });
  }
  if (darkQuery.addEventListener) darkQuery.addEventListener('change', syncThemeUI);
  syncThemeUI();

  /* ---------- Mobile menu ---------- */
  var header = document.querySelector('.site-header');
  var menuBtn = document.querySelector('[data-menu-toggle]');
  var menu = document.getElementById('nav-menu');

  function setMenu(open) {
    if (!menuBtn || !header) return;
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    header.classList.toggle('menu-open', open);
  }
  function menuIsOpen() { return menuBtn && menuBtn.getAttribute('aria-expanded') === 'true'; }

  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () { setMenu(!menuIsOpen()); });

    menu.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if ((e.key === 'Escape' || e.key === 'Esc') && menuIsOpen()) {
        setMenu(false);
        menuBtn.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (menuIsOpen() && !header.contains(e.target)) setMenu(false);
    });

    var desktop = mq('(min-width: 64rem)');
    var onDesktopChange = function () { if (desktop.matches) setMenu(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onDesktopChange);
  }

  /* ---------- Header hairline on scroll ---------- */
  if (header) {
    var ticking = false;
    var updateHeader = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(updateHeader); }
    }, { passive: true });
    updateHeader();
  }

  /* ---------- Scroll reveal ---------- */
  var revealItems = document.querySelectorAll('[data-reveal]');
  if (!reduceMotion && 'IntersectionObserver' in window && revealItems.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });

    // Anything already on screen is shown straight away, so nothing flickers.
    var vh = window.innerHeight || root.clientHeight;
    Array.prototype.forEach.call(revealItems, function (el) {
      if (el.getBoundingClientRect().top < vh * 0.94) el.classList.add('is-visible');
      else revealObserver.observe(el);
    });
    root.classList.add('reveal-ready');
  }

  /* ---------- Active section in nav ---------- */
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if ('IntersectionObserver' in window && navLinks.length) {
    var linkFor = {};
    Array.prototype.forEach.call(navLinks, function (a) { linkFor[a.getAttribute('href').slice(1)] = a; });

    var setActive = function (id) {
      Array.prototype.forEach.call(navLinks, function (a) {
        a.classList.toggle('is-active', a === linkFor[id]);
      });
    };

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    document.querySelectorAll('main section[id], main .hero').forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Copy email ---------- */
  var copyBtn = document.querySelector('[data-copy]');
  if (copyBtn) {
    var label = copyBtn.querySelector('.copy-label');
    var status = document.getElementById('copy-status');
    var defaultLabel = label ? label.textContent : 'Copy email';
    var resetTimer;

    var legacyCopy = function (text) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-1000px';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      return ok;
    };

    var selectEmailText = function () {
      var link = document.getElementById('contact-email');
      if (!link || !window.getSelection) return;
      var range = document.createRange();
      range.selectNodeContents(link);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    };

    var done = function (ok) {
      window.clearTimeout(resetTimer);
      copyBtn.classList.toggle('is-copied', ok);
      if (label) label.textContent = ok ? 'Copied' : 'Press Ctrl+C';
      if (status) status.textContent = ok ? 'Email address copied to clipboard.' : 'Copy failed. The email address is selected; press Control C or Command C to copy it.';
      if (!ok) selectEmailText();
      resetTimer = window.setTimeout(function () {
        copyBtn.classList.remove('is-copied');
        if (label) label.textContent = defaultLabel;
        if (status) status.textContent = '';
      }, 2200);
    };

    copyBtn.addEventListener('click', function () {
      var text = copyBtn.getAttribute('data-copy');
      if (navigator.clipboard && window.isSecureContext && window.Promise) {
        // Some locked-down browsers leave writeText() pending forever, so give it
        // a short window and fall back to the legacy path if it hasn't settled.
        var timeout = new Promise(function (resolve, reject) {
          window.setTimeout(function () { reject(new Error('clipboard timeout')); }, 800);
        });
        Promise.race([navigator.clipboard.writeText(text), timeout]).then(
          function () { done(true); },
          function () { done(legacyCopy(text)); }
        );
      } else {
        done(legacyCopy(text));
      }
    });
  }

  /* ---------- Scroll progress + back-to-top ---------- */
  var progressBar = document.querySelector('.scroll-progress span');
  var toTop = document.querySelector('.to-top');
  if (progressBar || toTop) {
    var ticking = false;
    var paintScroll = function () {
      ticking = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var y = window.scrollY || window.pageYOffset || 0;
      if (progressBar) progressBar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
      if (toTop) toTop.classList.toggle('is-visible', y > 700);
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(paintScroll); }
    }, { passive: true });
    window.addEventListener('resize', paintScroll);
    paintScroll();
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
