# Documentation Structure

This document explains the organization of all documentation in the Your Are Loud monorepo.

## 📁 Structure Overview

All documentation is now centralized in the `docs/` folder:

```
docs/
├── README.md                      # Documentation index and navigation
├── quick-start.md                 # 5-minute quick start guide
├── architecture.md                # Overall system architecture
├── monorepo-structure.md          # Monorepo organization and design
├── contributing.md                # Contribution guidelines
├── implementation-summary.md      # Implementation details and status
├── refactoring-summary.md         # Mobile app refactoring details
├── DOCUMENTATION_STRUCTURE.md     # This file
│
└── tech-spec/                     # Platform-specific technical specs
    ├── chrome-extension.md        # Chrome extension specification
    ├── mobile.md                  # iOS & Android (React Native)
    ├── macos.md                   # macOS native app
    └── windows.md                 # Windows native app
```

## 📖 Document Purposes

### Core Documentation

#### README.md
- **Purpose**: Documentation index and navigation hub
- **Audience**: Everyone
- **Content**: Links to all docs, organized by role and task
- **When to read**: First time exploring documentation

#### quick-start.md
- **Purpose**: Get developers up and running quickly
- **Audience**: New developers, contributors
- **Content**: 5-minute setup guide, basic commands
- **When to read**: First time setting up the project

#### architecture.md
- **Purpose**: Explain system design and architecture
- **Audience**: Developers, architects, technical leads
- **Content**: Component architecture, data flow, design decisions
- **When to read**: Understanding how the system works

#### monorepo-structure.md
- **Purpose**: Explain folder organization and design principles
- **Audience**: All developers
- **Content**: Directory structure, package organization, build system
- **When to read**: Navigating the codebase

#### contributing.md
- **Purpose**: Guide contributors through the contribution process
- **Audience**: Contributors, maintainers
- **Content**: Workflow, standards, PR process, code review
- **When to read**: Before making contributions

#### implementation-summary.md
- **Purpose**: Document current implementation status
- **Audience**: Project managers, developers
- **Content**: What's built, what's planned, current status
- **When to read**: Understanding project progress

#### refactoring-summary.md
- **Purpose**: Document the mobile app consolidation
- **Audience**: Mobile developers, maintainers
- **Content**: Why we refactored, what changed, benefits
- **When to read**: Understanding recent architectural changes

### Platform Technical Specifications

#### tech-spec/mobile.md
- **Purpose**: Complete technical specification for mobile apps
- **Audience**: Mobile developers (iOS & Android)
- **Content**: Architecture, React Native setup, shared code, native modules
- **When to read**: Developing mobile features

#### tech-spec/chrome-extension.md
- **Purpose**: Complete technical specification for Chrome extension
- **Audience**: Web developers, Chrome extension developers
- **Content**: Manifest V3, service workers, audio processing in browser
- **When to read**: Developing Chrome extension features

#### tech-spec/macos.md
- **Purpose**: Technical specification for macOS app
- **Audience**: macOS/Swift developers
- **Content**: SwiftUI, AVFoundation, menu bar integration
- **When to read**: Developing macOS features

#### tech-spec/windows.md
- **Purpose**: Technical specification for Windows app
- **Audience**: Windows/.NET developers
- **Content**: .NET MAUI, MVVM, Windows audio APIs
- **When to read**: Developing Windows features

## 🎯 Navigation Patterns

### By Experience Level

**👶 New to Project**
1. Start: `README.md` (root)
2. Then: `docs/README.md` (documentation index)
3. Then: `docs/quick-start.md`
4. Then: `docs/architecture.md`
5. Then: Your platform's tech spec

**👨‍💻 Experienced Developer**
- Jump directly to: `docs/tech-spec/[platform].md`
- Reference: `docs/architecture.md` as needed

**🔧 Maintainer/Reviewer**
- Review: `docs/contributing.md`
- Reference: All tech specs
- Update: Documentation as needed

### By Task

**Setting Up**
→ `docs/quick-start.md`

**Understanding Architecture**
→ `docs/architecture.md`

**Contributing Code**
→ `docs/contributing.md`

**Developing Feature**
→ `docs/tech-spec/[platform].md`

**Troubleshooting**
→ `docs/tech-spec/[platform].md` → "Troubleshooting" section

