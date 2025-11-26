#!/bin/bash

echo "Stopping Flask Server (port 5000)..."

# Find and kill processes using port 5000
pids=$(netstat -ano | grep :5000 | grep LISTENING | awk '{print $5}' | sort -u)

if [ -z "$pids" ]; then
    echo "No process found on port 5000"
else
    for pid in $pids; do
        echo "Killing process $pid"
        taskkill //F //PID $pid 2>/dev/null
    done
    echo "Flask server stopped."
fi
