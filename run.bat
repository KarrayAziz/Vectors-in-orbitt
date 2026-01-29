@echo off
REM Run script for Bio-Vector Orbit
REM Starts backend (in venv) and frontend concurrently

echo ========================================
echo Bio-Vector Orbit - Starting Services
echo ========================================
echo.

REM Check if venv exists
if not exist "backend\.venv\Scripts\activate.bat" (
    echo ERROR: Virtual environment not found!
    echo Please run setup.bat first.
    pause
    exit /b 1
)

echo Starting services...
echo.
echo Backend will run on: http://localhost:8000
echo Frontend will run on: http://localhost:3000
echo.
echo Press Ctrl+C to stop all services
echo.

REM Start backend in venv (in new window)
start "Bio-Vector Backend" cmd /k "cd backend && .venv\Scripts\activate.bat && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

REM Wait 2 seconds for backend to start
timeout /t 2 /nobreak >nul

REM Start frontend (in new window)
start "Bio-Vector Frontend" cmd /k "npm run dev"

echo.
echo Services started!
echo.
echo Backend: http://localhost:8000/docs
echo Frontend: http://localhost:3000
echo.
echo Close this window to keep services running.
echo Or press any key to exit...
pause >nul