## 🔄 Documentation Maintenance

### When to Update

Update documentation when you:

1. **Add/remove features** → Update relevant tech spec
2. **Change architecture** → Update `architecture.md`
3. **Modify structure** → Update `monorepo-structure.md`
4. **Change contribution process** → Update `contributing.md`
5. **Refactor major components** → Create summary document

### How to Update

1. Identify affected documents
2. Make changes in `docs/` folder
3. Update "Last Updated" dates (if present)
4. Commit with code changes
5. Update `docs/README.md` if adding new docs

### Documentation Review Checklist

- [ ] Is the information accurate?
- [ ] Are all links working?
- [ ] Is the structure clear?
- [ ] Are code examples correct?
- [ ] Is it easy to find information?
- [ ] Are diagrams up to date?
- [ ] Is the language clear and concise?

## 📏 Documentation Standards

### File Naming

- Use lowercase with hyphens: `quick-start.md`
- Be descriptive: `mobile.md` not `m.md`
- Use `.md` extension for Markdown

### Document Structure

Every document should have:

1. **Title** (H1) - Clear, descriptive
2. **Overview** - What this document covers
3. **Table of Contents** (for long docs) - Easy navigation
4. **Sections** (H2, H3) - Logical organization
5. **Examples** - Code samples, diagrams
6. **References** - Links to related docs

### Writing Style

- **Clear**: Use simple language
- **Concise**: No unnecessary words
- **Consistent**: Same terminology throughout
- **Complete**: Cover all aspects
- **Current**: Keep up to date

### Code Examples

```markdown
# Good example with language tag and context

```typescript
// Clear, commented code example
function calculateVolume(samples: Float32Array): number {
  const rms = calculateRMS(samples);
  return normalizeVolume(rms);
}
```
```

### Diagrams

Use ASCII art for diagrams:

```
User → Microphone → Audio Processing → Threshold Check → Notification
```

## 🔗 Cross-Referencing

### Internal Links

Use relative paths:

```markdown
See [Architecture Overview](./architecture.md) for details.
See [Mobile Tech Spec](./tech-spec/mobile.md) for mobile development.
```

### External Links

Use descriptive text:

```markdown
Learn more about [React Native](https://reactnative.dev/).
```

## 📊 Documentation Metrics

### Coverage

- ✅ Core documentation: 100%
- ✅ Mobile platform: 100%
- ✅ Chrome extension: 100%
- 🚧 macOS platform: 60%
- 🚧 Windows platform: 60%

### Quality Indicators

- All documents have clear structure
- All code examples are tested
- All links are working
- All diagrams are current
- All documents are up to date

## 🎓 Best Practices

### For Writers

1. **Write for your audience** - Know who will read it
2. **Start with why** - Explain purpose before details
3. **Use examples** - Show, don't just tell
4. **Keep it current** - Update with code changes
5. **Get feedback** - Ask others to review

### For Readers

1. **Start with README** - Get oriented first
2. **Follow learning paths** - Don't skip ahead
3. **Try examples** - Hands-on learning works best
4. **Ask questions** - Open issues for unclear docs
5. **Contribute back** - Fix errors you find

### For Maintainers

1. **Review regularly** - Weekly during active development
2. **Update proactively** - Don't let docs get stale
3. **Enforce standards** - Require doc updates in PRs
4. **Measure quality** - Track coverage and accuracy
5. **Celebrate good docs** - Recognize contributors

## 🚀 Future Improvements

### Planned

- [ ] Add more diagrams to architecture.md
- [ ] Complete macOS tech spec
- [ ] Complete Windows tech spec
- [ ] Add video tutorials
- [ ] Create API reference docs

### Ideas

- Interactive documentation website
- Automated documentation testing
- Documentation coverage reports
- Contributor documentation guide
- Documentation templates

## 📝 Contributing to Documentation

See [Contributing Guide](./contributing.md) for:

- How to propose documentation changes
- Documentation review process
- Style guide and standards
- Tools and resources

## 📬 Feedback

Found an issue with documentation structure?

1. Open an issue on GitHub
2. Tag with `documentation` label
3. Describe the problem
4. Suggest improvement

---

**Remember**: Well-organized documentation makes the project accessible to everyone. Keep it structured! 📚✨

**Last Updated**: January 2026
