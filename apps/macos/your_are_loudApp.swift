import SwiftUI

@main
struct your_are_loudApp: App {
    @StateObject private var audioMonitor = AudioMonitor()
    
    var body: some Scene {
        MenuBarExtra("Voice Monitor", systemImage: "waveform") {
            ContentView()
                .environmentObject(audioMonitor)
        }
        .menuBarExtraStyle(.window)
    }
}
