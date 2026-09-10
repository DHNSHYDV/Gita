import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gita.wisdom',
  appName: 'Gita',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    adjustMarginsForEdgeToEdge: 'disable',
    buildOptions: {
      keystorePath: undefined,
      releaseType: 'AAB'
    }
  },
  plugins: {
    CapacitorUpdater: {
      autoUpdate: false,
      resetWhenUpdate: false
    },
    StatusBar: {
      overlaysWebView: false,
      style: 'LIGHT',
      backgroundColor: '#F6F1EA'
    }
  }
};

export default config;
