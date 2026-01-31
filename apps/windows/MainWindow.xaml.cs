using System.Windows;
using YourAreLoud.ViewModels;

namespace YourAreLoud
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            DataContext = new MainViewModel();
        }

        protected override void OnClosed(System.EventArgs e)
        {
            base.OnClosed(e);
            (DataContext as MainViewModel)?.Cleanup();
        }
    }
}
