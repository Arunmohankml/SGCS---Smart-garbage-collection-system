@echo off
REM CivicEye dev server launcher
REM Starts Next.js in development mode on http://localhost:3000

echo Installing dependencies...
call npm install --no-audit --no-fund
if %errorlevel% neq 0 (
  echo.
  echo ERROR: npm install failed. Check your network connection.
  echo        You may need to configure your npm proxy settings.
  pause
  exit /b 1
)

echo.
echo Starting CivicEye dev server...
echo Open your browser at http://localhost:3000
echo Press Ctrl+C to stop.
echo.
call npm run dev
