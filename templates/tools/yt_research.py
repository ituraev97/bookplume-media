#!/usr/bin/env python3
"""YouTube niche research via YouTube Data API v3 (free key, ~310 quota units per run).

Usage:
  YT_API_KEY=... python3 yt_research.py --out research/2026-11-07-youtube.md \
      --category 27 --days 30 --q "coast guard rescue" --q "helicopter hoist rescue" --q "rescue at sea"

Steps (owner rule 2026-11-06):
  1. Trending in the US (videos.list chart=mostPopular, optional category) — background only.
  2. search.list for each niche query: order=viewCount, published in the last N days, US, English.
  3. videos.list + channels.list: views, likes, comments, length, channel subscribers.
     Outlier = views >= 3x channel subscribers and >= 10,000 views; engagement = (likes+comments)/views.
  4. Transcripts of the top 3 outliers, if youtube.com is reachable (youtube-transcript-api);
     otherwise the report says so and the hook must be analysed from title/description/chapters.
Writes a Markdown report (--out) and the raw table as JSON next to it.
"""
import argparse, json, os, re, sys, urllib.parse, urllib.request
from datetime import datetime, timedelta, timezone

API = "https://www.googleapis.com/youtube/v3/"


def get(endpoint, **params):
    params["key"] = os.environ["YT_API_KEY"]
    url = API + endpoint + "?" + urllib.parse.urlencode(params)
    try:
        with urllib.request.urlopen(url, timeout=30) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")[:300]
        print(f"API error {e.code} on {endpoint}: {body}", file=sys.stderr)
        return {"items": [], "error": e.code}


def dur_s(iso):
    m = re.match(r"P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", iso or "")
    if not m:
        return 0
    d, h, mi, s = (int(x or 0) for x in m.groups())
    return d * 86400 + h * 3600 + mi * 60 + s


def fmt_len(s):
    return f"{s // 60}:{s % 60:02d}"


def chunks(seq, n):
    for i in range(0, len(seq), n):
        yield seq[i:i + n]


def details(ids):
    vids = {}
    for part in chunks(list(ids), 50):
        for it in get("videos", part="snippet,statistics,contentDetails", id=",".join(part)).get("items", []):
            st, sn = it.get("statistics", {}), it["snippet"]
            vids[it["id"]] = {
                "id": it["id"], "title": sn["title"], "channel": sn["channelTitle"],
                "channelId": sn["channelId"], "published": sn["publishedAt"][:10],
                "views": int(st.get("viewCount", 0)), "likes": int(st.get("likeCount", 0)),
                "comments": int(st.get("commentCount", 0)),
                "seconds": dur_s(it["contentDetails"].get("duration")),
                "description": sn.get("description", "")[:600],
                "lang": (sn.get("defaultAudioLanguage") or sn.get("defaultLanguage") or "").lower(),
                "cat": sn.get("categoryId", ""),
                "thumb": (sn.get("thumbnails", {}).get("maxres") or sn.get("thumbnails", {}).get("high") or {}).get("url", ""),
            }
    chans = {}
    for part in chunks(sorted({v["channelId"] for v in vids.values()}), 50):
        for it in get("channels", part="statistics", id=",".join(part)).get("items", []):
            st = it.get("statistics", {})
            chans[it["id"]] = None if st.get("hiddenSubscriberCount") else int(st.get("subscriberCount", 0))
    for v in vids.values():
        subs = chans.get(v["channelId"])
        v["subs"] = subs
        v["ratio"] = round(v["views"] / subs, 1) if subs else None
        v["engagement"] = round((v["likes"] + v["comments"]) / v["views"] * 100, 2) if v["views"] else 0
        v["short"] = v["seconds"] <= 180
        v["outlier"] = bool(subs and v["views"] >= 3 * subs and v["views"] >= 10000)
    return vids


def transcript(video_id):
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
    except ImportError:
        os.system(f"{sys.executable} -m pip install -q --break-system-packages youtube-transcript-api >/dev/null 2>&1")
        try:
            from youtube_transcript_api import YouTubeTranscriptApi
        except ImportError:
            return None, "library not installable"
    try:
        api = YouTubeTranscriptApi()
        parts = api.fetch(video_id, languages=["en", "en-US"])
        return [(p.start, p.text) for p in parts], None
    except Exception as e:  # youtube.com blocked from the cloud, no captions, etc.
        return None, type(e).__name__ + ": " + str(e)[:120]


