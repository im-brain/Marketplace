/* Heavy Pockets Co. storefront preview v2.
   Plain JavaScript, no build step. Every feature here is preview-only:
   the cart never charges and nothing talks to Shopify or Printify. */
(function(){
"use strict";

var IMG = "../preview/img/"; // shared with the Step 11 preview (rewritten for the published copy)
var NS = "http://www.w3.org/2000/svg";
var uid = 0;
function el(n,a){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);return e;}
function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;var t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hash(a,b,seed){var h=Math.imul(a|0,374761393)^Math.imul(b|0,668265263)^Math.imul(seed,2246822519);h=Math.imul(h^h>>>13,1274126177);return((h^h>>>16)>>>0)/4294967296;}
function $(s,r){return (r||document).querySelector(s);}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}

/* ---------- 1. Retro button feedback ----------
   :active already handles mouse and touch. iOS Safari only applies :active
   when a touch listener exists, so register an empty passive one.
   Enter and Space get the same pressed look through .is-pressed. The visual
   never delays the action: the click fires exactly as it normally would. */
document.addEventListener("touchstart",function(){}, {passive:true});
var PRESSABLE = ".btn,.tab,.icon-btn";
document.addEventListener("keydown",function(e){
  if(e.key!=="Enter"&&e.key!==" ")return;
  var t=e.target.closest&&e.target.closest(PRESSABLE);
  if(t&&!t.disabled)t.classList.add("is-pressed");
});
function release(e){var t=e.target.closest&&e.target.closest(PRESSABLE);if(t)t.classList.remove("is-pressed");}
document.addEventListener("keyup",release);
document.addEventListener("focusout",release);
window.addEventListener("blur",function(){$$(".is-pressed").forEach(function(b){b.classList.remove("is-pressed");});});

/* ---------- 2. Drawn shapes shared by the tee mockups and stones ---------- */
function roundPoly(pts){
  var n=pts.length,m=function(a,b){return[(a[0]+b[0])/2,(a[1]+b[1])/2];},st=m(pts[n-1],pts[0]);
  var d="M"+st[0].toFixed(1)+" "+st[1].toFixed(1);
  for(var i=0;i<n;i++){var v=pts[i],e=m(pts[i],pts[(i+1)%n]);d+="Q"+v[0].toFixed(1)+" "+v[1].toFixed(1)+" "+e[0].toFixed(1)+" "+e[1].toFixed(1);}
  return d+"Z";
}
function pebble(r,cx,cy,R,n){var pts=[];for(var i=0;i<n;i++){var th=i/n*Math.PI*2+r()*.3;var k=1+(r()-.5)*.34;pts.push([cx+Math.cos(th)*R*k,cy+Math.sin(th)*R*k*.82]);}return roundPoly(pts);}
function txt(x,y,s,attrs){var t=el("text",Object.assign({x:x,y:y,"text-anchor":"middle","font-family":"'Atkinson Hyperlegible Next',system-ui,sans-serif","font-weight":"800"},attrs));t.textContent=s;return t;}

