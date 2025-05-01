#!/bin/bash

# Script to deploy React app to GitHub Pages
echo "Starting GitHub Pages deployment..."

# Clean any previous build
echo "Removing previous build..."
rm -rf build

# Build the app
echo "Building React app..."
npm run build

# Create .nojekyll file to prevent Jekyll processing
echo "Creating .nojekyll file..."
touch build/.nojekyll

# Add 404.html for SPA routing
echo "Creating 404.html for client-side routing..."
cp build/index.html build/404.html

# Deploy to GitHub Pages
echo "Deploying to GitHub Pages..."
npx gh-pages -d build

echo "Deployment complete!"
