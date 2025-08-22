import { DeviceRuleAlertToLaunch } from '@app/device/entity/device-rule-alert-to-launch';
import z, { array, object, string } from 'zod/v4';
import { container } from 'tsyringe';
import ChannelCache from '@app/channel/cache/channel-cache';
import { loggerError } from '@maur025/core-logger';
import EmailService from '../channel/email-service';

const SendNotificationToMailRequest = object({
	senderList: array(string()).nonempty(),
	titleFormat: string().nonempty(),
	messageFormat: string().nonempty(),
	notificationToLaunch: array(DeviceRuleAlertToLaunch).nonempty(),
});

type SendNotificationToMailRequest = z.infer<
	typeof SendNotificationToMailRequest
>;

export const sendNotificationToMail = async (
	request: SendNotificationToMailRequest,
): Promise<void> => {
	const { senderList, titleFormat, messageFormat, notificationToLaunch } =
		SendNotificationToMailRequest.parse(request);

	const channelCache = container.resolve(ChannelCache);
	const channel = channelCache.getById('1');

	if (!channel) {
		loggerError(
			`[NOTIFICATION] (sendNotificationToMail) channel not founded, fatal error`,
		);

		return;
	}

	const emailService = container.resolve(EmailService);

	for (const notification of notificationToLaunch) {
		// should be a for???
		emailService.getEmailService().sendMail({
			from: emailService.getEmailFrom(),
			to: senderList,
			subject: `${titleFormat} | test | test1 | test2`,
			text: `Notification of rule: ${notification.ruleId}`,
			html: messageFormat,
		});
	}
};
