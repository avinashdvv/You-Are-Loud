#!/bin/bash

# Setup script for Your Are Loud monorepo
# This script initializes the development environment

set -e  # Exit on error

echo "🚀 Setting up Your Are Loud monorepo..."
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version is too old. Please install Node.js 18 or later."
    exit 1
fi
echo "✅ Node.js $(node -v) detected"
echo ""

# Check pnpm
echo "📦 Checking pnpm..."
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm not found. Installing pnpm..."
    npm install -g pnpm
fi
echo "✅ pnpm $(pnpm -v) detected"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
pnpm install
echo "✅ Root dependencies installed"
echo ""

# Build shared packages
echo "🔨 Building shared packages..."
pnpm run build
echo "✅ Shared packages built"
echo ""

# macOS setup
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 macOS detected - checking macOS app setup..."
    
    if [ -d "apps/macos/your-are-loud.xcodeproj" ]; then
        echo "✅ macOS Xcode project found at apps/macos/"
        echo "   To build: cd apps/macos && open your-are-loud.xcodeproj"
    else
        echo "⚠️  macOS Xcode project not found"
    fi
    echo ""
    
    # Check for CocoaPods (if needed)
    if command -v pod &> /dev/null; then
        echo "✅ CocoaPods detected (for React Native iOS)"
    else
        echo "⚠️  CocoaPods not installed (needed for React Native iOS)"
        echo "   Install: sudo gem install cocoapods"
    fi
    echo ""
fi

# Windows setup
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "🪟 Windows detected - checking Windows app setup..."
    
    if [ -d "apps/windows" ]; then
        echo "✅ Windows app directory found at apps/windows/"
        echo "   To create project: cd apps/windows && dotnet new maui -n YourAreLoud"
    fi
    echo ""
fi

# React Native setup check
echo "📱 Checking React Native setup..."
if [ -d "apps/mobile" ] && [ -f "apps/mobile/package.json" ]; then
    echo "✅ Mobile (iOS/Android) React Native app found"
    echo "   To run: cd apps/mobile && npm install && npm run ios (or android)"
else
    echo "⚠️  Mobile React Native app not found"
    echo "   See apps/mobile/README.md"
fi
echo ""

# Chrome extension setup check
echo "🌐 Checking Chrome extension setup..."
if [ -d "apps/chrome-extension" ]; then
    echo "✅ Chrome extension directory found"
    echo "   See apps/chrome-extension/README.md to initialize"
else
    echo "⚠️  Chrome extension directory not found"
fi
echo ""

# Summary
echo "════════════════════════════════════════════════════"
echo "✅ Monorepo setup complete!"
echo "════════════════════════════════════════════════════"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Shared packages are built and ready to use"
echo "2. Review platform-specific READMEs:"
echo "   - apps/macos/README.md"
echo "   - apps/windows/README.md"
echo "   - apps/mobile/README.md (iOS & Android)"
echo "   - apps/chrome-extension/README.md"
echo ""
echo "3. Build platform apps:"
echo "   - macOS: Open apps/macos/your-are-loud.xcodeproj in Xcode"
echo "   - Windows: See apps/windows/README.md"
echo "   - Mobile: cd apps/mobile && npm install && npm run ios/android"
echo "   - Chrome: See apps/chrome-extension/README.md"
echo ""
echo "4. Read documentation:"
echo "   - docs/architecture.md - System architecture"
echo "   - MONOREPO_STRUCTURE.md - Folder structure"
echo ""
echo "Happy coding! 🎉"
