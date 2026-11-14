// node render_story.js '<json cfg>' out.jpg   (run from this folder; the plate png must be in this folder)
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>{console.error('PAGE ERROR',e.message);process.exitCode=1});
await p.goto('file://'+__dirname+'/quiz_story.html?cfg='+encodeURIComponent(process.argv[2]||'{}'));await p.waitForTimeout(1200);
await p.screenshot({path:process.argv[3]||'story.jpg',type:'jpeg',quality:95});await b.close();})();
