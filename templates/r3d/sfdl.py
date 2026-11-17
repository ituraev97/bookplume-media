import sys,json,urllib.request,os,struct
uid,name=sys.argv[1],sys.argv[2]
H={"Authorization":"Token "+os.environ["SFT"]}
info=json.load(urllib.request.urlopen(urllib.request.Request(f"https://api.sketchfab.com/v3/models/{uid}",headers=H)))
d=json.load(urllib.request.urlopen(urllib.request.Request(f"https://api.sketchfab.com/v3/models/{uid}/download",headers=H)))
k="glb" if "glb" in d else "gltf"
sz=d[k].get("size",0)
print(name,k,round(sz/1e6,1),"MB",info["license"]["label"],info["user"]["displayName"],info["viewerUrl"])
if sz>120e6: print("TOO BIG"); sys.exit()
os.makedirs(f"models/{name}",exist_ok=True)
fn=f"models/{name}/model.{'glb' if k=='glb' else 'zip'}"
urllib.request.urlretrieve(d[k]["url"],fn)
json.dump({"uid":uid,"title":info["name"],"author":info["user"]["displayName"],"username":info["user"]["username"],"license":info["license"]["label"],"url":info["viewerUrl"]},open(f"models/{name}/CREDITS.json","w"),indent=1)
