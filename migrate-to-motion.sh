#!/bin/bash

echo "🚀 Starting Framer Motion → Motion migration..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Backup current state
echo -e "${BLUE}📦 Creating backup...${NC}"
git add .
git commit -m "feat: backup before Motion migration" || echo "Nothing to commit"

# Step 2: Remove framer-motion and install motion
echo -e "${BLUE}📦 Updating packages...${NC}"
pnpm remove framer-motion
pnpm add motion

# Update all package.json files
echo -e "${BLUE}📝 Updating package.json files...${NC}"

# Update components package.json
sed -i '' 's/"framer-motion": ">=[^"]*"/"motion": ">=1.0.0"/g' packages/components/package.json
sed -i '' 's/"framer-motion": "\^[^"]*"/"motion": "^1.0.0"/g' packages/components/package.json

# Update docs package.json
sed -i '' 's/"framer-motion": "\^[^"]*"/"motion": "^1.0.0"/g' apps/docs/package.json

echo -e "${GREEN}✅ Package.json files updated${NC}"

# Step 3: Update import statements
echo -e "${BLUE}🔄 Updating import statements...${NC}"

# Find all TypeScript/JavaScript files and update imports
find . -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" | \
grep -v node_modules | \
grep -v .next | \
grep -v dist | \
xargs sed -i '' "s/from 'framer-motion'/from 'motion\/react'/g"

find . -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" | \
grep -v node_modules | \
grep -v .next | \
grep -v dist | \
xargs sed -i '' 's/from "framer-motion"/from "motion\/react"/g'

echo -e "${GREEN}✅ Import statements updated${NC}"

# Step 4: Clean everything
echo -e "${BLUE}🧹 Cleaning build outputs...${NC}"
rm -rf packages/*/dist
rm -rf packages/*/.turbo
rm -rf apps/*/.next
rm -rf apps/*/.turbo
rm -rf node_modules/.cache
rm -rf .turbo

echo -e "${GREEN}✅ Clean complete${NC}"

# Step 5: Reinstall dependencies
echo -e "${BLUE}📦 Reinstalling dependencies...${NC}"
pnpm install

echo -e "${GREEN}✅ Dependencies installed${NC}"

# Step 6: Test build
echo -e "${BLUE}🔨 Testing build...${NC}"
if pnpm build; then
    echo -e "${GREEN}✅ Migration successful! All packages build without errors.${NC}"
else
    echo -e "${YELLOW}⚠️  Build issues detected. You may need to fix remaining easing issues manually.${NC}"
fi

echo -e "${BLUE}🎉 Migration complete!${NC}"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Test your applications"
echo "2. Fix any remaining easing format issues"
echo "3. Commit your changes with: git add . && git commit -m 'feat: migrate from framer-motion to motion'"
