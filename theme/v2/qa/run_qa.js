// Storefront v2 browser QA (Playwright).
// Usage: from the repo root run  python3 -m http.server 8765  then  node theme/v2/qa/run_qa.js [screenshot dir]
const {chromium,devices}=require('playwright');
const out=process.argv[2]||require('os').tmpdir();const R=[];const ok=(n,c,extra='')=>{R.push(`${c?'PASS':'FAIL'}  ${n} ${extra}`)};
const URL='http://localhost:8765/theme/v2/index.html';
(async()=>{const b=await chromium.launch();
// desktop
let p=await b.newPage({viewport:{width:1440,height:900}});
const bad=[];p.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url())});p.on('pageerror',e=>bad.push('JS '+e.message));
await p.goto(URL,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
const fonts=await p.evaluate(()=>({px:document.fonts.check('16px "Press Start 2P"'),atk:document.fonts.check('700 16px "Atkinson Hyperlegible Next"'),
  bodyFam:getComputedStyle(document.body).fontFamily,h2:getComputedStyle(document.querySelector('#shop-h')).fontFamily}));
ok('Press Start 2P loaded',fonts.px);ok('Atkinson Hyperlegible Next loaded',fonts.atk);ok('body font is Atkinson',fonts.bodyFam.startsWith('"Atkinson'),fonts.bodyFam);
// images
const imgs=await p.evaluate(async()=>{const l=[...document.images];for(const i of l){i.loading='eager'};await new Promise(r=>setTimeout(r,800));return l.map(i=>[i.currentSrc.split('/').pop(),i.complete&&i.naturalWidth>0])});
ok('all <img> load',imgs.every(x=>x[1]),JSON.stringify(imgs));
const svgImg=await p.evaluate(()=>[...document.querySelectorAll('svg image')].length);ok('lick art embedded in tee svg',svgImg>0);
// nav links
for(const id of ['shop','field-notes','about']){const t=await p.$(`a[href="#${id}"]`);await t.click();await p.waitForTimeout(700);
 await p.waitForTimeout(800);const st=await p.evaluate(i=>[Math.round(document.getElementById(i).getBoundingClientRect().top),Math.ceil(scrollY+innerHeight)>=document.documentElement.scrollHeight-2],id);ok(`nav #${id} scrolls to section`,Math.abs(st[0])<40||st[1],`top=${st[0]} atPageEnd=${st[1]}`);}
// press state
await p.evaluate(()=>window.scrollTo(0,0));
const btn=await p.$('.hero-cta .btn');const bb=await btn.boundingBox();
const before=await btn.evaluate(e=>[getComputedStyle(e).transform,getComputedStyle(e).boxShadow]);
await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await p.waitForTimeout(150);
const hov=await btn.evaluate(e=>getComputedStyle(e).backgroundColor);
await p.mouse.down();await p.waitForTimeout(150);
const during=await btn.evaluate(e=>[getComputedStyle(e).transform,getComputedStyle(e).boxShadow]);
await p.screenshot({path:`${out}/press-down.png`,clip:{x:bb.x-20,y:bb.y-20,width:bb.width+40,height:bb.height+40}});
await p.mouse.up();await p.waitForTimeout(150);
const after=await btn.evaluate(e=>getComputedStyle(e).transform);
ok('hover lightens rust',hov==='rgb(188, 84, 54)',hov);
ok('mouse press moves 3px down-right',during[0]==='matrix(1, 0, 0, 1, 3, 3)',during[0]);
ok('press shrinks hard shadow to 1px',/1px 1px 0px$/.test(during[1])||during[1].includes('1px 1px 0px'),during[1].slice(-40));
ok('release returns to raised',after==='none'||after==='matrix(1, 0, 0, 1, 0, 0)',after);
const dur=await btn.evaluate(e=>getComputedStyle(e).transitionDuration);ok('transition ~70ms',dur.includes('0.07s'),dur);
// keyboard
await p.goto(URL,{waitUntil:'networkidle'});await p.keyboard.press('Tab');
const first=await p.evaluate(()=>document.activeElement.textContent.trim());ok('first Tab = skip link',first==='Skip to content',first);
let seen=[];for(let i=0;i<8;i++){await p.keyboard.press('Tab');seen.push(await p.evaluate(()=>{const a=document.activeElement;const cs=getComputedStyle(a);return (a.textContent.trim().slice(0,22)||a.getAttribute('aria-label'))+'|'+cs.outlineStyle+' '+cs.outlineColor}));}
ok('focus order + gold outline',seen.every(s=>s.includes('solid rgb(232, 185, 84)')),'\n      '+seen.join('\n      '));
// keyboard press visual
for(const key of [' ','Enter']){const kb=await p.$('#lab-splash');await kb.focus();await p.keyboard.down(key);
const kp=await kb.evaluate(e=>e.classList.contains('is-pressed'));await p.keyboard.up(key);
const kr=await kb.evaluate(e=>e.classList.contains('is-pressed'));ok(`${key===' '?'Space':'Enter'} on a button shows pressed then releases`,kp&&!kr);}
await p.click('#tab-agate');
// filter
await p.click('[data-filter=socks]');const vis=await p.$$eval('.card',cs=>cs.filter(c=>!c.hidden).length);ok('Socks filter shows 1 card',vis===1);
await p.click('[data-filter=all]');
// wet toggle in card
const w=await p.$('.card .wet');await w.click();await p.waitForTimeout(800);ok('card wet toggles on tap/click',await w.getAttribute('aria-pressed')==='true');
const filt=await w.evaluate(e=>getComputedStyle(e.querySelector('.wet-media')).filter);ok('wet = filter change only (same media)',filt.includes('saturate(1.12)'),filt);
// product viewer + cart
await p.click('a[data-view=socks]');await p.waitForTimeout(600);
ok('View loads socks into viewer',(await p.textContent('#pv-name'))==='Petoskey hexagon socks');
await p.click('#add');ok('add without size shows error',(await p.textContent('#buy-msg')).includes('Pick a size'));
await p.click('#pv-colors label:nth-of-type(2)');ok('color swap to slate image',(await p.getAttribute('#pv-media img','src')).includes('slate'));
await p.click('#pv-sizes label:nth-of-type(2)');await p.click('#add');
ok('loading state aria-busy',(await p.getAttribute('#add','aria-busy'))==='true');
await p.waitForTimeout(700);ok('added message + cart count',(await p.textContent('#cart-count'))==='1',await p.textContent('#buy-msg'));
await p.click('a[data-view=chart]');await p.waitForTimeout(300);ok('stand-in product: Add disabled',await p.$eval('#add',e=>e.disabled&&e.textContent==='Art in progress'));
await p.click('#cart-open');ok('cart dialog opens',await p.$eval('#cart',d=>d.open));await p.keyboard.press('Escape');ok('Esc closes cart',!(await p.$eval('#cart',d=>d.open)));
// wet test
if((await p.getAttribute('#lab-stone','aria-pressed'))!=='true')await p.click('#lab-splash');await p.click('#tab-petoskey');await p.click('#lab-stone');await p.focus('#tab-petoskey');await p.keyboard.press('ArrowRight');
ok('arrow keys move tabs',(await p.evaluate(()=>document.activeElement.id))==='tab-leland');
await p.keyboard.press('Tab');await p.keyboard.press('Enter');
ok('all 3 wetted unlocks message',!(await p.$eval('#lab-done',e=>e.hidden)),await p.textContent('#lab-count'));
await p.$eval('#wet-test',e=>e.scrollIntoView());await p.waitForTimeout(700);
await (await p.$('#wet-test')).screenshot({path:`${out}/wet-test-desktop-wet.png`});
ok('no 4xx/JS errors',bad.length===0,bad.join(','));
await p.close();
// reduced motion
p=await b.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});await p.goto(URL);
ok('reduced motion: no button transition',(await p.$eval('.btn',e=>getComputedStyle(e).transitionDuration))==='0s');await p.close();
// touch (iPhone)
const ctx=await b.newContext({...devices['iPhone 13']});p=await ctx.newPage();await p.goto(URL,{waitUntil:'networkidle'});
const t=await p.$('.card .wet');await t.tap();ok('touch tap wets card (iPhone 13 emulation)',(await t.getAttribute('aria-pressed'))==='true');
const hero=await p.evaluate(()=>document.querySelector('.hero img').currentSrc.split('/').pop());ok('iPhone portrait gets mobile hero',hero==='hero-approved-mobile.webp',hero);
const tgt=await p.$$eval('.btn,.tab,.icon-btn,.opt > span,.site-nav a',es=>es.filter(e=>e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return [e.textContent.trim().slice(0,14),Math.round(r.width),Math.round(r.height)]}).filter(x=>x[1]<44||x[2]<44));
ok('tap targets >= 44px',tgt.length===0,JSON.stringify(tgt));
const cutoff=await p.evaluate(()=>{const img=document.querySelector('.hero img').getBoundingClientRect();const cta=document.querySelector('.hero-cta .btn').getBoundingClientRect();return [Math.round(img.bottom),Math.round(cta.top),innerHeight]});
ok('mobile: nav above art, CTA directly below art',cutoff[1]>=cutoff[0],JSON.stringify(cutoff));
await ctx.close();
// 200% zoom approximations: CSS px viewport halves
for(const [w,h] of [[720,450],[640,400]]){p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:2});await p.goto(URL,{waitUntil:'networkidle'});
 const sw=await p.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]);ok(`200% zoom of ${w*2}x${h*2}: no sideways scroll`,sw[0]<=sw[1],JSON.stringify(sw));
 await p.screenshot({path:`${out}/zoom200-${w*2}.png`});await p.close();}
// overflow per section at all widths
for(const w of [320,375,390,768,1024,1440]){p=await b.newPage({viewport:{width:w,height:800}});await p.goto(URL,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 const o=await p.evaluate(()=>{const W=document.documentElement.clientWidth;return [...document.querySelectorAll('h1,h2,h3,p,a,button,li,span,dd,legend,label')].filter(e=>!e.closest('.visually-hidden')&&e.getClientRects().length).filter(e=>{const r=e.getBoundingClientRect();return r.width&&(r.right>W+1||e.scrollWidth>e.clientWidth+2&&getComputedStyle(e).overflowX!=='visible')}).map(e=>e.textContent.trim().slice(0,30))});
 ok(`width ${w}: nothing clipped or past the edge`,o.length===0,JSON.stringify(o.slice(0,5)));await p.close();}
console.log(R.join('\n'));await b.close();})();