/* ---------- 3. Tee mockups (drawn; real photos replace them after samples) ---------- */
var TEE="M214 34C244 70 356 70 386 34L468 56C522 74 560 112 588 186L500 230L470 190L474 626C400 640 200 640 126 626L130 190L100 230L12 186C40 112 78 74 132 56Z";
var TEES={
  lick:{c:"#4A4B47",label:"Drawn mockup of the I lick rocks pepper tee: a dull dry agate with one glossy wet lick showing red bands, over the words I lick rocks"},
  chart:{c:"#24323D",label:"Stand-in for the Great Lakes Beach Stone Chart slate tee: a grid of drawn pebbles with blank label lines. Art in progress."},
  expect:{c:"#E2DACA",label:"Stand-in for the Agate Expectations natural tee: the words in tall dark capitals. Art in progress."},
  brake:{c:"#1F5653",label:"Stand-in for the Will brake for agates lake teal tee: the words in cream capitals. Art in progress."}
};
function tee(kind){
  var id="t"+(uid++),cfg=TEES[kind];
  var svg=el("svg",{viewBox:"0 0 600 660",role:"img","aria-label":cfg.label,preserveAspectRatio:"xMidYMid meet"});
  var defs=el("defs",{});
  var cp=el("clipPath",{id:id+"c"});cp.appendChild(el("path",{d:TEE}));defs.appendChild(cp);
  var lg=el("linearGradient",{id:id+"g",x1:"0",y1:"0",x2:"1",y2:"1"});
  lg.appendChild(el("stop",{offset:"0","stop-color":"#fff","stop-opacity":".10"}));
  lg.appendChild(el("stop",{offset:".55","stop-color":"#fff","stop-opacity":"0"}));
  lg.appendChild(el("stop",{offset:"1","stop-color":"#000","stop-opacity":".16"}));
  defs.appendChild(lg);svg.appendChild(defs);
  /* hard pixel-style drop shadow instead of a soft blur */
  svg.appendChild(el("path",{d:TEE,fill:"#101D2C","fill-opacity":".22",transform:"translate(10 12)"}));
  svg.appendChild(el("path",{d:TEE,fill:cfg.c}));
  var g=el("g",{"clip-path":"url(#"+id+"c)"});
  g.appendChild(el("rect",{x:"0",y:"0",width:"600",height:"660",fill:"url(#"+id+"g)"}));
  [["M150 300C170 420 160 520 168 610",.10],["M440 280C430 400 446 520 436 612",.08],["M476 196C462 214 466 236 474 250",.12],["M124 196C138 214 134 236 126 250",.12]].forEach(function(f){g.appendChild(el("path",{d:f[0],stroke:"#000","stroke-opacity":f[1],"stroke-width":"6",fill:"none","stroke-linecap":"round"}));});
  svg.appendChild(g);
  svg.appendChild(el("path",{d:"M214 34C244 70 356 70 386 34",stroke:"#000","stroke-opacity":".22","stroke-width":"9",fill:"none","stroke-linecap":"round"}));
  if(kind==="lick"){
    svg.appendChild(el("image",{href:IMG+"i_lick_rocks.webp",x:"170",y:"104",width:"260",height:"312",preserveAspectRatio:"xMidYMid meet"}));
  }else if(kind==="chart"){
    var ink="#F3E8D2";
    svg.appendChild(txt(300,150,"GREAT LAKES",{fill:ink,"font-size":"30"}));
    svg.appendChild(txt(300,180,"BEACH STONE CHART",{fill:ink,"font-size":"18","font-weight":"700"}));
    var r=rng(77),cols=["#B5532F","#8A8F8C","#C9B48C","#5E7FA6","#7E2616","#A7A08F","#6F7F5A","#D9C9B0","#4E5E6A"];
    for(var i=0;i<9;i++){var cx=230+(i%3)*70,cy=228+Math.floor(i/3)*68;
      svg.appendChild(el("path",{d:pebble(r,cx,cy,20,7),fill:cols[i]}));
      svg.appendChild(el("rect",{x:cx-20,y:cy+26,width:40,height:3,fill:ink,"fill-opacity":".6"}));}
  }else if(kind==="expect"){
    svg.appendChild(el("path",{d:pebble(rng(12),300,170,34,8),fill:"#A7472D"}));
    svg.appendChild(el("path",{d:pebble(rng(12),306,166,20,8),fill:"#F3E8D2"}));
    svg.appendChild(el("path",{d:pebble(rng(12),308,165,10,8),fill:"#7E2616"}));
    svg.appendChild(txt(300,284,"AGATE",{fill:"#101D2C","font-size":"76"}));
    svg.appendChild(txt(300,346,"EXPECTATIONS",{fill:"#101D2C","font-size":"46"}));
  }else if(kind==="brake"){
    svg.appendChild(txt(300,214,"WILL BRAKE",{fill:"#F3E8D2","font-size":"54"}));
    svg.appendChild(txt(300,284,"FOR AGATES",{fill:"#F3E8D2","font-size":"54"}));
    svg.appendChild(el("rect",{x:"228",y:"310",width:"144",height:"6",fill:"#E8B954"}));
  }
  return svg;
}

/* ---------- 4. Field-guide stones (code-drawn stand-ins, flagged as such) ----------
   Petoskey cells are irregular on purpose (IMAGE_STANDARDS.md: varied, incomplete,
   flush cells, never stamped identical hexagons). Wetting only changes filters
   and dust, so wet and dry are always the same specimen. */
