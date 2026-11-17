import sys,json,struct
f=open(sys.argv[1],'rb'); f.read(12); l,_=struct.unpack('<II',f.read(8)); j=json.loads(f.read(l))
names=[n.get('name','') for n in j.get('nodes',[]) if 'mesh' in n]
mats=[m.get('name','') for m in j.get('materials',[])]
print(len(names),"mesh nodes;",len(mats),"materials")
print("NODES:",names[:120])
print("MATS:",mats[:60])
