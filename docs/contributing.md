# Contributing Guide

Thank you for considering contributing to **Your Are Loud**! This document provides guidelines for contributing to this monorepo.

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Project Structure](#project-structure)
5. [Coding Standards](#coding-standards)
6. [Testing Guidelines](#testing-guidelines)
7. [Commit Messages](#commit-messages)
8. [Pull Request Process](#pull-request-process)
9. [Adding New Platforms](#adding-new-platforms)
10. [Documentation](#documentation)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Assume good intentions

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
git clone https://github.com/YOUR_USERNAME/your-are-loud.git
cd your-are-loud
```

### 2. Set Up Development Environment

```bash
# Run setup script
./scripts/setup.sh

# Or manually:
pnpm install
pnpm run build
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

## 🔄 Development Workflow

### Working on Shared Packages

```bash
# Navigate to package
cd packages/core  # or audio-processing, notifications

# Make changes
# ...

# Build
pnpm run build

# Test
pnpm run test

# Lint
pnpm run lint
```

### Working on Platform Apps

**macOS:**
```bash
cd apps/macos
open your-are-loud.xcodeproj
# Make changes in Xcode
# Press Cmd+R to test
```

**Windows:**
```bash
cd apps/windows
# Open .sln in Visual Studio
# Make changes
# Press F5 to build and run
```

**React Native:**
```bash
cd apps/ios  # or apps/android
# Make changes in TypeScript
npx react-native start  # In one terminal
npx react-native run-ios  # In another terminal
```

**Chrome Extension:**
```bash
cd apps/chrome-extension
# Make changes in TypeScript
npm run build
# Load unpacked extension in Chrome
```

## 📁 Project Structure

### Monorepo Organization

```
your-are-loud/
├── apps/          # Platform-specific applications
├── packages/      # Shared TypeScript packages
├── docs/          # Documentation
└── scripts/       # Build and utility scripts
```

### Adding Files

- **Shared code**: Place in `packages/`
- **Platform-specific**: Place in `apps/[platform]/`
- **Documentation**: Place in `docs/`
- **Scripts**: Place in `scripts/`

## 📝 Coding Standards

### TypeScript (Shared Packages)

```typescript
// Use explicit types
export function calculateRMS(samples: Float32Array): number {
  // Implementation
}

// Use const for constants
export const DEFAULT_THRESHOLD = 0.7;

// Use interfaces for contracts
export interface AudioProcessor {
  process(buffer: AudioBuffer): VolumeInfo;
}

// Document public APIs
/**
 * Calculate RMS value from audio samples
 * @param samples Audio samples as Float32Array
 * @returns RMS value
 */
export function calculateRMS(samples: Float32Array): number {
  // ...
}
```

**Rules:**
- Use TypeScript strict mode
- Add JSDoc comments to public APIs
- Use meaningful variable names
- Keep functions small and focused
- Prefer pure functions when possible

### Swift (macOS)

```swift
// Use descriptive names
func calculateRMS(from samples: [Float]) -> Float {
    // Implementation
}

// Use access control
private func processAudioBuffer(_ buffer: AVAudioPCMBuffer) {
    // Implementation
}

// Document public APIs
/// Calculates RMS value from audio samples
/// - Parameter samples: Array of audio samples
/// - Returns: RMS value as Float
func calculateRMS(from samples: [Float]) -> Float {
    // ...
}
```

**Rules:**
- Follow Swift API Design Guidelines
- Use SwiftLint (if configured)
- Prefer value types (struct) over reference types (class)
- Use optionals appropriately

### C# (Windows)

```csharp
// Use PascalCase for public members
public class AudioMonitor
{
    // Use camelCase for private fields
    private float currentVolume;
    
    // Document public APIs
    /// <summary>
    /// Calculates RMS value from audio samples
    /// </summary>
    /// <param name="samples">Audio samples as float array</param>
    /// <returns>RMS value</returns>
    public float CalculateRMS(float[] samples)
    {
        // Implementation
    }
}
```

**Rules:**
- Follow C# coding conventions
- Use async/await for asynchronous operations
- Use LINQ where appropriate
- Add XML documentation comments

### Formatting

All TypeScript/JavaScript code is automatically formatted with Prettier:

```bash
# Format all code
pnpm run format

# Lint and fix
pnpm run lint:fix
```

## 🧪 Testing Guidelines

### Shared Packages

Every shared package should have tests:

```typescript
// packages/audio-processing/src/rmsCalculator.test.ts
import { calculateRMS } from './rmsCalculator';

describe('calculateRMS', () => {
  it('should calculate RMS correctly', () => {
    const samples = new Float32Array([0.1, 0.2, 0.3]);
    const rms = calculateRMS(samples);
    expect(rms).toBeCloseTo(0.214, 3);
  });
  
  it('should handle empty array', () => {
    const samples = new Float32Array([]);
    const rms = calculateRMS(samples);
    expect(rms).toBe(0);
  });
});
```

**Test Requirements:**
- Test happy paths
- Test edge cases (empty, null, boundary values)
- Test error conditions
- Aim for >80% code coverage

### Running Tests

```bash
# All tests
pnpm run test:all

# Specific package
cd packages/core && pnpm test

# With coverage
pnpm test -- --coverage
```

## 📝 Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

### Examples

```bash
# Feature
git commit -m "feat(core): add threshold validation"

# Bug fix
git commit -m "fix(macos): resolve audio buffer memory leak"

# Documentation
git commit -m "docs: update contributing guide"

# Multiple scopes
git commit -m "feat(ios,android): add background monitoring"

# With body
git commit -m "fix(audio-processing): improve RMS calculation

The previous implementation had floating point precision issues
when processing very quiet audio. This commit adds epsilon handling."

# Breaking change
git commit -m "feat(core)!: change threshold range to 0.0-1.0

BREAKING CHANGE: Threshold values are now 0.0-1.0 instead of 0-100.
Update all platform apps to use normalized values."
```

### Scope Examples

- `core`, `audio-processing`, `notifications` (packages)
- `macos`, `windows`, `ios`, `android`, `chrome` (apps)
- `docs`, `scripts`, `ci` (infrastructure)

## 🔀 Pull Request Process

### 1. Before Submitting

- [ ] Code compiles without errors
- [ ] All tests pass (`pnpm run test:all`)
- [ ] Linter passes (`pnpm run lint`)
- [ ] Code is formatted (`pnpm run format`)
- [ ] Documentation updated (if needed)
- [ ] Commit messages follow conventions

### 2. PR Description

Use this template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Platforms Affected
- [ ] macOS
- [ ] Windows
- [ ] iOS
- [ ] Android
- [ ] Chrome Extension
- [ ] Shared Packages

## Testing
How has this been tested?

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Follows coding standards
- [ ] No console.log() statements left
- [ ] CHANGELOG updated (for significant changes)
```

### 3. Review Process

- Maintainers will review your PR
- Address feedback promptly
- Keep PR scope focused (one feature/fix per PR)
- Be responsive to comments

### 4. Merging

- PRs require at least one approval
- All checks must pass
- Maintainer will merge when ready

## 🆕 Adding New Platforms

### Process

1. **Propose the platform**
   - Open an issue describing the platform
   - Discuss approach with maintainers

2. **Create directory structure**
   ```bash
   mkdir -p apps/new-platform
   cd apps/new-platform
   ```

3. **Add README.md**
   - Technology stack
   - Prerequisites
   - Setup instructions
   - Build instructions
   - Integration with shared packages

4. **Implement core features**
   - Audio monitoring
   - Volume threshold
   - Notifications
   - Settings persistence

5. **Test thoroughly**
   - Manual testing
   - Platform-specific tests

6. **Update documentation**
   - Update root README.md
   - Update MONOREPO_STRUCTURE.md
   - Add platform to comparison tables

### Example: Adding Linux App

```bash
# Create structure
mkdir -p apps/linux
cd apps/linux

# Create README
touch README.md

# Implement (example: Electron + TypeScript)
npm init -y
npm install electron react
# ... implementation

# Document
# Update root README.md with Linux entry
```

## 📚 Documentation

### What to Document

- **API Changes**: Document all public API changes
- **New Features**: Add usage examples
- **Breaking Changes**: Document migration path
- **Platform Guides**: Keep platform READMEs updated
- **Architecture**: Update architecture.md for structural changes

### Documentation Standards

- Use clear, concise language
- Provide code examples
- Include screenshots where helpful
- Keep table of contents updated
- Link related documents

### Where to Document

- **API Documentation**: JSDoc in code
- **User Guides**: Platform-specific READMEs
- **Architecture**: `docs/architecture.md`
- **Contributing**: This file
- **Changelog**: `CHANGELOG.md` (if maintained)

## 🐛 Reporting Bugs

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Platform:**
- OS: [e.g., macOS 14.0]
- App version: [e.g., 1.0.0]
- Device: [e.g., MacBook Pro M1]

**Additional context**
Any other relevant information.
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Which platforms would benefit?**
- [ ] macOS
- [ ] Windows
- [ ] iOS
- [ ] Android
- [ ] Chrome Extension

**Additional context**
Any other relevant information.
```

## 🎯 Best Practices

### Code Review

When reviewing PRs:
- Be constructive and respectful
- Explain the "why" behind suggestions
- Appreciate good work
- Test the changes locally if significant

### Communication

- Use issues for bugs and features
- Use discussions for questions
- Tag relevant people with @mention
- Be patient and respectful

### Shared Package Changes

When modifying shared packages:
1. Consider backward compatibility
2. Update version numbers appropriately
3. Test with all platform apps
4. Document breaking changes clearly

### Platform-Specific Changes

When modifying platform apps:
1. Keep algorithms in sync with shared packages
2. Test thoroughly on target platform
3. Follow platform-specific conventions
4. Update platform README if needed

## 📞 Getting Help

- **Questions**: Open a GitHub Discussion
- **Bugs**: Open a GitHub Issue
- **Chat**: (If available) Join our Discord/Slack

## 🙏 Thank You!

Every contribution, no matter how small, is valuable. Thank you for helping make Your Are Loud better!

---

**Happy Contributing! 🎉**