var STONES={
  agate:{name:"Lake Superior agate",label:"Code-drawn Lake Superior agate: a red-brown pebble with uneven red and cream bands",
    dry:"A dull, waxy, often pitted red-brown pebble that hides in plain sight.",
    wet:"Glossy and a little see-through at the edges, sometimes with thin bands on a broken face.",
    aside:"Hold it up to the sun. The only red rock on the beach that lets a little daylight through."},
  petoskey:{name:"Petoskey stone",label:"Code-drawn Petoskey stone: gray limestone with irregular, roughly six-sided coral cells, each with a dark center",
    dry:"A plain gray or tan limestone pebble, maybe faintly mottled.",
    wet:"Tightly packed, roughly six-sided cells show up, each with a dark eye and thin lines radiating out.",
    aside:"A fossil coral colony from a Devonian sea. Michigan's state stone since 1965."},
  leland:{name:"Leland Blue",label:"Code-drawn Leland Blue slag: a blue-gray lump with streaks of blue, purple, and green and uneven bubbles",
    dry:"A dull blue-gray lump.",
    wet:"Strong blues, purples, grays, and greens, often streaky, with gas bubbles of mixed sizes.",
    aside:"Not a natural stone: it is slag from a 19th-century iron furnace in Leland, Michigan."}
};
function stone(kind){
  var id="s"+(uid++),r=rng({agate:23,petoskey:58,leland:91}[kind]);
  var svg=el("svg",{viewBox:"0 0 200 180",role:"img","aria-label":STONES[kind].label});
  var out=pebble(r,100,92,80,9);
  var defs=el("defs",{}),cp=el("clipPath",{id:id+"c"});cp.appendChild(el("path",{d:out}));defs.appendChild(cp);svg.appendChild(defs);
  var g=el("g",{"clip-path":"url(#"+id+"c)"});
  if(kind==="agate"){
    g.appendChild(el("rect",{width:"200",height:"180",fill:"#6E3424"}));
    var base=[];for(var i=0;i<8;i++){var th=i/8*Math.PI*2+.4;base.push([Math.cos(th)*(1+(r()-.5)*.3),Math.sin(th)*(1+(r()-.5)*.3)*.86]);}
    var dk=["#9A2E1A","#B5532F","#7E2616","#C46A3E"],lt=["#EDE3D2","#F1E7DA","#D9B99B"],s=.9,k=0;
    while(s>.2&&k<60){
      if(r()<.4){var cx=112+22*(1-s),cy=86-12*(1-s);g.appendChild(el("path",{d:roundPoly(base.map(function(p){return[cx+p[0]*70*s,cy+p[1]*70*s];})),fill:dk[k%4]}));s-=.06+r()*.07;k++;}
      else{for(var j=0;j<4+Math.floor(r()*4)&&s>.2;j++){var cx2=112+22*(1-s),cy2=86-12*(1-s);g.appendChild(el("path",{d:roundPoly(base.map(function(p){return[cx2+p[0]*70*s,cy2+p[1]*70*s];})),fill:j%2?lt[j%3]:dk[(k+j)%4]}));s-=.012+r()*.012;}k++;}
    }
    g.appendChild(el("path",{d:roundPoly(base.map(function(p){return[128+p[0]*10,78+p[1]*10];})),fill:"#DCD6CB"}));
    /* outer skin covering part of the stone, as on most real beach agates */
    g.appendChild(el("path",{d:"M-10 120C30 104 60 150 110 150S180 120 210 140V190H-10Z",fill:"#5E2E22","fill-opacity":".85"}));
  }else if(kind==="petoskey"){
    g.appendChild(el("rect",{width:"200",height:"180",fill:"#A8A194"}));
    /* a hex lattice whose shared corners are each nudged by a fixed random amount:
       cells stay packed and flush but come out different sizes and shapes */
    var R=14,w=Math.sqrt(3)*R,J=R*.32;
    function corner(x,y){var kx=Math.round(x*10),ky=Math.round(y*10);return[x+(hash(kx,ky,1)-.5)*2*J,y+(hash(kx,ky,2)-.5)*2*J];}
    for(var row=-1;row<11;row++){for(var col=-1;col<10;col++){
      var x=col*w+(row%2?w/2:0),y=row*R*1.5,pts=[];
      for(var v=0;v<6;v++){var a=Math.PI/3*v+Math.PI/6;pts.push(corner(x+Math.cos(a)*R,y+Math.sin(a)*R));}
      var ccx=0,ccy=0;pts.forEach(function(p){ccx+=p[0];ccy+=p[1];});ccx/=6;ccy/=6;
      var shade=["#BDB5A6","#B3AB9C","#C2BAAA","#AEA697"][Math.floor(r()*4)];
      g.appendChild(el("polygon",{points:pts.map(function(p){return p[0].toFixed(1)+","+p[1].toFixed(1);}).join(" "),fill:shade,stroke:"#6A6357","stroke-width":(1+r()*.9).toFixed(2)}));
      var rays=9+Math.floor(r()*6),rot=r()*Math.PI;
      for(var q=0;q<rays;q++){var b=rot+q/rays*Math.PI*2,len=R*(.45+r()*.3);g.appendChild(el("line",{x1:ccx.toFixed(1),y1:ccy.toFixed(1),x2:(ccx+Math.cos(b)*len).toFixed(1),y2:(ccy+Math.sin(b)*len).toFixed(1),stroke:"#746C60","stroke-width":".7","stroke-opacity":(.5+r()*.4).toFixed(2)}));}
      g.appendChild(el("ellipse",{cx:(ccx+(r()-.5)*2).toFixed(1),cy:(ccy+(r()-.5)*2).toFixed(1),rx:(2+r()*1.4).toFixed(1),ry:(1.8+r()*1.2).toFixed(1),fill:"#4A443B"}));
    }}
    /* worn patch where the pattern fades, like a real tumbled stone */
    g.appendChild(el("ellipse",{cx:"58",cy:"130",rx:"46",ry:"30",fill:"#A8A194","fill-opacity":".55"}));
  }else{
    g.appendChild(el("rect",{width:"200",height:"180",fill:"#3A4A6E"}));
    [["M-10 64C40 46 80 84 130 66S210 52 220 72","#56679A",16,.7],["M-10 112C50 92 90 128 150 104S210 118 220 112","#64528A",12,.6],["M10 150C60 136 110 156 200 138","#4F7470",10,.6],["M20 34C70 46 120 28 190 40","#7F8EB0",6,.5]].forEach(function(s){g.appendChild(el("path",{d:s[0],stroke:s[1],"stroke-width":s[2],"stroke-opacity":s[3],fill:"none","stroke-linecap":"round"}));});
    for(var bI=0;bI<22;bI++){var bx=24+r()*152,by=26+r()*128,br=1+r()*r()*6.5;g.appendChild(el("ellipse",{cx:bx.toFixed(1),cy:by.toFixed(1),rx:br.toFixed(1),ry:(br*(.75+r()*.4)).toFixed(1),fill:"#1E2A45",stroke:"#9FB0D6","stroke-width":".8","stroke-opacity":".6"}));}
    for(var rs=0;rs<4;rs++){g.appendChild(el("circle",{cx:(30+r()*140).toFixed(1),cy:(30+r()*120).toFixed(1),r:(2+r()*3).toFixed(1),fill:"#8A5A3A","fill-opacity":".7"}));}
  }
  var nf=el("filter",{id:id+"n",x:"0",y:"0",width:"100%",height:"100%"});nf.appendChild(el("feTurbulence",{type:"fractalNoise",baseFrequency:".9",numOctaves:"2",stitchTiles:"stitch"}));nf.appendChild(el("feColorMatrix",{values:"0 0 0 0 .93 0 0 0 0 .91 0 0 0 0 .86 0 0 0 .7 0"}));defs.appendChild(nf);
  g.appendChild(el("rect",{width:"200",height:"180",fill:"#E9E4D8","fill-opacity":".18",class:"dust"}));
  g.appendChild(el("rect",{width:"200",height:"180",filter:"url(#"+id+"n)",class:"dust"}));
  svg.appendChild(g);
  svg.appendChild(el("path",{d:out,fill:"none",stroke:"#000","stroke-opacity":".25","stroke-width":"3"}));
  return svg;
}

