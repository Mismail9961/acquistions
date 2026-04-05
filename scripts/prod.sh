#!/bin/bash
set -euo pipefail

# Production deployment script for Acquisition App
# Run from anywhere: paths are resolved from the repository root.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT"

echo "🚀 Starting Acquisition App in Production Mode"
echo "==============================================="

if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production file not found in $ROOT"
    echo "   Please create .env.production with your production environment variables."
    exit 1
fi

if ! docker info >/dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    echo "   Please start Docker and try again."
    exit 1
fi

echo "📦 Building and starting production container..."
echo "   - Using Neon Cloud Database (no Neon Local proxy)"
echo "   - Running in optimized production mode"
echo ""

docker compose -f docker-compose.prod.yml up --build -d

# Neon Cloud is remote; brief pause before migrations (optional)
echo "⏳ Waiting a few seconds before running migrations..."
sleep 5

echo "📜 Applying latest schema with Drizzle (using .env.production)..."
# drizzle.config → src/env.js uses NODE_ENV to pick the env file; default is development
export NODE_ENV=production
npm run db:migrate

echo ""
echo "🎉 Production environment started!"
echo "   Application: http://localhost:3000 (host port follows APP_PORT in .env.production)"
echo ""
echo "Useful commands (run from $ROOT):"
echo "   View logs: docker compose -f docker-compose.prod.yml logs -f app"
echo "   Stop app:  docker compose -f docker-compose.prod.yml down"