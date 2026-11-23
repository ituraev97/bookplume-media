const {chromium}=require('/home/claude/work/r3d/node_modules/playwright-core');
(async()=>{const jobs=JSON.parse(process.argv[2]);const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell'});
for(const j of jobs){const p=await b.newPage({viewport:{width:j.W,height:j.H}});await p.goto('file://'+__dirname+'/cover.html#'+encodeURIComponent(JSON.stringify(j)));await p.waitForTimeout(700);
await p.screenshot({path:j.out,type:'jpeg',quality:95});await p.close();}await b.close();})();
