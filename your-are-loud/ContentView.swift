import SwiftUI

struct ContentView: View {
    @EnvironmentObject var audioMonitor: AudioMonitor
    
    var body: some View {
        VStack(spacing: 20) {
            Text("🎙️ Voice Monitor")
                .font(.headline)
            
            // Volume Meter
            VStack(alignment: .leading, spacing: 5) {
                Text("Current Volume")
                    .font(.caption)
                
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 5)
                        .fill(Color.gray.opacity(0.3))
                        .frame(height: 20)
                    
                    RoundedRectangle(cornerRadius: 5)
                        .fill(volumeColor)
                        .frame(width: CGFloat(audioMonitor.currentVolume) * 200, height: 20)
                        .animation(.easeInOut(duration: 0.1), value: audioMonitor.currentVolume)
                }
                .frame(width: 200)
            }
            
            // Threshold Slider
            VStack(alignment: .leading, spacing: 5) {
                Text("Warning Threshold: \(String(format: "%.2f", audioMonitor.volumeThreshold))")
                    .font(.caption)
                
                Slider(value: $audioMonitor.volumeThreshold, in: 0.3...1.0)
                    .frame(width: 200)
            }
            
            // Warning Count
            HStack {
                Text("Warnings: \(audioMonitor.warningCount)")
                    .font(.caption)
                    .foregroundColor(.red)
                
                if audioMonitor.warningCount > 0 {
                    Button("Reset") {
                        audioMonitor.warningCount = 0
                    }
                    .buttonStyle(.plain)
                    .font(.caption)
                }
            }
            
            Divider()
            
            // Control Buttons
            VStack(spacing: 10) {
                if audioMonitor.isMonitoring {
                    Button(action: {
                        audioMonitor.stopMonitoring()
                    }) {
                        HStack {
                            Image(systemName: "stop.circle.fill")
                            Text("Stop Monitoring")
                        }
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.red)
                    .controlSize(.large)
                } else {
                    Button(action: {
                        audioMonitor.startMonitoring()
                    }) {
                        HStack {
                            Image(systemName: "play.circle.fill")
                            Text("Start Monitoring")
                        }
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.green)
                    .controlSize(.large)
                }
                
                Button("Quit") {
                    NSApplication.shared.terminate(nil)
                }
                .buttonStyle(.bordered)
            }
        }
        .padding(20)
        .frame(width: 280)
    }
    
    var volumeColor: Color {
        if audioMonitor.currentVolume > audioMonitor.volumeThreshold {
            return .red
        } else if audioMonitor.currentVolume > audioMonitor.volumeThreshold * 0.8 {
            return .yellow
        } else {
            return .green
        }
    }
}

#Preview {
    ContentView()
        .environmentObject(AudioMonitor())
}
