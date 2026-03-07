export const alerts = {
  micPermissionOpenedTab: () =>
    alert(
      'A new tab opened to request microphone access.\n\n' +
        '1. In that tab, click "Allow" when Chrome asks for the microphone.\n' +
        '2. The tab will close automatically.\n' +
        '3. Return here and click "Start Monitoring" again.'
    ),

  startMonitoringFailed: (reason: string) =>
    alert('Failed to start monitoring:\n\n' + reason),

  unexpectedError: (message: string) => alert('Error: ' + message),
};
