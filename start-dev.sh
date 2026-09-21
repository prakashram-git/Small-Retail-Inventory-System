#!/bin/bash

# Kill any existing Node processes
echo "🛑 Stopping existing servers..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "node" 2>/dev/null || true

# Clear Next.js cache
echo "🧹 Clearing Next.js cache..."
rm -rf .next

# Install dependencies if needed
echo "📦 Checking dependencies..."
npm install

# Start the dev server
echo "🚀 Starting dev server..."
npm run dev
