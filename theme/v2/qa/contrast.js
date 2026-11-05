// Measures the contrast of every visible text element against its nearest solid background.
// Usage: python3 -m http.server 8765 (repo root), then node theme/v2/qa/contrast.js
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://localhost:8765/theme/v2/index.html',{waitUntil:'networkidle'});
const res=await p.evaluate(()=>{
 const rgb=s=>{const m=s.match(/[\d.]+/g);return m?m.map(Number):[0,0,0,0]};
 const L=c=>{const f=v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])};
 const bg=e=>{for(;e;e=e.parentElement){const c=rgb(getComputedStyle(e).backgroundColor);if(c[3]===undefined||c[3]>=.95)return c;}return [16,29,44]};
 const out={};
 for(const e of document.querySelectorAll('body *')){
  if(e.closest('svg,.visually-hidden,picture'))continue;
  const t=[...e.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');
  if(!t||!e.getClientRects().length)continue;
  const cs=getComputedStyle(e);const fg=rgb(cs.color),b=bg(e);
  const r=(Math.max(L(fg),L(b))+.05)/(Math.min(L(fg),L(b))+.05);
  const big=parseFloat(cs.fontSize)>=24||(parseFloat(cs.fontSize)>=18.66&&+cs.fontWeight>=700);
  const k=cs.color+' on rgb('+b.slice(0,3).join(', ')+')';
  if(!out[k]||out[k].r>r)out[k]={r:+r.toFixed(2),need:big?3:4.5,sample:t.slice(0,40)};
 }
 return out;});
let fail=0;for(const [k,v] of Object.entries(res).sort((a,b)=>a[1].r-b[1].r)){const ok=v.r>=v.need;if(!ok)fail++;console.log((ok?'PASS ':'FAIL ')+v.r.toFixed(2)+' (needs '+v.need+')  '+k+'  "'+v.sample+'"');}
console.log(fail?fail+' failing pairs':'All text pairs meet WCAG AA');await b.close();})();
