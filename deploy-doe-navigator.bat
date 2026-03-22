@echo off
REM DOE Navigator Deployment Script for Windows
REM Automatically builds and deploys the DOE Navigator to root level

echo 🚀 Starting DOE Navigator Deployment...

REM Navigate to DOE Navigator source
cd /d "d:\Calculations\Kaizen-Academy-Toolkit\DOE-navigator"

REM Install dependencies (if needed)
echo 📦 Installing dependencies...
call npm install

REM Build the application with relative paths
echo 🔨 Building DOE Navigator with relative paths...
call npx vite build

REM Check if build was successful
if %ERRORLEVEL% EQU 0 (
    echo ✅ Build successful!
    
    REM Create deployment directory if it doesn't exist
    if not exist "..\DOE-Navigator" mkdir "..\DOE-Navigator"
    
    REM Clear existing files
    echo 🧹 Clearing existing deployment files...
    del /Q "..\DOE-Navigator\*.*" 2>nul
    for /d %%d in ("..\DOE-Navigator\*") do rd /S /Q "%%d" 2>nul
    
    REM Copy built files to deployment directory
    echo 📋 Copying files to root level...
    xcopy /E /Y dist\ "..\DOE-Navigator\"
    
    echo 🎉 DOE Navigator deployed successfully!
    echo 📍 Available at: DOE-Navigator/
    echo 🌐 After Vercel deploy: https://your-domain.vercel.app/DOE-Navigator/
) else (
    echo ❌ Build failed!
    exit /b 1
)

pause
