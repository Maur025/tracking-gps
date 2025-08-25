import { RuleNotification } from '@app/rule/entity/rule-notification';
import z, { array, object } from 'zod/v4';
import { sendNotificationToTelegram } from './telegram/send-notification-to-telegram';
import { DeviceNotificationSchema } from '../schema/device-notification.schema';
import { container } from 'tsyringe';
import NotificationManager from '../notification-manager';
import { getDeviceEmailSubject } from '@app/device/service/notification/get-device-email-subject';
import { getDeviceEmailHtmlMessage } from '@app/device/service/notification/get-device-email-html-message';

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

	const notificationManager = container.resolve(NotificationManager);

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
		handleEmailSend(notificationToMail, notificationData, notificationManager);
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

const handleEmailSend = (
	notificationToMail: RuleNotification[],
	notificationData: DeviceNotificationSchema,
	notificationManager: NotificationManager,
) => {
	const senderList: string[] = notificationToMail
		.map(({ channelData }) => channelData?.tomail)
		.filter(value => value !== undefined);

	const { title = '', message = '' } = notificationToMail[0].channelData ?? {};

	const subject: string = getDeviceEmailSubject({
		notificationData,
		template: title,
	});

	const htmlMessage: string = getDeviceEmailHtmlMessage({
		notificationData,
		template: message,
	});

	console.log(subject);
	console.log(htmlMessage);

	notificationManager.notifyToEmail({
		senderList,
		subject,
		htmlMessage,
	});
};
