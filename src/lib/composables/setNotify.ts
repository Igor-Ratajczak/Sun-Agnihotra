import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';

function createChannel(id: string) {
	if (id === 'SunRise') {
		LocalNotifications.createChannel({
			id: 'SunRise',
			name: 'Wschód',
			description: 'Zaraz będzie wschód słońca',
			sound: 'gong',
			importance: 5,
			visibility: 1
		});
	} else if (id === 'SunSet') {
		LocalNotifications.createChannel({
			id: 'SunSet',
			name: 'Zachód',
			description: 'Zaraz będzie zachód słońca',
			sound: 'gong',
			importance: 5,
			visibility: 1
		});
	}
}

export async function createNotification(id: string, name: string, time: Date) {
	const channels = await LocalNotifications.listChannels();
	if (!channels.channels.find((channel) => channel.id === id)) {
		createChannel(id);
	}

	const notificationOffset =
		Number((await Preferences.get({ key: 'notificationOffset' })).value) || 5;

	const new_time = time.setMinutes(time.getMinutes() - notificationOffset - 0.5);
	time = new Date(new_time);

	LocalNotifications.schedule({
		notifications: [
			{
				title: name,
				body: name,
				id: 1,
				schedule: { at: time },
				sound: 'gong',
				attachments: [],
				actionTypeId: '',
				extra: {},
				channelId: id
			}
		]
	});
	LocalNotifications.getPending().then((result) => {
		console.log(result.notifications); // List of scheduled notifications
	});
}
