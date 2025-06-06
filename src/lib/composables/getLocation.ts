import { Geolocation } from '@capacitor/geolocation';
import { Preferences } from '@capacitor/preferences';
import { store } from './store.svelte';

export async function getCurrentPosition() {
	await Preferences.get({ key: 'location_permission' }).then((permission) => {
		if (permission.value === '1') {
			Geolocation.getCurrentPosition({
				enableHighAccuracy: true,
				timeout: 10000
			})
				.then((location) => {
					const latitude = location.coords.latitude;
					const longitude = location.coords.longitude;

					store.latitude = latitude;
					store.longitude = longitude;
				})
				.catch((error) => {
					console.error(error);
				});
		}
	});
}
