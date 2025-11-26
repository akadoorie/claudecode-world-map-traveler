@echo off
echo Stopping World Map Traveler Application...
echo.

echo [1/2] Stopping React Client (port 3000)...
powershell -Command "$port=3000; $proc=(Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1); if($proc){$processId=$proc.OwningProcess; Write-Host \"  - Killing process $processId\"; Stop-Process -Id $processId -Force} else {Write-Host \"  - No process found on port $port\"}"

echo [2/2] Stopping Flask Server (port 5000)...
powershell -Command "$port=5000; $proc=(Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1); if($proc){$processId=$proc.OwningProcess; Write-Host \"  - Killing process $processId\"; Stop-Process -Id $processId -Force} else {Write-Host \"  - No process found on port $port\"}"

echo.
echo Application stopped successfully.
pause
