# ============================================================
# mrmax store — instalacja zaleznosci (PowerShell)
# Uruchom: .\install.ps1
# Jesli execution policy blokuje: powershell -ExecutionPolicy Bypass -File .\install.ps1
# ============================================================

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "=== mrmax store: instalacja zaleznosci ===" -ForegroundColor Cyan
Write-Host ""

# Sprawdz Node.js
try {
    $nodeVer = node -v
    Write-Host "Node: $nodeVer"
} catch {
    Write-Host "[BLAD] Nie znaleziono Node.js. Pobierz z https://nodejs.org/" -ForegroundColor Red
    Read-Host "Enter aby zamknac"
    exit 1
}

try {
    $npmVer = npm -v
    Write-Host "npm:  $npmVer"
} catch {
    Write-Host "[BLAD] Nie znaleziono npm." -ForegroundColor Red
    exit 1
}

Write-Host ""

function Install-In($path, $label) {
    Write-Host "[$label] Instaluje $path..." -ForegroundColor Yellow
    Push-Location $path
    try {
        npm install
        if ($LASTEXITCODE -ne 0) {
            throw "npm install failed in $path"
        }
    } finally {
        Pop-Location
    }
    Write-Host ""
}

Install-In "." "1/3"
Install-In "frontend" "2/3"
Install-In "backend" "3/3"

Write-Host "=== GOTOWE ===" -ForegroundColor Green
Write-Host "Nastepne kroki:"
Write-Host "  1. Copy-Item .env.example .env  (i wpisz tokeny Printify)"
Write-Host "  2. .\dev.bat                    (lub: npm run dev)"
Write-Host ""
