# Your Are Loud - Windows App

Native Windows desktop application for voice monitoring.

## Overview

The Windows app provides the same voice monitoring functionality as the macOS version, using native Windows APIs and technologies.

## Technology Stack Options

### Option 1: .NET MAUI (Recommended)
- **Language**: C# 11+
- **Framework**: .NET MAUI (Multi-platform App UI)
- **Audio**: NAudio library
- **Notifications**: Windows.UI.Notifications
- **Deployment**: Self-contained executable or MSIX package

**Pros**:
- Cross-platform (Windows 10/11, potential Linux support)
- Modern C# development experience
- Rich ecosystem of NuGet packages
- Hot reload during development
- Easier to maintain

### Option 2: WinUI 3 + C++
- **Language**: C++20
- **Framework**: WinUI 3 (Windows App SDK)
- **Audio**: Windows.Media.Audio APIs
- **Notifications**: WinRT notification APIs
- **Deployment**: MSIX package

**Pros**:
- Maximum performance
- Smallest binary size
- Direct Windows API access
- Windows 10/11 only (more focused)

## Recommended: .NET MAUI Implementation

This skeleton is designed for .NET MAUI.

## Prerequisites

- Windows 10 version 1809 or later (for development)
- Windows 11 recommended (for running)
- Visual Studio 2022 17.8+
- .NET 8.0 SDK or later
- Windows App SDK

## Quick Start

```bash
cd apps/windows
dotnet restore
dotnet build
dotnet run
```

## Project Structure

See the `src/` directory for the actual implementation files.

## License

MIT License - See root LICENSE file
