# Documentation Index

Welcome to the **Your Are Loud** project documentation.

## 📚 Available Documentation

### Core Documentation

| Document | Description | Audience |
|----------|-------------|----------|
| [Architecture Overview](./architecture.md) | Overall monorepo architecture | All team members |
| [Contributing Guide](./contributing.md) | How to contribute to the project | Contributors |

### App Technical Specifications

| App | Tech Spec | Status | Description |
|-----|-----------|--------|-------------|
| **Chrome Extension** | [chrome-extension.md](./tech-spec/chrome-extension.md) | ✅ Complete | Manifest V3 extension with offscreen audio processing |
| **Android** | [android.md](./tech-spec/android.md) | 🚧 Incomplete | React Native app for Android devices |
| **iOS** | [ios.md](./tech-spec/ios.md) | 🚧 Incomplete | React Native app for iOS devices |
| **macOS** | [macos.md](./tech-spec/macos.md) | 🚧 Incomplete | Native Swift + SwiftUI app |
| **Windows** | [windows.md](./tech-spec/windows.md) | 🚧 Incomplete | WPF .NET app |

### Quick Links

- **New to the project?** Start with [Architecture Overview](./architecture.md)
- **Working on Chrome extension?** Read [Chrome Extension Tech Spec](./tech-spec/chrome-extension.md)
- **Want to contribute?** Check [Contributing Guide](./contributing.md)
- **Need quick setup?** See [Quick Start Guide](../QUICK_START.md) in root

## 📖 What's in the Tech Spec

The Chrome Extension Tech Spec covers:

1. **Architecture** - Component structure and responsibilities
2. **Message Protocol** - All message types and flows
3. **API Documentation** - Function signatures and usage
4. **Audio Processing** - How audio monitoring works
5. **Development Guide** - Setup, build, and debug
6. **Testing Strategy** - What and how to test
7. **Deployment** - Publishing to Chrome Web Store
8. **Troubleshooting** - Common issues and solutions

## 🎯 Documentation Standards

### When to Update Documentation

**CRITICAL:** Documentation must be updated whenever you make:

- Architecture changes (new components, modified structure)
- Message protocol changes (new/modified message types)
- API changes (new functions, changed signatures)
- Build process changes
- New features or significant functionality changes

### How to Update

1. Edit the relevant `.md` file in `docs/`
2. Update "Last Updated" date
3. Add entry to "Change Log" section (if applicable)
4. Commit documentation with code changes

Example commit:
```bash
git add docs/tech-spec/chrome-extension.md src/
git commit -m "feat(chrome-ext): add new feature

- Implement feature X
- Update documentation with new API

Docs updated: tech-spec/chrome-extension.md section Y"
```

## 🔍 Finding Information

### By Role

**Chrome Extension Developer:**
- [Chrome Extension Tech Spec](./tech-spec/chrome-extension.md) → All sections
- Focus: Popup, Background Worker, Offscreen Document, Content Script

**Android Developer:**
- [Android Tech Spec](./tech-spec/android.md) → (To be completed)
- Focus: React Native, Native modules, AudioRecord API

**iOS Developer:**
- [iOS Tech Spec](./tech-spec/ios.md) → (To be completed)
- Focus: React Native, Native modules, AVFoundation

**macOS Developer:**
- [macOS Tech Spec](./tech-spec/macos.md) → (To be completed)
- Focus: SwiftUI, AVAudioEngine, Menu bar integration

**Windows Developer:**
- [Windows Tech Spec](./tech-spec/windows.md) → (To be completed)
- Focus: WPF, MVVM, NAudio/Windows audio APIs

**Audio Processing Engineer:**
- Any app's tech spec → "Audio Processing" section
- Shared packages documentation in `packages/audio-processing/`

**QA/Tester:**
- Any app's tech spec → "Testing Strategy" section
- Any app's tech spec → "Troubleshooting" section

**DevOps/Release Manager:**
- Any app's tech spec → "Deployment" section
- Any app's tech spec → "Build Configuration" section

### By Task

**"I need to add a new message type"**
→ Chrome Extension Tech Spec → "Message Protocol"

**"I need to understand how audio processing works"**
→ Chrome Extension Tech Spec → "Audio Processing Pipeline"

**"Extension not working on user's machine"**
→ Chrome Extension Tech Spec → "Troubleshooting"

**"How do I test the extension?"**
→ Chrome Extension Tech Spec → "Testing Strategy"

**"What Chrome APIs are we using?"**
→ Chrome Extension Tech Spec → "API Documentation" → "Appendix"

## 📝 Document Maintenance

### Regular Updates

Documentation should be reviewed and updated:

- **Weekly:** Check for outdated information during development
- **Before releases:** Ensure all features documented
- **After major changes:** Update architecture diagrams
- **Quarterly:** General review and cleanup

### Version Control

- Documentation lives in `docs/` folder
- Versioned with code (same git repo)
- Historical versions available via git history
- Breaking changes noted in CHANGELOG

## 🚀 Getting Started

### For New Developers

1. Read [Architecture Overview](./architecture.md)
2. Read [Quick Start Guide](../QUICK_START.md)
3. Pick a component to work on
4. Read that component's spec in [Chrome Extension Tech Spec](./tech-spec/chrome-extension.md)
5. Check [Contributing Guide](./contributing.md)
6. Set up development environment
7. Start coding!

### For Contributors

1. Read [Contributing Guide](./contributing.md)
2. Fork the repository
3. Read relevant tech specs
4. Make your changes
5. **Update documentation if needed**
6. Submit pull request

## 🛠️ Documentation Tools

### Viewing Markdown

- **VS Code:** Built-in preview (`Cmd+Shift+V` or `Ctrl+Shift+V`)
- **GitHub:** Rendered automatically
- **Cursor:** Built-in preview

### Markdown Linting

We use standard Markdown formatting:

- ATX-style headers (`#` not underlines)
- Fenced code blocks (```)
- Tables for structured data
- Links in reference style when repeated

### Diagrams

Text-based diagrams using ASCII art:
- Easy to maintain
- Version control friendly
- No external tools needed
- Render correctly in any text viewer

## 📬 Feedback

Found an error in documentation? Have a suggestion?

1. Open an issue on GitHub
2. Tag with `documentation` label
3. Specify which document and section
4. Suggest improvement

## 📄 License

Documentation is MIT licensed, same as the project code.

---

**Remember:** Good documentation makes the project accessible to everyone. Keep it updated! 📚✨
