#!/bin/bash
# Setup script for Bio-Vector Orbit (Linux/Mac)
# Creates venv and installs all dependencies

echo "========================================"
echo "Bio-Vector Orbit - Environment Setup"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.11+ from python.org"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js from nodejs.org"
    exit 1
fi

echo "[1/5] Creating Python virtual environment..."
cd backend
python3 -m venv .venv
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to create virtual environment"
    exit 1
fi

echo "[2/5] Activating virtual environment..."
source .venv/bin/activate

echo "[3/5] Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install Python dependencies"
    exit 1
fi

echo "[4/5] Installing Node.js dependencies..."
cd ..
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install Node.js dependencies"
    exit 1
fi

echo "[5/5] Setup complete!"
echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Virtual environment created at: backend/.venv"
echo ""
echo "To run the application, use: ./run.sh"
echo ""
