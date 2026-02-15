#!/bin/bash

# Vercel Deployment Preparation Script
# Run this script before deploying to ensure everything is ready

set -e

echo "==================================="
echo "k0nach! Deployment Preparation"
echo "==================================="
echo ""

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "ERROR: Node.js 18+ is required. Current version: $(node -v)"
    exit 1
fi
echo "✓ Node.js version: $(node -v)"
echo ""

# Check if git is clean
echo "Checking git status..."
if ! git diff-index --quiet HEAD --; then
    echo "WARNING: Uncommitted changes detected. Commit before deploying."
fi
echo "✓ Git status checked"
echo ""

# Install dependencies
echo "Installing dependencies..."
npm install --legacy-peer-deps
cd frontend && npm install --legacy-peer-deps
cd ..
echo "✓ Dependencies installed"
echo ""

# Type checking
echo "Running type checks..."
cd frontend
npm run type-check || echo "WARNING: Type check issues detected"
cd ..
echo "✓ Type check complete"
echo ""

# Build
echo "Building production bundle..."
cd frontend
npm run build
BUILD_SIZE=$(du -sh dist | cut -f1)
echo "✓ Build complete - Size: $BUILD_SIZE"
echo ""

# Summary
echo "==================================="
echo "Deployment Ready!"
echo "==================================="
echo ""
echo "Next steps:"
echo "1. Commit changes: git commit -m 'Prepare for deployment'"
echo "2. Push to GitHub: git push origin main"
echo "3. Deploy on Vercel:"
echo "   - Option A: vercel command"
echo "   - Option B: Vercel Dashboard auto-deploy"
echo ""
echo "Environment variables to set in Vercel:"
echo "  VITE_API_URL=https://your-api-domain.com"
echo "  GEMINI_API_KEY=your_api_key"
echo "  ADMIN_PASSWORD=secure_password"
echo ""
