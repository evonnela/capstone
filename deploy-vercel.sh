#!/bin/bash
# Clean up
rm -rf build

# Run a fresh build with the correct homepage path
npm run build

# Deploy to Vercel
echo "Now run: vercel --prod"
