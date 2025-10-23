import { RuleNotification } from '@app/rule/entity/rule-notification';
import z, { array, object } from 'zod/v4';
import { DeviceNotificationSchema } from '../schema/device-notification.schema';
import { loggerDebug } from '@maur025/core-logger';

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
	const {
		notifications,
		//	notificationData
	} = HandleRuleNotificationRequest.parse(request);

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
		loggerDebug(`Method not implemented: Email notifications`);
	}

	if (notificationToSms.length) {
		loggerDebug(`Method not implemented: SMS notifications`);
	}

	if (notificationToWhatsapp.length) {
		loggerDebug(`Method not implemented: Whatsapp notifications`);
	}

	if (notificationToTelegram.length) {
		loggerDebug(`Method not implemented: Telegram notifications`);
	}
};

// const handleEmailSend = (
// 	notificationToMail: RuleNotification[],
// 	notificationData: DeviceNotificationSchema,
// ) => {
// 	const senderList: string[] = notificationToMail
// 		.map(({ channelData }) => channelData?.tomail)
// 		.filter(value => value !== undefined);

// 	const { title = '', message = '' } = notificationToMail[0].channelData ?? {};

// 	const subject: string = getDeviceEmailSubject({
// 		notificationData,
// 		template: title,
// 	});

// 	const htmlMessage: string = getDeviceEmailHtmlMessage({
// 		notificationData,
// 		template: message,
// 	});

// 	console.log(subject);
// 	console.log(htmlMessage);

// 	// notificationManager.notifyToEmail({
// 	// 	senderList,
// 	// 	subject,
// 	// 	htmlMessage,
// 	// });
// };
