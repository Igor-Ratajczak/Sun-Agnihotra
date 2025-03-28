import { Geolocation } from '@capacitor/geolocation';
import { Preferences } from '@capacitor/preferences';
import { getSunTimes } from './getSun';

export async function getCurrentPosition() {
	const location = await Geolocation.getCurrentPosition({
		enableHighAccuracy: true,
		timeout: 10000
	});

	const latitude = location.coords.latitude;
	const longitude = location.coords.longitude;

	setLocation(latitude, longitude);
}
export function setLocation(latitude: number, longitude: number) {
	Preferences.set({ key: 'latitude', value: String(latitude) });
	Preferences.set({ key: 'longitude', value: String(longitude) });

	getSunTimes(latitude, longitude);
}
