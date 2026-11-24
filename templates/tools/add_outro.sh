#!/bin/bash
# usage: add_outro.sh final.mp4 final_ig.mp4  — appends templates/outro/studyduo_outro.mp4 (Instagram only)
set -e
D="$(cd "$(dirname "$0")/.." && pwd)"; IN="$1"; OUT="$2"; OUTRO="$D/outro/studyduo_outro.mp4"
[ -f "$OUTRO" ] || { echo "outro missing"; exit 1; }
ffmpeg -y -loglevel error -i "$IN" -i "$OUTRO" -filter_complex \
"[0:v]scale=1080:1920,setsar=1,fps=30,format=yuv420p[v0];[1:v]scale=1080:1920,setsar=1,fps=30,format=yuv420p[v1];[0:a]aresample=44100,aformat=channel_layouts=stereo[a0];[1:a]aresample=44100,aformat=channel_layouts=stereo[a1];[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]" \
-map "[v]" -map "[a]" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart "$OUT"
echo "in=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN") out=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT")"
