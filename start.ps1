# Desia Translator - Start Script (PowerShell)
# This script starts both backend and frontend servers

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Desia Translator" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python 3.11 is available
try {
    $pythonVersion = py -3.11 --version 2>&1
    Write-Host "[OK] Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Python 3.11 is not installed or not in PATH" -ForegroundColor Red
    Write-Host "  Please install Python 3.11 from python.org" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Node.js is available
try {
    $nodeVersion = node --version 2>&1
    Write-Host "[OK] Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "  Please install Node.js from nodejs.org" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Check if backend venv exists
if (-not (Test-Path "backend\.venv\Scripts\python.exe")) {
    Write-Host "Backend virtual environment not found. Creating..." -ForegroundColor Yellow
    py -3.11 -m venv backend\.venv
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    & backend\.venv\Scripts\python.exe -m pip install --upgrade pip
    & backend\.venv\Scripts\pip.exe install -r backend\requirements.txt
    Write-Host "[OK] Backend setup complete" -ForegroundColor Green
}

# Check if frontend node_modules exists
if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "Frontend dependencies not found. Installing..." -ForegroundColor Yellow
    Push-Location frontend
    npm install
    Pop-Location
    Write-Host "[OK] Frontend setup complete" -ForegroundColor Green
}

Write-Host ""
Write-Host "Starting Backend Server (Port 5002)..." -ForegroundColor Cyan
Write-Host ""

# Start backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; .\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 5002 --reload"

# Wait for backend to start
Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Health check
Write-Host "Performing backend health check..." -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Method Get -Uri 'http://127.0.0.1:5002/api/health' -TimeoutSec 5
    if ($health.status -eq 'ok') {
        Write-Host "[OK] Backend healthy" -ForegroundColor Green
    } else {
        Write-Host "[WARN] Backend responded but not OK: $($health | ConvertTo-Json -Compress)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[ERROR] Backend health check failed" -ForegroundColor Red
}

# Dictionary stats
Write-Host "Checking dictionary and ChatGPT service..." -ForegroundColor Cyan
try {
    $dictCount = (& backend\.venv\Scripts\python.exe -c "import pandas as pd; df=pd.read_csv('backend/train/data/dict.csv'); print(len(df))")
    Write-Host "[OK] Dictionary loaded: $dictCount Odia-Desia entries" -ForegroundColor Green
} catch {
    Write-Host "[WARN] Dictionary check skipped" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Starting Frontend Server (Port 5173)..." -ForegroundColor Cyan
Write-Host ""

# Start frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Desia Translator Started Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  " -NoNewline
Write-Host "http://127.0.0.1:5002" -ForegroundColor Blue
Write-Host "Frontend: " -NoNewline
Write-Host "http://localhost:5173" -ForegroundColor Blue
Write-Host "API (Desia): POST http://127.0.0.1:5002/api/translate_with_desia" -ForegroundColor DarkCyan
Write-Host ""
Write-Host "Both servers are running in separate windows." -ForegroundColor Yellow
Write-Host "Close those windows to stop the servers." -ForegroundColor Yellow
Write-Host ""
Write-Host "Opening browser in 3 seconds..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

# Open browser
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "Press any key to exit this window (servers will keep running)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
