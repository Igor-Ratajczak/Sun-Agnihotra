<script lang="ts">
	import { checkPermissions } from '$lib/composables/checkPermissions';
	import { getCurrentPosition } from '$lib/composables/getLocation';
	import sun from '$lib/assets/sun.png';
	import { Preferences } from '@capacitor/preferences';
	import { onMount } from 'svelte';
	import { updateNotifications } from '$lib/composables/getSun';
	import { store } from '$lib/composables/store.svelte';

	let locationIsChanged: boolean = $state(true);
	let positions = $state({
		location: { x: 100, y: 250 },
		sun: { x: 100, y: 450 },
		notify: { x: 100, y: 600 }
	});

	async function setPreferences() {
		await Preferences.set({ key: 'latitude', value: String(store.latitude) });
		await Preferences.set({ key: 'longitude', value: String(store.longitude) });
		await Preferences.set({ key: 'sunRise', value: store.sunRise });
		await Preferences.set({ key: 'sunSet', value: store.sunSet });
		await Preferences.set({ key: 'notificationOffset', value: String(store.notificationOffset) });
	}

	$effect(() => {
		if (store && store.latitude !== null && store.longitude !== null) {
			setPreferences();
		}
	});

	async function GPS() {
		await checkPermissions();
		await getCurrentPosition();
	}

	onMount(async () => {
		const keys = ['latitude', 'longitude', 'sunRise', 'sunSet', 'notificationOffset', 'position'];
		const results = await Promise.all(keys.map((key) => Preferences.get({ key })));
		const [lat, lng, rise, set, offset, position] = results;
		store.latitude = Number(lat.value);
		store.longitude = Number(lng.value);
		store.sunRise = rise.value || '';
		store.sunSet = set.value || '';
		store.notificationOffset = Number(offset.value) || 5;
		positions = JSON.parse(position.value || JSON.stringify(positions));

		locationIsChanged = !store.latitude && !store.longitude;
		checkPermissions();

		updateNotifications(store.latitude, store.longitude);
	});

	function setNewLocation() {
		if (store.latitude && store.longitude) {
			locationIsChanged = false;
			updateNotifications(store.latitude, store.longitude);
		}
	}
	function updateNotificationOffset() {
		if (store.notificationOffset >= 0 && store.notificationOffset <= 60) {
			store.notificationOffset = Number(store.notificationOffset.toFixed(0));
			Preferences.set({ key: 'notificationOffset', value: String(store.notificationOffset) });
			updateNotifications(store.latitude, store.longitude);
		}
	}

	function onDragStart(event: DragEvent, key: 'location' | 'sun' | 'notify') {
		event.dataTransfer?.setData('text/plain', key);
	}

	async function onDrop(event: DragEvent) {
		event.preventDefault();
		const key = event.dataTransfer?.getData('text/plain') as 'location' | 'sun' | 'notify';
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		const draggedEl = document.querySelector(`.${key}`) as HTMLElement;
		const offsetX = draggedEl.offsetWidth / 2;
		const offsetY = draggedEl.offsetHeight / 2;

		const x = Math.round((event.clientX - rect.left - offsetX) / 50) * 50;
		const y = Math.round((event.clientY - rect.top - offsetY) / 50) * 50;

		positions[key] = { x, y };
		await Preferences.set({ key: 'position', value: JSON.stringify(positions) });
	}

	function allowDrop(event: DragEvent) {
		event.preventDefault();
	}
</script>

<main class="container dropzone" ondragover={allowDrop} ondrop={onDrop}>
	{#if store.latitude && store.longitude && !locationIsChanged}
		<div
			class="location draggable"
			role="button"
			tabindex="0"
			draggable="true"
			ondragstart={(e) => onDragStart(e, 'location')}
			style="left: {positions.location.x}px; top: {positions.location.y}px;"
		>
			<b>Lokalizacja:</b>
			<div class="latitude">{store.latitude.toFixed(2)}</div>
			<div class="longitude">{store.longitude.toFixed(2)}</div>
			<button class="change_location" onclick={() => (locationIsChanged = true)}>Zmień</button>
		</div>

		<div
			class="sun draggable"
			role="button"
			tabindex="0"
			draggable="true"
			ondragstart={(e) => onDragStart(e, 'sun')}
			style="left: {positions.sun.x}px; top: {positions.sun.y}px;"
		>
			<img src={sun} alt="sun" />
			<div class="sunrise">{store.sunRise || '12:23'}</div>
			<div class="sunset">{store.sunSet || '12:23'}</div>
		</div>
		<div
			class="notify draggable"
			role="button"
			tabindex="0"
			draggable="true"
			ondragstart={(e) => onDragStart(e, 'notify')}
			style="left: {positions.notify.x}px; top: {positions.notify.y}px;"
		>
			<b>Powiadomienia</b>
			<input
				class="notificationOffset"
				type="number"
				max="60"
				min="0"
				placeholder="Ile minut przed wydarzeniem?"
				onchange={() => updateNotificationOffset()}
				bind:value={store.notificationOffset}
			/>
		</div>
	{:else if locationIsChanged}
		<div class="set_location">
			<b>Ustaw lokalizację:</b>
			<button class="gps" onclick={() => GPS()}>Ustaw lokalizację GPS</button>
			<p>lub wpisz sam</p>
			<input
				type="number"
				class="latitude"
				placeholder="Wpisz szerokość geograficzną"
				bind:value={store.latitude}
			/>
			<input
				type="number"
				class="longitude"
				placeholder="Wpisz długość geograficzną"
				bind:value={store.longitude}
			/>
			<button class="set_manually" onclick={() => setNewLocation()}>Zatwierdź</button>
		</div>
	{/if}
</main>

<style>
	.dropzone {
		position: relative;
		width: 100%;
		height: 100vh;
	}
	.draggable {
		position: absolute;
		cursor: grab;
		background-color: rgba(0, 0, 0, 0.5);
		padding: 10px;
		border-radius: 10px;
	}
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

		.notify {
			grid-template-columns: 100%;

			input {
				width: 90%;
				text-align: center;
			}
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
			width: 8em;
			justify-items: center;

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
