import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
export async function init({THREE,renderer,W,H,args}){
  renderer.setClearColor(0x000000,0); renderer.toneMappingExposure=1.15;
  const scene=new THREE.Scene(); scene.background=null;
  const camera=new THREE.PerspectiveCamera(26,W/H,0.001,100);
  scene.add(new THREE.HemisphereLight(0xfff6e0,0x553322,2.0));
  const key=new THREE.DirectionalLight(0xffffff,3.0); key.position.set(1.5,3,3); scene.add(key);
  const g=await new GLTFLoader().loadAsync(args.model); const root=g.scene; scene.add(root); root.updateMatrixWorld(true);
  const meshes=[]; root.traverse(o=>{if(o.isMesh)meshes.push(o)});
  meshes.forEach((m,k)=>{ if((args.hide||[]).includes(k)) m.visible=false; });
  const b=new THREE.Box3(); meshes.forEach(m=>{if(m.visible)b.expandByObject(m)});
  const c=b.getCenter(new THREE.Vector3()); const s=b.getSize(new THREE.Vector3());
  const d=(s.y/2)/Math.tan(THREE.MathUtils.degToRad(13))*1.08;
  const yaw=args.yaw||0.25; camera.position.set(c.x+Math.sin(yaw)*d,c.y+0.02,c.z+Math.cos(yaw)*d); camera.lookAt(c);
  return {scene,camera};
}
export async function frame(){}
