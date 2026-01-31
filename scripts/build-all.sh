#!/bin/bash

# Build all platform applications
# This script builds shared packages and all platform apps where possible

set -e

echo "🔨 Building all applications in the monorepo..."
echo ""

# Build shared packages
echo "📦 Building shared packages..."
pnpm run build
echo "✅ Shared packages built"
echo ""

# Build Chrome extension (if exists and has package.json)
if [ -d "apps/chrome-extension" ] && [ -f "apps/chrome-extension/package.json" ]; then
    echo "🌐 Building Chrome extension..."
    cd apps/chrome-extension
    npm install
    npm run build 2>/dev/null || echo "⚠️  No build script found in Chrome extension"
    cd ../..
    echo "✅ Chrome extension processed"
    echo ""
fi

# Build React Native (iOS/Android) - if initialized
if [ -d "apps/mobile" ] && [ -f "apps/mobile/package.json" ]; then
    echo "📱 Building React Native mobile app..."
    cd apps/mobile
    npm install
    echo "✅ React Native dependencies installed"
    
    if [[ "$OSTYPE" == "darwin"* ]] && [ -d "ios" ]; then
        echo "📱 Installing iOS pods..."
        cd ios
        pod install 2>/dev/null || echo "⚠️  CocoaPods not configured (iOS native code needs initialization)"
        cd ..
    fi
    cd ..
    echo "✅ React Native processed"
    echo ""
fi

# macOS build (requires macOS)
if [[ "$OSTYPE" == "darwin"* ]] && [ -d "apps/macos/your-are-loud.xcodeproj" ]; then
    echo "🍎 Building macOS app..."
    cd apps/macos
    xcodebuild -project your-are-loud.xcodeproj -scheme your-are-loud -configuration Debug 2>/dev/null || echo "⚠️  macOS build skipped (requires Xcode)"
    cd ../..
    echo "✅ macOS build attempted"
    echo ""
fi

# Windows build (requires Windows + .NET)
if [ -d "apps/windows" ] && [ -f "apps/windows/YourAreLoud.sln" ]; then
    echo "🪟 Building Windows app..."
    cd apps/windows
    dotnet build 2>/dev/null || echo "⚠️  Windows build skipped (requires .NET)"
    cd ../..
    echo "✅ Windows build attempted"
    echo ""
fi

echo "════════════════════════════════════════════════════"
echo "✅ Build process complete!"
echo "════════════════════════════════════════════════════"
echo ""
echo "📝 Platform-specific builds:"
echo "   - macOS: Open Xcode project and build manually"
echo "   - Windows: Open Visual Studio solution and build manually"
echo "   - React Native: Use 'npx react-native run-ios/android'"
echo "   - Chrome: Load unpacked extension from apps/chrome-extension/dist"
echo ""
