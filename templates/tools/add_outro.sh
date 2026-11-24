#!/bin/bash
# usage: add_outro.sh final.mp4 final_ig.mp4
# Instagram REEL + TRIAL_REEL only: appends templates/outro/studyduo_outro.mp4 with a smooth 0.3 s cross-fade
# (picture + sound), outro loudness matched to the video. Never for YouTube/Facebook/TikTok/Pinterest/Stories.
set -e
D="$(cd "$(dirname "$0")/.." && pwd)"; IN="$1"; OUT="$2"; OUTRO="$D/outro/studyduo_outro.mp4"; X=0.3
[ -f "$OUTRO" ] || { echo "outro missing"; exit 1; }
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
VD=$(ffprobe -v error -select_streams v:0 -show_entries stream=duration -of default=nw=1:nk=1 "$IN"); [ -n "$VD" ] && [ "$VD" != "N/A" ] && DUR=$VD
OFF=$(python3 -c "print(round($DUR-$X,3))")
# loudness of the main video -> match the outro to it
LUFS=$(ffmpeg -nostats -i "$IN" -af ebur128 -f null - 2>&1 | awk '/Integrated loudness/{f=1} f&&/I:/{print $2; exit}')
[ -z "$LUFS" ] && LUFS=-15
HAS_A=$(ffprobe -v error -select_streams a -show_entries stream=index -of default=nw=1:nk=1 "$IN" | head -1)
if [ -z "$HAS_A" ]; then A0="anullsrc=r=48000:cl=stereo,atrim=0:$DUR[a0]"; else A0="[0:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:$DUR,asetpts=PTS-STARTPTS[a0]"; fi
ffmpeg -y -loglevel error -i "$IN" -i "$OUTRO" -filter_complex \
"[0:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:white,setsar=1,fps=30,format=yuv420p,settb=1/30000[v0];\
[1:v]scale=1080:1920,setsar=1,fps=30,format=yuv420p,settb=1/30000[v1];\
[v0][v1]xfade=transition=fade:duration=$X:offset=$OFF[v];\
$A0;[1:a]aresample=48000,aformat=channel_layouts=stereo,loudnorm=I=$LUFS:TP=-1.5:LRA=7,aresample=48000[a1];\
[a0][a1]acrossfade=d=$X:c1=tri:c2=tri[a]" \
-map "[v]" -map "[a]" -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$OUT"
echo "in=$DUR out=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT") (expected in + outro - $X) main_lufs=$LUFS"
