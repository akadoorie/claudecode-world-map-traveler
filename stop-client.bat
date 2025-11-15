@echo off
echo Stopping React Client (port 3000)...

powershell -Command "$port=3000; $proc=(Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1); if($proc){$processId=$proc.OwningProcess; Write-Host \"Killing process $processId\"; Stop-Process -Id $processId -Force; Write-Host \"React client stopped.\"} else {Write-Host \"No process found on port $port\"}"

pause
