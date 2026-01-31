# Your Are Loud - Windows App

> **📖 For complete documentation, see [Windows Technical Specification](../../docs/tech-spec/windows.md)**

Native Windows application with system tray integration that monitors your voice volume during calls.

## Quick Start

```bash
# Restore dependencies
dotnet restore

# Build
dotnet build

# Run
dotnet run
```

## Prerequisites

- Windows 10 or later
- .NET 8.0 SDK
- Visual Studio 2022 (recommended)

## Project Structure

```
apps/windows/
├── YourAreLoud.csproj        # Project file
├── Program.cs                # Entry point
├── App.xaml                  # Application definition
├── MainWindow.xaml           # Main window UI
├── ViewModels/               # MVVM view models
└── Services/                 # Audio & notification services
```

## Key Features

- ✅ **Native Windows app** - C# + .NET MAUI
- ✅ System tray integration
- ✅ Real-time voice monitoring
- ✅ Visual volume meter
- ✅ Windows toast notifications
- ✅ MVVM architecture

## Development

```bash
# Open in Visual Studio
start YourAreLoud.sln

# Or use CLI
dotnet watch run    # Hot reload during development
dotnet test         # Run tests
```

## Technology Stack

- **C# 12** - Programming language
- **.NET MAUI** - UI framework
- **NAudio** - Audio processing
- **CommunityToolkit.Mvvm** - MVVM helpers

## Documentation

For comprehensive documentation including:
- Architecture details
- MVVM pattern implementation
- Audio processing with NAudio
- System tray integration
- Build & deployment

**👉 See [Windows Technical Specification](../../docs/tech-spec/windows.md)**

## Status

📝 **Skeleton** - Ready for implementation with comprehensive guide

## License

MIT - See root LICENSE file
