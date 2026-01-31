import AVFoundation
import Combine
import UserNotifications
import AppKit

class AudioMonitor: ObservableObject {
    @Published var currentVolume: Float = 0.0
    @Published var isMonitoring: Bool = false
    @Published var volumeThreshold: Float = 0.7 // Adjust this (0.0 - 1.0)
    @Published var warningCount: Int = 0
    
    private var audioEngine: AVAudioEngine?
    private var inputNode: AVAudioInputNode?
    private var lastWarningTime: Date?
    private let warningCooldown: TimeInterval = 3.0 // seconds between warnings
    
    init() {
        // Permissions will be requested when starting monitoring
    }
    
    func requestMicrophonePermission() {
        AVCaptureDevice.requestAccess(for: .audio) { granted in
            if granted {
                print("Microphone access granted")
            } else {
                print("Microphone access denied")
            }
        }
    }
    
    func requestNotificationPermission() {
        // Delay to ensure app is fully initialized
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
                if granted {
                    print("Notification permission granted")
                } else if let error = error {
                    print("Notification permission error: \(error.localizedDescription)")
                }
            }
        }
    }
    
    func startMonitoring() {
        // Request permissions if not already done
        requestMicrophonePermission()
        requestNotificationPermission()
        
        audioEngine = AVAudioEngine()
        guard let audioEngine = audioEngine else { return }
        
        inputNode = audioEngine.inputNode
        guard let inputNode = inputNode else { return }
        
        let recordingFormat = inputNode.outputFormat(forBus: 0)
        
        inputNode.installTap(onBus: 0, bufferSize: 1024, format: recordingFormat) { [weak self] buffer, time in
            self?.processAudioBuffer(buffer)
        }
        
        do {
            try audioEngine.start()
            DispatchQueue.main.async {
                self.isMonitoring = true
            }
        } catch {
            print("Could not start audio engine: \(error.localizedDescription)")
        }
    }
    
    func stopMonitoring() {
        audioEngine?.stop()
        inputNode?.removeTap(onBus: 0)
        DispatchQueue.main.async {
            self.isMonitoring = false
            self.currentVolume = 0.0
        }
    }
    
    private func processAudioBuffer(_ buffer: AVAudioPCMBuffer) {
        guard let channelData = buffer.floatChannelData else { return }
        
        let channelDataValue = channelData.pointee
        let channelDataValueArray = stride(from: 0, to: Int(buffer.frameLength), by: buffer.stride)
            .map { channelDataValue[$0] }
        
        let rms = sqrt(channelDataValueArray.map { $0 * $0 }.reduce(0, +) / Float(buffer.frameLength))
        let avgPower = 20 * log10(rms)
        let normalizedVolume = max(0, min(1, (avgPower + 50) / 50))
        
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            self.currentVolume = normalizedVolume
            
            if normalizedVolume > self.volumeThreshold {
                self.checkAndShowWarning()
            }
        }
    }
    
    private func checkAndShowWarning() {
        let now = Date()
        
        if let lastWarning = lastWarningTime,
           now.timeIntervalSince(lastWarning) < warningCooldown {
            return // Too soon since last warning
        }
        
        lastWarningTime = now
        warningCount += 1
        showWarning()
    }
    
    private func showWarning() {
        // Visual flash effect with system beep
        NSSound.beep()
        
        // Send notification (with error handling)
        let content = UNMutableNotificationContent()
        content.title = "🔊 You're Too Loud!"
        content.body = "Please lower your voice during the call"
        content.sound = .default
        
        let request = UNNotificationRequest(
            identifier: UUID().uuidString,
            content: content,
            trigger: nil
        )
        
        UNUserNotificationCenter.current().add(request) { error in
            if let error = error {
                print("Failed to send notification: \(error.localizedDescription)")
            }
        }
    }
}
