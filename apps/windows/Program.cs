using System;
using System.Windows;

namespace YourAreLoud
{
    public class Program
    {
        [STAThread]
        public static void Main()
        {
            var application = new App();
            application.InitializeComponent();
            application.Run();
        }
    }
}