function fillArt(root){
  $$("[data-tee]",root).forEach(function(n){if(!n.firstChild)n.appendChild(tee(n.dataset.tee));});
}
fillArt(document);

/* ---------- 5. Wet toggles (tap, click, Enter, or Space; hover is a bonus) ---------- */
document.addEventListener("click",function(e){
  var b=e.target.closest&&e.target.closest(".wet");
  if(!b)return;
  b.setAttribute("aria-pressed",b.getAttribute("aria-pressed")==="true"?"false":"true");
  b.dispatchEvent(new CustomEvent("wetchange",{bubbles:true}));
});

/* ---------- 6. Shop filter ---------- */
var filterBtns=$$("[data-filter]"),cards=$$(".card"),fstatus=$("#filter-status");
filterBtns.forEach(function(btn){
  btn.addEventListener("click",function(){
    var f=btn.dataset.filter,shown=0;
    filterBtns.forEach(function(b){b.setAttribute("aria-pressed",String(b===btn));});
    cards.forEach(function(c){var on=f==="all"||c.dataset.kind===f;c.hidden=!on;if(on)shown++;});
    fstatus.textContent="Showing "+shown+(shown===1?" product":" products")+".";
  });
});

/* ---------- 7. Product viewer ---------- */
var TEE_SIZES=["S","M","L","XL","2XL","3XL"];
var PRODUCTS={
  lick:{no:"HP-007",name:"I lick rocks",price:"$27.99",priceNote:"Planned price. Final price set after samples. 2XL and 3XL may cost more.",
    colors:["Pepper"],sizes:TEE_SIZES,ready:true,media:"tee",mediaNote:"Drawn mockup. Real photos come from the samples.",
    note:"A dull, dry agate with one licked streak where the red bands show through. Everybody does the lick test. Few admit it.",
    details:["Printed in the US when you order, so nothing sits in a warehouse.","The art: a code-drawn dry agate with one wet lick, in cream, red, and gray inks.","Blank, fabric, and fit details get filled in once samples arrive."]},
  chart:{no:"HP-002",name:"Great Lakes Beach Stone Chart",price:"$27.99",priceNote:"Planned price. Final price set after samples.",
    colors:["Slate"],sizes:TEE_SIZES,ready:false,media:"tee",mediaNote:"Stand-in art. The real chart is still being drawn and checked.",
    note:"The stones you are actually likely to pick up on a Great Lakes beach, drawn wet so you can see what they really look like.",
    details:["Every stone and label gets checked against reliable references before printing.","Pairs with the free field guide.","Art in progress, so it cannot be added to the cart yet."]},
  expect:{no:"HP-006",name:"Agate Expectations",price:"$27.99",priceNote:"Planned price. Final price set after samples.",
    colors:["Natural"],sizes:TEE_SIZES,ready:false,media:"tee",mediaNote:"Stand-in art. Final lettering and agate are still being drawn.",
    note:"For anyone who has picked up a hundred red pebbles hoping one would let the light through.",
    details:["Printed in the US when you order.","Art in progress, so it cannot be added to the cart yet."]},
  brake:{no:"HP-009",name:"Will brake for agates",price:"$27.99",priceNote:"Planned price. Final price set after samples.",
    colors:["Lake teal"],sizes:TEE_SIZES,ready:false,media:"tee",mediaNote:"Stand-in art. Final lettering is still being drawn.",
    note:"For the driver who knows every gravel pull-off between here and the lake.",
    details:["Printed in the US when you order.","Art in progress, so it cannot be added to the cart yet."]},
  socks:{no:"HP-011",name:"Petoskey hexagon socks",price:"$18.99",priceNote:"Planned price. Final price set after samples.",
    colors:["Natural","Slate"],sizes:["S","M","L"],ready:true,media:"socks",mediaNote:"Flat pattern preview. Sock mockups come with the samples.",
    note:"An all-over Petoskey cell pattern drawn by code, so no two cells are quite the same.",
    details:["All-over printed crew socks, made in the US to order.","Sized S, M, and L.","Printify notes that side seams can show on dark designs; we will check the sample."]}
};
var pv={bar:$("#pv-bar"),media:$("#pv-media"),mediaNote:$("#pv-media-note"),spec:$("#pv-spec"),name:$("#pv-name"),price:$("#pv-price"),
  colors:$("#pv-colors"),sizes:$("#pv-sizes"),noteNo:$("#pv-note-no"),note:$("#pv-note"),details:$("#pv-details"),add:$("#add"),msg:$("#buy-msg"),viewer:$("#product")};
