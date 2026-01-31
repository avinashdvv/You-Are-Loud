#!/bin/bash

# Clean all build artifacts and dependencies
# Useful for a fresh start

set -e

echo "🧹 Cleaning monorepo build artifacts..."
echo ""

# Clean root node_modules
echo "🗑️  Cleaning root dependencies..."
rm -rf node_modules
rm -rf .pnpm-store
echo "✅ Root cleaned"
echo ""

# Clean shared packages
echo "🗑️  Cleaning shared packages..."
for package in packages/*; do
    if [ -d "$package" ]; then
        echo "   Cleaning $(basename $package)..."
        rm -rf "$package/node_modules"
        rm -rf "$package/dist"
    fi
done
echo "✅ Shared packages cleaned"
echo ""

# Clean macOS build artifacts
if [ -d "apps/macos" ]; then
    echo "🗑️  Cleaning macOS build artifacts..."
    find apps/macos -type d -name "build" -exec rm -rf {} + 2>/dev/null || true
    find apps/macos -type d -name "DerivedData" -exec rm -rf {} + 2>/dev/null || true
    rm -rf apps/macos/.build 2>/dev/null || true
    echo "✅ macOS cleaned"
    echo ""
fi

# Clean Windows build artifacts
if [ -d "apps/windows" ]; then
    echo "🗑️  Cleaning Windows build artifacts..."
    find apps/windows -type d -name "bin" -exec rm -rf {} + 2>/dev/null || true
    find apps/windows -type d -name "obj" -exec rm -rf {} + 2>/dev/null || true
    echo "✅ Windows cleaned"
    echo ""
fi

# Clean React Native
if [ -d "apps/mobile" ]; then
    echo "🗑️  Cleaning React Native mobile app..."
    rm -rf apps/mobile/node_modules 2>/dev/null || true
    rm -rf apps/mobile/ios/Pods 2>/dev/null || true
    rm -rf apps/mobile/android/build 2>/dev/null || true
    rm -rf apps/mobile/android/app/build 2>/dev/null || true
    rm -rf apps/mobile/android/.gradle 2>/dev/null || true
    echo "✅ React Native cleaned"
    echo ""
fi

# Clean Chrome extension
if [ -d "apps/chrome-extension" ]; then
    echo "🗑️  Cleaning Chrome extension..."
    rm -rf apps/chrome-extension/node_modules 2>/dev/null || true
    rm -rf apps/chrome-extension/dist 2>/dev/null || true
    rm -rf apps/chrome-extension/build 2>/dev/null || true
    echo "✅ Chrome extension cleaned"
    echo ""
fi

echo "════════════════════════════════════════════════════"
echo "✅ Cleanup complete!"
echo "════════════════════════════════════════════════════"
echo ""
echo "Run './scripts/setup.sh' to reinstall dependencies"
echo ""
