#!/usr/bin/env python3
"""Free AI pictures (FLUX.2 klein on the owner's office PC) via Drive folder "IMG RELAY". Standard library only.
Pictures = thumbnail PLATES without text (thumbkit adds words/stamps/documents). See thumbkit STYLE.md.

  python3 img_client.py request ID spec.json --creds /tmp/drive_creds.json
      spec.json = [{"name": "plate_A.png", "prompt": "...", "w": 1280, "h": 720, "ref": "local/real_frame.jpg" (optional EDIT
      mode: keeps the real person/object and re-lights/extends it), "seed": 1}]  (max 6 images). Local ref files are uploaded.
  python3 img_client.py status ID --creds ...   -> {"state": "missing|pending|ready|failed", ...}
  python3 img_client.py wait ID OUTDIR --creds ... [--timeout 2400]  -> polls, then unzips the PNGs into OUTDIR
  python3 img_client.py fetch ID OUTDIR --creds ...
A picture takes ~3–8 min on the PC (longer while the PC voices or renders). Request early in the run; if nothing arrives
in time, build the thumbnail with the previous generator and say so in the report.
"""
import argparse, io, json, os, sys, time, urllib.parse, urllib.request, zipfile

API = "https://www.googleapis.com"
FOLDER = "IMG RELAY"

def token(path):
    c = json.load(open(path))
    body = urllib.parse.urlencode({"client_id": c["client_id"], "client_secret": c["client_secret"],
                                   "refresh_token": c["refresh_token"], "grant_type": "refresh_token"}).encode()
    with urllib.request.urlopen("https://www.googleapis.com/oauth2/v4/token", body, timeout=60) as r:
        return json.load(r)["access_token"]

def req(method, url, tok, body=None, headers=None):
    h = {"Authorization": "Bearer " + tok}; h.update(headers or {})
    return urllib.request.urlopen(urllib.request.Request(url, data=body, method=method, headers=h), timeout=900)

def folder(tok):
    q = urllib.parse.quote(f"name = '{FOLDER}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")
    with req("GET", f"{API}/drive/v3/files?q={q}&fields=files(id)", tok) as r:
        f = json.load(r)["files"]
    if f:
        return f[0]["id"]
    b = json.dumps({"name": FOLDER, "mimeType": "application/vnd.google-apps.folder"}).encode()
    with req("POST", f"{API}/drive/v3/files?fields=id", tok, b, {"Content-Type": "application/json"}) as r:
        return json.load(r)["id"]

def find(tok, parent, name):
    q = urllib.parse.quote(f"'{parent}' in parents and name = '{name}' and trashed = false")
    with req("GET", f"{API}/drive/v3/files?q={q}&fields=files(id)", tok) as r:
        f = json.load(r)["files"]
    return f[0]["id"] if f else None

def get(tok, fid):
    with req("GET", f"{API}/drive/v3/files/{fid}?alt=media", tok) as r:
        return r.read()

def upload(tok, parent, name, data, mime="application/json"):
    meta = json.dumps({"name": name, "parents": [parent]}).encode()
    with req("POST", f"{API}/upload/drive/v3/files?uploadType=resumable", tok, meta,
             {"Content-Type": "application/json; charset=UTF-8", "X-Upload-Content-Type": mime}) as r:
        loc = r.headers["Location"]
    with req("PUT", loc, tok, data, {"Content-Type": mime}) as r:
        return json.load(r)["id"]

def status(tok, parent, rid):
    d = find(tok, parent, f"imgdone_{rid}.json")
    if d:
        res = json.loads(get(tok, d)); res["state"] = "ready" if res.get("ok") else "failed"; return res
    return {"state": "pending" if find(tok, parent, f"img_{rid}.json") else "missing"}

def fetch(tok, parent, rid, out):
    z = zipfile.ZipFile(io.BytesIO(get(tok, find(tok, parent, f"imgout_{rid}.zip"))))
    os.makedirs(out, exist_ok=True); got = []
    for n in z.namelist():
        b = os.path.basename(n)
        if b and b == n:
            open(os.path.join(out, b), "wb").write(z.read(n)); got.append(b)
    return got

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", choices=["request", "status", "wait", "fetch"]); ap.add_argument("id"); ap.add_argument("arg", nargs="?")
    ap.add_argument("--creds", default="/tmp/drive_creds.json"); ap.add_argument("--timeout", type=int, default=2400)
    a = ap.parse_args()
    if not all(c.isalnum() or c in "-_" for c in a.id):
        sys.exit("ID: letters, digits, - and _ only")
    tok = token(a.creds); parent = folder(tok)
    if a.cmd == "request":
        items = json.load(open(a.arg)); base = os.path.dirname(os.path.abspath(a.arg))
        if not items or len(items) > 6:
            sys.exit("1-6 images per request")
        for i, it in enumerate(items):
            if not it.get("prompt") or not it.get("name"):
                sys.exit("every image needs name + prompt")
            if it.get("ref"):
                p = it["ref"] if os.path.isabs(it["ref"]) else os.path.join(base, it["ref"])
                rn = f"ref_{a.id}_{i}{os.path.splitext(p)[1] or '.png'}"
                upload(tok, parent, rn, open(p, "rb").read(), "image/png" if p.endswith(".png") else "image/jpeg"); it["ref"] = rn
        upload(tok, parent, f"img_{a.id}.json", json.dumps({"id": a.id, "images": items}).encode())
        print(json.dumps({"requested": a.id, "images": len(items)}))
    elif a.cmd == "status":
        print(json.dumps(status(tok, parent, a.id)))
    elif a.cmd == "fetch":
        print(json.dumps({"files": fetch(tok, parent, a.id, a.arg)}))
    else:
        t0 = time.time()
        while time.time() - t0 < a.timeout:
            s = status(tok, parent, a.id)
            if s["state"] == "ready":
                print(json.dumps({"files": fetch(token(a.creds), parent, a.id, a.arg), "minutes": s.get("minutes")})); return
            if s["state"] in ("failed", "missing"):
                sys.exit(json.dumps(s))
            time.sleep(60); tok = token(a.creds)
        sys.exit(json.dumps({"state": "timeout"}))

if __name__ == "__main__":
    main()
