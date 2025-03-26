<script lang="ts">
	import * as SunCalc from 'suncalc';
	import { DateTime } from 'luxon';
	import sun from '$lib/assets/sun.png';

	import { Geolocation } from '@capacitor/geolocation';
	import { onMount } from 'svelte';

	let latitude: null | number = $state(null);
	let longitude: null | number = $state(null);
	let sunSunrise: string = $state('');
	let sunSunset: string = $state('');

	async function getCurrentPosition() {
		let location = await Geolocation.getCurrentPosition();
		latitude = location.coords.latitude;
		longitude = location.coords.longitude;

		getSunTimes();
	}

	function getSunTimes() {
		if (latitude === null || longitude === null) return;
		const date = new Date();
		const timezone = 'Europe/Warsaw';

		const dt = DateTime.fromJSDate(date).setZone(timezone); // Transfer date to the timezone
		const jsDate = dt.toJSDate();

		const sunTimes = SunCalc.getTimes(jsDate, latitude, longitude);

		sunSunrise = sunTimes.sunrise.toTimeString().slice(0, 5);
		sunSunset = sunTimes.sunset.toTimeString().slice(0, 5);
	}

	onMount(() => {
		getCurrentPosition();
	});
</script>

<main class="container">
	{#if latitude === null || longitude === null}
		<div class="set_location">
			<b>Ustaw lokalizację:</b>
			<button onclick={() => Geolocation.getCurrentPosition()}>Ustaw lokalizację</button>
		</div>
	{:else}
		<div class="location">
			<b>Lokalizacja:</b>
			<div class="latitude">{latitude.toFixed(2)}</div>
			<div class="longitude">{longitude.toFixed(2)}</div>
		</div>
	{/if}

	<div class="sun">
		<img src={sun} alt="sun" />
		<div class="sunrise">{sunSunrise}</div>
		<div class="sunset">{sunSunset}</div>
	</div>
</main>

<style>
	main {
		font-family: 'Roboto', sans-serif;
		font-size: 25px;
		display: grid;
		place-items: center;
		color: white;

		> div {
			margin: 10px;
			padding: 10px;
			border-radius: 10px;
			background-color: rgba(0, 0, 0, 0.5);
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 0 10px;
			grid-template-rows: 1fr 1fr;

			> div {
				grid-row: 2;
				text-align: center;
				font-size: 20px;
				font-weight: bold;
				padding: 10px;
				border-radius: 10px;
				background-color: rgba(0, 0, 0, 0.5);
			}

			> b,
			img {
				grid-column: 1 / 3;
				text-align: center;
				justify-self: center;
				align-self: center;
			}
		}
	}
</style>
