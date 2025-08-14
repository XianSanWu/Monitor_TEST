Write-Host "正在檢查 4200 端口的使用情況..." -ForegroundColor Green
$processes = netstat -ano | Select-String ":4200"

if ($processes) {
  Write-Host "找到佔用 4200 端口的進程：" -ForegroundColor Yellow
  $processes | ForEach-Object {
    Write-Host $_.ToString() -ForegroundColor Cyan
  }

  Write-Host "`n正在停止這些進程..." -ForegroundColor Yellow
  $processes | ForEach-Object {
    $ProcessId = ($_.ToString() -split '\s+')[-1]
    Write-Host "停止進程 PID: $ProcessId" -ForegroundColor Red
    taskkill /f /pid $ProcessId
  }
  Write-Host "完成！" -ForegroundColor Green
}
else {
  Write-Host "沒有找到佔用 4200 端口的進程。" -ForegroundColor Green
}

Write-Host "`n按任意鍵繼續..." -ForegroundColor Gray
Read-Host
