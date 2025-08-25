import { RuleNotification } from '@app/rule/entity/rule-notification';
import z, { array, object } from 'zod/v4';
import { sendNotificationToTelegram } from './telegram/send-notification-to-telegram';
import { DeviceNotificationSchema } from '../schema/device-notification.schema';

const HandleRuleNotificationRequest = object({
	notifications: array(RuleNotification).default([]),
	notificationData: DeviceNotificationSchema,
});

type HandleRuleNotificationRequest = z.infer<
	typeof HandleRuleNotificationRequest
>;

export const handleRuleNotification = async (
	request: HandleRuleNotificationRequest,
): Promise<void> => {
	const { notifications, notificationData } =
		HandleRuleNotificationRequest.parse(request);

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

	console.log(notificationData);

	if (notificationToMail.length) {
		// const senderList: string[] = notificationToMail
		// 	.map(({ channelData }) => channelData?.tomail)
		// 	.filter(value => value !== undefined);
		// const { title = '', message = '' } =
		// 	notificationToMail[0].channelData ?? {};
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
