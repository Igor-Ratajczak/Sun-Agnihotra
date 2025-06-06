interface Store {
	latitude: null | number;
	longitude: null | number;
	sunRise: string;
	sunSet: string;
	notificationOffset: number;
}

export const store: Store = $state({
	latitude: null,
	longitude: null,
	sunRise: '',
	sunSet: '',
	notificationOffset: 5
});
