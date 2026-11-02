/* SAMPLE placeholder stone, drawn in code. Not a real specimen, not a product.
   Replace with Brian's dry and wet photo pairs. */
(function () {
  function rand(seed) {
    let s = seed >>> 0;
    return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }
  function blob(r, cx, cy, rad, wobble, pts) {
    const out = [];
    const phase = r() * 6.28;
    for (let i = 0; i < pts; i++) {
      const a = (i / pts) * Math.PI * 2;
      const k = 1 + wobble * (Math.sin(a * 2 + phase) * 0.55 + Math.sin(a * 3 + phase * 1.7) * 0.3 + (r() - 0.5) * 0.25);
      out.push([cx + Math.cos(a) * rad * k * 1.12, cy + Math.sin(a) * rad * k * 0.9]);
    }
    let d = 'M' + out[0].join(',');
    for (let i = 0; i < pts; i++) {
      const p0 = out[(i - 1 + pts) % pts], p1 = out[i], p2 = out[(i + 1) % pts], p3 = out[(i + 2) % pts];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += 'C' + c1.join(',') + ' ' + c2.join(',') + ' ' + p2.join(',');
    }
    return d + 'Z';
  }
  const palettes = {
    agate: ['#6b1a0b', '#a8351a', '#d06a2e', '#efc9a4', '#8c2a12', '#f6ece0', '#c4552a', '#7d2410', '#e39a63', '#fbf3ea'],
    lake: ['#2c2a33', '#4d4a57', '#8b8794', '#c9c5cf', '#3b3843', '#a7a3b0'],
    jasper: ['#6e2219', '#8e3524', '#b4553a', '#7a2a1e', '#c87457'],
    petoskey: ['#5b5650', '#6e6862', '#625d57', '#77716a'],
    leland: ['#123a5c', '#1d5a86', '#2f7fb0', '#164a72', '#5fa8cf']
  };
  window.drawStone = function (svg, opts) {
    const o = Object.assign({ seed: 7, kind: 'agate', bands: 38 }, opts || {});
    const r = rand(o.seed);
    r(); const id = 's' + o.seed + '_' + (window.__stoneN = (window.__stoneN || 0) + 1);
    const pal = palettes[o.kind];
    const ns = 'http://www.w3.org/2000/svg';
    svg.setAttribute('viewBox', '0 0 400 320');
    let defs = '<defs>' +
      '<filter id="w' + id + '"><feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="4" seed="' + o.seed + '"/><feDisplacementMap in="SourceGraphic" scale="' + (o.kind === 'agate' ? 38 : 10) + '"/></filter>' +
      '<filter id="g' + id + '"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="' + (o.seed + 3) + '"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>' +
      '<radialGradient id="sh' + id + '" cx="38%" cy="30%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>' +
      '<linearGradient id="gl' + id + '" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<pattern id="ht' + id + '" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="5" height="5" fill="none"/><circle cx="2.5" cy="2.5" r="1.25" fill="' + (o.paper || '#f2b705') + '"/></pattern>' +
      '<filter id="d' + id + '"><feColorMatrix type="saturate" values=".14"/><feComponentTransfer><feFuncR type="linear" slope=".62" intercept=".3"/><feFuncG type="linear" slope=".62" intercept=".29"/><feFuncB type="linear" slope=".62" intercept=".28"/></feComponentTransfer></filter>' +
      '<clipPath id="c' + id + '"><path d="' + blob(rand(o.seed), 200, 165, 140, 0.16, 9) + '"/></clipPath></defs>';
    let g = '<g clip-path="url(#c' + id + ')"><g' + (o.dry ? ' filter="url(#d' + id + ')"' : '') + '><rect width="400" height="320" fill="' + pal[0] + '"/><g filter="url(#w' + id + ')">';
    if (o.kind === 'agate') {
      // a beach agate: a pitted, wave-worn rind, with the banding showing only on one broken face
      const fx = 200 + (r() - 0.5) * 70, fy = 160 + (r() - 0.5) * 50, frad = 80 + r() * 22;
      const face = blob(rand(o.seed + 5), fx, fy, frad, 0.26, 8);
      defs = defs.replace('</defs>', '<clipPath id="f' + id + '"><path d="' + face + '"/></clipPath></defs>');
      g += '<rect width="400" height="320" fill="#84482b"/>';
      for (let i = 0; i < 7; i++) g += '<path d="' + blob(rand(o.seed + 40 + i), 40 + r() * 320, 30 + r() * 260, 30 + r() * 40, 0.3, 7) + '" fill="#9b5a36" opacity=".55"/>';
      for (let i = 0; i < 70; i++) g += '<circle cx="' + (r() * 400).toFixed(1) + '" cy="' + (r() * 320).toFixed(1) + '" r="' + (1 + r() * 3.4).toFixed(1) + '" fill="' + (r() < 0.7 ? '#4f2a18' : '#c08660') + '" opacity="' + (0.3 + r() * 0.35).toFixed(2) + '"/>';
      // fortification bands, centered off the face so they read as arcs broken by the fracture
      const a = r() * 6.28, bx = fx + Math.cos(a) * frad * 0.45, by = fy + Math.sin(a) * frad * 0.45;
      g += '<g clip-path="url(#f' + id + ')"><rect width="400" height="320" fill="' + pal[0] + '"/>';
      for (let i = 0; i < o.bands; i++) {
        const t = Math.pow(1 - i / o.bands, 0.62) * (i > o.bands * 0.82 ? 0.9 : 1);
        const col = pal[(i + Math.floor(r() * 2)) % pal.length];
        g += '<path d="' + blob(rand(o.seed + 11), bx + (r() - 0.5) * 6, by + (r() - 0.5) * 6, 150 * t + 4, 0.18, 9) + '" fill="' + col + '"/>';
      }
      g += '</g><path d="' + face + '" fill="none" stroke="#f3d9c0" stroke-opacity=".35" stroke-width="3"/>';
    } else if (o.kind === 'leland') {
      // Leland Blue is smelter slag: glassy blue with flow lines, gas bubbles, and gray streaks, never bands
      for (let i = 0; i < 12; i++) {
        const y = 30 + r() * 260, amp = 10 + r() * 22, ph = r() * 6.28;
        let d = 'M-20,' + y.toFixed(1);
        for (let x = 30; x <= 430; x += 50) d += ' Q' + (x - 25) + ',' + (y + Math.sin(ph + x / 60) * amp).toFixed(1) + ' ' + x + ',' + (y + Math.sin(ph + x / 45) * amp * 0.6).toFixed(1);
        g += '<path d="' + d + '" fill="none" stroke="' + pal[2 + (i % 3)] + '" stroke-width="' + (2 + r() * 8).toFixed(1) + '" stroke-linecap="round" opacity="' + (0.35 + r() * 0.35).toFixed(2) + '"/>';
      }
      for (let i = 0; i < 3; i++) g += '<path d="' + blob(rand(o.seed + 60 + i), 60 + r() * 280, 60 + r() * 200, 14 + r() * 18, 0.4, 7) + '" fill="#56616b" opacity=".7"/>';
    } else {
      const n = o.kind === 'petoskey' ? 4 : 9;
      for (let i = 0; i < n; i++) {
        const col = pal[(i + Math.floor(r() * 2)) % pal.length];
        g += '<path d="' + blob(rand(o.seed + 11), 206 + (r() - 0.5) * 6, 170 + (r() - 0.5) * 6, 150 * (1 - i / n) + 4, 0.18, 9) + '" fill="' + col + '"/>';
      }
    }
    if (o.kind === 'petoskey') {
      defs = defs.replace('</defs>', '<pattern id="hx' + id + '" width="34" height="58.9" patternUnits="userSpaceOnUse" patternTransform="rotate(8)"><path d="M17 0l17 9.8v19.6L17 39.3 0 29.4V9.8zM0 29.4v29.5M34 29.4v29.5" fill="none" stroke="#2e2a26" stroke-width="3"/><circle cx="17" cy="19.6" r="4" fill="#3a3530"/><circle cx="0" cy="49" r="4" fill="#3a3530"/><circle cx="34" cy="49" r="4" fill="#3a3530"/></pattern></defs>');
      g += '<rect width="400" height="320" fill="url(#hx' + id + ')" opacity=".85"/>';
    }
    if (o.kind === 'leland') {
      // vesicles: round gas-bubble holes, each with a tiny lit inner edge
      for (let i = 0; i < 34; i++) {
        const cx = 50 + r() * 300, cy = 40 + r() * 240, rr = 2 + Math.pow(r(), 2) * 9;
        g += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + rr.toFixed(1) + '" fill="#081c2e" opacity=".8"/>' +
          '<circle cx="' + (cx + rr * 0.3).toFixed(1) + '" cy="' + (cy + rr * 0.35).toFixed(1) + '" r="' + (rr * 0.35).toFixed(1) + '" fill="#9fd0ea" opacity=".45"/>';
      }
    }
    g += '</g><rect width="400" height="320" fill="#000" filter="url(#g' + id + ')"/><rect width="400" height="320" fill="url(#sh' + id + ')"/></g>' +
      (o.dry ? '<rect width="400" height="320" fill="url(#ht' + id + ')" opacity=".22"/>' : '<rect class="gloss" x="-320" y="-40" width="220" height="400" transform="skewX(-18)" fill="url(#gl' + id + ')"/>') + '</g>';
    svg.innerHTML = defs + g;
    svg.setAttribute('xmlns', ns);
  };
})();