var current="lick";

function optHTML(name,value,checked,swatch){
  var sw=swatch?'<i class="sw" style="background:'+swatch+'"></i>':"";
  return '<label class="opt"><input type="radio" name="'+name+'" value="'+value+'"'+(checked?" checked":"")+'><span>'+sw+value+'</span></label>';
}
var SWATCH={Pepper:"#4A4B47",Slate:"#24323D",Natural:"#E2DACA","Lake teal":"#1F5653"};
function sockMedia(color){
  var file=color==="Slate"?"socks_slate.jpg":"socks_natural.jpg";
  return '<button class="wet hoverable" type="button" aria-pressed="false" aria-label="Wet the Petoskey sock pattern in '+color.toLowerCase()+'">'+
    '<span class="wet-media socks-one"><img src="'+IMG+file+'" alt="Petoskey hexagon sock pattern in '+color.toLowerCase()+'" width="720" height="720"></span>'+
    '<span class="wet-hint" aria-hidden="true"><span class="is-dry">Tap to wet</span><span class="is-wet">Wet. Tap to dry.</span></span></button>';
}
function teeMedia(id){
  return '<button class="wet hoverable" type="button" aria-pressed="false" aria-label="Wet the '+PRODUCTS[id].name+' shirt '+(PRODUCTS[id].ready?"mockup":"stand-in")+'">'+
    '<span class="wet-media panel" data-tee="'+id+'"></span>'+
    '<span class="wet-hint" aria-hidden="true"><span class="is-dry">Tap to wet</span><span class="is-wet">Wet. Tap to dry.</span></span></button>';
}
function showProduct(id){
  var p=PRODUCTS[id];if(!p)return;current=id;
  pv.bar.textContent="PRODUCT / "+p.no+".TXT";
  pv.spec.textContent="No. "+p.no;
  pv.name.textContent=p.name;
  pv.price.innerHTML=p.price+' <span class="sub"></span>';pv.price.querySelector(".sub").textContent=p.priceNote;
  pv.media.innerHTML=p.media==="socks"?sockMedia(p.colors[0]):teeMedia(id);fillArt(pv.media);
  pv.mediaNote.textContent=p.mediaNote;
  pv.colors.innerHTML='<legend>Color: <span id="pv-color-name"></span></legend>'+p.colors.map(function(c,i){return optHTML("color",c,i===0,SWATCH[c]);}).join("");
  $("#pv-color-name").textContent=p.colors[0];
  pv.sizes.innerHTML="<legend>Size</legend>"+p.sizes.map(function(s){return optHTML("size",s,false);}).join("");
  pv.noteNo.textContent=p.no;pv.note.textContent=p.note;
  pv.details.innerHTML="";p.details.forEach(function(d){var li=document.createElement("li");li.textContent=d;pv.details.appendChild(li);});
  pv.msg.textContent="";pv.msg.className="form-msg";
  pv.add.removeAttribute("aria-busy");
  if(p.ready){pv.add.disabled=false;pv.add.textContent="Add to cart";}
  else{pv.add.disabled=true;pv.add.textContent="Art in progress";}
}
pv.colors.addEventListener("change",function(e){
  if(e.target.name!=="color")return;
  $("#pv-color-name").textContent=e.target.value;
  if(PRODUCTS[current].media==="socks"){pv.media.innerHTML=sockMedia(e.target.value);}
});
document.addEventListener("click",function(e){
  var a=e.target.closest&&e.target.closest("[data-view]");
  if(!a)return;
  e.preventDefault();
  showProduct(a.dataset.view);
  var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  pv.viewer.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"});
  pv.viewer.focus({preventScroll:true});
  if(history.replaceState)history.replaceState(null,"","#product");
});

