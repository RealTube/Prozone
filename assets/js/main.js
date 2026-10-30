/* ==========================================================================
   ProZone Armenia — interactions & scroll motion
   Everything works without GSAP; GSAP only adds the motion layer.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var motion = root.classList.contains('motion') && hasGsap && !reduce;
  if (!motion) root.classList.remove('motion');

  var T = window.PZ_T || function (k, f) { return f; };
  var $ =function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  // Small rAF tween (used where GSAP is optional)
  function tween(from, to, ms, onUpdate, done) {
    if (reduce || !ms) { onUpdate(to); if (done) done(); return; }
    var t0 = performance.now();
    requestAnimationFrame(function frame(now) {
      var p = Math.min(1, (now - t0) / ms);
      var e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      onUpdate(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(frame); else if (done) done();
    });
  }

  /* ---------- Footer year ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Header ---------- */
  var hdr = $('.hdr');
  function onScroll() { hdr.classList.toggle('is-scrolled', window.scrollY > 24); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var menuBtn = $('.hdr__menu'), mnav = $('#mnav');
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? T('hdr.menuClose', 'Close menu') : T('hdr.menuOpen', 'Open menu'));
    mnav.hidden = !open;
  }
  menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
  $$('a', mnav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Set-point dial (hero) ---------- */
  var hero = $('.hero'), dial = $('[data-dial]');
  var startDial = function () {};
  if (dial) {
    var MIN = -20, MAX = 45, SP = 22, R = 118, CX = 160, CY = 160;
    var C = 2 * Math.PI * R, ARC = C * .75, NS = 'http://www.w3.org/2000/svg';
    var frac = function (t) { return (Math.max(MIN, Math.min(MAX, t)) - MIN) / (MAX - MIN); };
    var ang = function (t) { return (135 + frac(t) * 270) * Math.PI / 180; };
    var pt = function (t, r) { return [CX + r * Math.cos(ang(t)), CY + r * Math.sin(ang(t))]; };
    var svgEl = function (name, attrs) {
      var el = document.createElementNS(NS, name);
      Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
      return el;
    };

    var ticks = $('.dial__ticks', dial);
    for (var t = MIN; t <= MAX; t += 5) {
      var major = t % 20 === 0;
      var a = pt(t, R + 15), b = pt(t, R + (major ? 25 : 21));
      ticks.appendChild(svgEl('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], 'class': 'dial__tick' + (major ? ' dial__tick--major' : '') }));
      if (major) {
        var l = pt(t, R + 38), txt = svgEl('text', { x: l[0], y: l[1], 'class': 'dial__lbl' });
        txt.textContent = (t > 0 ? '+' : t < 0 ? '−' : '') + Math.abs(t) + '°';
        ticks.appendChild(txt);
      }
    }
    $('.dial__track', dial).setAttribute('stroke-dasharray', ARC + ' ' + C);
    var sp1 = pt(SP, R - 13), sp2 = pt(SP, R + 13), spLine = $('.dial__sp', dial);
    spLine.setAttribute('x1', sp1[0]); spLine.setAttribute('y1', sp1[1]);
    spLine.setAttribute('x2', sp2[0]); spLine.setAttribute('y2', sp2[1]);

    var arc = $('.dial__arc', dial), dot = $('.dial__dot', dial);
    var outEl = $('[data-out]', dial), inEl = $('[data-in]', dial);
    var modeEl = $('[data-mode-label]', dial), plantEl = $('[data-plant]', dial);
    var outNow = SP;

    var render = function (v) {
      outNow = v;
      var lo = frac(Math.min(SP, v)), hi = frac(Math.max(SP, v));
      arc.setAttribute('stroke-dasharray', ((hi - lo) * ARC).toFixed(2) + ' ' + C.toFixed(2));
      arc.setAttribute('stroke-dashoffset', (-lo * ARC).toFixed(2));
      var p = pt(v, R);
      dot.setAttribute('cx', p[0].toFixed(2));
      dot.setAttribute('cy', p[1].toFixed(2));
      var r = Math.round(v);
      outEl.textContent = (r > 0 ? '+' : r < 0 ? '−' : '') + Math.abs(r);
    };

    var SEASONS = {
      summer: { out: 39, mode: 'cool', label: T('dial.cooling', 'Cooling'), plant: T('dial.chiller', 'Chiller') },
      winter: { out: -12, mode: 'heat', label: T('dial.heating', 'Heating'), plant: T('dial.boiler', 'Boiler') }
    };
    var current = null, tweenId = 0;
    var setSeason = function (name) {
      if (current === name) return;
      current = name;
      var s = SEASONS[name], id = ++tweenId;
      hero.setAttribute('data-mode', s.mode);
      $$('[data-season]', dial).forEach(function (btn) { btn.setAttribute('aria-pressed', String(btn.dataset.season === name)); });
      modeEl.textContent = s.label;
      plantEl.textContent = s.plant;
      tween(outNow, s.out, 1700, function (v) { if (id === tweenId) render(v); });
    };

    render(SP);
    modeEl.textContent = SEASONS.summer.label;
    plantEl.textContent = SEASONS.summer.plant;

    var heroVisible = true, resumeAt = 0;
    $$('[data-season]', dial).forEach(function (btn) {
      btn.addEventListener('click', function () { resumeAt = Date.now() + 15000; setSeason(btn.dataset.season); });
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { heroVisible = es[0].isIntersecting; }).observe(hero);
    }

    startDial = function () {
      setSeason('summer');
      if (reduce) return;
      // Auto-cycle the seasons while the hero is on screen and the visitor isn't using the toggle
      setInterval(function () {
        if (!heroVisible || document.hidden || Date.now() < resumeAt) return;
        setSeason(current === 'summer' ? 'winter' : 'summer');
      }, 5600);
      // Inside temperature: tiny live wobble around the set point
      setInterval(function () {
        if (!heroVisible || document.hidden) return;
        inEl.textContent = (SP + Math.round((Math.random() - .5) * 2) / 10).toFixed(1);
      }, 1700);
    };
  }

  /* ---------- Counters ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || '';
        tween(0, end, 1500, function (v) { el.textContent = Math.round(v) + suf; });
        cio.unobserve(el);
      });
    }, { threshold: .6 });
    $$('[data-count]').forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Chiller: step list ---------- */
  var xp = $('.xp'), xpSteps = $$('.xp__steps li'), xpBar = $('.xp__progress span');
  function setStep(n) {
    xp.setAttribute('data-step', n);
    xpSteps.forEach(function (li) { li.classList.toggle('is-on', +li.dataset.step === n); });
  }

  /* ---------- Gallery: filters ---------- */
  var shots = $$('.shot');
  var filterBtns = $$('.filters button');
  filterBtns.forEach(function (btn) {
    var f = btn.dataset.filter;
    var n = shots.filter(function (s) { return f === 'all' || s.dataset.cat.split(' ').indexOf(f) > -1; }).length;
    $('.count', btn).textContent = n;
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      var shown = [];
      shots.forEach(function (s) {
        var show = f === 'all' || s.dataset.cat.split(' ').indexOf(f) > -1;
        s.hidden = !show;
        if (show) shown.push(s);
      });
      if (motion) {
        gsap.fromTo(shown, { opacity: 0, y: 24, clipPath: 'inset(0% 0% 0% 0%)' },
          { opacity: 1, y: 0, duration: .6, stagger: .05, ease: 'power3.out', overwrite: true });
        ScrollTrigger.refresh();
      }
    });
  });

  /* ---------- Gallery: lightbox ---------- */
  var lb = $('#lb');
  if (lb && typeof lb.showModal === 'function') {
    var lbImg = $('img', lb), lbTitle = $('[data-lb-title]', lb), lbTag = $('[data-lb-tag]', lb), idx = 0;
    var visibleShots = function () { return shots.filter(function (s) { return !s.hidden; }); };
    var show = function (i) {
      var list = visibleShots();
      idx = (i + list.length) % list.length;
      var s = list[idx];
      lbImg.src = s.getAttribute('href');
      lbImg.alt = $('img', s).alt;
      lbTitle.textContent = s.dataset.title;
      lbTag.textContent = (idx + 1) + ' / ' + list.length + ' · ' + s.dataset.tag;
    };
    shots.forEach(function (s) {
      s.addEventListener('click', function (e) {
        e.preventDefault();
        show(visibleShots().indexOf(s));
        lb.showModal();
      });
    });
    $('.lb__close', lb).addEventListener('click', function () { lb.close(); });
    $('.lb__prev', lb).addEventListener('click', function () { show(idx - 1); });
    $('.lb__next', lb).addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') show(idx + 1);
      if (e.key === 'ArrowLeft') show(idx - 1);
    });
    var x0 = null;
    lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }

  /* ---------- Call-back form (opens the visitor's email app) ---------- */
  var form = $('#qform');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    var d = new FormData(form);
    var subject = T('mail.subject', 'Call-back request') + ': ' + d.get('service') + (d.get('company') ? ' — ' + d.get('company') : '');
    var body = [
      T('mail.name', 'Name') + ': ' + d.get('name'),
      T('mail.company', 'Company') + ': ' + (d.get('company') || '—'),
      T('mail.phone', 'Phone') + ': ' + d.get('phone'),
      T('mail.service', 'Service') + ': ' + d.get('service'),
      '',
      d.get('message') || ''
    ].join('\n');
    window.location.href = 'mailto:info@prozone.am?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });

  /* ---------- Mobile bar: step aside while the big phone number is on screen ---------- */
  var mbar = $('.mbar'), bigphone = $('.bigphone');
  if (mbar && bigphone && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { mbar.classList.toggle('is-hidden', es[0].isIntersecting); }).observe(bigphone);
  }

  /* ======================================================================
     Motion layer (GSAP + ScrollTrigger)
     ====================================================================== */
  if (!motion) {
    // Static fallback: show the chiller fully taken apart, with every step visible
    xp.classList.add('xp--static');
    if (window.PZChiller) window.PZChiller.render(1);
    startDial();
    window.__pzReady = true;
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Split headings into masked words
  function splitWords(el) {
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var w = document.createElement('span'), wi = document.createElement('span');
            w.className = 'w'; wi.className = 'wi'; wi.textContent = part;
            w.appendChild(wi); frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') {
          walk(n);
        }
      });
    })(el);
    return $$('.wi', el);
  }

  $$('[data-split]').forEach(function (el) {
    var words = splitWords(el);
    el.classList.add('is-split');
    gsap.set(words, { yPercent: 108 });
    el.style.visibility = 'visible';
    gsap.to(words, {
      yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: .05,
      scrollTrigger: { trigger: el, start: 'top 86%' }
    });
  });

  // Intro
  var intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
  intro
    .to('.hdr', { opacity: 1, y: 0, duration: .9 })
    .to('.hero .line > span', { y: 0, duration: 1.25, stagger: .13 }, .1)
    .to('[data-hero-fade]', { opacity: 1, y: 0, duration: 1, stagger: .1 }, .45)
    .to('.dial', { opacity: 1, y: 0, scale: 1, duration: 1.3 }, .55)
    .add(startDial, .9);

  // Hero: photo drifts, content eases away as you scroll past
  gsap.to('.hero__media img', {
    yPercent: 10, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('.hero__inner', {
    yPercent: -12, opacity: .25, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  // Generic reveals, batched so neighbours stagger
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    onEnter: function (batch) {
      gsap.to(batch, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: .1, overwrite: true });
    }
  });

  // Brand marquee — speeds up with scroll velocity
  var track = $('.marquee__track');
  if (track) {
    $$('img', track).forEach(function (img) {
      var c = img.cloneNode(true);
      c.alt = ''; c.setAttribute('aria-hidden', 'true');
      track.appendChild(c);
    });
    var marquee = gsap.to(track, { xPercent: -50, ease: 'none', duration: 40, repeat: -1 });
    var boost = 0;
    ScrollTrigger.create({
      onUpdate: function (self) { boost = Math.min(Math.abs(self.getVelocity()) / 260, 6); }
    });
    gsap.ticker.add(function () { boost *= .93; marquee.timeScale(1 + boost); });
  }

  // Service cards: subtle 3D tilt on fine pointers
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('.svc').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        gsap.to(card, { rotateY: x * 7, rotateX: -y * 7, transformPerspective: 900, duration: .5, ease: 'power2.out' });
      });
      card.addEventListener('pointerleave', function () {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: .8, ease: 'power3.out' });
      });
    });
  }

  // Chiller: pinned, taken apart as you scroll
  if (window.PZChiller) {
    xp.classList.add('xp--pinned');
    setStep(0);
    var xpState = { p: 0 };
    gsap.to(xpState, {
      p: 1, ease: 'none',
      scrollTrigger: {
        trigger: '.xp__pin', pin: true, start: 'top top',
        end: function () { return '+=' + Math.round(window.innerHeight * 3.2); },
        scrub: .8, invalidateOnRefresh: true
      },
      onUpdate: function () {
        setStep(window.PZChiller.render(xpState.p));
        if (xpBar) xpBar.style.transform = 'scaleX(' + xpState.p.toFixed(3) + ')';
      }
    });
  }

  // Gallery: photos wipe in from below
  ScrollTrigger.batch('.shot', {
    start: 'top 92%',
    onEnter: function (batch) {
      gsap.fromTo(batch, { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15, ease: 'power4.out', stagger: .08 });
    }
  });

  // Industries: two rows slide in opposite directions with scroll
  $$('.ind__row').forEach(function (row, i) {
    var fromX = i % 2 ? -30 : 0, toX = i % 2 ? 0 : -30;
    gsap.fromTo(row, { xPercent: fromX }, {
      xPercent: toX, ease: 'none',
      scrollTrigger: { trigger: '.ind', start: 'top bottom', end: 'bottom top', scrub: .5 }
    });
  });

  // Process: line draws, steps light up
  gsap.to('.steps__line span', {
    scaleY: 1, ease: 'none',
    scrollTrigger: { trigger: '.steps', start: 'top 62%', end: 'bottom 62%', scrub: true }
  });
  $$('.step').forEach(function (step) {
    ScrollTrigger.create({
      trigger: step, start: 'top 62%',
      onEnter: function () { step.classList.add('is-on'); },
      onLeaveBack: function () { step.classList.remove('is-on'); }
    });
  });

  // Big phone number: digits roll up
  if (bigphone) {
    var chars = bigphone.textContent.split('').map(function (ch) {
      var s = document.createElement('span');
      s.className = 'ch';
      s.textContent = ch === ' ' ? ' ' : ch;
      return s;
    });
    bigphone.textContent = '';
    chars.forEach(function (s) { bigphone.appendChild(s); });
    gsap.from(chars, {
      yPercent: 70, opacity: 0, duration: .9, ease: 'power3.out', stagger: .035,
      scrollTrigger: { trigger: bigphone, start: 'top 88%' }
    });
  }

  function refresh() {
    if (window.PZChiller) window.PZChiller.fit();
    ScrollTrigger.refresh();
  }
  window.addEventListener('load', refresh);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);

  window.__pzReady = true;
})();
