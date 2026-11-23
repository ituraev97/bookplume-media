<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:PJS;src:url(pjs800.woff2);font-weight:800}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;font-family:PJS,Arial,sans-serif;font-weight:800;background:#F7F6EC;color:#1F2A14;position:relative}
.top{position:absolute;left:0;top:0;width:1080px;height:300px;background:#1F2A14;color:#F7F6EC}
.h1{position:absolute;left:60px;top:46px;font-size:92px;letter-spacing:-3px;line-height:1}
.h2{position:absolute;left:60px;top:170px;font-size:56px;color:#F2D14E}
.num{position:absolute;right:50px;top:50px;font-size:44px;color:#F2D14E}
.win{position:absolute;overflow:hidden;border:6px solid #1F2A14;border-radius:26px;background:#FBF8EE;box-shadow:0 18px 50px rgba(31,42,20,.25)}
.win img{position:absolute;filter:contrast(1.15) saturate(1.3)}
.q{position:absolute;background:#F2D14E;border:4px solid #1F2A14;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:30px}
.pin{position:absolute;width:70px;height:70px;border-radius:50%;background:#C9483C;border:6px solid #fff;box-shadow:0 0 0 4px #1F2A14;color:#fff;font-size:40px;display:flex;align-items:center;justify-content:center}
.ring{position:absolute;border-radius:50%;border:14px solid #E5202A;box-shadow:0 0 0 4px #fff}
.cap{position:absolute;left:0;width:1080px;text-align:center}
.pill{display:inline-block;background:#1F2A14;color:#F2D14E;border-radius:999px;padding:14px 40px 18px;font-size:42px;letter-spacing:2px}
.chip{position:absolute;background:#5C7A2F;color:#fff;border:4px solid #1F2A14;border-radius:10px;padding:2px 14px;font-size:30px;white-space:nowrap}
.ans{display:flex;align-items:center;font-size:52px;margin:0 0 8px 0}
.ans b{width:64px;height:64px;border-radius:50%;background:#C9483C;color:#fff;display:flex;align-items:center;justify-content:center;font-size:38px;margin-right:26px;font-weight:800}
</style></head><body><script>
const D=__D__;const A=__A__;
const P=new URLSearchParams(location.search);const s=+P.get('s');
const labels=D.labels.map(l=>l.box),qs=D.qs;const AR=D.plate.w/D.plate.h;
function win(x,y,w,h,zoom,pin,opts){
  const iw=w*zoom,ih=iw/AR;const px=pin[0],py=pin[1];
  const cl=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
  let L=cl(w/2-px*iw,w-iw,0),T=ih<h?(h-ih)/2:cl(h/2-py*ih,h-ih,0);
  let o=`<div class="win" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><img src="liver1086.png" style="left:${L}px;top:${T}px;width:${iw}px;height:${ih}px">`;
  (opts.stickers||[]).forEach(i=>{const b=labels[i];o+=`<div class="q" style="left:${L+b[0]*iw}px;top:${T+b[1]*ih}px;width:${(b[2]-b[0])*iw}px;height:${(b[3]-b[1])*ih}px">?</div>`});
  (opts.pins||[]).forEach(p=>{const cx=L+p.p[0]*iw,cy=T+p.p[1]*ih;if(p.ring)o+=`<div class="ring" style="left:${cx-90}px;top:${cy-90}px;width:180px;height:180px"></div>`;o+=`<div class="pin" style="left:${cx-35+(p.dx||0)}px;top:${cy-35+(p.dy||0)}px">${p.n}</div>`});
  (opts.chips||[]).forEach(c=>{const b=labels[c.i];const ax=c.at?c.at[0]:(b[0]+b[2])/2,ay=c.at?c.at[1]:(b[1]+b[3])/2;o+=`<div class="chip" style="left:${L+ax*iw}px;top:${T+ay*ih}px;transform:translate(-50%,-50%) rotate(-3deg)">${c.t}</div>`});
  return o+'</div>';}
const allS=D.labels.map((_,i)=>i);
let h='';
if(s==1){h=`<div class="top"><div class="h1">LIVER QUIZ</div><div class="h2">Can you name all 5?</div><div class="num">1/6</div></div>`+
 win(40,340,1000,740,1,[0.5,0.5],{stickers:allS,pins:qs.map(q=>({n:q.n,p:q.pin}))})+
 `<div class="cap" style="top:1130px"><div class="pill">0/5 ? SWIPE FOR EACH ONE</div></div><div class="cap" style="top:1240px;font-size:44px;color:#C9483C">Comment your score</div>`;}
else if(s>=2&&s<=5){const ids=s<5?[s-2]:[3,4];
 h=`<div class="top"><div class="h1">LIVER QUIZ</div><div class="h2">Question${ids.length>1?'s':''} ${ids.map(i=>i+1).join(' & ')}</div><div class="num">${s}/6</div></div>`;
 if(ids.length==1){const q=qs[ids[0]];h+=win(40,340,1000,740,1.7,q.pin,{stickers:allS,pins:[{n:q.n,p:q.pin,ring:1,dx:60,dy:-70}]})+
   `<div class="cap" style="top:1110px;font-size:76px;letter-spacing:-2px">${q.n}. ${A[ids[0]]}?</div><div class="cap" style="top:1230px"><div class="pill">Answer on the last slide</div></div>`;}
 else{ids.forEach((i,k)=>{const q=qs[i];h+=win(40,330+k*400,1000,380,1.9,q.pin,{stickers:allS,pins:[{n:q.n,p:q.pin,ring:1,dx:60,dy:-60}]});});
   h+=`<div class="cap" style="top:1195px;font-size:58px">4. Name this vessel?</div><div class="cap" style="top:1265px;font-size:58px">5. Name this lobe?</div>`;}}
else{h=`<div class="top"><div class="h1">LIVER QUIZ</div><div class="h2">Answers · save this</div><div class="num">6/6</div></div>`+
 win(40,330,1000,470,1,[0.5,0.5],{stickers:[8,9,5,7,6,4],pins:[],chips:[{i:0,t:'1 GALLBLADDER'},{i:1,t:'2 RIGHT LOBE'},{i:2,t:'3 LEFT LOBE',at:[0.14,0.25]},{i:3,t:'4 INF. VENA CAVA',at:[0.47,0.2]},{i:4,t:'5 CAUDATE LOBE',at:[0.36,0.4]}]})+
 `<div style="position:absolute;left:90px;top:830px">`+qs.map(q=>`<div class="ans"><b>${q.n}</b>${q.name}</div>`).join('')+`</div>`;}
document.body.insertAdjacentHTML('beforeend',h);
</script></body></html>
