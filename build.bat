@echo off
chcp 65001 >nul
echo ========================================
echo     GitHub Pages 一键部署脚本
echo ========================================
echo.

cd /d "C:\Users\Administrator\Desktop\github\MCXiaoyang.github.io"

echo [1/4] 检查 Git 状态...
git status

echo.
echo [2/4] 添加所有更改...
git add .

echo.
echo [3/4] 提交更改...
set /p msg="请输入提交信息（直接回车使用 '更新网站'）: "
if "%msg%"=="" set msg=更新网站
git commit -m "%msg%"

echo.
echo [4/4] 推送到 GitHub...
git push

echo.
echo ========================================
echo     部署完成！等待1-2分钟刷新网站
echo     https://MCXiaoyang.github.io
echo ========================================
pause