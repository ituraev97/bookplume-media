const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const jobs=JSON.parse(fs.readFileSync('jobs.json'));const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});
p.on('pageerror',e=>console.error('ERR',e.message));
let n=0;for(const j of jobs){n++;await p.goto('file://'+__dirname+'/thumb.html?n='+n+'#'+encodeURIComponent(JSON.stringify(j.cfg)));await p.waitForTimeout(500);await p.screenshot({path:j.out,type:'jpeg',quality:92});}
await b.close();})();
