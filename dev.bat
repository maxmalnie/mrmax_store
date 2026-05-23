@echo off
REM ============================================================
REM mrmax store — dev mode (frontend + backend rownoleglie)
REM Frontend: http://localhost:5173
REM Backend:  http://localhost:4000
REM ============================================================

cd /d "%~dp0"

if not exist node_modules (
  echo [INFO] Brak node_modules — uruchamiam install.bat
  call install.bat
  if errorlevel 1 exit /b 1
)

if not exist .env (
  echo.
  echo [UWAGA] Brak pliku .env — kopiuje z .env.example
  copy .env.example .env >nul
  echo [UWAGA] Wpisz tokeny Printify w .env zanim zlozysz pierwsze zamowienie.
  echo.
)

echo === mrmax store: dev mode ===
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:4000
echo.

call npm run dev
