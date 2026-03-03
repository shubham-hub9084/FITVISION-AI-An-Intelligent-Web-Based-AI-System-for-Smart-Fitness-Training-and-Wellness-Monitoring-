@echo off
echo =========================================
echo   AI Fitness Trainer - Backend Launcher
echo =========================================

REM Set the backend directory
cd /d "%~dp0"

REM Check if ai_env exists
IF NOT EXIST "ai_env\Scripts\python.exe" (
    echo [INFO] Virtual environment not found. Creating ai_env...
    python -m venv ai_env
    IF ERRORLEVEL 1 (
        echo [ERROR] Failed to create virtual environment. Make sure Python is installed.
        pause
        exit /b 1
    )
    echo [INFO] Installing dependencies...
    ai_env\Scripts\pip install -r requirements.txt
    IF ERRORLEVEL 1 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
    echo [SUCCESS] All dependencies installed!
) ELSE (
    echo [INFO] Virtual environment found. Checking packages...
    ai_env\Scripts\pip install -r requirements.txt --quiet
)

echo.
echo [INFO] Starting Flask backend on http://localhost:5000
echo [INFO] Press Ctrl+C to stop the server.
echo.
ai_env\Scripts\python.exe app.py
pause
