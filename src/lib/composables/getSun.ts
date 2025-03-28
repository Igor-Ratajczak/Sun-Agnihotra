import { Preferences } from '@capacitor/preferences';
import * as SunCalc from 'suncalc';
import { createNotification } from './setNotify';

export function getSunTimes(latitude: number | null, longitude: number | null) {
	if (latitude === null || longitude === null) return;
	const date = new Date();

	const sunTimes = SunCalc.getTimes(date, latitude, longitude);

	const sunSunrise = sunTimes.sunrise.toTimeString().slice(0, 5);
	const sunSunset = sunTimes.sunset.toTimeString().slice(0, 5);

	Preferences.set({ key: 'sunSunrise', value: sunSunrise });
	Preferences.set({ key: 'sunSunset', value: sunSunset });

	createNotification('SunRise', 'Wschód', sunTimes.sunrise);
	createNotification('SunSet', 'Zachód', sunTimes.sunset);
}
