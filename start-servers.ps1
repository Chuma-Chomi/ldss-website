# LDSS Website - Server Startup Script
Write-Host "Starting LDSS Website Servers..." -ForegroundColor Green
Write-Host ""

# Get the script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $scriptPath "backend"
$frontendPath = Join-Path $scriptPath "frontend"

# Check if directories exist
if (-not (Test-Path $backendPath)) {
    Write-Host "Error: Backend directory not found!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $frontendPath)) {
    Write-Host "Error: Frontend directory not found!" -ForegroundColor Red
    exit 1
}

# Start Backend Server
Write-Host "Starting Backend Server on port 4000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Backend Server Starting...' -ForegroundColor Cyan; npm run dev"

# Wait a moment
Start-Sleep -Seconds 2

# Start Frontend Server
Write-Host "Starting Frontend Server on port 5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'Frontend Server Starting...' -ForegroundColor Cyan; npm run dev"

Write-Host ""
Write-Host "Servers are starting in separate windows..." -ForegroundColor Green
Write-Host "Backend: http://localhost:4000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Wait a few seconds for servers to fully start, then open:" -ForegroundColor Yellow
Write-Host "  http://localhost:5173" -ForegroundColor White
Write-Host ""