/* ---------- 8. Add to cart + cart dialog (preview only) ---------- */
var cartItems=[],form=$("#buy"),cartBtn=$("#cart-open"),cartCount=$("#cart-count"),dlg=$("#cart"),cartList=$("#cart-list"),cartEmpty=$("#cart-empty");
form.addEventListener("change",function(){if(pv.msg.classList.contains("err")){pv.msg.textContent="";pv.msg.className="form-msg";}});
form.addEventListener("submit",function(e){
  e.preventDefault();
  var p=PRODUCTS[current];if(!p.ready||pv.add.getAttribute("aria-busy")==="true")return;
  var size=form.querySelector("input[name=size]:checked"),color=form.querySelector("input[name=color]:checked");
  if(!size){pv.msg.className="form-msg err";pv.msg.textContent="Pick a size first.";form.querySelector("input[name=size]").focus();return;}
  pv.add.setAttribute("aria-busy","true");pv.add.textContent="Adding";
  setTimeout(function(){
    cartItems.push({name:p.name,color:color?color.value:"",size:size.value,price:p.price});
    renderCart();
    pv.add.removeAttribute("aria-busy");pv.add.textContent="Add another";
    pv.msg.className="form-msg ok";pv.msg.textContent="Added "+p.name+", "+(color?color.value.toLowerCase()+", ":"")+"size "+size.value+". Preview only, nothing is charged.";
  },500);
});
function renderCart(){
  var n=cartItems.length;
  cartCount.textContent=n;
  cartBtn.setAttribute("aria-label","Cart, "+n+(n===1?" item":" items"));
  cartList.innerHTML="";
  cartItems.forEach(function(it){var li=document.createElement("li");var a=document.createElement("span");a.textContent=it.name+" ("+it.color+", "+it.size+")";var b=document.createElement("b");b.textContent=it.price;li.appendChild(a);li.appendChild(b);cartList.appendChild(li);});
  cartEmpty.hidden=n>0;
}
cartBtn.addEventListener("click",function(){if(dlg.showModal)dlg.showModal();else dlg.setAttribute("open","");});
$("#cart-close").addEventListener("click",function(){if(dlg.close)dlg.close();else dlg.removeAttribute("open");});
dlg.addEventListener("click",function(e){if(e.target===dlg)dlg.close();});

