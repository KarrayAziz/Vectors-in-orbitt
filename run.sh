#!/bin/bash
# Run script for Bio-Vector Orbit (Linux/Mac)
# Starts backend (in venv) and frontend concurrently

echo "========================================"
echo "Bio-Vector Orbit - Starting Services"
echo "========================================"
echo ""

# Check if venv exists
if [ ! -f "backend/.venv/bin/activate" ]; then
    echo "ERROR: Virtual environment not found!"
    echo "Please run ./setup.sh first."
    exit 1
fi

echo "Starting services..."
echo ""
echo "Backend will run on: http://localhost:8000"
echo "Frontend will run on: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Activate venv and start backend in background
(cd backend && source .venv/bin/activate && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000) &
BACKEND_PID=$!

# Wait 2 seconds for backend to start
sleep 2

# Start frontend in background
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Services started!"
echo ""
echo "Backend: http://localhost:8000/docs (PID: $BACKEND_PID)"
echo "Frontend: http://localhost:3000 (PID: $FRONTEND_PID)"
echo ""
echo "Press Ctrl+C to stop all services..."

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Services stopped.'; exit" INT
wait
