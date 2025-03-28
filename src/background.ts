import { getSunTimes } from '$lib/composables/getSun';
import { Preferences } from '@capacitor/preferences';

addEventListener('updateSunTimes', async () => {
	try {
		// Retrieve stored latitude and longitude
		const lat = await Preferences.get({ key: 'latitude' });
		const lon = await Preferences.get({ key: 'longitude' });

		if (lat.value && lon.value) {
			// Update sun times and schedule notifications
			getSunTimes(parseFloat(lat.value), parseFloat(lon.value));
		}
	} catch (error) {
		console.error('Error updating sun times:', error);
	}
});
