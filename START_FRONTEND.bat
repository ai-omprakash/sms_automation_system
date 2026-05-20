@echo off
title SMS Pro - Frontend
color 0B
echo ============================================
echo   SMS Pro - Starting Frontend
echo ============================================
echo.

cd /d "%~dp0frontend"

IF NOT EXIST "node_modules" (
    echo Installing npm packages...
    npm install
)

echo.
echo ============================================
echo   Frontend running at http://localhost:5173
echo ============================================
echo.

npm run dev
pause
