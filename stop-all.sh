#!/bin/bash

echo "Stopping World Map Traveler Application..."
echo ""

echo "[1/2] Stopping React Client (port 3000)..."
pids_3000=$(netstat -ano | grep :3000 | grep LISTENING | awk '{print $5}' | sort -u)

if [ -z "$pids_3000" ]; then
    echo "  - No process found on port 3000"
else
    for pid in $pids_3000; do
        echo "  - Killing process $pid"
        taskkill //F //PID $pid 2>/dev/null
    done
fi

echo "[2/2] Stopping Flask Server (port 5000)..."
pids_5000=$(netstat -ano | grep :5000 | grep LISTENING | awk '{print $5}' | sort -u)

if [ -z "$pids_5000" ]; then
    echo "  - No process found on port 5000"
else
    for pid in $pids_5000; do
        echo "  - Killing process $pid"
        taskkill //F //PID $pid 2>/dev/null
    done
fi

echo ""
echo "Application stopped successfully."
