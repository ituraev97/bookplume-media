import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
export async function init({THREE,renderer,W,H,args}){
  const scene=new THREE.Scene(); scene.background=new THREE.Color(0x202820);
  const camera=new THREE.PerspectiveCamera(30,W/H,0.01,1000);
  scene.add(new THREE.HemisphereLight(0xffffff,0x444444,2.2));
  const dl=new THREE.DirectionalLight(0xffffff,2.5); dl.position.set(2,3,4); scene.add(dl);
  const g=await new GLTFLoader().loadAsync(args.model);
  const root=g.scene; scene.add(root);
  const box=new THREE.Box3().setFromObject(root); const c=box.getCenter(new THREE.Vector3()); const s=box.getSize(new THREE.Vector3());
  root.position.sub(c);
  const meshes=[]; root.traverse(o=>{if(o.isMesh){meshes.push(o); o.material=o.material.clone(); o.userData.m0=o.material;}});
  const R=Math.max(s.x,s.y,s.z);
  const az=args.az||0;
  camera.position.set(Math.sin(az)*R*2.2,0,Math.cos(az)*R*2.2); camera.lookAt(0,0,0);
  const info={size:s.toArray(),meshes:meshes.map(m=>{const b=new THREE.Box3().setFromObject(m);return {n:m.name,mat:m.material.name,c:b.getCenter(new THREE.Vector3()).toArray().map(v=>+v.toFixed(3)),s:b.getSize(new THREE.Vector3()).toArray().map(v=>+v.toFixed(3))}})};
  return {scene,camera,meshes,info,THREE};
}
export async function frame(ctx,t){
  const i=Math.round(t);
  ctx.meshes.forEach((m,k)=>{
    if(i<0||k===i){m.material=m.userData.m0; m.visible=true;}
    else {m.material=new ctx.THREE.MeshBasicMaterial({color:0x557755,transparent:true,opacity:0.08,depthWrite:false});}
  });
}
