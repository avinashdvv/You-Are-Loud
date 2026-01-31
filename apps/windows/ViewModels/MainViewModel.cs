using System;
using System.Windows;
using System.Windows.Input;
using System.Windows.Media;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using YourAreLoud.Services;

namespace YourAreLoud.ViewModels
{
    public partial class MainViewModel : ObservableObject
    {
        private readonly AudioMonitor audioMonitor;
        private readonly NotificationService notificationService;

        [ObservableProperty]
        private float currentVolume;

        [ObservableProperty]
        private float volumeThreshold = 0.7f;

        [ObservableProperty]
        private bool isMonitoring;

        [ObservableProperty]
        private int warningCount;

        [ObservableProperty]
        private Brush volumeColor = Brushes.Green;

        [ObservableProperty]
        private double volumeBarWidth;

        public bool HasWarnings => warningCount > 0;

        public MainViewModel()
        {
            audioMonitor = new AudioMonitor();
            notificationService = new NotificationService();

            audioMonitor.VolumeChanged += OnVolumeChanged;
            audioMonitor.WarningTriggered += OnWarningTriggered;
        }

        [RelayCommand]
        private void ToggleMonitoring()
        {
            if (isMonitoring)
            {
                StopMonitoring();
            }
            else
            {
                StartMonitoring();
            }
        }

        private void StartMonitoring()
        {
            try
            {
                audioMonitor.SetThreshold(volumeThreshold);
                audioMonitor.StartMonitoring();
                IsMonitoring = true;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Failed to start monitoring: {ex.Message}", 
                              "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void StopMonitoring()
        {
            audioMonitor.StopMonitoring();
            IsMonitoring = false;
            CurrentVolume = 0;
            VolumeBarWidth = 0;
        }

        [RelayCommand]
        private void ResetCount()
        {
            WarningCount = 0;
            OnPropertyChanged(nameof(HasWarnings));
        }

        [RelayCommand]
        private void Quit()
        {
            Application.Current.Shutdown();
        }

        partial void OnVolumeThresholdChanged(float value)
        {
            if (isMonitoring)
            {
                audioMonitor.SetThreshold(value);
            }
        }

        private void OnVolumeChanged(object? sender, float volume)
        {
            Application.Current.Dispatcher.Invoke(() =>
            {
                CurrentVolume = volume;
                VolumeBarWidth = volume * 240; // Width of volume bar container

                // Update color based on threshold
                if (volume > volumeThreshold)
                {
                    VolumeColor = Brushes.Red;
                }
                else if (volume > volumeThreshold * 0.8f)
                {
                    VolumeColor = Brushes.Yellow;
                }
                else
                {
                    VolumeColor = Brushes.Green;
                }
            });
        }

        private void OnWarningTriggered(object? sender, EventArgs e)
        {
            Application.Current.Dispatcher.Invoke(() =>
            {
                WarningCount++;
                OnPropertyChanged(nameof(HasWarnings));
                notificationService.ShowWarning();
            });
        }

        public void Cleanup()
        {
            audioMonitor.Dispose();
        }
    }
}
