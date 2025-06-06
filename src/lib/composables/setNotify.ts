import { LocalNotifications } from '@capacitor/local-notifications';
import { Temporal } from '@js-temporal/polyfill';
import { store } from './store.svelte';

function createChannel(id: string) {
	if (id === 'SunRise') {
		LocalNotifications.createChannel({
			id: 'SunRise',
			name: 'Wschód',
			description: 'Zaraz będzie wschód słońca',
			sound: 'gong',
			importance: 1,
			visibility: 1
		});
	} else if (id === 'SunSet') {
		LocalNotifications.createChannel({
			id: 'SunSet',
			name: 'Zachód',
			description: 'Zaraz będzie zachód słońca',
			sound: 'gong',
			importance: 1,
			visibility: 1
		});
	}
}

export async function createNotification(id: string, name: string, time: string) {
	const channels = await LocalNotifications.listChannels();
	if (!channels.channels.find((channel) => channel.id === id)) {
		createChannel(id);
	}
	const notificationOffset = store.notificationOffset;

	const new_time = Temporal.PlainDateTime.from(time).add({
		minutes: -notificationOffset - 1
	});

	const notificationId = Number(
		`${new_time.toPlainDate().toString().replaceAll('-', '')}${id === 'SunRise' ? '0' : '1'}`
	);

	await LocalNotifications.cancel({ notifications: [{ id: notificationId }] });

	await LocalNotifications.schedule({
		notifications: [
			{
				title: name,
				body: name,
				id: notificationId,
				schedule: { at: new Date(new_time.toString()) },
				sound: 'gong',
				attachments: [],
				actionTypeId: '',
				extra: {},
				channelId: id
			}
		]
	});
	const now = Temporal.Now.plainDateTimeISO();

	const result = await LocalNotifications.getPending();

	const toCancel = result.notifications.filter((notif) => {
		if (!notif.schedule?.at) return false;
		const scheduled = Temporal.PlainDateTime.from(
			new Date(notif.schedule.at).toISOString().replace('Z', '')
		);
		return Temporal.PlainDateTime.compare(scheduled, now) < 0;
	});

	if (toCancel.length) {
		await LocalNotifications.cancel({ notifications: toCancel });
	}
}
