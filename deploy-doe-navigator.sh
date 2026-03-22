#!/bin/bash

# DOE Navigator Deployment Script
# Automatically builds and deploys the DOE Navigator to the toolkit

echo "🚀 Starting DOE Navigator Deployment..."

# Navigate to DOE Navigator source
cd "d:\Calculations\Kaizen-Academy-Toolkit\DOE-navigator"

# Install dependencies (if needed)
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building DOE Navigator..."
npx vite build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Create deployment directory if it doesn't exist
    mkdir -p "../toolkit/DOE-Navigator"
    
    # Copy built files to deployment directory
    echo "📋 Copying files to toolkit..."
    cp -r dist/* "../toolkit/DOE-Navigator/"
    
    echo "🎉 DOE Navigator deployed successfully!"
    echo "📍 Available at: toolkit/DOE-Navigator/"
else
    echo "❌ Build failed!"
    exit 1
fi
