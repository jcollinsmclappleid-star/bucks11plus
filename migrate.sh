#!/bin/bash
# 11+ Standard Migration Script
# Run this in your NEW blank Replit project

echo "Starting migration..."

# Create directory structure
mkdir -p server client shared script

# Copy all essential files
cp -r /home/runner/workspace/server/* ./server/ 2>/dev/null || true
cp -r /home/runner/workspace/client/* ./client/ 2>/dev/null || true
cp -r /home/runner/workspace/shared/* ./shared/ 2>/dev/null || true
cp -r /home/runner/workspace/script/* ./script/ 2>/dev/null || true
cp /home/runner/workspace/package.json . 2>/dev/null || true
cp /home/runner/workspace/package-lock.json . 2>/dev/null || true
cp /home/runner/workspace/tsconfig.json . 2>/dev/null || true
cp /home/runner/workspace/vite.config.ts . 2>/dev/null || true
cp /home/runner/workspace/.replit . 2>/dev/null || true

echo "Installing dependencies..."
npm install

echo "✅ Migration complete! Your new project is ready."
echo "Next steps:"
echo "1. Add your Stripe secrets in the Secrets tab:"
echo "   - STRIPE_PUBLISHABLE_KEY"
echo "   - STRIPE_SECRET_KEY"
echo "2. Click Publish and claim your sandbox"
