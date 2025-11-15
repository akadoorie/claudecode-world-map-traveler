@echo off
echo Stopping World Map Traveler Application...
echo.

echo [1/2] Stopping React Client (port 3000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo   - Killing process %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo [2/2] Stopping Flask Server (port 5000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do (
    echo   - Killing process %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo Application stopped successfully.
pause
