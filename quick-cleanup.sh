#!/bin/bash

# Tuel Animate - Quick Cleanup Script
# This script performs a faster cleanup for quick iteration

echo "🚀 Quick cleanup and rebuild..."

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Quick cleanup (only build outputs, not dependencies)
echo -e "${BLUE}Cleaning build outputs...${NC}"
find . -name ".next" -type d -prune -exec rm -rf {} + 2>/dev/null || true
find . -name ".turbo" -type d -prune -exec rm -rf {} + 2>/dev/null || true
find . -path "*/packages/*/dist" -type d -prune -exec rm -rf {} + 2>/dev/null || true
find . -path "*/apps/*/dist" -type d -prune -exec rm -rf {} + 2>/dev/null || true
find . -name "*.tsbuildinfo" -type f -delete 2>/dev/null || true

# Build
echo -e "${BLUE}Building...${NC}"
pnpm build

echo -e "${GREEN}✅ Quick cleanup complete!${NC}"
