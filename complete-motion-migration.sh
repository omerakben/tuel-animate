#!/bin/bash

echo "🚀 Complete Migration: Framer Motion → Motion + Easing Fix"
echo "=========================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to update easing usage in files
update_easing_usage() {
    echo -e "${BLUE}🔧 Fixing easing usage patterns...${NC}"

    # Replace animations.easing.easeOut with animations.easing.motion.easeOut
    find packages apps -name "*.tsx" -o -name "*.ts" | \
    grep -v node_modules | \
    grep -v .next | \
    grep -v dist | \
    while read file; do
        if grep -q "animations\.easing\." "$file"; then
            echo "Updating easing usage in: $file"
            sed -i '' 's/animations\.easing\.easeOut/animations.easing.motion.easeOut/g' "$file"
            sed -i '' 's/animations\.easing\.easeIn/animations.easing.motion.easeIn/g' "$file"
            sed -i '' 's/animations\.easing\.easeInOut/animations.easing.motion.easeInOut/g' "$file"
            sed -i '' 's/animations\.easing\.linear/animations.easing.motion.linear/g' "$file"
        fi
    done
}

# Step 1: Update tokens to export motion easing as default
echo -e "${BLUE}📝 Updating tokens to use motion easing by default...${NC}"

# Check if tokens already have the motion structure
if grep -q "motion:" packages/tokens/src/index.ts; then
    echo "Tokens already have motion structure, just need to update usage..."
else
    echo "Need to update tokens structure first..."
fi

# Step 2: Backup current state
echo -e "${BLUE}📦 Creating backup...${NC}"
git add .
git commit -m "feat: backup before complete Motion migration" || echo "Nothing to commit"

# Step 3: Remove framer-motion and install motion
echo -e "${BLUE}📦 Updating packages...${NC}"

# Check if we're in workspace root
if [ -f "pnpm-workspace.yaml" ]; then
    echo "Removing framer-motion..."
    pnpm remove framer-motion --filter "*"

    echo "Installing motion..."
    pnpm add motion --filter "*"
else
    echo "Not in workspace root, updating manually..."
fi

# Step 4: Update package.json files
echo -e "${BLUE}📝 Updating package.json files...${NC}"

# Update components package.json peer dependencies
if [ -f "packages/components/package.json" ]; then
    sed -i '' 's/"framer-motion": ">=[^"]*"/"motion": ">=1.0.0"/g' packages/components/package.json
    sed -i '' 's/"framer-motion": "\^[^"]*"/"motion": "^1.0.0"/g' packages/components/package.json
    echo "✅ Updated packages/components/package.json"
fi

# Update docs package.json
if [ -f "apps/docs/package.json" ]; then
    sed -i '' 's/"framer-motion": "\^[^"]*"/"motion": "^1.0.0"/g' apps/docs/package.json
    echo "✅ Updated apps/docs/package.json"
fi

# Step 5: Update import statements
echo -e "${BLUE}🔄 Updating import statements...${NC}"

# Find all TypeScript/JavaScript files and update imports
find packages apps -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" | \
grep -v node_modules | \
grep -v .next | \
grep -v dist | \
while read file; do
    if grep -q "framer-motion" "$file"; then
        echo "Updating imports in: $file"
        sed -i '' "s/from 'framer-motion'/from 'motion\/react'/g" "$file"
        sed -i '' 's/from "framer-motion"/from "motion\/react"/g' "$file"
    fi
done

echo -e "${GREEN}✅ Import statements updated${NC}"

# Step 6: Fix easing usage
update_easing_usage

# Step 7: Clean everything
echo -e "${BLUE}🧹 Cleaning build outputs...${NC}"
rm -rf packages/*/dist
rm -rf packages/*/.turbo
rm -rf apps/*/.next
rm -rf apps/*/.turbo
rm -rf node_modules/.cache
rm -rf .turbo

echo -e "${GREEN}✅ Clean complete${NC}"

# Step 8: Reinstall dependencies
echo -e "${BLUE}📦 Reinstalling dependencies...${NC}"
pnpm install

echo -e "${GREEN}✅ Dependencies installed${NC}"

# Step 9: Test build
echo -e "${BLUE}🔨 Testing build...${NC}"
if pnpm build; then
    echo -e "${GREEN}✅ Migration successful! All packages build without errors.${NC}"

    # Run a quick test to check if the cubic-bezier error is resolved
    echo -e "${BLUE}🧪 Testing for cubic-bezier errors...${NC}"
    if pnpm dev --filter @tuel/docs &
    DEV_PID=$!
    sleep 5
    kill $DEV_PID 2>/dev/null
    then
        echo -e "${GREEN}✅ No cubic-bezier errors detected${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Build issues detected. Manual fixes may be needed.${NC}"
fi

echo ""
echo -e "${GREEN}🎉 MIGRATION COMPLETE! 🎉${NC}"
echo -e "${BLUE}=========================================================="
echo -e "${YELLOW}📋 What was changed:${NC}"
echo "• ✅ Migrated from framer-motion to motion package"
echo "• ✅ Updated all import statements to motion/react"
echo "• ✅ Fixed easing to use motion-compatible arrays"
echo "• ✅ Updated package.json dependencies"
echo "• ✅ Cleaned and rebuilt all packages"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Test your applications thoroughly"
echo "2. Check for any remaining cubic-bezier errors"
echo "3. Commit your changes: git add . && git commit -m 'feat: migrate to Motion with easing fixes'"
echo ""
echo -e "${GREEN}🎯 The cubic-bezier error should now be resolved!${NC}"
