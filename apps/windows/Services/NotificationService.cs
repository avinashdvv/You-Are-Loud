using Microsoft.Toolkit.Uwp.Notifications;
using System.Media;

namespace YourAreLoud.Services
{
    public class NotificationService
    {
        public void ShowWarning()
        {
            // Play system beep
            SystemSounds.Beep.Play();

            // Show toast notification
            new ToastContentBuilder()
                .AddText("🔊 You're Too Loud!")
                .AddText("Please lower your voice during the call")
                .Show();
        }
    }
}
