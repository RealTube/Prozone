/* ==========================================================================
   ProZone — isometric air-cooled screw chiller that comes apart on scroll.
   Drawn in code (no image files): window.PZChiller.render(progress 0..1).
   ========================================================================== */
(function () {
  'use strict';

  var svg = document.querySelector('.xp__svg');
  if (!svg) return;

  var T = window.PZ_T || function (k, f) { return f; };
  var LANG = window.PZ_LANG || 'en';
  var NS = 'http://www.w3.org/2000/svg';
  var C30 = Math.cos(Math.PI / 6), S30 = 0.5, R2 = Math.SQRT2;

  // Isometric projection: +x → right-down, +y → left-down, +z → up
  function P(x, y, z) { return [(x - y) * C30, (x + y) * S30 - z]; }
  function f1(n) { return (+n).toFixed(1); }
  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function pts(a) { return a.map(function (p) { return f1(p[0]) + ',' + f1(p[1]); }).join(' '); }
  function poly(a, fill, g, cls) { return el('polygon', { points: pts(a), fill: fill, 'class': cls || 'xp-face' }, g); }
  function seg(a, b, g, cls) { return el('line', { x1: f1(a[0]), y1: f1(a[1]), x2: f1(b[0]), y2: f1(b[1]), 'class': cls }, g); }

  // Logo-derived palette: [top, +y face, +x face]
  var COL = {
    panel:   ['#F5F7FC', '#DCE2EE', '#C1CADC'],
    frame:   ['#3C4A7C', '#26336A', '#1A2552'],
    coil:    ['#C9D1E0', '#9AA6C1', '#8290AD'],
    deck:    ['#EEF1F7', '#D0D7E5', '#B6C0D4'],
    comp:    ['#2D50CF', '#0A2791', '#091F71'],
    motor:   ['#6A77A0', '#46527F', '#2F3A63'],
    cabinet: ['#FBFCFE', '#E2E7F0', '#C8D0DF'],
    evap:    ['#7D97E6', '#3858C4', '#1F3B98']
  };

  var defs = el('defs', null, svg);
  var blur = el('filter', { id: 'xp-blur', x: '-20%', y: '-20%', width: '140%', height: '140%' }, defs);
  el('feGaussianBlur', { stdDeviation: '10' }, blur);
  var gradId = 0;

  function box(g, b, col) {
    var x0 = b.x, x1 = b.x + b.w, y0 = b.y, y1 = b.y + b.d, z0 = b.z, z1 = b.z + b.h;
    poly([P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)], col[0], g);
    poly([P(x0, y1, z1), P(x1, y1, z1), P(x1, y1, z0), P(x0, y1, z0)], col[1], g);
    poly([P(x1, y0, z1), P(x1, y1, z1), P(x1, y1, z0), P(x1, y0, z0)], col[2], g);
  }

  // Cylinder lying along x: {x0, x1, y, z, r}
  function cylX(g, c, col) {
    function at(x, th) {
      var o = P(x, c.y, c.z), u = Math.cos(th) * c.r, v = Math.sin(th) * c.r;
      return [o[0] - C30 * u, o[1] + S30 * u - v];
    }
    var a1 = Math.PI * .75, a2 = Math.PI * 1.75, A = at(c.x1, a1), B = at(c.x1, a2);
    var id = 'xp-g' + (gradId++);
    var grad = el('linearGradient', { id: id, gradientUnits: 'userSpaceOnUse', x1: f1(A[0]), y1: f1(A[1]), x2: f1(B[0]), y2: f1(B[1]) }, defs);
    el('stop', { offset: '0', 'stop-color': col[0] }, grad);
    el('stop', { offset: '.5', 'stop-color': col[1] }, grad);
    el('stop', { offset: '1', 'stop-color': col[2] }, grad);
    poly([at(c.x0, a1), at(c.x1, a1), at(c.x1, a2), at(c.x0, a2)], 'url(#' + id + ')', g);
    var o = P(c.x1, c.y, c.z);
    var cap = el('g', { transform: 'matrix(' + [-C30, S30, 0, -1, o[0], o[1]].map(f1).join(',') + ')' }, g);
    el('circle', { r: c.r, fill: col[2], 'class': 'xp-face' }, cap);
    el('circle', { r: c.r * .7, fill: 'none', 'class': 'xp-ring' }, cap);
    for (var i = 0; i < 8; i++) {
      var th = i * Math.PI / 4;
      el('circle', { cx: f1(Math.cos(th) * c.r * .86), cy: f1(Math.sin(th) * c.r * .86), r: 1.4, 'class': 'xp-bolt' }, cap);
    }
  }

  // Axial condenser fan sitting on a horizontal plane: {x, y, z, r, h}
  var rotors = [];
  function fan(g, c) {
    var o0 = P(c.x, c.y, c.z), o1 = P(c.x, c.y, c.z + c.h);
    var rx = c.r * R2 * C30, ry = c.r * R2 * S30;
    el('ellipse', { cx: f1(o0[0]), cy: f1(o0[1]), rx: f1(rx), ry: f1(ry), fill: '#1A2552', 'class': 'xp-face' }, g);
    poly([[o0[0] - rx, o0[1]], [o1[0] - rx, o1[1]], [o1[0] + rx, o1[1]], [o0[0] + rx, o0[1]]], '#26336A', g);
    el('ellipse', { cx: f1(o1[0]), cy: f1(o1[1]), rx: f1(rx), ry: f1(ry), fill: '#08133F', 'class': 'xp-face' }, g);
    var plane = el('g', { transform: 'matrix(' + [C30, S30, -C30, S30, o1[0], o1[1]].map(f1).join(',') + ')' }, g);
    var rot = el('g', null, plane);
    var r = c.r;
    for (var i = 0; i < 5; i++) {
      el('path', {
        d: 'M0 0C' + f1(r * .25) + ' ' + f1(-r * .18) + ' ' + f1(r * .7) + ' ' + f1(-r * .34) + ' ' + f1(r * .9) + ' ' + f1(-r * .08) +
           'C' + f1(r * .72) + ' ' + f1(r * .14) + ' ' + f1(r * .3) + ' ' + f1(r * .14) + ' 0 0Z',
        fill: i % 2 ? '#9FB1E6' : '#B8C7F0', transform: 'rotate(' + i * 72 + ')'
      }, rot);
    }
    el('circle', { r: f1(r * .17), fill: '#EEF2FA' }, rot);
    el('circle', { r: f1(r * .96), fill: 'none', 'class': 'xp-grille' }, plane);
    el('circle', { r: f1(r * .6), fill: 'none', 'class': 'xp-grille' }, plane);
    seg([-r * .96, 0], [r * .96, 0], plane, 'xp-grille');
    seg([0, -r * .96], [0, r * .96], plane, 'xp-grille');
    rotors.push(rot);
  }

  /* ---------- Scene ---------- */
  var floor = el('g', { 'class': 'xp-floor' }, svg);
  for (var gy = -240; gy <= 440; gy += 40) seg(P(-260, gy, -70), P(600, gy, -70), floor, 'xp-grid');
  for (var gx = -260; gx <= 600; gx += 40) seg(P(gx, -240, -70), P(gx, 440, -70), floor, 'xp-grid');
  poly([P(-14, -14, -2), P(346, -14, -2), P(346, 142, -2), P(-14, 142, -2)], 'rgba(0,0,0,.45)', floor, 'xp-shadow')
    .setAttribute('filter', 'url(#xp-blur)');

  var layer = el('g', { 'class': 'xp-parts' }, svg);
  var labelLayer = el('g', { 'class': 'xp-labels' }, svg);
  var parts = [];

  function part(id, cfg, draw) {
    cfg.id = id;
    cfg.g = el('g', { 'class': 'xp-part xp-' + id }, layer);
    draw(cfg.g);
    parts.push(cfg);
  }

  var FANS = [33, 98, 164, 229];

  part('base', { bb: [-4, -4, 0, 334, 128, 10], ex: [0, 0, -50], win: [.86, .98] }, function (g) {
    box(g, { x: -4, y: -4, z: 0, w: 338, d: 132, h: 10 }, COL.frame);
  });

  part('back', { bb: [0, 0, 10, 262, 3, 76], ex: [0, 0, 0], win: [0, 1] }, function (g) {
    box(g, { x: 0, y: 0, z: 10, w: 262, d: 3, h: 66 }, COL.panel);
  });

  part('comps', {
    bb: [46, 20, 10, 238, 60, 60], ex: [0, -10, 118], win: [.60, .76], step: 4,
    label: { key: 'ch.s4.t', fb: 'Screw compressors', num: '04', at: [208, 40, 54], side: 1 }
  }, function (g) {
    [46, 150].forEach(function (x) {
      box(g, { x: x, y: 20, z: 10, w: 60, d: 40, h: 44 }, COL.comp);
      box(g, { x: x + 8, y: 26, z: 54, w: 18, d: 12, h: 6 }, COL.motor);
      cylX(g, { x0: x + 60, x1: x + 88, y: 40, z: 30, r: 16 }, COL.motor);
    });
  });

  part('evap', {
    bb: [10, 70, 12, 250, 114, 66], ex: [0, 196, -30], win: [.44, .60], step: 3,
    label: { key: 'ch.s3.t', fb: 'Evaporator', num: '03', at: [24, 112, 40], side: -1 }
  }, function (g) {
    cylX(g, { x0: 10, x1: 250, y: 92, z: 34, r: 22 }, COL.evap);
    [44, 206].forEach(function (x) { box(g, { x: x, y: 86, z: 52, w: 12, d: 12, h: 14 }, COL.evap); });
  });

  part('front', { bb: [0, 121, 10, 262, 124, 76], ex: [0, 250, 0], win: [0, .1], fade: true }, function (g) {
    box(g, { x: 0, y: 121, z: 10, w: 262, d: 3, h: 66 }, COL.panel);
    for (var z = 18; z < 72; z += 6) seg(P(8, 124, z), P(254, 124, z), g, 'xp-louver');
    seg(P(131, 124, 12), P(131, 124, 74), g, 'xp-seam');
  });

  part('cabinet', {
    bb: [262, 0, 10, 330, 124, 134], ex: [150, 0, 0], win: [.76, .9], step: 5,
    label: { key: 'ch.s5.t', fb: 'Controls & power', num: '05', at: [330, 70, 134], side: 1 }
  }, function (g) {
    box(g, { x: 262, y: 0, z: 10, w: 68, d: 124, h: 124 }, COL.cabinet);
    poly([P(262, 124, 134), P(330, 124, 134), P(330, 124, 126), P(262, 124, 126)], '#E3120B', g);
    poly([P(330, 0, 134), P(330, 124, 134), P(330, 124, 126), P(330, 0, 126)], '#B50D08', g);
    seg(P(296, 124, 16), P(296, 124, 122), g, 'xp-seam');
    seg(P(290, 124, 60), P(290, 124, 78), g, 'xp-handle');
    seg(P(302, 124, 60), P(302, 124, 78), g, 'xp-handle');
    poly([P(268, 124, 112), P(288, 124, 112), P(288, 124, 98), P(268, 124, 98)], '#0A1D66', g);
    poly([P(270, 124, 110), P(282, 124, 110), P(282, 124, 104), P(270, 124, 104)], '#4DB5FF', g, 'xp-screen');
    for (var z = 30; z < 118; z += 8) seg(P(330, 18, z), P(330, 106, z), g, 'xp-louver');
  });

  part('coilB', { bb: [0, 2, 76, 262, 14, 144], ex: [0, -112, 40], win: [.28, .44], step: 2 }, function (g) {
    box(g, { x: 0, y: 2, z: 76, w: 262, d: 12, h: 68 }, COL.coil);
    for (var x = 6; x < 258; x += 5) seg(P(x, 14, 80), P(x, 14, 140), g, 'xp-fin');
  });

  part('coilF', {
    bb: [0, 110, 76, 262, 122, 144], ex: [0, 132, 40], win: [.28, .44], step: 2,
    label: { key: 'ch.s2.t', fb: 'Condenser coils', num: '02', at: [20, 122, 132], side: -1 }
  }, function (g) {
    box(g, { x: 0, y: 110, z: 76, w: 262, d: 12, h: 68 }, COL.coil);
    for (var x = 6; x < 258; x += 5) seg(P(x, 122, 80), P(x, 122, 140), g, 'xp-fin');
  });

  part('deck', { bb: [0, 0, 144, 262, 124, 151], ex: [0, 0, 158], win: [.12, .28], step: 1 }, function (g) {
    box(g, { x: 0, y: 0, z: 144, w: 262, d: 124, h: 7 }, COL.deck);
    FANS.forEach(function (x) {
      var o = P(x, 62, 151);
      el('ellipse', { cx: f1(o[0]), cy: f1(o[1]), rx: f1(28 * R2 * C30), ry: f1(28 * R2 * S30), fill: '#0B1640' }, g);
    });
  });

  part('fans', {
    bb: [6, 35, 151, 256, 89, 160], ex: [0, 0, 250], win: [.1, .26], step: 1,
    label: { key: 'ch.s1.t', fb: 'Condenser fans', num: '01', at: [256, 62, 160], side: 1 }
  }, function (g) {
    FANS.forEach(function (x) { fan(g, { x: x, y: 62, z: 151, r: 27, h: 9 }); });
  });

  /* ---------- Labels ---------- */
  parts.forEach(function (p) {
    if (!p.label) return;
    var L = p.label, a = P(L.at[0], L.at[1], L.at[2]);
    var elbow = [a[0] + L.side * 30, a[1] - 30], end = [elbow[0] + L.side * 30, elbow[1]];
    var g = el('g', { 'class': 'xp-label', opacity: 0 }, labelLayer);
    el('polyline', { points: pts([a, elbow, end]), 'class': 'xp-lead' }, g);
    el('circle', { cx: f1(a[0]), cy: f1(a[1]), r: 3.5, 'class': 'xp-dot' }, g);
    var t = el('text', { x: f1(end[0] + L.side * 8), y: f1(end[1] + 7), 'text-anchor': L.side > 0 ? 'start' : 'end' }, g);
    var n = el('tspan', { 'class': 'xp-num' }, t);
    n.textContent = L.num + '  ';
    var s = el('tspan', null, t);
    s.textContent = T(L.key, L.fb).replace(/<[^>]+>/g, '').toLocaleUpperCase(LANG);
    L.g = g; L.text = t; L.end = end;
  });

  /* ---------- Fit the viewBox ---------- */
  function corners(bb, off) {
    var out = [];
    for (var i = 0; i < 8; i++) {
      out.push(P((i & 1 ? bb[3] : bb[0]) + off[0], (i & 2 ? bb[4] : bb[1]) + off[1], (i & 4 ? bb[5] : bb[2]) + off[2]));
    }
    return out;
  }
  // Two camera framings: close on the assembled unit, wide on the exploded view.
  var vbStart = null, vbEnd = null, camK = -1;
  function bounds(fn) {
    var b = [Infinity, Infinity, -Infinity, -Infinity];
    fn(function (p) { b[0] = Math.min(b[0], p[0]); b[1] = Math.min(b[1], p[1]); b[2] = Math.max(b[2], p[0]); b[3] = Math.max(b[3], p[1]); });
    return b;
  }
  function fit(withLabels) {
    var a = bounds(function (add) { parts.forEach(function (p) { corners(p.bb, [0, 0, 0]).forEach(add); }); });
    var e = bounds(function (add) {
      parts.forEach(function (p) {
        corners(p.bb, [0, 0, 0]).forEach(add);
        if (!p.fade) corners(p.bb, p.ex).forEach(add);
        if (withLabels && p.label) {
          var L = p.label, o = P(p.ex[0], p.ex[1], p.ex[2]);
          var w = L.text.getComputedTextLength() || L.text.textContent.length * 8;
          add([L.end[0] + o[0] + L.side * (12 + w), L.end[1] + o[1] - 14]);
          add([L.end[0] + o[0], L.end[1] + o[1] + 14]);
        }
      });
    });
    var padA = 110, padE = 18;
    vbStart = [a[0] - padA, a[1] - padA, a[2] - a[0] + padA * 2, a[3] - a[1] + padA * 2];
    vbEnd = [e[0] - padE, e[1] - padE, e[2] - e[0] + padE * 2, e[3] - e[1] + padE * 2];
    camK = -1;
    camera(lastP);
  }
  function camera(p) {
    if (!vbStart) return;
    var k = Math.min(1, Math.max(0, (p - .04) / .5));
    k = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    if (Math.abs(k - camK) < .0005) return;
    camK = k;
    svg.setAttribute('viewBox', vbStart.map(function (v, i) { return f1(v + (vbEnd[i] - v) * k); }).join(' '));
  }

  /* ---------- Depth sorting (painter's algorithm on axis-aligned boxes) ---------- */
  function cur(p) {
    var o = p.off || [0, 0, 0], b = p.bb;
    return [b[0] + o[0], b[1] + o[1], b[2] + o[2], b[3] + o[0], b[4] + o[1], b[5] + o[2]];
  }
  function below(a, b) { return a[3] <= b[0] + .01 || a[4] <= b[1] + .01 || a[5] <= b[2] + .01; }
  function depth(a) { return a[0] + a[3] + a[1] + a[4] + a[2] + a[5]; }
  function mustBefore(A, B) {
    var a = cur(A), b = cur(B), ab = below(a, b), ba = below(b, a);
    if (ab !== ba) return ab;
    if (!ab) return depth(a) < depth(b);
    return false;
  }
  var lastOrder = '';
  function sortParts() {
    var rem = parts.slice(), out = [];
    while (rem.length) {
      var pick = -1, i, j;
      for (i = 0; i < rem.length && pick < 0; i++) {
        var ok = true;
        for (j = 0; j < rem.length; j++) if (i !== j && mustBefore(rem[j], rem[i])) { ok = false; break; }
        if (ok) pick = i;
      }
      if (pick < 0) {
        pick = 0;
        for (i = 1; i < rem.length; i++) if (depth(cur(rem[i])) < depth(cur(rem[pick]))) pick = i;
      }
      out.push(rem.splice(pick, 1)[0]);
    }
    var key = out.map(function (p) { return p.id; }).join();
    if (key !== lastOrder) {
      out.forEach(function (p) { layer.appendChild(p.g); });
      lastOrder = key;
    }
  }

  /* ---------- Render ---------- */
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  var spin = 0, scrollSpin = 0, activeStep = -1;
  function applySpin() {
    var a = (spin + scrollSpin) % 360;
    rotors.forEach(function (r) { r.setAttribute('transform', 'rotate(' + f1(a) + ')'); });
  }

  var lastP = 0;
  function render(p) {
    lastP = p;
    camera(p);
    parts.forEach(function (part) {
      var t = ease(Math.min(1, Math.max(0, (p - part.win[0]) / (part.win[1] - part.win[0]))));
      part.off = [part.ex[0] * t, part.ex[1] * t, part.ex[2] * t];
      var s = P(part.off[0], part.off[1], part.off[2]);
      part.g.setAttribute('transform', 'translate(' + f1(s[0]) + ' ' + f1(s[1]) + ')');
      if (part.fade) part.g.setAttribute('opacity', f1(1 - t));
      if (part.label) {
        part.label.g.setAttribute('transform', 'translate(' + f1(s[0]) + ' ' + f1(s[1]) + ')');
        part.label.g.setAttribute('opacity', Math.max(0, Math.min(1, (t - .55) / .45)).toFixed(2));
      }
    });
    sortParts();
    scrollSpin = p * 900;
    applySpin();

    var step = p < .1 ? 0 : p < .28 ? 1 : p < .44 ? 2 : p < .6 ? 3 : p < .76 ? 4 : p < .92 ? 5 : 6;
    if (step !== activeStep) {
      activeStep = step;
      parts.forEach(function (part) { part.g.classList.toggle('is-active', part.step === step); });
    }
    return step;
  }

  // Idle fan spin while the chiller is on screen
  var visible = false, last = 0, reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      if (visible) { last = performance.now(); requestAnimationFrame(loop); }
    }).observe(svg);
  }
  function loop(now) {
    if (!visible) return;
    spin += (now - last) * .09;
    last = now;
    applySpin();
    requestAnimationFrame(loop);
  }

  var mqLabels = window.matchMedia('(min-width: 900px)');
  fit(mqLabels.matches);
  if (mqLabels.addEventListener) mqLabels.addEventListener('change', function (e) { fit(e.matches); });

  window.PZChiller = { render: render, fit: function () { fit(mqLabels.matches); } };
  render(0);
})();
