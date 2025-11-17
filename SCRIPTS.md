# Quick Start Scripts

This directory contains convenient scripts to start both the backend and frontend servers with a single command.

## Windows

### Option 1: Batch Script (CMD)
Double-click `start.bat` or run from command prompt:
```cmd
start.bat
```

### Option 2: PowerShell Script (Recommended)
Double-click `start.ps1` or run from PowerShell:
```powershell
.\start.ps1
```

**Note:** If you get an execution policy error, run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## What These Scripts Do

1. ✅ Check for Python 3.11 and Node.js
2. ✅ Create virtual environment if needed
3. ✅ Install dependencies if missing
4. ✅ Start backend server on port 5002
5. ✅ Start frontend server on port 5173
6. ✅ Open browser automatically (PowerShell version)

## Manual Start (Alternative)

### Backend
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python -m uvicorn backend.app.main:get_app --host 127.0.0.1 --port 5002
```

### Frontend
```powershell
cd frontend
npm run dev
```

## Stopping the Servers

Simply close the terminal windows that were opened by the start scripts.

## Troubleshooting

### Port Already in Use
If port 5002 or 5173 is already in use:
```powershell
# Find and stop processes using the ports
Get-NetTCPConnection -LocalPort 5002,5173 -State Listen | 
    Select-Object -ExpandProperty OwningProcess -Unique | 
    ForEach-Object { Stop-Process -Id $_ -Force }
```

### Backend Not Starting
- Ensure Python 3.11 is installed
- Check `backend\requirements.txt` dependencies are compatible
- Delete `backend\.venv` and run the script again

### Frontend Not Starting
- Ensure Node.js 18+ is installed
- Delete `frontend\node_modules` and `frontend\package-lock.json`
- Run `npm install` manually in the frontend directory
