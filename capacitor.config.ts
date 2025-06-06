import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.github.igorratajczak.sunsetrise',
	appName: 'sun-set-rise',
	webDir: 'build',
	plugins: {
		LocalNotifications: {
			smallIcon: 'favicon',
			iconColor: '#3f51b5'
		}
	}
};

export default config;
