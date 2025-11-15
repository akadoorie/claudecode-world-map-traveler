@echo off
echo Stopping Flask Server (port 5000)...

REM Find and kill Python processes using port 5000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do (
    echo Killing process %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo Flask server stopped.
pause
