import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.getvigilante.app',
  appName: 'The Vigilante',
  webDir: 'dist',
  
  // Server configuration
  server: {
    // For production, comment out the url line below.
    // For development, uncomment and point to your local dev server:
    // url: 'http://localhost:8080',
    androidScheme: 'https',
    iosScheme: 'https',
    allowNavigation: [
      'www.getvigilante.com',
      'getvigilante.com',
      'dbzyvxnlqjbuygtvhizq.databasepad.com',
      '*.supabase.co'
    ]
  },

  // iOS-specific configuration
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: true,
    scrollEnabled: true,
    scheme: 'Vigilante',
    backgroundColor: '#ffffff',
    preferredContentMode: 'mobile'
  },

  // Android-specific configuration
  android: {
    allowMixedContent: false,
    backgroundColor: '#ffffff',
    captureInput: true,
    webContentsDebuggingEnabled: false
  },

  // Plugins configuration
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#4c1d95',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#4c1d95'
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#4c1d95'
    }
  }
};

export default config;
