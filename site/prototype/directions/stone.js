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
    jasper: ['#6e2219', '#8e3524', '#b4553a', '#7a2a1e', '#c87457']
  };
  window.drawStone = function (svg, opts) {
    const o = Object.assign({ seed: 7, kind: 'agate', bands: 38 }, opts || {});
    const r = rand(o.seed);
    const id = 's' + o.seed + Math.floor(r() * 1e6);
    const pal = palettes[o.kind];
    const ns = 'http://www.w3.org/2000/svg';
    svg.setAttribute('viewBox', '0 0 400 320');
    let defs = '<defs>' +
      '<filter id="w' + id + '"><feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="4" seed="' + o.seed + '"/><feDisplacementMap in="SourceGraphic" scale="' + (o.kind === 'agate' ? 38 : 10) + '"/></filter>' +
      '<filter id="g' + id + '"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="' + (o.seed + 3) + '"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>' +
      '<radialGradient id="sh' + id + '" cx="38%" cy="30%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>' +
      '<linearGradient id="gl' + id + '" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<pattern id="ht' + id + '" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="5" height="5" fill="none"/><circle cx="2.5" cy="2.5" r="1.25" fill="' + (o.paper || '#f2b705') + '"/></pattern>' +
      '<filter id="d' + id + '"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope="1.9" intercept="-.32"/><feFuncG type="linear" slope="1.9" intercept="-.32"/><feFuncB type="linear" slope="1.9" intercept="-.32"/></feComponentTransfer></filter>' +
      '<clipPath id="c' + id + '"><path d="' + blob(rand(o.seed), 200, 165, 140, 0.16, 9) + '"/></clipPath></defs>';
    let g = '<g clip-path="url(#c' + id + ')"><g' + (o.dry ? ' filter="url(#d' + id + ')"' : '') + '><rect width="400" height="320" fill="' + pal[0] + '"/><g filter="url(#w' + id + ')">';
    const n = o.kind === 'agate' ? o.bands : 9;
    for (let i = 0; i < n; i++) {
      // fortification banding: tight near the rim, wider toward a quartz core
      const t = o.kind === 'agate' ? Math.pow(1 - i / n, 0.62) * (i > n * 0.82 ? 0.9 : 1) : 1 - i / n;
      const col = pal[(i + Math.floor(r() * 2)) % pal.length];
      g += '<path d="' + blob(rand(o.seed + 11), 206 + (r() - 0.5) * 6, 170 + (r() - 0.5) * 6, 150 * t + 4, 0.18, 9) + '" fill="' + col + '"/>';
    }
    g += '</g><rect width="400" height="320" fill="#000" filter="url(#g' + id + ')"/><rect width="400" height="320" fill="url(#sh' + id + ')"/></g>' +
      (o.dry ? '<rect width="400" height="320" fill="url(#ht' + id + ')" opacity=".55"/>' : '<rect class="gloss" x="-320" y="-40" width="220" height="400" transform="skewX(-18)" fill="url(#gl' + id + ')"/>') + '</g>';
    svg.innerHTML = defs + g;
    svg.setAttribute('xmlns', ns);
  };
})();
