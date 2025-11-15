@echo off
echo Stopping React Client (port 3000)...

REM Find and kill Node.js processes using port 3000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo Killing process %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo React client stopped.
pause
