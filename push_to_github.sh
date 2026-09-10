#!/bin/bash
set -e

echo "=================================================="
echo "🕉️ Pushing Gita App to GitHub (github.com/DHNSHYDV/Gita)"
echo "=================================================="

# Check remote
git remote -v

echo ""
echo "Attempting to push main branch and release tag v1.0.0..."
git push -u origin main --tags

echo ""
echo "✅ Successfully pushed to https://github.com/DHNSHYDV/Gita"
echo "You can now view your release at: https://github.com/DHNSHYDV/Gita/releases"
