#!/bin/bash

# Build script for Vercel deployment
echo "Building VECTIS Energy Calculator for Vercel..."

# Install dependencies
npm install

# Build the frontend
echo "Building frontend with Vite..."
npx vite build

# Copy API routes to correct location
echo "Setting up API routes..."
mkdir -p dist/api
cp -r api/* dist/api/

# Create package.json for serverless functions
echo "Creating package.json for API..."
cat > dist/api/package.json << EOF
{
  "name": "vectis-api",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@neondatabase/serverless": "^0.10.4",
    "ws": "^8.18.0"
  }
}
EOF

echo "Build complete! Ready for Vercel deployment."
echo "Make sure to set DATABASE_URL environment variable in Vercel dashboard."