import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
export async function init({THREE,renderer,W,H,args}){
  const scene=new THREE.Scene(); scene.background=new THREE.Color(0x202820);
  const camera=new THREE.PerspectiveCamera(30,W/H,0.01,100);
  scene.add(new THREE.HemisphereLight(0xffffff,0x444444,2.2)); const dl=new THREE.DirectionalLight(0xffffff,2.5); dl.position.set(2,3,4); scene.add(dl);
  const g=await new GLTFLoader().loadAsync(args.model); scene.add(g.scene);
  const meshes=[]; g.scene.traverse(o=>{if(o.isMesh)meshes.push(o)});
  meshes.forEach((m,k)=>{ if(k!==args.i){m.material=new THREE.MeshBasicMaterial({color:0x557755,transparent:true,opacity:0.12,depthWrite:false})} else {m.material=new THREE.MeshStandardMaterial({color:0xF2D14E})} });
  const b=new THREE.Box3().setFromObject(meshes[args.i]); const c=b.getCenter(new THREE.Vector3()); const s=b.getSize(new THREE.Vector3()).length();
  camera.position.set(c.x+(args.side||0)*s*2,c.y,c.z+s*2.5); camera.lookAt(c);
  return {scene,camera};
}
export async function frame(){}
