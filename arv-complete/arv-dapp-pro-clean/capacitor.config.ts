import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ir.arvandkhabar.arvsuperdapp',
  appName: 'ARV Super DApp',
  webDir: 'out',
  android: {
    allowMixedContent: false,
  },
  server: {
    cleartext: false,
  },
};

export default config;
