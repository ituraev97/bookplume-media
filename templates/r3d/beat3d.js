import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
import {setupOverlay,background,frameDist,applyOffset,fitFont,setFrame,ZONE} from './ui.js';
// 3D LABELS TO THE BEAT. args: {model, cfg}
// cfg: {title:["line 1","<b>line 2</b>"], credit, hide:[meshIdx], smooth:true, baseColor:"#EDE6D2", keepMaterials:false,
//       bpm, items:[{name, plain, meshes:[idx], focus?:[idx], t0, t1}], tEndLine, end, endA, endB, yaw:0.42, trans?:0.32 (camera move time, s — use 1–2 for long-video B-roll)}
const sm=x=>x<0?0:x>1?1:x*x*(3-2*x);
export async function init({THREE,renderer,W,H,args}){
  const cfg=args.cfg; setFrame(W,H,cfg.plain); const ov=await setupOverlay();
  renderer.toneMappingExposure=1.05;
  const scene=new THREE.Scene(); scene.background=background(THREE);
  const camera=new THREE.PerspectiveCamera(28,W/H,0.001,100);
  scene.add(new THREE.HemisphereLight(0xfff6e0,0x2a3a1a,1.6));
  const key=new THREE.DirectionalLight(0xffffff,2.6); key.position.set(1.5,3,3); scene.add(key);
  const rim=new THREE.DirectionalLight(0xF2D14E,1.4); rim.position.set(-3,2,-3); scene.add(rim);
  const gltf=await new GLTFLoader().loadAsync(args.model); const root=gltf.scene; scene.add(root); root.updateMatrixWorld(true);
  const meshes=[]; root.traverse(o=>{if(o.isMesh)meshes.push(o)});
  const hide=new Set(cfg.hide||[]);
  meshes.forEach((m,k)=>{ m.userData.k=k; if(hide.has(k)){m.visible=false;return;}
    let mat;
    if(cfg.keepMaterials){ mat=m.material.clone(); }
    else { mat=new THREE.MeshStandardMaterial({color:new THREE.Color(cfg.baseColor||'#EDE6D2'),roughness:0.55,metalness:0}); }
    m.material=mat; m.userData.base=mat.color.clone(); m.userData.em=(mat.emissive||new THREE.Color(0)).clone();
    if(cfg.smooth!==false && !cfg.keepMaterials){ try{ let g=m.geometry.clone(); ['normal','uv','uv1','tangent'].forEach(a=>g.attributes[a]&&g.deleteAttribute(a)); g=mergeVertices(g,1e-4); g.computeVertexNormals(); m.geometry=g; }catch(e){} }
  });
  const boxes=cfg.items.map(it=>{const b=new THREE.Box3(); (it.focus||it.meshes).forEach(i=>b.expandByObject(meshes[i])); return b;});
  const full=new THREE.Box3(); meshes.forEach(m=>{ if(m.visible) full.expandByObject(m); });
  return {THREE,scene,camera,meshes,cfg,boxes,full,ov};
}
export async function frame(ctx,t){
  const {THREE,camera,meshes,cfg,boxes,full,ov}=ctx; const items=cfg.items;
  let i=0; items.forEach((it,k)=>{ if(t>=it.t0-0.02) i=k; });
  const ended=t>=items[items.length-1].t1;
  const fov=camera.fov, asp=camera.aspect;
  const V=b=>({c:b.getCenter(new THREE.Vector3()), d:Math.max(frameDist(THREE,b,fov,asp,0.85), cfg.minDist||0)});
  const F=V(full);
  let tgt,dist;
  if(!ended){ const cur=V(boxes[i]), prev=i>0?V(boxes[i-1]):cur; const k=sm((t-items[i].t0+0.02)/(cfg.trans||0.32));
    tgt=prev.c.clone().lerp(cur.c,k); dist=Math.min(prev.d+(cur.d-prev.d)*k, F.d); }
  else { const last=V(boxes[items.length-1]); const k=sm((t-items[items.length-1].t1)/0.6); tgt=last.c.clone().lerp(F.c,k); dist=Math.min(last.d,F.d)+(F.d-Math.min(last.d,F.d))*k; }
  const beat=60/cfg.bpm; const ph=((t-items[0].t0)%beat+beat)%beat; const bump=Math.exp(-ph*10)*0.02;
  const yaw=(cfg.yaw??0.42)*Math.sin(t*0.45)-0.1+(ended?(t-items[items.length-1].t1)*(cfg.endSpin??0.35):0), pitch=0.08; const d=dist*(1-bump);
  camera.position.set(tgt.x+Math.sin(yaw)*d, tgt.y+Math.sin(pitch)*d, tgt.z+Math.cos(yaw)*d); camera.lookAt(tgt); applyOffset(camera);
  meshes.forEach(m=>{ if(m.userData.base){ m.material.color.copy(m.userData.base); m.material.emissive&&m.material.emissive.copy(m.userData.em); m.material.emissiveIntensity=1; } });
  // optional x-ray: item.ghost {meshIdx: opacity} fades organs in front of the current one (fades in over 0.3 s)
  meshes.forEach(m=>{ if(m.userData.base){ m.visible=true; m.material.transparent=false; m.material.opacity=1; m.material.depthWrite=true; } });
  if(!ended){ const g=items[i].ghost||{}, gp=i>0?(items[i-1].ghost||{}):{}; const k=sm((t-items[i].t0+0.02)/0.3);
    const keys=new Set([...Object.keys(g),...Object.keys(gp)]);
    keys.forEach(j=>{ const m=meshes[+j]; if(!m||!m.userData.base) return; const a=g[j]??1, b=gp[j]??1; const o=b+(a-b)*k;
      if(o<0.02){ m.visible=false; } else if(o<0.999){ m.material.transparent=true; m.material.opacity=o; m.material.depthWrite=false; } }); }
  items.forEach((it,k)=>{
    if(k<i||ended) it.meshes.forEach(j=>{ const mt=meshes[j].material; mt.color.set(0xBFD39A); mt.emissive&&mt.emissive.set(0x2E4A12); });
    if(k===i&&!ended){ const f=0.75+0.25*Math.exp(-(((t-it.t0)%beat+beat)%beat)*6); it.meshes.forEach(j=>{ const mt=meshes[j].material; mt.color.set(0xF2D14E); if(mt.emissive){mt.emissive.set(0xF2B10E); mt.emissiveIntensity=0.55*f;} }); }
  });
  const n=items.length, done=ended?n:i+1;
  let h=`<div class="topshade"></div><div class="botshade"></div><div class="title"><div>${cfg.title[0]}</div><div>${cfg.title[1]}</div></div>`;
  h+=`<div class="prog"><i style="width:${(done/n*100).toFixed(1)}%"></i></div><div class="count">${done}/${n}</div><div class="credit">${cfg.credit}</div>`;
  if(!ended){ const it=items[i]; const a=i===0?1:Math.min(1,(t-it.t0)/0.16); const sc=0.7+0.3*a; const fz=fitFont(it.name);
    let sd=''; if(it.side){ const ta=it.sideAt??it.t0; if(t>=ta){ const b=Math.min(1,(t-ta)/0.14); const col=it.side.includes('RIGHT')?'#3E7CC9':it.side==='YOUR LEFT'?'#C9483C':'#1F2A14'; sd=`<div class="f" style="background:${col};color:#fff;border-color:#fff;font-size:54px;letter-spacing:3px;transform:scale(${(0.6+0.4*b).toFixed(3)});opacity:${b}">${it.side}</div>`; } else sd=`<div class="f" style="opacity:.9;font-size:54px;letter-spacing:3px">L or R?</div>`; }
    h+=`<div class="lab" style="opacity:${a};transform:scale(${sc.toFixed(3)});transform-origin:50% 0"><div class="n" style="font-size:${fz}px">${it.name}</div>${sd}${it.plain&&(!it.side||t>=(it.sideAt??it.t0))?`<div class="p">${it.plain}</div>`:''}</div>`; }
  if(cfg.sideTags&&!ended){ h+=`<div style="position:absolute;top:452px;left:34px;font-weight:800;font-size:30px;line-height:1;color:#fff;background:#3E7CC9;padding:8px 16px;border-radius:14px;border:3px solid #fff">◀ YOUR RIGHT</div><div style="position:absolute;top:452px;right:34px;font-weight:800;font-size:30px;line-height:1;color:#fff;background:#C9483C;padding:8px 16px;border-radius:14px;border:3px solid #fff">YOUR LEFT ▶</div>`; }
  if(t>=cfg.tEndLine-0.1){ const a=Math.min(1,(t-cfg.tEndLine+0.1)/0.3); const sc=0.6+0.4*(1-Math.pow(1-a,3));
    h+=`<div class="end" style="transform:scale(${sc.toFixed(3)}) rotate(-2deg);opacity:${a}"><div class="a">${cfg.endA}</div><div class="b">${cfg.endB}</div></div>`; }
  ov.innerHTML=ZONE.plain?'':h;
}
