@echo off
REM Setup script for Bio-Vector Orbit
REM Creates venv and installs all dependencies

echo ========================================
echo Bio-Vector Orbit - Environment Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.11+ from python.org
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from nodejs.org
    pause
    exit /b 1
)

echo [1/5] Creating Python virtual environment...
cd backend
python -m venv .venv
if %errorlevel% neq 0 (
    echo ERROR: Failed to create virtual environment
    pause
    exit /b 1
)

echo [2/5] Activating virtual environment...
call .venv\Scripts\activate.bat

echo [3/5] Installing Python dependencies...
pip install --upgrade pip
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)

echo [4/5] Installing Node.js dependencies...
cd ..
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Node.js dependencies
    pause
    exit /b 1
)

echo [5/5] Setup complete virtual environment...
echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Virtual environment created at: backend\.venv
echo.
echo To run the application, use: run.bat
echo.
pause
