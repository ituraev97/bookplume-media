import json,sys,subprocess
d=json.load(open('quiz.json')); d['thumb']=json.loads(sys.argv[1])
open('vid/src/quizdata.ts','w').write("export const QZ = "+json.dumps(d,indent=1)+" as const;\n")
subprocess.run(['node','thumb.mjs',sys.argv[2]],cwd='vid',check=True)
