// Shared overlay layout for Book Plume 3D shorts (1080x1920). Fixed zones — nothing may overlap:
//   TOP    0–430 : solid shade; title y 200–340 (max 2 lines), progress row y 352–384 (bar x 70–860, counter/steps), credit y 400
//   MODEL  430–1170 : the 3D model (camera framing keeps the focus box inside this zone)
//   BOTTOM 1170–1520 : dark gradient band; label chip at y 1215, sub-line / fact under it (flex column, gap 14)
//   END CARD centered at y 700–1150 only after the last item.
export const CSS = `
@font-face{font-family:PJS;font-weight:800;src:url(/r3d/fonts/plus-jakarta-sans-latin-800-normal.woff2)}
@font-face{font-family:PJS;font-weight:700;src:url(/r3d/fonts/plus-jakarta-sans-latin-700-normal.woff2)}
#ov{position:absolute;left:0;top:0;width:1080px;height:1920px;pointer-events:none;font-family:PJS,sans-serif;overflow:hidden}
.topshade{position:absolute;left:0;top:0;width:1080px;height:470px;background:linear-gradient(rgba(12,18,8,.98) 0,rgba(12,18,8,.96) 400px,rgba(12,18,8,0) 470px)}
.botshade{position:absolute;left:0;top:1120px;width:1080px;height:800px;background:linear-gradient(rgba(12,18,8,0),rgba(12,18,8,.88) 120px,rgba(12,18,8,.97) 420px,rgba(12,18,8,.98))}
.title{position:absolute;left:60px;top:200px;width:960px;height:140px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#F7F6EC;font-weight:800;font-size:64px;line-height:1.08;letter-spacing:-1px;text-align:center}
.title b{color:#1F2A14;background:#F2D14E;padding:0 14px;border-radius:12px}
.prog{position:absolute;left:70px;top:362px;width:790px;height:12px;background:rgba(255,255,255,.16);border-radius:6px;overflow:hidden}
.prog i{display:block;height:100%;background:#F2D14E}
.count{position:absolute;left:880px;top:346px;width:130px;text-align:right;color:#F2D14E;font-weight:800;font-size:40px;line-height:44px}
.steps{position:absolute;left:70px;top:352px;width:940px;height:36px;display:flex;gap:10px}
.steps div{flex:1;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:22px;border-radius:10px;border:3px solid rgba(247,246,236,.35);color:rgba(247,246,236,.6);white-space:nowrap;overflow:hidden}
.steps div.on{background:#F2D14E;color:#1F2A14;border-color:#F2D14E}
.steps div.done{background:#5C7A2F;color:#fff;border-color:#5C7A2F}
.credit{position:absolute;left:70px;top:402px;width:940px;color:rgba(247,246,236,.5);font-weight:700;font-size:21px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lab{position:absolute;left:60px;top:1205px;width:960px;display:flex;flex-direction:column;align-items:center;gap:14px}
.lab .n{background:#F2D14E;color:#1F2A14;font-weight:800;padding:10px 30px;border-radius:22px;border:6px solid #1F2A14;box-shadow:7px 9px 0 rgba(0,0,0,.4);white-space:nowrap;max-width:940px}
.lab .p{color:#F7F6EC;font-weight:700;font-size:42px;white-space:nowrap}
.lab .f{background:rgba(247,246,236,.96);color:#1F2A14;font-weight:800;font-size:44px;padding:10px 26px;border-radius:18px;border:5px solid #1F2A14;white-space:nowrap;box-shadow:6px 8px 0 rgba(0,0,0,.35)}
.lab .f em{font-style:normal;color:#C9483C}
.lab .f.t{background:#C9483C;color:#fff;border-color:#fff}
.end{position:absolute;left:90px;top:700px;width:900px;padding:56px 30px;background:#F2D14E;border:6px solid #1F2A14;border-radius:36px;box-shadow:12px 14px 0 rgba(0,0,0,.4);text-align:center;color:#1F2A14}
.end .a{font-weight:800;font-size:80px;line-height:1.05}.end .b{margin-top:22px;font-weight:800;font-size:50px;color:#C9483C;line-height:1.15}
`;
export async function setupOverlay(){
  const st=document.createElement('style'); st.textContent=CSS; document.head.appendChild(st);
  const ov=document.createElement('div'); ov.id='ov'; document.body.appendChild(ov);
  await document.fonts.load('800 40px PJS'); await document.fonts.load('700 40px PJS');
  return ov;
}
// font size so that a chip text fits 940 px
export const fitFont=(txt,max=76,min=40)=>{ const est=txt.length*0.62; let f=max; while(f>min && est*f>880) f-=2; return f; };
export function background(THREE){
  const cv=document.createElement('canvas'); cv.width=540; cv.height=960; const g=cv.getContext('2d');
  const gr=g.createRadialGradient(270,400,30,270,420,620); gr.addColorStop(0,'#3B5124'); gr.addColorStop(0.55,'#223017'); gr.addColorStop(1,'#11180B');
  g.fillStyle=gr; g.fillRect(0,0,540,960);
  g.fillStyle='rgba(255,255,255,0.05)'; for(let y=12;y<960;y+=24)for(let x=12;x<540;x+=24){g.beginPath();g.arc(x,y,1.3,0,7);g.fill();}
  const t=new THREE.CanvasTexture(cv); t.colorSpace=THREE.SRGBColorSpace; return t;
}
// camera framing: box must fit inside the MODEL zone (x 70–1010, y 450–1150 of the 1080x1920 frame)
export const ZONE={cy:800, h:700, w:940, W:1080, H:1920, plain:false};
// landscape / long-video use: setFrame(1920,1080,true) -> no overlay, model framed in the centre 80% of the frame
export function setFrame(W,H,plain){ ZONE.W=W; ZONE.H=H; ZONE.plain=!!plain; if(W>H||plain){ ZONE.cy=H/2; ZONE.h=H*0.8; ZONE.w=W*0.8; } }
export function frameDist(THREE,box,fovDeg,aspect,fill=0.9){
  const s=box.getSize(new THREE.Vector3());
  const vfov=fovDeg*Math.PI/180; const fracH=ZONE.h/ZONE.H*fill, fracW=ZONE.w/ZONE.W*fill;
  const dH=(s.y/fracH)/(2*Math.tan(vfov/2));
  const hfov=2*Math.atan(Math.tan(vfov/2)*aspect); const dW=(Math.max(s.x,s.z*0.6)/fracW)/(2*Math.tan(hfov/2));
  return Math.max(dH,dW)+s.z*0.5;
}
// shift the projection so the camera target lands at ZONE.cy instead of the frame centre
export const applyOffset=(camera)=>camera.setViewOffset(ZONE.W,ZONE.H,0,ZONE.H/2-ZONE.cy,ZONE.W,ZONE.H);
