using System;
using System.Linq;
using NAudio.Wave;

namespace YourAreLoud.Services
{
    public class AudioMonitor : IDisposable
    {
        private WaveInEvent? waveIn;
        private float currentVolume;
        private float volumeThreshold = 0.7f;
        private DateTime? lastWarningTime;
        private readonly TimeSpan warningCooldown = TimeSpan.FromSeconds(3);

        public event EventHandler<float>? VolumeChanged;
        public event EventHandler? WarningTriggered;

        public bool IsMonitoring { get; private set; }

        public void StartMonitoring()
        {
            if (IsMonitoring) return;

            waveIn = new WaveInEvent
            {
                WaveFormat = new WaveFormat(44100, 1),
                BufferMilliseconds = 50
            };

            waveIn.DataAvailable += OnDataAvailable;
            waveIn.StartRecording();
            IsMonitoring = true;
        }

        public void StopMonitoring()
        {
            if (!IsMonitoring) return;

            waveIn?.StopRecording();
            waveIn?.Dispose();
            waveIn = null;
            IsMonitoring = false;
            currentVolume = 0;
            VolumeChanged?.Invoke(this, 0);
        }

        public void SetThreshold(float threshold)
        {
            volumeThreshold = Math.Max(0.3f, Math.Min(1.0f, threshold));
        }

        private void OnDataAvailable(object? sender, WaveInEventArgs e)
        {
            float rms = CalculateRMS(e.Buffer, e.BytesRecorded);
            float normalized = NormalizeVolume(rms);

            currentVolume = normalized;
            VolumeChanged?.Invoke(this, normalized);

            if (normalized > volumeThreshold)
            {
                CheckAndShowWarning();
            }
        }

        private float CalculateRMS(byte[] buffer, int bytesRecorded)
        {
            float sum = 0;
            int sampleCount = bytesRecorded / 2;

            for (int i = 0; i < bytesRecorded; i += 2)
            {
                short sample = BitConverter.ToInt16(buffer, i);
                float sample32 = sample / 32768f;
                sum += sample32 * sample32;
            }

            return (float)Math.Sqrt(sum / sampleCount);
        }

        private float NormalizeVolume(float rms)
        {
            if (rms <= 0) return 0;

            float avgPower = 20 * (float)Math.Log10(rms);
            float normalized = (avgPower + 50) / 50;

            return Math.Max(0, Math.Min(1, normalized));
        }

        private void CheckAndShowWarning()
        {
            DateTime now = DateTime.Now;

            if (lastWarningTime.HasValue &&
                (now - lastWarningTime.Value) < warningCooldown)
            {
                return;
            }

            lastWarningTime = now;
            WarningTriggered?.Invoke(this, EventArgs.Empty);
        }

        public void Dispose()
        {
            StopMonitoring();
        }
    }
}
