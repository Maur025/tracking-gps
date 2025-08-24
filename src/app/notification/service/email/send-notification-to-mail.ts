import { DeviceRuleAlertToLaunch } from '@app/device/entity/device-rule-alert-to-launch';
import z, { array, object, string } from 'zod/v4';
import { container } from 'tsyringe';
import EmailService from '../channel/email-service';
import { loggerError } from '@maur025/core-logger';
import { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const SendNotificationToMailRequest = object({
	senderList: array(string()).nonempty(),
	titleFormat: string().nonempty(),
	messageFormat: string().nonempty(),
	notificationToLaunch: array(DeviceRuleAlertToLaunch).nonempty(),
});

export type SendNotificationToMailRequest = z.infer<
	typeof SendNotificationToMailRequest
>;

export const sendNotificationToMail = async (
	request: SendNotificationToMailRequest,
): Promise<void> => {
	const { senderList, titleFormat, messageFormat, notificationToLaunch } =
		SendNotificationToMailRequest.parse(request);

	const auxLogger: string = '[EMAIL] (sendNotificationToMail)';
	const emailService = container.resolve(EmailService);

	let email: Transporter<SMTPTransport.SentMessageInfo> | null = null;

	try {
		email = emailService.getEmailService();
	} catch (error) {
		loggerError(
			`${auxLogger} email service not found, can't send notification: `,
			error as Error,
		);

		return;
	}

	for (const notification of notificationToLaunch) {
		// should be a for???

		try {
			email.sendMail({
				from: emailService.getEmailFrom(),
				to: senderList,
				subject: `${titleFormat} | test | test1 | test2`,
				text: `Notification of rule: ${notification.ruleId}`,
				html: messageFormat,
			});
		} catch (error) {
			loggerError(
				`${auxLogger} error to send email of ruleId ${notification.ruleId}`,
				error as Error,
			);
		}
	}
};
