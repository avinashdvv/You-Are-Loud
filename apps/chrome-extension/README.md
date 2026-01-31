# Your Are Loud - Chrome Extension

> **📖 For complete documentation, see [Chrome Extension Technical Specification](../../docs/tech-spec/chrome-extension.md)**

Browser extension for voice monitoring during video calls in Chrome.

## Quick Start

```bash
# Install dependencies
npm install

# Build extension
npm run build

# Load in Chrome
# 1. Open chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the dist/ folder
```

## Prerequisites

- Node.js >= 18
- Chrome browser
- TypeScript knowledge

## Project Structure

```
apps/chrome-extension/
├── src/
│   ├── background/       # Service worker
│   ├── content/          # Content scripts
│   ├── popup/            # Extension popup UI
│   ├── offscreen/        # Offscreen document (audio processing)
│   └── services/         # Shared services
├── public/               # Static assets
└── manifest.json         # Extension manifest (V3)
```

## Key Features

- ✅ Manifest V3 (latest standard)
- ✅ Real-time voice monitoring in browser
- ✅ Works with all video call platforms (Zoom, Meet, Teams, etc.)
- ✅ Browser notifications
- ✅ Adjustable threshold settings

## Development

```bash
# Start development build with watch
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Run tests
npm test
```

## Technology Stack

- **Manifest V3** - Latest Chrome extension API
- **TypeScript** - Type safety
- **React** - UI components
- **Web Audio API** - Audio processing
- **Webpack** - Build tool

## Documentation

For comprehensive documentation including:
- Architecture and message protocol
- Audio processing pipeline
- API documentation
- Development guide
- Testing strategy
- Publishing to Chrome Web Store

**👉 See [Chrome Extension Technical Specification](../../docs/tech-spec/chrome-extension.md)**

## Shared Packages

Uses monorepo shared packages:
- `@your-are-loud/core` - Core logic
- `@your-are-loud/audio-processing` - Audio algorithms
- `@your-are-loud/notifications` - Notification management

## License

MIT - See root LICENSE file
