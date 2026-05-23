@echo off
REM ============================================================
REM mrmax store — instalacja wszystkich zaleznosci
REM Uruchom: install.bat (lub kliknij dwukrotnie)
REM ============================================================

setlocal enabledelayedexpansion
cd /d "%~dp0"

echo.
echo === mrmax store: instalacja zaleznosci ===
echo.

REM Sprawdz Node.js
where node >nul 2>nul
if errorlevel 1 (
  echo [BLAD] Nie znaleziono Node.js. Pobierz z https://nodejs.org/ ^(LTS^).
  pause
  exit /b 1
)

for /f "delims=" %%v in ('node -v') do set NODE_VER=%%v
echo Node: !NODE_VER!

REM Sprawdz npm
where npm >nul 2>nul
if errorlevel 1 (
  echo [BLAD] Nie znaleziono npm.
  pause
  exit /b 1
)

for /f "delims=" %%v in ('npm -v') do set NPM_VER=%%v
echo npm:  !NPM_VER!
echo.

echo [1/3] Instaluje root...
call npm install
if errorlevel 1 goto :error

echo.
echo [2/3] Instaluje frontend...
pushd frontend
call npm install
if errorlevel 1 (
  popd
  goto :error
)
popd

echo.
echo [3/3] Instaluje backend...
pushd backend
call npm install
if errorlevel 1 (
  popd
  goto :error
)
popd

echo.
echo === GOTOWE ===
echo Nastepne kroki:
echo   1. copy .env.example .env  (i wpisz tokeny Printify)
echo   2. dev.bat                 (uruchom frontend + backend)
echo.
pause
exit /b 0

:error
echo.
echo === BLAD instalacji ===
pause
exit /b 1
