import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.github.igorratajczak.sunsetrise',
	appName: 'sun-set-rise',
	webDir: 'build',
	plugins: {
		LocalNotifications: {
			smallIcon: 'favicon',
			iconColor: '#3f51b5'
		},
		BackgroundRunner: {
			label: 'sun-times-updater',
			src: 'assets/background.js',
			event: 'updateSunTimes',
			repeat: true,
			interval: 1440, // Interval in minutes (1440 minutes = 24 hours)
			autoStart: true
		}
	},
	android: { buildOptions: { signingType: 'apksigner' } }
};

export default config;
