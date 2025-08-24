import { DeviceRuleAlertToLaunch } from '@app/device/entity/device-rule-alert-to-launch';
import { RuleNotification } from '@app/rule/entity/rule-notification';
import z, { array, object } from 'zod/v4';
import { sendNotificationToMail } from './email/send-notification-to-mail';
import { sendNotificationToTelegram } from './telegram/send-notification-to-telegram';

const HandleRuleNotificationRequest = object({
	notifications: array(RuleNotification).default([]),
	notificationToLaunch: array(DeviceRuleAlertToLaunch).default([]),
});

type HandleRuleNotificationRequest = z.infer<
	typeof HandleRuleNotificationRequest
>;

export const handleRuleNotification = async (
	request: HandleRuleNotificationRequest,
): Promise<void> => {
	const { notifications, notificationToLaunch } =
		HandleRuleNotificationRequest.parse(request);

	console.log(notificationToLaunch);

	const notificationToMail: RuleNotification[] = [];
	const notificationToWhatsapp: RuleNotification[] = [];
	const notificationToTelegram: RuleNotification[] = [];
	const notificationToSms: RuleNotification[] = [];

	for (const notification of notifications) {
		switch (notification.channelId) {
			case '1': {
				notificationToMail.push(notification);
				continue;
			}
			case '2': {
				notificationToSms.push(notification);

				continue;
			}
			case '3': {
				notificationToWhatsapp.push(notification);
				continue;
			}
			case '4': {
				notificationToTelegram.push(notification);
				continue;
			}
			default: {
				continue;
			}
		}
	}

	if (notificationToMail.length) {
		const senderList: string[] = notificationToMail
			.map(({ channelData }) => channelData?.tomail)
			.filter(value => value !== undefined);

		const { title = '', message = '' } =
			notificationToMail[0].channelData ?? {};

		sendNotificationToMail({
			senderList,
			titleFormat: title,
			messageFormat: message,
			notificationToLaunch,
		});
	}

	if (notificationToSms.length) {
		console.log(notificationToSms);
	}

	if (notificationToWhatsapp.length) {
		console.log(notificationToWhatsapp);
	}

	if (notificationToTelegram.length) {
		await sendNotificationToTelegram();
	}
};
