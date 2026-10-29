#!/usr/bin/env bash
# Max-quality final encode that still fits the 94 MB hosting limit (GitHub raw file limit is 100 MB).
# usage: encode_final.sh video_master.mp4 mix_final.wav out.mp4
# 1) x264 CRF 17, preset slower, tune animation, AAC 256k.
# 2) If that is > 94 MB: two-pass x264 at the exact bitrate that lands at ~93 MB.
set -euo pipefail
IN="$1"; AUD="$2"; OUT="$3"
LIMIT=$((94*1024*1024))
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
COMMON="-c:v libx264 -preset slower -tune animation -pix_fmt yuv420p -profile:v high -level 4.2 -g 60 -bf 3"
AUDIO="-c:a aac -b:a 256k -ar 48000"
ffmpeg -y -v error -i "$IN" -i "$AUD" -map 0:v -map 1:a $COMMON -crf 17 $AUDIO -shortest -movflags +faststart "$OUT"
SIZE=$(stat -c %s "$OUT")
if [ "$SIZE" -gt "$LIMIT" ]; then
  # bits available for video: 93 MB total minus audio (256 kb/s) and ~1% container overhead
  VBR=$(python3 -c "d=$DUR; print(int((93*1024*1024*8*0.99/d - 256000)/1000))")
  echo "CRF 17 = $((SIZE/1048576)) MB > 94 MB -> two-pass at ${VBR}k"
  LOG=$(mktemp -d)/p
  ffmpeg -y -v error -i "$IN" -map 0:v $COMMON -b:v ${VBR}k -maxrate $((VBR*3))k -bufsize $((VBR*4))k -an -pass 1 -passlogfile "$LOG" -f mp4 /dev/null
  ffmpeg -y -v error -i "$IN" -i "$AUD" -map 0:v -map 1:a $COMMON -b:v ${VBR}k -maxrate $((VBR*3))k -bufsize $((VBR*4))k $AUDIO -pass 2 -passlogfile "$LOG" -shortest -movflags +faststart "$OUT"
fi
echo "final: $OUT $(( $(stat -c %s "$OUT") / 1048576 )) MB"
