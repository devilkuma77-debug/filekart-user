@echo off
echo ========================================================
echo Starting Flipkart Clone Multi-Tier System...
echo ========================================================

echo.
echo Starting Backend API Server (Port 5000)...
start "Flipkart Backend API" cmd /k "cd backend && npm run dev"

echo.
echo Starting Flipkart Customer WebApp (Port 3000)...
start "Flipkart Customer WebApp" cmd /k "cd webapp && npm run dev"

echo.
echo Starting Flipkart Enterprise Admin Dashboard (Port 3001)...
start "Flipkart Admin Panel" cmd /k "cd admin && npm run dev"

echo.
echo ========================================================
echo Services are booting up:
echo 1. Customer WebApp:   http://localhost:3000
echo 2. Admin Operations:  http://localhost:3001
echo 3. Backend API:       http://localhost:5000
echo ========================================================
