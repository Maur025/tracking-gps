import { RuleNotification } from '@app/rule/entity/rule-notification';
import z, { array, object } from 'zod/v4';
import { DeviceNotificationSchema } from '../schema/device-notification.schema';
import { loggerDebug } from '@maur025/core-logger';
import { getDeviceNotificationTitle } from '@app/device/service/notification/get-device-notification-title';
import { getDeviceNotificationMessage } from '@app/device/service/notification/get-device-notification-message';
import { addEmailToQueue } from './email/add-email-to-queue';
import { addWhatsappToQueue } from './whatsapp/add-whatsapp-to-queue';

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

	if (notificationToMail.length) {
		// await handleEmailSend(notificationToMail, notificationData);
	}

	if (notificationToSms.length) {
		loggerDebug(`Method not implemented: SMS notifications`);
	}

	if (notificationToWhatsapp.length) {
		// await handleWhatsappSend(notificationToWhatsapp, notificationData);
	}

	if (notificationToTelegram.length) {
		loggerDebug(`Method not implemented: Telegram notifications`);
	}
};

const handleEmailSend = async (
	notificationToMail: RuleNotification[],
	notificationData: DeviceNotificationSchema,
) => {
	const senderList: string[] = notificationToMail
		.map(({ channelData }) => channelData?.tomail)
		.filter(value => value !== undefined);

	const { title = 'rule.name', message = '$rule.description' } =
		notificationToMail[0].channelData ?? {};

	const subject: string = getDeviceNotificationTitle({
		notificationData,
		template: title,
	});

	const htmlMessage: string = getDeviceNotificationMessage({
		notificationData,
		template: message,
	});

	await addEmailToQueue({ senderList, subject, htmlMessage });
};

const handleWhatsappSend = async (
	notificationToWhatsapp: RuleNotification[],
	notificationData: DeviceNotificationSchema,
) => {
	const batchSize = 15;
	let notificationsPromiseList: Promise<void>[] = [];

	for (const wpNotification of notificationToWhatsapp) {
		const { title = '$rule.name', message = '$rule.description' } =
			wpNotification?.channelData ?? {};

		notificationsPromiseList.push(
			addWhatsappToQueue({
				numberPhone: wpNotification.channelData?.number ?? '',
				message: `${getDeviceNotificationTitle({ notificationData, template: title })}\n${getDeviceNotificationMessage({ notificationData, template: message })}`,
			}),
		);

		if (batchSize == notificationsPromiseList.length) {
			await Promise.all(notificationsPromiseList);

			notificationsPromiseList = [];
		}
	}

	if (notificationsPromiseList.length) {
		await Promise.all(notificationsPromiseList);
	}
};
