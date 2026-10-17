@echo off
echo ========================================================
echo Installing dependencies for Flipkart Clone System...
echo ========================================================

echo.
echo [1/3] Installing Backend Dependencies...
cd backend
call npm install
cd ..

echo.
echo [2/3] Installing WebApp (Customer Site) Dependencies...
cd webapp
call npm install
cd ..

echo.
echo [3/3] Installing Admin Panel Dependencies...
cd admin
call npm install
cd ..

echo.
echo ========================================================
echo All dependencies installed successfully!
echo You can now start the project using 'start-all.bat'
echo ========================================================
pause
