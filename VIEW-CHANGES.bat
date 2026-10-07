@echo off
title View Website Changes
echo ==========================================
echo          WEBSITE CHANGE HISTORY
echo ==========================================
echo.
echo Recent commits:
git log --oneline --decorate --graph --all -20
echo.
echo ==========================================
echo CURRENT UNCOMMITTED CHANGES
echo ==========================================
git status
echo.
echo ==========================================
echo FILE-LEVEL DIFFERENCE FROM LAST COMMIT
echo ==========================================
git diff --stat
echo.
pause
