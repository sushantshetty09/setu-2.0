@echo off
echo ===================================================
echo   SETU (सेतु) - AI Government Schemes Portal
echo   One Voice. Every Service.
echo ===================================================
echo.

echo Starting SETU Backend on http://localhost:8000 ...
start "SETU Backend" cmd /k "cd backend && py run.py"

echo Starting SETU Frontend on http://localhost:5173 ...
start "SETU Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo   Frontend: http://localhost:5173
echo   Backend API: http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo   CSC Login: operator@csc.gov.in / demo123
echo ===================================================
echo.
pause
