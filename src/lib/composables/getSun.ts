import * as SunCalc from 'suncalc';
import { Temporal } from '@js-temporal/polyfill';
import { createNotification } from './setNotify';
import { store } from './store.svelte';

export async function getSunTimes(date: string, lat: number, lng: number) {
	const times = SunCalc.getTimes(new Date(date), lat, lng);

	if (
		!times.sunrise ||
		!times.sunset ||
		isNaN(times.sunrise.getTime()) ||
		isNaN(times.sunset.getTime())
	) {
		throw new Error('Invalid sunrise or sunset time');
	}

	const rise = times.sunrise.toTimeString();
	const set = times.sunset.toTimeString();
	const today = Temporal.Now.plainDateISO();

	if (date.toString() === today.toString()) {
		store.sunRise = rise.slice(0, 5);
		store.sunSet = set.slice(0, 5);
		return {
			day: date.toString(),
			rise: times.sunrise.toISOString().replace('Z', ''),
			set: times.sunset.toISOString().replace('Z', '')
		};
	}

	return {
		day: date.toString(),
		rise: times.sunrise.toISOString().replace('Z', ''),
		set: times.sunset.toISOString().replace('Z', '')
	};
}

export async function updateNotifications(lat: number | null, lng: number | null) {
	if (lat == null || lng == null) return;

	// Generate this week's dates
	const week: string[] = Array.from({ length: 7 }).map((_, i) =>
		Temporal.Now.plainDateISO().add({ days: i }).toString()
	);

	for (const day of week) {
		try {
			const sunTimes = await getSunTimes(day, lat, lng);

			await createNotification('SunRise', 'Wschód słońca', sunTimes.rise);
			await createNotification('SunSet', 'Zachód słońca', sunTimes.set);
		} catch (e) {
			console.log(e);
		}
	}
}
