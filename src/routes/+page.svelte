<script lang="ts">
	import { checkPermissions } from '$lib/composables/checkPermissions';
	import { getCurrentPosition } from '$lib/composables/getLocation';
	import sun from '$lib/assets/sun.png';
	import { Preferences } from '@capacitor/preferences';
	import { setLocation } from '$lib/composables/getLocation';
	import { onMount } from 'svelte';
	import { getSunTimes } from '$lib/composables/getSun';

	let latitude: null | number = $state(null);
	let longitude: null | number = $state(null);
	let sunSunrise: string = $state('');
	let sunSunset: string = $state('');
	let locationIsChanged: boolean = $state(false);
	let notificationOffset: number = $state(5);

	async function setPreferences() {
		latitude = Number((await Preferences.get({ key: 'latitude' })).value) || null;
		longitude = Number((await Preferences.get({ key: 'longitude' })).value) || null;
		sunSunrise = (await Preferences.get({ key: 'sunSunrise' })).value || '';
		sunSunset = (await Preferences.get({ key: 'sunSunset' })).value || '';
		notificationOffset = Number((await Preferences.get({ key: 'notificationOffset' })).value) || 5;
	}

	function GPS() {
		checkPermissions();
		getCurrentPosition();
		setPreferences();
	}

	onMount(async () => {
		GPS();
	});

	$effect(() => {
		if (latitude && longitude && !locationIsChanged) {
			// if gps is disabled show manual location inputs
			locationIsChanged = latitude === null && longitude === null ? true : false;
		}
	});

	function setNewLocation() {
		if (latitude && longitude) {
			setLocation(latitude, longitude);
			setPreferences();
			locationIsChanged = false;
		}
	}
	function updateNotificationOffset() {
		if (notificationOffset >= 0 && notificationOffset <= 60) {
			notificationOffset = Number(notificationOffset.toFixed(0));
			Preferences.set({ key: 'notificationOffset', value: String(notificationOffset) });
			getSunTimes(latitude, longitude);
		}
	}
</script>

<main class="container">
	{#if latitude === null || longitude === null || locationIsChanged === true}
		<div class="set_location">
			<b>Ustaw lokalizację:</b>
			<button class="gps" onclick={() => GPS()}>Ustaw lokalizację GPS</button>
			<p>lub wpisz sam</p>
			<input
				type="number"
				class="latitude"
				placeholder="Wpisz szerokość geograficzną"
				bind:value={latitude}
			/>
			<input
				type="number"
				class="longitude"
				placeholder="Wpisz długość geograficzną"
				bind:value={longitude}
			/>
			<button class="set_manual" onclick={() => setNewLocation()}>Zatwierdź</button>
		</div>
	{:else}
		<div class="location">
			<b>Lokalizacja:</b>
			<div class="latitude">{latitude.toFixed(2)}</div>
			<div class="longitude">{longitude.toFixed(2)}</div>
			<button class="change_location" onclick={() => (locationIsChanged = true)}>Zmień</button>
		</div>
		<div class="sun">
			<img src={sun} alt="sun" />
			<div class="sunrise">{sunSunrise}</div>
			<div class="sunset">{sunSunset}</div>
		</div>
		<b>Powiadomienia</b>
		<input
			class="notificationOffset"
			type="number"
			max="60"
			min="0"
			placeholder="Ile minut przed wydarzeniem?"
			onchange={() => updateNotificationOffset()}
			bind:value={notificationOffset}
		/>
	{/if}
</main>

<style>
	button,
	input {
		margin: 10px;
		padding: 10px;
		border-radius: 10px;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1em 0;
		color: white;
	}
	main {
		font-family: 'Roboto', sans-serif;
		font-size: 25px;
		display: grid;
		place-items: center;
		color: white;

		.set_location {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 1em 0;
		}

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

			.change_location {
				grid-column: 1 / 3;
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
