import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {setupOverlay,background,frameDist,applyOffset,fitFont,setFrame,ZONE} from './ui.js';
// 3D JOURNEY: a glowing bolus travels through organs stage by stage. args: {model, cfg}
// cfg = {
//  title:["line1","line2 with <b>hl</b>"], credit:"3D: ...", hide:[meshIdx],
//  wp:{ name: {mesh:k, sel:[[axis,"min"|"max"|"abs",w],...], zfrac?:0..1, d?:[dx,dy,dz]} | {lerp:[nameA,nameB,f], d?:[..]} | {p:[x,y,z]} },
//  meander:{ name:{mesh:k, rows:5, cols:3, zback:0.02} }   -> a list of points usable inside paths as "@name"
//  stages:[{key,label, t0,t1, light:[k], focus:[k], zoom:1, dy:0, ghost:{k:op}, semi:{k:op},
//           move:{type:"path", pts:[names], a:t0, b:t1, ease:"smooth"|"linear"} | {type:"swirl", at:name, r:0.012} | {type:"hold", at:name},
//           lightAt:[{t, meshes:[k]}] }],
//  particles:[{from:name, to:name, t0, t1, color:"#7CFF6B", n:12}],
//  colors:[{t, color:"#hex"}] (optional: bolus/trail/glow colour keys, 0.6 s blend; default yellow),
//  chips:[{txt, kind:"n"|"f"|"t", t0, t1}],  final:t (all organs lit, full view), tEnd0, endA, endB, bolusSize:0.0075 }
const sm=x=>x<0?0:x>1?1:x*x*(3-2*x);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export async function init({THREE,renderer,W,H,args}){
  const cfg=args.cfg; setFrame(W,H,cfg.plain); const ov=await setupOverlay();
  renderer.toneMappingExposure=1.1;
  const scene=new THREE.Scene(); scene.background=background(THREE);
  const camera=new THREE.PerspectiveCamera(28,W/H,0.0005,50);
  scene.add(new THREE.HemisphereLight(0xfff4e6,0x2a3a1a,1.5));
  const key=new THREE.DirectionalLight(0xffffff,2.4); key.position.set(1,2,3); scene.add(key);
  const rim=new THREE.DirectionalLight(0xF2D14E,1.2); rim.position.set(-2,1,-2); scene.add(rim);
  const gltf=await new GLTFLoader().loadAsync(args.model); const root=gltf.scene; scene.add(root); root.updateMatrixWorld(true);
  const meshes=[]; root.traverse(o=>{if(o.isMesh)meshes.push(o)});
  const hide=new Set(cfg.hide||[]);
  meshes.forEach((m,k)=>{ m.userData.k=k; if(hide.has(k)){m.visible=false;return;}
    const mat=m.material.clone(); mat.transparent=true; m.material=mat; m.userData.em=mat.emissive?mat.emissive.clone():null; });
  const VC={}; const verts=k=>{ if(VC[k]) return VC[k]; const m=meshes[k]; const p=m.geometry.attributes.position; const out=[]; const v=new THREE.Vector3();
    const step=Math.max(1,Math.floor(p.count/8000)); for(let i=0;i<p.count;i+=step){ v.fromBufferAttribute(p,i).applyMatrix4(m.matrixWorld); out.push(v.clone()); } return VC[k]=out; };
  const avg=a=>{const s=new THREE.Vector3(); a.forEach(v=>s.add(v)); return s.multiplyScalar(1/Math.max(1,a.length));};
  const WP={};
  const resolve=name=>{ if(WP[name]) return WP[name]; const s=cfg.wp[name]; if(!s) throw new Error('no waypoint '+name); let v;
    if(s.p) v=new THREE.Vector3(...s.p);
    else if(s.lerp) v=resolve(s.lerp[0]).clone().lerp(resolve(s.lerp[1]),s.lerp[2]);
    else { let a=verts(s.mesh); for(const [ax,mode,w] of (s.sel||[])){ const vals=a.map(q=>q[ax]); const mn=Math.min(...vals), mx=Math.max(...vals), c=(mn+mx)/2;
        a=a.filter(q=> mode==='min'? q[ax]<mn+w : mode==='max'? q[ax]>mx-w : Math.abs(q[ax]-c)<w); }
      v=avg(a); if(s.zfrac!==undefined){ const zs=a.map(q=>q.z); const zmx=Math.max(...zs), zmn=Math.min(...zs); v.z=zmx-(zmx-zmn)*s.zfrac; } }
    if(s.d) v.add(new THREE.Vector3(...s.d)); return WP[name]=v; };
  const MEAN={}; for(const [name,s] of Object.entries(cfg.meander||{})){ const b=new THREE.Box3(); verts(s.mesh).forEach(v=>b.expandByPoint(v));
    const zf=b.max.z-(s.zback??0.02), iw=b.max.x-b.min.x, ih=b.max.y-b.min.y, rows=s.rows||5, cols=s.cols||3, pts=[];
    for(let r=0;r<rows;r++){ const y=b.max.y-ih*(0.15+0.7*r/(rows-1)); const xs=[...Array(cols)].map((_,c)=>0.18+0.64*c/(cols-1)); if(r%2) xs.reverse(); xs.forEach(f=>pts.push(new THREE.Vector3(b.min.x+iw*f,y+(f-0.5)*0.008,zf))); }
    MEAN[name]=pts; }
  const expand=names=>names.flatMap(n=>n.startsWith('@')?MEAN[n.slice(1)]:[resolve(n)]);
  const curves=cfg.stages.map(st=> st.move&&st.move.type==='path' ? new THREE.CatmullRomCurve3(expand(st.move.pts),false,'centripetal') : null);
  // bolus + glow + trail
  const bs=cfg.bolusSize||0.0075;
  const bol=new THREE.Mesh(new THREE.SphereGeometry(bs,24,16), new THREE.MeshBasicMaterial({color:0xFFE680,depthTest:false,transparent:true})); bol.renderOrder=10; scene.add(bol);
  const gc=document.createElement('canvas'); gc.width=gc.height=128; const gg=gc.getContext('2d'); const rg=gg.createRadialGradient(64,64,0,64,64,64);
  rg.addColorStop(0,'rgba(255,230,120,1)'); rg.addColorStop(0.35,'rgba(242,209,78,0.6)'); rg.addColorStop(1,'rgba(242,209,78,0)'); gg.fillStyle=rg; gg.fillRect(0,0,128,128);
  const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(gc),depthTest:false,transparent:true,blending:THREE.AdditiveBlending})); glow.renderOrder=9; scene.add(glow);
  const trail=[]; for(let i=0;i<14;i++){ const s=new THREE.Mesh(new THREE.SphereGeometry(bs*0.55,12,8), new THREE.MeshBasicMaterial({color:0xF2D14E,depthTest:false,transparent:true})); s.renderOrder=8; scene.add(s); trail.push(s); }
  const parts=(cfg.particles||[]).map(p=>({...p, a:resolve(p.from), b:resolve(p.to), objs:[...Array(p.n||12)].map(()=>{ const s=new THREE.Mesh(new THREE.SphereGeometry(bs*0.38,8,6), new THREE.MeshBasicMaterial({color:new THREE.Color(p.color),depthTest:false,transparent:true})); s.renderOrder=7; s.visible=false; scene.add(s); return s; })}));
  const full=new THREE.Box3(); meshes.forEach(m=>{ if(m.visible) full.expandByObject(m); });
  const sboxes=cfg.stages.map(st=>{ const b=new THREE.Box3(); (st.focus||st.light).forEach(k=>b.expandByObject(meshes[k])); return b; });
  return {THREE,scene,camera,meshes,ov,cfg,curves,resolve,bol,glow,trail,parts,full,sboxes,bs};
}
export async function frame(ctx,t){
  const {THREE,camera,meshes,cfg,curves,resolve,bol,glow,trail,parts,ov}=ctx; const S=cfg.stages;
  const stageAt=tt=>{ let k=-1; S.forEach((s,i)=>{ if(tt>=s.t0) k=i; }); if(tt>=cfg.final) return -2; return k; };
  const pos=tt=>{ // bolus position
    let k=stageAt(tt); if(k===-2) k=S.length-1; if(k<0){ const s0=S[0]; return s0.move.type==='path'?curves[0].getPoint(0):resolve(s0.move.at); }
    const s=S[k], m=s.move;
    if(m.type==='path'){ const a=m.a??s.t0, b=m.b??s.t1; const u=clamp((tt-a)/(b-a),0,1); return curves[k].getPoint(m.ease==='linear'?u:sm(u)); }
    const c=resolve(m.at); if(m.type==='hold') return c.clone();
    const a=(tt-s.t0)*5.5, r=(m.r||0.012)*Math.min(1,(tt-s.t0)/0.4); return c.clone().add(new THREE.Vector3(Math.cos(a)*r,Math.sin(a*0.7)*r*0.8,Math.sin(a)*r*0.4)); };
  const p=pos(t); bol.position.copy(p); glow.position.copy(p); const pul=1+0.25*Math.sin(t*10); glow.scale.set(ctx.bs*7.3*pul,ctx.bs*7.3*pul,1);
  trail.forEach((s,i)=>{ s.position.copy(pos(t-(i+1)*0.05)); s.material.opacity=0.55*(1-i/trail.length); s.scale.setScalar(1-i/trail.length*0.6); });
  const k=stageAt(t), fin=k===-2; [bol,glow,...trail].forEach(o=>o.visible=!fin);
  if(cfg.colors&&cfg.colors.length){ const K=cfg.colors; let i=-1; K.forEach((c,j)=>{ if(t>=c.t) i=j; });
    const col=new THREE.Color(K[Math.max(0,i)].color); if(i>0){ const u=sm((t-K[i].t)/0.6); col.copy(new THREE.Color(K[i-1].color)).lerp(new THREE.Color(K[i].color),u); }
    bol.material.color.copy(col); trail.forEach(s=>s.material.color.copy(col).multiplyScalar(0.9)); glow.material.color.copy(col).lerp(new THREE.Color(1,1,1),0.35); }
  // camera
  const fov=camera.fov, asp=camera.aspect;
  const V=i=>{ if(i<0) return {c:ctx.full.getCenter(new THREE.Vector3()), d:frameDist(THREE,ctx.full,fov,asp,0.92)};
    const st=S[i]; const c=ctx.sboxes[i].getCenter(new THREE.Vector3()); c.y+=(st.dy||0); return {c, d:frameDist(THREE,ctx.sboxes[i],fov,asp,0.85)*(st.zoom||1)}; };
  const st0= fin?cfg.final : k<0?0 : S[k].t0; const prevK= fin? S.length-1 : k-1; const curK= fin?-1:k;
  const A=V(fin||k>0?prevK:-1), B=V(curK); const a=sm((t-st0)/0.7);
  const tgt=A.c.clone().lerp(B.c,a); const d=A.d+(B.d-A.d)*a; if(curK>=0) tgt.lerp(p,0.25*a);
  const yaw=0.35*Math.sin(t*0.35)+0.05+(fin?(t-cfg.final)*(cfg.endSpin??0.35):0), pitch=0.12; // endSpin keeps the end card moving (no frozen frames)
  camera.position.set(tgt.x+Math.sin(yaw)*d, tgt.y+Math.sin(pitch)*d, tgt.z+Math.cos(yaw)*d); camera.lookAt(tgt); applyOffset(camera);
  // organ looks
  const lit=new Set(); let ghost={}, semi={};
  if(k>=0){ const s=S[k]; s.light.forEach(x=>lit.add(x)); (s.lightAt||[]).forEach(l=>{ if(t>=l.t) l.meshes.forEach(x=>lit.add(x)); }); ghost=s.ghost||{}; semi=s.semi||{}; }
  meshes.forEach(m=>{ const j=m.userData.k; if(!m.visible) return; const mt=m.material;
    let op= fin?((cfg.finalGhost||{})[j]??1) : k<0?0.85 : lit.has(j)?(semi[j]??1):(ghost[j]??0.16);
    mt.opacity=op; mt.depthWrite=op>0.9;
    if(mt.emissive){ mt.emissive.copy(m.userData.em||new THREE.Color(0)); if((lit.has(j)&&!fin)||(fin&&(cfg.finalLight||[]).includes(j))) mt.emissive.set(0x5a4500); } });
  parts.forEach(pp=>{ pp.objs.forEach((s,i)=>{ const ph=((t-pp.t0)*0.9+i/pp.objs.length)%1; s.visible=t>pp.t0&&t<pp.t1;
    if(s.visible){ s.position.copy(pp.a).lerp(pp.b,ph); s.material.opacity=Math.sin(ph*Math.PI); } }); });
  // overlay
  const idx=fin?S.length:k;
  let h=`<div class="topshade"></div><div class="botshade"></div><div class="title"><div>${cfg.title[0]}</div><div>${cfg.title[1]}</div></div>`;
  h+=`<div class="steps">${S.map((s,i)=>`<div class="${i<idx?'done':i===idx?'on':''}">${s.label}</div>`).join('')}</div><div class="credit">${cfg.credit}</div>`;
  const act=cfg.chips.filter(c=>t>=c.t0&&t<c.t1);
  if(act.length && t<cfg.tEnd0 && !(cfg.saveMap&&t>=cfg.saveMap.t0)){ h+=`<div class="lab">`+act.map(c=>{ const a=clamp((t-c.t0)/0.18,0,1)*clamp((c.t1-t)/0.18,0,1); const sc=0.75+0.25*clamp((t-c.t0)/0.18,0,1);
      if(c.kind==='n') return `<div class="n" style="font-size:${fitFont(c.txt,70)}px;opacity:${a};transform:scale(${sc})">${c.txt}</div>`;
      return `<div class="f${c.kind==='t'?' t':''}" style="opacity:${a};transform:scale(${sc})">${c.txt}</div>`; }).join('')+`</div>`; }
  if(t>=cfg.tEnd0){ const a=clamp((t-cfg.tEnd0)/0.3,0,1); const sc=(0.6+0.4*(1-Math.pow(1-a,3)))*(1+0.025*Math.sin(Math.max(0,t-cfg.tEnd0-0.3)*4.2));
    h+=`<div class="end" style="transform:scale(${sc.toFixed(3)}) rotate(-2deg);opacity:${a}"><div class="a">${cfg.endA}</div><div class="b">${cfg.endB}</div></div>`; }
  const SM=cfg.saveMap; if(SM && t>=SM.t0 && t<cfg.tEnd0){ camera.updateMatrixWorld(); const a=clamp((t-SM.t0)/0.3,0,1);
    h+=`<svg class="smap" width="1080" height="1920" style="position:absolute;left:0;top:0;opacity:${a}">`+SM.items.map(it=>{ const v=resolve(it.wp).clone().project(camera);
      const x=(v.x+1)/2*ZONE.W, y=(1-v.y)/2*ZONE.H; return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="34" fill="#F2D14E" stroke="#1F2A14" stroke-width="6"/><text x="${x.toFixed(1)}" y="${(y+15).toFixed(1)}" text-anchor="middle" font-family="PJS" font-weight="800" font-size="42" fill="#1F2A14">${it.n}</text>`; }).join('')+`</svg>`;
    h+=`<div class="lab" style="opacity:${a}"><div class="n" style="font-size:60px">${SM.title}</div><div class="smleg">${SM.items.map(it=>`<span><b>${it.n}</b>${it.txt}</span>`).join('')}</div></div>`; }
  ov.innerHTML=ZONE.plain?'':h;
}
