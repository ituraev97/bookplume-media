import sys,json,urllib.request,urllib.parse,os
q=sys.argv[1]; extra=sys.argv[2] if len(sys.argv)>2 else ""
url="https://api.sketchfab.com/v3/search?"+urllib.parse.urlencode({"type":"models","q":q,"downloadable":"true","count":24,"sort_by":"-likeCount"})+extra
r=json.load(urllib.request.urlopen(urllib.request.Request(url,headers={"Authorization":"Token "+os.environ["SFT"]})))
for m in r["results"]:
    lic=(m.get("license") or {}).get("label")
    print(m["uid"], "|", m["name"][:60], "|", lic, "|", m.get("faceCount"), "|", (m.get("user") or {}).get("username"))
