/* Speed readout for testing on a real phone. A testing aid, not part of the
   system. It is fetched only when someone asks for it, and it reads numbers
   twice a second without starting any animation of its own. */

const box = document.createElement('pre');
box.className = 'readout';
box.setAttribute('aria-hidden', 'true');
document.body.appendChild(box);

let lastFrames = 0;
let lastTime = performance.now();

function shown() {
  return Array.from(document.querySelectorAll('hp-wet-stone')).find((el) => el.offsetParent !== null);
}

setInterval(() => {
  const clock = window.Waterline && window.Waterline.clock;
  const el = shown();
  const now = performance.now();
  const lines = [];
  if (clock) {
    const fps = Math.round((clock.frames - lastFrames) / ((now - lastTime) / 1000));
    lastFrames = clock.frames;
    lines.push('clock   ' + (clock.running ? 'running, ' + fps + ' frames a second' : 'stopped (no work)'));
  } else {
    lines.push('clock   not loaded (baseline or still version)');
  }
  lastTime = now;
  if (el) {
    const live = el.hasAttribute('live');
    lines.push('mode    ' + (live ? 'full effect' : 'simple swap'));
    lines.push('state   ' + (el.getAttribute('data-state') || 'dry'));
    if (live && el.stats) {
      lines.push('work    ' + el.stats.work.toFixed(2) + ' ms average, ' + el.stats.peak.toFixed(1) + ' ms peak');
      lines.push('wet     ' + Math.round((el.coverage ? el.coverage() : 0) * 100) + '% of the picture');
      const c = el.querySelector('canvas');
      lines.push('canvas  ' + (c ? c.width + ' x ' + c.height : 'none (nothing wet yet)'));
    }
  }
  lines.push('screen  ' + window.innerWidth + ' x ' + window.innerHeight + ' at ' + (window.devicePixelRatio || 1) + 'x');
  box.textContent = lines.join('\n');
}, 500);
