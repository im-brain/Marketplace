// Renders the "I lick rocks" art at Printify tee print size (transparent PNG).
// Run: node scripts/render_lick.js [seed]
// Output: designs/lick/i_lick_rocks_light-ink.png (for dark tees) and _dark-ink.png (for light tees).
const {chromium} = require('playwright');
const path = require('path');
(async () => {
  const seed = process.argv[2] || '7';
  const file = 'file://' + path.resolve(__dirname, '../designs/lick/lick_rocks.html');
  const b = await chromium.launch();
  for (const ink of ['light', 'dark']) {
    // 850 x 1020 CSS px at 5x = 4250 x 5100 px, which fits the 4500 x 5100 front print area.
    const p = await b.newPage({viewport: {width: 850, height: 1020}, deviceScaleFactor: 5});
    await p.goto(`${file}?seed=${seed}&w=850&ink=${ink}&print=1`, {waitUntil: 'networkidle'});
    await p.waitForTimeout(500);
    const out = path.resolve(__dirname, `../designs/lick/i_lick_rocks_${ink}-ink.png`);
    await p.screenshot({path: out, omitBackground: true});
    console.log('Saved', out);
    await p.close();
  }
  await b.close();
})();
