@echo off
title Save Website Changes
echo ==========================================
echo       SAVE WEBSITE CHANGES TO GIT
echo ==========================================
echo.
git status
echo.
set /p MSG=Enter a short description of your changes: 
if "%MSG%"=="" set MSG=Updated website
echo.
git add .
git commit -m "%MSG%"
echo.
echo ------------------------------------------
echo Changes saved to Git history.
echo ------------------------------------------
git log -1 --oneline
echo.
pause
