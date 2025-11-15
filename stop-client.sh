#!/bin/bash

echo "Stopping React Client (port 3000)..."

# Find and kill processes using port 3000
pids=$(netstat -ano | grep :3000 | grep LISTENING | awk '{print $5}' | sort -u)

if [ -z "$pids" ]; then
    echo "No process found on port 3000"
else
    for pid in $pids; do
        echo "Killing process $pid"
        taskkill //F //PID $pid 2>/dev/null
    done
    echo "React client stopped."
fi
