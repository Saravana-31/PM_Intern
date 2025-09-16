@echo off
echo Starting AI-Based Internship Recommendation Engine...
echo.

echo Checking MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo MongoDB is already running.
) else (
    echo Starting MongoDB...
    start "MongoDB" mongod --dbpath C:\data\db
    timeout /t 3 /nobreak > nul
)

echo.
echo Inserting sample data...
cd backend
python sample_data.py
cd ..

echo.
echo Starting Node.js Backend...
start "Node Backend" cmd /k "cd node_backend && node server.js"

echo.
echo Starting Python Backend...
start "Python Backend" cmd /k "cd backend && python app.py"

echo.
echo Starting React Frontend...
start "React Frontend" cmd /k "cd intern_frontend && npm start"

echo.
echo All services starting...
echo Please wait for all services to start...
echo.
echo Frontend will be available at: http://localhost:3000
echo Node Backend: http://localhost:4000
echo Python Backend: http://localhost:5000
echo.
echo Press any key to continue...
pause > nul
