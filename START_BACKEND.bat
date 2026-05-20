@echo off
title SMS Pro - Backend
color 0A
echo ============================================
echo   SMS Pro - Starting Backend Server
echo ============================================
echo.

cd /d "%~dp0backend"

IF NOT EXIST "venv\Scripts\activate" (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate

echo Installing dependencies...
pip install -r requirements.txt --quiet

echo.
echo ============================================
echo   Backend running at http://localhost:8000
echo   API Docs at http://localhost:8000/docs
echo ============================================
echo.

uvicorn main:app --reload --port 8000
pause
