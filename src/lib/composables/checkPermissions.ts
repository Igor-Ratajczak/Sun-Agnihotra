import { Preferences } from '@capacitor/preferences';
import { Geolocation } from '@capacitor/geolocation';
import { LocalNotifications } from '@capacitor/local-notifications';

export const checkPermissions = async () => {
	const { location } = await Geolocation.checkPermissions();

	if (location !== 'granted') {
		await Geolocation.requestPermissions();
		Preferences.set({ key: 'location_permission', value: '1' });
	} else {
		Preferences.set({ key: 'location_permission', value: '0' });
	}
	const { display } = await LocalNotifications.checkPermissions();

	if (display !== 'granted') {
		await LocalNotifications.requestPermissions();
		Preferences.set({ key: 'notify_permission', value: '1' });
	} else {
		Preferences.set({ key: 'notify_permission', value: '0' });
	}
};
