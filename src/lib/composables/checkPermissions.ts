import { Preferences } from '@capacitor/preferences';
import { Geolocation } from '@capacitor/geolocation';
import { LocalNotifications } from '@capacitor/local-notifications';

export const checkPermissions = async () => {
	await Geolocation.requestPermissions();
	const location = await Geolocation.checkPermissions();
	if (location.location === 'granted') {
		await Geolocation.requestPermissions();
		await Preferences.set({ key: 'location_permission', value: '1' });
	} else {
		await Preferences.set({ key: 'location_permission', value: '0' });
	}

	await LocalNotifications.requestPermissions();
	const notify = await LocalNotifications.checkPermissions();
	if (notify.display === 'granted') {
		await LocalNotifications.requestPermissions();
		await Preferences.set({ key: 'notify_permission', value: '1' });
	} else {
		await Preferences.set({ key: 'notify_permission', value: '0' });
	}
};
