/* ==========================================================================
   ProZone — isometric equipment that comes apart on scroll.
   Drawn in code (no image files). The SVG picks its machine with
   data-machine="chiller | boiler | ahu | bms"; window.PZXp.render(progress 0..1).
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
  // Flat rectangles on the two visible side planes
  function rectY(g, y, x0, x1, z0, z1, fill, cls) { return poly([P(x0, y, z1), P(x1, y, z1), P(x1, y, z0), P(x0, y, z0)], fill, g, cls); }
  function rectX(g, x, y0, y1, z0, z1, fill, cls) { return poly([P(x, y0, z1), P(x, y1, z1), P(x, y1, z0), P(x, y0, z0)], fill, g, cls); }

  // Logo-derived palette: [top, +y face, +x face]
  var COL = {
    panel:   ['#F5F7FC', '#DCE2EE', '#C1CADC'],
    frame:   ['#3C4A7C', '#26336A', '#1A2552'],
    coil:    ['#C9D1E0', '#9AA6C1', '#8290AD'],
    deck:    ['#EEF1F7', '#D0D7E5', '#B6C0D4'],
    comp:    ['#2D50CF', '#0A2791', '#091F71'],
    motor:   ['#6A77A0', '#46527F', '#2F3A63'],
    cabinet: ['#FBFCFE', '#E2E7F0', '#C8D0DF'],
    evap:    ['#7D97E6', '#3858C4', '#1F3B98'],
    hot:     ['#FF8A7E', '#E3271C', '#B3150D'],
    metal:   ['#C9D0DE', '#98A2BA', '#77829E'],
    valve:   ['#FFD27A', '#E8A93A', '#B87F1E'],
    wheel:   ['#E9EDF5', '#BAC3D6', '#929DB6'],
    dark:    ['#2A3560', '#1A2552', '#121B42'],
    copper:  ['#F6A96B', '#D9783A', '#B05A24']
  };

  var defs = el('defs', null, svg);
  var blur = el('filter', { id: 'xp-blur', x: '-20%', y: '-20%', width: '140%', height: '140%' }, defs);
  el('feGaussianBlur', { stdDeviation: '10' }, blur);
  var gradId = 0;
  function gradient(a, b, col) {
    var id = 'xp-g' + (gradId++);
    var grad = el('linearGradient', { id: id, gradientUnits: 'userSpaceOnUse', x1: f1(a[0]), y1: f1(a[1]), x2: f1(b[0]), y2: f1(b[1]) }, defs);
    el('stop', { offset: '0', 'stop-color': col[0] }, grad);
    el('stop', { offset: '.5', 'stop-color': col[1] }, grad);
    el('stop', { offset: '1', 'stop-color': col[2] }, grad);
    return 'url(#' + id + ')';
  }

  function box(g, b, col) {
    var x0 = b.x, x1 = b.x + b.w, y0 = b.y, y1 = b.y + b.d, z0 = b.z, z1 = b.z + b.h;
    poly([P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)], col[0], g);
    poly([P(x0, y1, z1), P(x1, y1, z1), P(x1, y1, z0), P(x0, y1, z0)], col[1], g);
    poly([P(x1, y0, z1), P(x1, y1, z1), P(x1, y1, z0), P(x1, y0, z0)], col[2], g);
  }

  // Group drawn on the +x end plane of a point: local (u, v) = world (+y, +z)
  function capX(g, x, y, z) {
    var o = P(x, y, z);
    return el('g', { transform: 'matrix(' + [-C30, S30, 0, -1, o[0], o[1]].map(f1).join(',') + ')' }, g);
  }

  // Cylinder lying along x: {x0, x1, y, z, r}
  function cylX(g, c, col) {
    function at(x, th) {
      var o = P(x, c.y, c.z), u = Math.cos(th) * c.r, v = Math.sin(th) * c.r;
      return [o[0] - C30 * u, o[1] + S30 * u - v];
    }
    var a1 = Math.PI * .75, a2 = Math.PI * 1.75;
    poly([at(c.x0, a1), at(c.x1, a1), at(c.x1, a2), at(c.x0, a2)], gradient(at(c.x1, a1), at(c.x1, a2), col), g);
    var cap = capX(g, c.x1, c.y, c.z);
    el('circle', { r: c.r, fill: col[2], 'class': 'xp-face' }, cap);
    el('circle', { r: c.r * .7, fill: 'none', 'class': 'xp-ring' }, cap);
    if (c.bolts !== false) {
      for (var i = 0; i < 8; i++) {
        var th = i * Math.PI / 4;
        el('circle', { cx: f1(Math.cos(th) * c.r * .86), cy: f1(Math.sin(th) * c.r * .86), r: 1.4, 'class': 'xp-bolt' }, cap);
      }
    }
    return cap;
  }

  // Upright cylinder: {x, y, z0, z1, r}
  function cylZ(g, c, col) {
    var o0 = P(c.x, c.y, c.z0), o1 = P(c.x, c.y, c.z1);
    var rx = c.r * R2 * C30, ry = c.r * R2 * S30;
    el('ellipse', { cx: f1(o0[0]), cy: f1(o0[1]), rx: f1(rx), ry: f1(ry), fill: col[2], 'class': 'xp-face' }, g);
    poly([[o0[0] - rx, o0[1]], [o1[0] - rx, o1[1]], [o1[0] + rx, o1[1]], [o0[0] + rx, o0[1]]],
      gradient([o0[0] - rx, 0], [o0[0] + rx, 0], [col[1], col[0], col[2]]), g);
    el('ellipse', { cx: f1(o1[0]), cy: f1(o1[1]), rx: f1(rx), ry: f1(ry), fill: col[0], 'class': 'xp-face' }, g);
  }

  // Five swept blades around the origin of a local plane
  function blades(parent, r, n, light) {
    for (var i = 0; i < n; i++) {
      el('path', {
        d: 'M0 0C' + f1(r * .25) + ' ' + f1(-r * .18) + ' ' + f1(r * .7) + ' ' + f1(-r * .34) + ' ' + f1(r * .9) + ' ' + f1(-r * .08) +
           'C' + f1(r * .72) + ' ' + f1(r * .14) + ' ' + f1(r * .3) + ' ' + f1(r * .14) + ' 0 0Z',
        fill: i % 2 ? light[0] : light[1], transform: 'rotate(' + f1(i * 360 / n) + ')'
      }, parent);
    }
  }

  // Spinning parts: {g, k} where k is the speed factor
  var rotors = [];

  // Axial condenser fan sitting on a horizontal plane: {x, y, z, r, h}
  function fan(g, c) {
    var o0 = P(c.x, c.y, c.z), o1 = P(c.x, c.y, c.z + c.h);
    var rx = c.r * R2 * C30, ry = c.r * R2 * S30;
    el('ellipse', { cx: f1(o0[0]), cy: f1(o0[1]), rx: f1(rx), ry: f1(ry), fill: '#1A2552', 'class': 'xp-face' }, g);
    poly([[o0[0] - rx, o0[1]], [o1[0] - rx, o1[1]], [o1[0] + rx, o1[1]], [o0[0] + rx, o0[1]]], '#26336A', g);
    el('ellipse', { cx: f1(o1[0]), cy: f1(o1[1]), rx: f1(rx), ry: f1(ry), fill: '#08133F', 'class': 'xp-face' }, g);
    var plane = el('g', { transform: 'matrix(' + [C30, S30, -C30, S30, o1[0], o1[1]].map(f1).join(',') + ')' }, g);
    var rot = el('g', null, plane);
    var r = c.r;
    blades(rot, r, 5, ['#9FB1E6', '#B8C7F0']);
    el('circle', { r: f1(r * .17), fill: '#EEF2FA' }, rot);
    el('circle', { r: f1(r * .96), fill: 'none', 'class': 'xp-grille' }, plane);
    el('circle', { r: f1(r * .6), fill: 'none', 'class': 'xp-grille' }, plane);
    seg([-r * .96, 0], [r * .96, 0], plane, 'xp-grille');
    seg([0, -r * .96], [0, r * .96], plane, 'xp-grille');
    rotors.push({ g: rot, k: 1 });
  }

  /* ---------- Scene ---------- */
  var floor = el('g', { 'class': 'xp-floor' }, svg);
  for (var gy = -240; gy <= 440; gy += 40) seg(P(-260, gy, -70), P(600, gy, -70), floor, 'xp-grid');
  for (var gx = -260; gx <= 600; gx += 40) seg(P(gx, -240, -70), P(gx, 440, -70), floor, 'xp-grid');

  var layer = el('g', { 'class': 'xp-parts' }, svg);
  var labelLayer = el('g', { 'class': 'xp-labels' }, svg);
  var parts = [];

  function part(id, cfg, draw) {
    cfg.id = id;
    cfg.g = el('g', { 'class': 'xp-part xp-' + id }, layer);
    draw(cfg.g);
    parts.push(cfg);
  }

  // Shared timing: casing opens, then parts 1–5 come out, then the base drops
  var OPEN = [0, .1], W = [null, [.1, .26], [.28, .44], [.44, .6], [.6, .76], [.76, .9]], DROP = [.86, .98];
  function lab(key, fb, num, at, side) { return { key: key, fb: fb, num: num, at: at, side: side }; }

  /* ---------- Machines ---------- */
  var MACHINES = {

    // Air-cooled screw chiller
    chiller: function () {
      var FANS = [33, 98, 164, 229];

      part('base', { bb: [-4, -4, 0, 334, 128, 10], ex: [0, 0, -50], win: DROP }, function (g) {
        box(g, { x: -4, y: -4, z: 0, w: 338, d: 132, h: 10 }, COL.frame);
      });

      part('back', { bb: [0, 0, 10, 262, 3, 76], ex: [0, 0, 0], win: [0, 1] }, function (g) {
        box(g, { x: 0, y: 0, z: 10, w: 262, d: 3, h: 66 }, COL.panel);
      });

      part('comps', {
        bb: [46, 20, 10, 238, 60, 60], ex: [0, -10, 118], win: [.60, .76], step: 4,
        label: lab('ch.s4.t', 'Screw compressors', '04', [208, 40, 54], 1)
      }, function (g) {
        [46, 150].forEach(function (x) {
          box(g, { x: x, y: 20, z: 10, w: 60, d: 40, h: 44 }, COL.comp);
          box(g, { x: x + 8, y: 26, z: 54, w: 18, d: 12, h: 6 }, COL.motor);
          cylX(g, { x0: x + 60, x1: x + 88, y: 40, z: 30, r: 16 }, COL.motor);
        });
      });

      part('evap', {
        bb: [10, 70, 12, 250, 114, 66], ex: [0, 196, -30], win: [.44, .60], step: 3,
        label: lab('ch.s3.t', 'Evaporator', '03', [24, 112, 40], -1)
      }, function (g) {
        cylX(g, { x0: 10, x1: 250, y: 92, z: 34, r: 22 }, COL.evap);
        [44, 206].forEach(function (x) { box(g, { x: x, y: 86, z: 52, w: 12, d: 12, h: 14 }, COL.evap); });
      });

      part('front', { bb: [0, 121, 10, 262, 124, 76], ex: [0, 250, 0], win: OPEN, fade: true }, function (g) {
        box(g, { x: 0, y: 121, z: 10, w: 262, d: 3, h: 66 }, COL.panel);
        for (var z = 18; z < 72; z += 6) seg(P(8, 124, z), P(254, 124, z), g, 'xp-louver');
        seg(P(131, 124, 12), P(131, 124, 74), g, 'xp-seam');
      });

      part('cabinet', {
        bb: [262, 0, 10, 330, 124, 134], ex: [150, 0, 0], win: [.76, .9], step: 5,
        label: lab('ch.s5.t', 'Controls & power', '05', [330, 70, 134], 1)
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
        label: lab('ch.s2.t', 'Condenser coils', '02', [20, 122, 132], -1)
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
        label: lab('ch.s1.t', 'Condenser fans', '01', [256, 62, 160], 1)
      }, function (g) {
        FANS.forEach(function (x) { fan(g, { x: x, y: 62, z: 151, r: 27, h: 9 }); });
      });

      return { shadow: [-14, -14, 346, 142] };
    },

    // Floor-standing commercial gas boiler
    boiler: function () {
      part('base', { bb: [-4, -4, 0, 184, 124, 10], ex: [0, 0, -50], win: DROP }, function (g) {
        box(g, { x: -4, y: -4, z: 0, w: 188, d: 128, h: 10 }, COL.frame);
      });

      // Insulated left wall stays as a backdrop
      part('wall', { bb: [0, 0, 10, 4, 117, 210], ex: [0, 0, 0], win: [0, 1] }, function (g) {
        box(g, { x: 0, y: 0, z: 10, w: 4, d: 117, h: 200 }, COL.panel);
        for (var y = 14; y < 112; y += 14) seg(P(4, y, 16), P(4, y, 204), g, 'xp-seam');
      });

      part('flue', {
        bb: [20, 4, 22, 140, 20, 190], ex: [0, -130, 130], win: W[3], step: 3,
        label: lab('bo.s3.t', 'Flue & condensate', '03', [140, 12, 150], 1)
      }, function (g) {
        cylZ(g, { x: 40, y: 12, z0: 22, z1: 40, r: 6 }, COL.metal);
        box(g, { x: 20, y: 4, z: 40, w: 120, d: 16, h: 110 }, COL.metal);
        for (var z = 52; z < 146; z += 12) seg(P(140, 6, z), P(140, 18, z), g, 'xp-seam');
        cylZ(g, { x: 80, y: 12, z0: 150, z1: 190, r: 10 }, COL.metal);
      });

      part('hx', {
        bb: [20, 24, 40, 140, 100, 160], ex: [0, 170, 0], win: W[2], step: 2,
        label: lab('bo.s2.t', 'Heat exchanger', '02', [20, 100, 140], -1)
      }, function (g) {
        box(g, { x: 20, y: 24, z: 40, w: 120, d: 76, h: 120 }, COL.hot);
        for (var z = 48; z < 156; z += 6) seg(P(26, 100, z), P(134, 100, z), g, 'xp-fin');
        for (var y = 30; y < 98; y += 6) seg(P(140, y, 48), P(140, y, 152), g, 'xp-fin');
        var o = capX(g, 140, 62, 100);
        el('circle', { r: 9, fill: '#3A0A06', 'class': 'xp-face' }, o);
        el('circle', { r: 5, 'class': 'xp-flame' }, o);
      });

      part('pump', {
        bb: [144, 22, 10, 176, 104, 92], ex: [170, 0, 0], win: W[4], step: 4,
        label: lab('bo.s4.t', 'Pump & gas valve', '04', [176, 40, 76], 1)
      }, function (g) {
        cylZ(g, { x: 160, y: 40, z0: 10, z1: 40, r: 16 }, COL.comp);
        cylZ(g, { x: 160, y: 40, z0: 40, z1: 76, r: 12 }, COL.motor);
        cylZ(g, { x: 160, y: 88, z0: 10, z1: 62, r: 5 }, COL.valve);
        box(g, { x: 146, y: 74, z: 62, w: 28, d: 28, h: 26 }, COL.valve);
        rectY(g, 102, 152, 168, 70, 80, '#0A1D66');
      });

      part('front', { bb: [0, 117, 10, 180, 120, 210], ex: [0, 250, 0], win: OPEN, fade: true }, function (g) {
        box(g, { x: 0, y: 117, z: 10, w: 180, d: 3, h: 200 }, COL.cabinet);
        rectY(g, 120, 0, 180, 194, 202, '#E3120B', 'xp-trim');
        seg(P(90, 120, 16), P(90, 120, 188), g, 'xp-seam');
        seg(P(82, 120, 96), P(82, 120, 120), g, 'xp-handle');
        seg(P(98, 120, 96), P(98, 120, 120), g, 'xp-handle');
        for (var z = 18; z < 50; z += 6) seg(P(10, 120, z), P(170, 120, z), g, 'xp-louver');
      });

      part('side', { bb: [177, 0, 10, 180, 117, 210], ex: [250, 0, 0], win: OPEN, fade: true }, function (g) {
        box(g, { x: 177, y: 0, z: 10, w: 3, d: 117, h: 200 }, COL.cabinet);
        poly([P(180, 0, 202), P(180, 117, 202), P(180, 117, 194), P(180, 0, 194)], '#B50D08', g, 'xp-trim');
        for (var z = 18; z < 50; z += 6) seg(P(180, 10, z), P(180, 107, z), g, 'xp-louver');
      });

      part('burner', {
        bb: [30, 32, 160, 130, 92, 196], ex: [-40, 0, 210], win: W[1], step: 1,
        label: lab('bo.s1.t', 'Burner & fan', '01', [30, 92, 178], -1)
      }, function (g) {
        box(g, { x: 30, y: 32, z: 160, w: 100, d: 60, h: 8 }, COL.frame);
        cylZ(g, { x: 60, y: 62, z0: 168, z1: 196, r: 22 }, COL.motor);
        box(g, { x: 92, y: 44, z: 168, w: 34, d: 36, h: 26 }, COL.comp);
        rectY(g, 80, 98, 120, 176, 186, '#4DB5FF', 'xp-screen');
        cylX(g, { x0: 126, x1: 132, y: 62, z: 181, r: 8, bolts: false }, COL.valve);
      });

      part('ctrl', {
        bb: [120, 100, 170, 176, 116, 206], ex: [0, 200, 150], win: W[5], step: 5,
        label: lab('bo.s5.t', 'Controls & safety', '05', [120, 116, 200], -1)
      }, function (g) {
        box(g, { x: 120, y: 100, z: 170, w: 56, d: 16, h: 36 }, COL.cabinet);
        rectY(g, 116, 120, 176, 200, 206, '#E3120B');
        rectY(g, 116, 126, 150, 178, 194, '#0A1D66');
        rectY(g, 116, 128, 146, 182, 191, '#4DB5FF', 'xp-screen');
        [158, 166].forEach(function (x) { rectY(g, 116, x, x + 5, 184, 189, '#4ADE80', 'xp-led'); });
      });

      part('top', { bb: [0, 0, 210, 180, 120, 236], ex: [0, 0, 200], win: OPEN, fade: true }, function (g) {
        box(g, { x: 0, y: 0, z: 210, w: 180, d: 120, h: 6 }, COL.cabinet);
        cylZ(g, { x: 80, y: 12, z0: 216, z1: 236, r: 12 }, COL.metal);
      });

      return { shadow: [-14, -14, 194, 134] };
    },

    // Air handling unit: filters → heat-recovery wheel → coils → plug fan → controls
    ahu: function () {
      part('base', { bb: [-2, -2, 0, 362, 112, 10], ex: [0, 0, -50], win: DROP }, function (g) {
        box(g, { x: -2, y: -2, z: 0, w: 364, d: 114, h: 10 }, COL.frame);
      });

      part('back', { bb: [0, 0, 10, 360, 3, 130], ex: [0, 0, 0], win: [0, 1] }, function (g) {
        box(g, { x: 0, y: 0, z: 10, w: 360, d: 3, h: 120 }, COL.panel);
        [30, 90, 140, 195, 275].forEach(function (x) { seg(P(x, 3, 14), P(x, 3, 126), g, 'xp-seam'); });
      });

      part('endL', { bb: [0, 3, 10, 3, 107, 130], ex: [0, 0, 0], win: [0, 1] }, function (g) {
        box(g, { x: 0, y: 3, z: 10, w: 3, d: 104, h: 120 }, COL.panel);
        for (var z = 22; z < 122; z += 8) seg(P(3, 12, z), P(3, 98, z), g, 'xp-louver');
      });

      part('endR', { bb: [357, 3, 10, 360, 107, 130], ex: [0, 0, 0], win: [0, 1] }, function (g) {
        box(g, { x: 357, y: 3, z: 10, w: 3, d: 104, h: 120 }, COL.panel);
        rectX(g, 360, 20, 90, 30, 112, '#26336A');
        rectX(g, 360, 26, 84, 36, 106, '#0B1640');
      });

      part('filters', {
        bb: [40, 6, 14, 80, 104, 126], ex: [-70, 0, 150], win: W[1], step: 1,
        label: lab('ah.s1.t', 'Filters', '01', [40, 104, 126], -1)
      }, function (g) {
        box(g, { x: 40, y: 6, z: 14, w: 6, d: 98, h: 112 }, COL.deck);
        box(g, { x: 52, y: 6, z: 14, w: 28, d: 98, h: 112 }, COL.cabinet);
        for (var y = 10; y < 102; y += 6) seg(P(46, y, 18), P(46, y, 122), g, 'xp-fin');
        [14, 42, 70, 98].forEach(function (z) { if (z > 14) seg(P(80, 8, z), P(80, 102, z), g, 'xp-seam'); });
        for (var y2 = 12; y2 < 100; y2 += 12) seg(P(80, y2, 18), P(80, y2, 122), g, 'xp-louver');
      });

      part('wheel', {
        bb: [100, 3, 18, 116, 107, 122], ex: [0, 180, 0], win: W[2], step: 2,
        label: lab('ah.s2.t', 'Heat-recovery wheel', '02', [108, 107, 70], -1)
      }, function (g) {
        var cap = cylX(g, { x0: 100, x1: 116, y: 55, z: 70, r: 52, bolts: false }, COL.wheel);
        var rot = el('g', null, cap);
        [.92, .78, .64, .5, .36].forEach(function (k) { el('circle', { r: f1(52 * k), fill: 'none', 'class': 'xp-ring' }, rot); });
        for (var i = 0; i < 12; i++) {
          var th = i * Math.PI / 6;
          seg([Math.cos(th) * 9, Math.sin(th) * 9], [Math.cos(th) * 50, Math.sin(th) * 50], rot, 'xp-spoke');
        }
        el('circle', { r: 9, fill: '#46527F', 'class': 'xp-face' }, rot);
        rotors.push({ g: rot, k: .12 });
      });

      part('coils', {
        bb: [150, 6, 14, 182, 104, 126], ex: [0, 0, 200], win: W[3], step: 3,
        label: lab('ah.s3.t', 'Cooling & heating coils', '03', [182, 6, 126], 1)
      }, function (g) {
        box(g, { x: 150, y: 6, z: 14, w: 12, d: 98, h: 112 }, COL.evap);
        for (var y = 10; y < 102; y += 4) seg(P(162, y, 18), P(162, y, 122), g, 'xp-fin');
        box(g, { x: 170, y: 6, z: 14, w: 12, d: 98, h: 112 }, COL.hot);
        for (var y2 = 10; y2 < 102; y2 += 4) seg(P(182, y2, 18), P(182, y2, 122), g, 'xp-fin');
      });

      part('fan', {
        bb: [204, 15, 14, 262, 95, 110], ex: [70, 250, 0], win: W[4], step: 4,
        label: lab('ah.s4.t', 'Supply fan & motor', '04', [262, 95, 70], 1)
      }, function (g) {
        box(g, { x: 204, y: 20, z: 14, w: 58, d: 70, h: 6 }, COL.frame);
        box(g, { x: 208, y: 40, z: 50, w: 32, d: 30, h: 36 }, COL.comp);
        var cap = cylX(g, { x0: 240, x1: 262, y: 55, z: 70, r: 40, bolts: false }, COL.motor);
        var rot = el('g', null, cap);
        blades(rot, 36, 7, ['#9FB1E6', '#B8C7F0']);
        el('circle', { r: 7, fill: '#EEF2FA' }, rot);
        el('circle', { r: 36, fill: 'none', 'class': 'xp-grille' }, cap);
        rotors.push({ g: rot, k: 1.4 });
      });

      part('front', { bb: [3, 107, 10, 357, 110, 130], ex: [0, 250, 0], win: OPEN, fade: true }, function (g) {
        box(g, { x: 3, y: 107, z: 10, w: 354, d: 3, h: 120 }, COL.panel);
        [30, 90, 140, 195, 275].forEach(function (x) { seg(P(x, 110, 14), P(x, 110, 126), g, 'xp-seam'); });
        [60, 167, 235, 316].forEach(function (x) {
          seg(P(x - 4, 110, 62), P(x - 4, 110, 80), g, 'xp-handle');
          seg(P(x + 4, 110, 62), P(x + 4, 110, 80), g, 'xp-handle');
        });
      });

      part('top', { bb: [0, 0, 130, 360, 110, 160], ex: [0, 0, 200], win: OPEN, fade: true }, function (g) {
        box(g, { x: 0, y: 0, z: 130, w: 360, d: 110, h: 4 }, COL.panel);
        box(g, { x: 10, y: 20, z: 134, w: 46, d: 70, h: 24 }, COL.metal);
        box(g, { x: 300, y: 20, z: 134, w: 46, d: 70, h: 24 }, COL.metal);
      });

      part('ctrl', {
        bb: [362, 24, 10, 394, 92, 118], ex: [140, 0, 0], win: W[5], step: 5,
        label: lab('ah.s5.t', 'Controls & VFD', '05', [394, 58, 118], 1)
      }, function (g) {
        box(g, { x: 362, y: 24, z: 10, w: 32, d: 68, h: 108 }, COL.cabinet);
        poly([P(362, 92, 118), P(394, 92, 118), P(394, 92, 110), P(362, 92, 110)], '#E3120B', g);
        poly([P(394, 24, 118), P(394, 92, 118), P(394, 92, 110), P(394, 24, 110)], '#B50D08', g);
        rectX(g, 394, 38, 66, 80, 100, '#0A1D66');
        rectX(g, 394, 41, 63, 84, 96, '#4DB5FF', 'xp-screen');
        rectX(g, 394, 72, 80, 88, 94, '#4ADE80', 'xp-led');
        for (var z = 24; z < 70; z += 8) seg(P(394, 36, z), P(394, 82, z), g, 'xp-louver');
      });

      return { shadow: [-14, -14, 404, 124] };
    },

    // BMS control cabinet: door with touch panel, DDC controllers, I/O, power, network
    bms: function () {
      part('base', { bb: [-2, -2, 0, 202, 70, 14], ex: [0, 0, 0], win: [0, 1] }, function (g) {
        box(g, { x: -2, y: -2, z: 0, w: 204, d: 72, h: 14 }, COL.frame);
      });

      part('shell', { bb: [0, 0, 14, 200, 4, 250], ex: [0, 0, 0], win: [0, 1] }, function (g) {
        box(g, { x: 0, y: 0, z: 14, w: 200, d: 4, h: 236 }, COL.panel);
      });

      part('sideL', { bb: [0, 4, 14, 4, 64, 250], ex: [0, 0, 0], win: [0, 1] }, function (g) {
        box(g, { x: 0, y: 4, z: 14, w: 4, d: 60, h: 236 }, COL.panel);
      });

      part('plate', { bb: [8, 4, 22, 192, 10, 242], ex: [0, 0, 0], win: [0, 1] }, function (g) {
        box(g, { x: 8, y: 4, z: 22, w: 184, d: 3, h: 220 }, COL.deck);
        [196, 136, 64].forEach(function (z) { box(g, { x: 12, y: 7, z: z, w: 176, d: 3, h: 6 }, COL.metal); });
      });

      [[170, 'ductA'], [104, 'ductB'], [30, 'ductC']].forEach(function (d) {
        part(d[1], { bb: [12, 10, d[0], 188, 24, d[0] + 12], ex: [0, 0, 0], win: [0, 1] }, function (g) {
          box(g, { x: 12, y: 10, z: d[0], w: 176, d: 14, h: 12 }, COL.metal);
          for (var x = 20; x < 186; x += 8) seg(P(x, 24, d[0] + 2), P(x, 24, d[0] + 10), g, 'xp-seam');
        });
      });

      part('ddc', {
        bb: [16, 10, 186, 144, 36, 226], ex: [0, 130, 110], win: W[2], step: 2,
        label: lab('bm.s2.t', 'DDC controllers', '02', [16, 36, 214], -1)
      }, function (g) {
        [16, 60, 104].forEach(function (x) {
          box(g, { x: x, y: 10, z: 186, w: 40, d: 26, h: 40 }, COL.comp);
          rectY(g, 36, x + 6, x + 30, 208, 220, '#0A1D66');
          rectY(g, 36, x + 8, x + 28, 210, 218, '#4DB5FF', 'xp-screen');
          rectY(g, 36, x + 32, x + 36, 214, 218, '#4ADE80', 'xp-led');
          for (var i = 0; i < 6; i++) rectY(g, 36, x + 4 + i * 6, x + 8 + i * 6, 189, 195, '#FF8A3D');
        });
      });

      part('net', {
        bb: [152, 10, 190, 186, 34, 240], ex: [0, 110, 150], win: W[5], step: 5,
        label: lab('bm.s5.t', 'Network & gateway', '05', [186, 22, 222], 1)
      }, function (g) {
        box(g, { x: 152, y: 10, z: 190, w: 34, d: 24, h: 32 }, COL.dark);
        for (var i = 0; i < 4; i++) {
          rectY(g, 34, 155 + i * 7.5, 160 + i * 7.5, 196, 202, '#0B1640');
          rectY(g, 34, 155 + i * 7.5, 158 + i * 7.5, 205, 208, '#4ADE80', 'xp-led');
        }
        rectY(g, 34, 156, 182, 212, 218, '#4DB5FF', 'xp-screen');
        cylZ(g, { x: 180, y: 16, z0: 222, z1: 240, r: 2 }, COL.dark);
      });

      part('io', {
        bb: [16, 10, 122, 186, 36, 160], ex: [0, 170, 30], win: W[3], step: 3,
        label: lab('bm.s3.t', 'I/O modules', '03', [16, 36, 150], -1)
      }, function (g) {
        for (var i = 0; i < 9; i++) {
          var x = 16 + i * 19;
          box(g, { x: x, y: 10, z: 122, w: 16, d: 26, h: 38 }, COL.cabinet);
          rectY(g, 36, x + 2, x + 14, 151, 157, '#FF8A3D');
          rectY(g, 36, x + 2, x + 14, 125, 131, '#FF8A3D');
          rectY(g, 36, x + 5, x + 8, 140, 143, i % 3 ? '#4ADE80' : '#F4140C', 'xp-led');
        }
      });

      part('power', {
        bb: [16, 10, 46, 184, 38, 96], ex: [0, 150, -26], win: W[4], step: 4,
        label: lab('bm.s4.t', 'Power & protection', '04', [16, 38, 86], -1)
      }, function (g) {
        box(g, { x: 16, y: 10, z: 50, w: 40, d: 26, h: 44 }, COL.metal);
        for (var z = 58; z < 90; z += 6) seg(P(18, 36, z), P(54, 36, z), g, 'xp-louver');
        rectY(g, 36, 44, 52, 82, 88, '#4ADE80', 'xp-led');
        for (var i = 0; i < 6; i++) {
          var x = 64 + i * 9;
          box(g, { x: x, y: 10, z: 50, w: 8, d: 24, h: 40 }, COL.cabinet);
          rectY(g, 34, x + 2, x + 6, 68, 76, '#E3120B');
        }
        box(g, { x: 128, y: 12, z: 46, w: 56, d: 26, h: 12 }, COL.dark);
        cylX(g, { x0: 134, x1: 178, y: 25, z: 74, r: 14, bolts: false }, COL.copper);
        box(g, { x: 128, y: 12, z: 88, w: 56, d: 26, h: 8 }, COL.dark);
      });

      part('sideR', { bb: [196, 4, 14, 200, 64, 250], ex: [0, 0, 0], win: [0, 1] }, function (g) {
        box(g, { x: 196, y: 4, z: 14, w: 4, d: 60, h: 236 }, COL.panel);
        for (var z = 30; z < 70; z += 6) seg(P(200, 14, z), P(200, 54, z), g, 'xp-louver');
      });

      part('roof', { bb: [0, 4, 246, 196, 64, 250], ex: [0, 0, 0], win: [0, 1] }, function (g) {
        box(g, { x: 0, y: 4, z: 246, w: 196, d: 60, h: 4 }, COL.panel);
      });

      part('door', {
        bb: [0, 64, 14, 200, 68, 250], ex: [240, 120, 0], win: W[1], step: 1,
        label: lab('bm.s1.t', 'Operator touch panel', '01', [200, 66, 230], 1)
      }, function (g) {
        box(g, { x: 0, y: 64, z: 14, w: 200, d: 4, h: 236 }, COL.cabinet);
        rectY(g, 68, 0, 200, 236, 244, '#E3120B', 'xp-trim');
        poly([P(200, 64, 244), P(200, 68, 244), P(200, 68, 236), P(200, 64, 236)], '#B50D08', g, 'xp-trim');
        rectY(g, 68, 50, 150, 140, 214, '#0A1D66');
        rectY(g, 68, 56, 144, 146, 208, '#0E2A8F');
        [[62, 96, 196, 202], [62, 120, 186, 190], [62, 108, 178, 182]].forEach(function (r) { rectY(g, 68, r[0], r[1], r[2], r[3], '#4DB5FF', 'xp-screen'); });
        [[104, 112], [116, 124], [128, 136]].forEach(function (b, i) { rectY(g, 68, b[0], b[1], 152, 162 + i * 10, '#57BDFF'); });
        rectY(g, 68, 64, 72, 152, 160, '#4ADE80', 'xp-led');
        rectY(g, 68, 76, 84, 152, 160, '#F4140C', 'xp-led');
        seg(P(184, 68, 110), P(184, 68, 140), g, 'xp-handle');
        for (var z = 26; z < 66; z += 6) seg(P(20, 68, z), P(180, 68, z), g, 'xp-louver');
      });

      return { shadow: [-10, -10, 210, 76] };
    }
  };

  var kind = svg.getAttribute('data-machine') || 'chiller';
  var machine = (MACHINES[kind] || MACHINES.chiller)();
  var sh = machine.shadow;
  poly([P(sh[0], sh[1], -2), P(sh[2], sh[1], -2), P(sh[2], sh[3], -2), P(sh[0], sh[3], -2)], 'rgba(0,0,0,.45)', floor, 'xp-shadow')
    .setAttribute('filter', 'url(#xp-blur)');

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
    s.textContent = T(L.key, L.fb).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').toLocaleUpperCase(LANG);
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
    var a = spin + scrollSpin;
    rotors.forEach(function (r) { r.g.setAttribute('transform', 'rotate(' + f1((a * r.k) % 360) + ')'); });
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

  // Idle spin (fans, wheels) while the machine is on screen
  var visible = false, last = 0, reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (rotors.length && !reduce && 'IntersectionObserver' in window) {
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

  window.PZXp = { render: render, fit: function () { fit(mqLabels.matches); } };
  render(0);
})();
