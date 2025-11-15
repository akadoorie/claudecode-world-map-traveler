@echo off
echo Stopping Flask Server (port 5000)...

powershell -Command "$port=5000; $proc=(Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1); if($proc){$processId=$proc.OwningProcess; Write-Host \"Killing process $processId\"; Stop-Process -Id $processId -Force; Write-Host \"Flask server stopped.\"} else {Write-Host \"No process found on port $port\"}"

pause
