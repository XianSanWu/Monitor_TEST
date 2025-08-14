@echo off
echo 正在檢查 4200 端口的使用情況...
netstat -ano | findstr :4200
if %errorlevel% equ 0 (
    echo.
    echo 找到佔用 4200 端口的進程，正在停止...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4200') do (
        echo 停止進程 PID: %%a
        taskkill /f /pid %%a
    )
    echo 完成！
) else (
    echo 沒有找到佔用 4200 端口的進程。
)
echo.
pause
