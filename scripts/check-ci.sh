#!/bin/bash
# Stop on the first error
set -e

echo "==========================================="
echo "   Running CI Checks Locally"
echo "==========================================="

echo -e "\n[1/3] Running ESLint..."
npm run lint

echo -e "\n[2/4] Running Unit Tests..."
npm run test:unit

echo -e "\n[3/4] Running TypeScript compiler check..."
npx tsc --noEmit

echo -e "\n[4/4] Testing Docker build..."
if docker info >/dev/null 2>&1; then
  docker build -t webaiki:ci-test .
else
  echo "⚠️ Skipping Docker build: Docker daemon is not running or requires sudo permissions."
fi

echo -e "\n==========================================="
echo "   All CI checks passed successfully! 🎉"
echo "==========================================="
