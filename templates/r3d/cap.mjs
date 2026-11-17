// node cap.mjs <module> <outdir> <fps> <t0> <t1> [w h] [args-json] [--times t1,t2,...]
import { chromium } from 'playwright-core';
import fs from 'fs';
const [mod,out,fps,t0,t1,w='1080',h='1920',args='{}',timesArg]=process.argv.slice(2);
fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
 args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--no-sandbox']});
const pg=await b.newPage({viewport:{width:+w,height:+h}});
pg.on('console',m=>console.log('PAGE',m.text())); pg.on('pageerror',e=>console.log('ERR',e.message));
await pg.goto(`http://127.0.0.1:8765/r3d/page.html?mod=${encodeURIComponent(mod)}&w=${w}&h=${h}${args.startsWith('@')?'&argsfile='+encodeURIComponent(args.slice(1)):'&args='+encodeURIComponent(args)}`);
await pg.waitForFunction('window.READY===true',null,{timeout:600000});
console.log('INFO',JSON.stringify(await pg.evaluate('window.info')));
let times=[];
if(timesArg){times=timesArg.split(',').map(Number)}else{for(let i=Math.round(+t0*fps);i<Math.round(+t1*fps);i++)times.push(i/fps)}
let k=0;const T=Date.now();
for(const t of times){
  await pg.evaluate(`renderAt(${t})`);
  const fn=`${out}/f${String(timesArg?k:Math.round(t*fps)).padStart(5,'0')}.png`;
  if(process.env.SHOT){ await pg.screenshot({path:fn,type:'png'}); }
  else { const d=await pg.evaluate(()=>document.querySelector('canvas').toDataURL('image/png')); fs.writeFileSync(fn,Buffer.from(d.split(',')[1],'base64')); }
  k++; if(k%30==0)console.log(k,'frames',((Date.now()-T)/k).toFixed(0),'ms/frame');
}
await b.close();