def table(rows):
    out = ["| # | Title | Channel | Views | Subs | Views/Subs | Eng % | Length | Published |",
           "|---|---|---|---|---|---|---|---|---|"]
    for i, v in enumerate(rows, 1):
        subs = f"{v['subs']:,}" if v["subs"] is not None else "hidden"
        ratio = f"{v['ratio']}x" if v["ratio"] is not None else "n/a"
        t = v["title"].replace("|", "/")[:80]
        out.append(f"| {i} | [{t}](https://youtu.be/{v['id']}) | {v['channel']} | {v['views']:,} | {subs} | "
                   f"{ratio} | {v['engagement']} | {fmt_len(v['seconds'])} | {v['published']} |")
    return "\n".join(out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--q", action="append", required=True, help="niche query (2-3)")
    ap.add_argument("--category", default="", help="trending category id, e.g. 27 Education, 25 News, 24 Entertainment, 28 Science&Tech")
    ap.add_argument("--days", type=int, default=30)
    ap.add_argument("--transcripts", type=int, default=3)
    ap.add_argument("--region", default="US", help="ISO country for trending/search, e.g. US, UZ")
    ap.add_argument("--lang", default="en", help="relevance language, e.g. en, uz, ru")
    ap.add_argument("--thumbs", type=int, default=5, help="download thumbnails of the top N outliers (needs i.ytimg.com)")
    ap.add_argument("--out", required=True)
    a = ap.parse_args()

    # 1. trending (background)
    tp = dict(part="id", chart="mostPopular", regionCode=a.region, maxResults=25)
    if a.category:
        tp["videoCategoryId"] = a.category
    trend = get("videos", **tp)
    if not trend.get("items") and a.category:
        tp.pop("videoCategoryId")
        trend = get("videos", **tp)
    trend_ids = [i["id"] for i in trend.get("items", [])]

    # 2. niche search
    after = (datetime.now(timezone.utc) - timedelta(days=a.days)).strftime("%Y-%m-%dT%H:%M:%SZ")
    hits = {}
    for q in a.q:
        r = get("search", part="id", type="video", order="viewCount", publishedAfter=after,
                regionCode=a.region, relevanceLanguage=a.lang, maxResults=25, q=q)
        for it in r.get("items", []):
            hits.setdefault(it["id"]["videoId"], set()).add(q)

    # 3. details + channel stats
    vids = details(set(hits) | set(trend_ids))
    def keep(v):
        if v["cat"] in ("10", "20"):  # Music, Gaming
            return False
        if v["lang"] and not v["lang"].startswith(a.lang):
            return False
        if a.lang == "en":
            letters = [c for c in v["title"] if c.isalpha()]
            if letters and sum(not c.isascii() for c in letters) / len(letters) > 0.3:
                return False
        return True
    allniche = [vids[i] for i in hits if i in vids]
    niche = [v for v in allniche if keep(v)]
    dropped = len(allniche) - len(niche)
    for v in niche:
        v["queries"] = sorted(hits[v["id"]])
    trending = [vids[i] for i in trend_ids if i in vids]
    longs = sorted([v for v in niche if not v["short"]], key=lambda v: v["views"], reverse=True)
    shorts = sorted([v for v in niche if v["short"]], key=lambda v: v["views"], reverse=True)
    outliers = sorted([v for v in niche if v["outlier"] and v["engagement"] >= 3],
                      key=lambda v: (v["ratio"] or 0), reverse=True)
    if len(outliers) < 3:  # relax the engagement floor if the niche is thin
        outliers = sorted([v for v in niche if v["outlier"]], key=lambda v: (v["ratio"] or 0), reverse=True)

    # 4. transcripts of the best outliers
    tx = []
    for v in outliers[: a.transcripts]:
        lines, err = transcript(v["id"])
        if lines:
            first30 = " ".join(t for s, t in lines if s < 30)
            tx.append(f"### {v['title']}\nhttps://youtu.be/{v['id']} · {v['views']:,} views · {fmt_len(v['seconds'])}\n\n"
                      f"**First 30 s:** {first30}\n\n**Full transcript (first 1500 chars):** "
                      + " ".join(t for _, t in lines)[:1500])
        else:
            tx.append(f"### {v['title']}\nhttps://youtu.be/{v['id']} — transcript unavailable ({err}). "
                      f"Analyse the hook from title, description and chapters:\n\n> {v['description'][:500]}")

    # 5. thumbnails of the best outliers (to study the packaging); i.ytimg.com may be blocked
    tdir = os.path.splitext(a.out)[0] + "-thumbs"
    thumbs_md = []
    picks, seen = [], set()
    for v in outliers[: a.thumbs] + longs[:3]:  # outliers first, then the most viewed long videos
        if v["id"] not in seen:
            seen.add(v["id"]); picks.append(v)
    for v in picks:
        if not v.get("thumb"):
            continue
        path = os.path.join(tdir, v["id"] + ".jpg")
        ok = False
        try:
            os.makedirs(tdir, exist_ok=True)
            with urllib.request.urlopen(v["thumb"], timeout=20) as r, open(path, "wb") as f:
                f.write(r.read())
            ok = True
        except Exception:
            pass
        thumbs_md.append(f"- {v['title'][:70]} — {v['views']:,} views — " + (f"saved {path} (LOOK at it)" if ok else f"{v['thumb']} (not downloadable from here)"))

    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    md = [f"Source: YouTube Data API ({today}; queries: {', '.join(a.q)}; last {a.days} days; {a.region}/{a.lang})", "",
          f"## 1. Trending in {a.region}" + (f" (category {a.category})" if a.category else ""), table(trending[:10]), "",
          f"Filtered out {dropped} videos in other languages or Music/Gaming categories.", "",
          "## 2. Niche — long videos, most viewed", table(longs[:10]), "",
          "## 2b. Niche — Shorts (≤ 3 min), most viewed", table(shorts[:10]), "",
          "## 3. Outliers (views ≥ 3× subscribers, ≥ 10k views; engagement ≥ 3% preferred)", table(outliers[:10]), "",
          "## 4. Top outliers — hook and transcript", *tx, "",
          "## 5. Thumbnails (top outliers + 3 most viewed long videos)", *(thumbs_md or ["- none"]), ""]
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    with open(a.out, "w") as f:
        f.write("\n".join(md))
    with open(os.path.splitext(a.out)[0] + ".json", "w") as f:
        json.dump({"trending": trending, "niche": niche, "outliers": outliers}, f, indent=1)
    print(f"wrote {a.out}: {len(niche)} niche videos, {len(outliers)} outliers, {len(tx)} transcript blocks")


if __name__ == "__main__":
    main()
