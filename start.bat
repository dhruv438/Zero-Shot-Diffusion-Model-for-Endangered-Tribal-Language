@echo off
REM Desia Translator - Start Script
REM This script starts both backend and frontend servers

echo ========================================
echo Starting Desia Translator
echo ========================================
echo.

REM Check if Python 3.11 is available
py -3.11 --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python 3.11 is not installed or not in PATH
    echo Please install Python 3.11 from python.org
    pause
    exit /b 1
)

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from nodejs.org
    pause
    exit /b 1
)

REM Check if backend venv exists
if not exist "backend\.venv\Scripts\python.exe" (
    echo Backend virtual environment not found. Creating...
    py -3.11 -m venv backend\.venv
    echo Installing backend dependencies...
    backend\.venv\Scripts\python.exe -m pip install --upgrade pip
    backend\.venv\Scripts\pip.exe install -r backend\requirements.txt
)

REM Check if frontend node_modules exists
if not exist "frontend\node_modules" (
    echo Frontend dependencies not found. Installing...
    cd frontend
    call npm install
    cd ..
)

echo.
echo Starting Backend Server (Port 5002)...
echo.
start "Desia Backend" cmd /k "backend\.venv\Scripts\python.exe -m uvicorn backend.app.main:get_app --host 127.0.0.1 --port 5002"

REM Wait for backend to start
timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend Server (Port 5173)...
echo.
start "Desia Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Desia Translator Started Successfully!
echo ========================================
echo.
echo Backend:  http://127.0.0.1:5002
echo Frontend: http://localhost:5173
echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
echo.
pause
