@echo off
REM DOE Navigator Deployment Script for Windows
REM Automatically builds and deploys the DOE Navigator to the toolkit

echo 🚀 Starting DOE Navigator Deployment...

REM Navigate to DOE Navigator source
cd /d "d:\Calculations\Kaizen-Academy-Toolkit\DOE-navigator"

REM Install dependencies (if needed)
echo 📦 Installing dependencies...
call npm install

REM Build the application
echo 🔨 Building DOE Navigator...
call npx vite build

REM Check if build was successful
if %ERRORLEVEL% EQU 0 (
    echo ✅ Build successful!
    
    REM Create deployment directory if it doesn't exist
    if not exist "..\toolkit\DOE-Navigator" mkdir "..\toolkit\DOE-Navigator"
    
    REM Copy built files to deployment directory
    echo 📋 Copying files to toolkit...
    xcopy /E /Y dist\ "..\toolkit\DOE-Navigator\"
    
    echo 🎉 DOE Navigator deployed successfully!
    echo 📍 Available at: toolkit/DOE-Navigator/
) else (
    echo ❌ Build failed!
    exit /b 1
)

pause