/* ---------- 9. Wet test: tabs, splash button, and a small specimen log ---------- */
var tabs=$$("[data-stone-tab]"),panel=$("#lab-panel"),labStone=$("#lab-stone"),labMedia=$("#lab-media"),splash=$("#lab-splash");
var wetted={},drawn={};
function syncSplash(){var wet=labStone.getAttribute("aria-pressed")==="true";splash.textContent=wet?"Dry it off":"Splash it";}
function selectStone(kind,focus){
  tabs.forEach(function(t){var on=t.dataset.stoneTab===kind;t.setAttribute("aria-selected",String(on));t.tabIndex=on?0:-1;if(on&&focus)t.focus();});
  panel.setAttribute("aria-labelledby","tab-"+kind);
  var s=STONES[kind];
  if(!drawn[kind])drawn[kind]=stone(kind);
  labMedia.innerHTML="";labMedia.appendChild(drawn[kind]);
  labStone.dataset.kind=kind;
  labStone.setAttribute("aria-pressed","false");
  labStone.setAttribute("aria-label","Wet the "+s.name+" drawing");
  $("#lab-name").textContent=s.name;$("#lab-dry").textContent=s.dry;$("#lab-wet").textContent=s.wet;$("#lab-aside").textContent=s.aside;
  syncSplash();
}
tabs.forEach(function(t,i){
  t.addEventListener("click",function(){selectStone(t.dataset.stoneTab,false);});
  t.addEventListener("keydown",function(e){
    var n=null;
    if(e.key==="ArrowRight")n=(i+1)%tabs.length;else if(e.key==="ArrowLeft")n=(i-1+tabs.length)%tabs.length;
    else if(e.key==="Home")n=0;else if(e.key==="End")n=tabs.length-1;
    if(n!==null){e.preventDefault();selectStone(tabs[n].dataset.stoneTab,true);}
  });
});
splash.addEventListener("click",function(){labStone.click();});
labStone.addEventListener("wetchange",function(){
  syncSplash();
  if(labStone.getAttribute("aria-pressed")!=="true")return;
  wetted[labStone.dataset.kind]=true;
  var n=Object.keys(wetted).length;
  $("#lab-count").textContent="Specimens wetted: "+n+" of 3";
  $$(".pips i").forEach(function(p,i){p.classList.toggle("on",i<n);});
  if(n===3)$("#lab-done").hidden=false;
});
selectStone("agate",false);

})();
