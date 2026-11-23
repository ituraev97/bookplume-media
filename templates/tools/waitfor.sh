#!/bin/bash
# waitfor.sh LOG REGEX [MAX_SECONDS=540] [PID]
# Token saver: ONE call waits up to MAX_SECONDS (default 9 min, under the 10-min tool limit) for a long background job
# instead of many cat/tail polls. Returns as soon as REGEX appears in LOG, or PID (if given) exits, or time is up.
# Prints only: the status word (DONE | EXITED | WAITING) and the last 3 lines of LOG. Call it again while it says WAITING.
#   nohup ./make.sh ... > build.log 2>&1 &  echo $! > build.pid
#   bash tools/waitfor.sh build.log "^long.mp4 |EXIT|Error" 540 $(cat build.pid)
LOG=$1; RE=$2; MAX=${3:-540}; PID=$4; t=0
while [ $t -lt $MAX ]; do
  if [ -f "$LOG" ] && grep -Eq "$RE" "$LOG"; then echo DONE; tail -n 3 "$LOG"; exit 0; fi
  if [ -n "$PID" ] && ! kill -0 "$PID" 2>/dev/null; then echo EXITED; tail -n 3 "$LOG" 2>/dev/null; exit 0; fi
  sleep 15; t=$((t+15))
done
echo WAITING; tail -n 3 "$LOG" 2>/dev/null | cut -c1-200
