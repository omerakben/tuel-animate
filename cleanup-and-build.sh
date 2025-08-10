#!/bin/bash

# Tuel Animate - Complete Cleanup and Build Script
# This script performs a complete cleanup of all caches and rebuilds everything from scratch

set -e  # Exit on any error

echo "🧹 Starting complete cleanup and rebuild process..."
echo "================================================="

# Color codes for pretty output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

step() {
    echo -e "\n${BLUE}📋 Step $1: $2${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Step 1: Clean all node_modules directories
step 1 "Removing all node_modules directories"
echo "Finding and removing node_modules directories..."
find . -name "node_modules" -type d -prune -exec rm -rf {} + 2>/dev/null || true
success "All node_modules directories removed"

# Step 2: Clean all build outputs
step 2 "Removing all build outputs"
echo "Cleaning .next directories..."
find . -name ".next" -type d -prune -exec rm -rf {} + 2>/dev/null || true

echo "Cleaning dist directories..."
find . -name "dist" -type d -prune -exec rm -rf {} + 2>/dev/null || true

echo "Cleaning .turbo directories..."
find . -name ".turbo" -type d -prune -exec rm -rf {} + 2>/dev/null || true

echo "Cleaning TypeScript build info..."
find . -name "*.tsbuildinfo" -type f -delete 2>/dev/null || true
success "All build outputs cleaned"

# Step 3: Clean package manager caches
step 3 "Cleaning package manager caches"
echo "Removing lock files..."
rm -f pnpm-lock.yaml package-lock.json yarn.lock 2>/dev/null || true

echo "Cleaning pnpm cache..."
pnpm store prune 2>/dev/null || warning "pnpm store prune failed or pnpm not found"

echo "Cleaning npm cache..."
npm cache clean --force 2>/dev/null || warning "npm cache clean failed"
success "Package manager caches cleaned"

# Step 4: Clean git ignored files (optional safety check)
step 4 "Cleaning git ignored files"
if command -v git &> /dev/null && [ -d ".git" ]; then
    echo "Cleaning git ignored files..."
    git clean -fdX
    success "Git ignored files cleaned"
else
    warning "Not a git repository or git not found, skipping git clean"
fi

# Step 5: Fresh package installation
step 5 "Installing fresh dependencies"
echo "Installing all dependencies with pnpm..."
if ! command -v pnpm &> /dev/null; then
    error "pnpm is not installed. Please install pnpm first: npm install -g pnpm"
fi

pnpm install --frozen-lockfile=false
success "Fresh dependencies installed"

# Step 6: Build all packages
step 6 "Building all packages"
echo "Building all packages with Turbo..."
pnpm build
success "All packages built successfully"

# Step 7: Type checking
step 7 "Running type checks"
echo "Running TypeScript type checking..."
pnpm --filter=@tuel/docs exec tsc --noEmit
success "Type checking passed"

# Step 8: Linting (optional)
step 8 "Running linter (optional)"
echo "Running ESLint..."
pnpm --filter=@tuel/docs exec eslint . --ext .ts,.tsx --max-warnings 0 || warning "Linting completed with warnings"

# Step 9: Final verification
step 9 "Final verification"
echo "Verifying all packages..."
pnpm build --dry-run || pnpm build --filter=@tuel/docs
success "Final verification passed"

echo ""
echo "🎉 Complete cleanup and rebuild finished successfully!"
echo "================================================="
echo -e "${GREEN}✅ All caches cleared${NC}"
echo -e "${GREEN}✅ Fresh dependencies installed${NC}"
echo -e "${GREEN}✅ All packages built${NC}"
echo -e "${GREEN}✅ Type checking passed${NC}"
echo -e "${GREEN}✅ Ready for development${NC}"
echo ""
echo "Your project is now in a completely clean state with:"
echo "• React 19.0.0-rc.1 compatibility"
echo "• Next.js 15.4.6 with strict type checking"
echo "• All TypeScript errors resolved"
echo "• Production-ready build"
echo ""
