import z, { array, object, string } from 'zod/v4';
import { container } from 'tsyringe';
import EmailService from '../channel/email-service';
import { loggerError } from '@maur025/core-logger';
import { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const SendNotificationToMailRequest = object({
	to: array(string()).nonempty(),
	subject: string().nonempty(),
	text: string().nonempty(),
	html: string().nonempty(),
});

type SendNotificationToMailRequest = z.infer<
	typeof SendNotificationToMailRequest
>;

export const sendNotificationToMail = async (
	request: SendNotificationToMailRequest,
): Promise<void> => {
	const { to, subject, text, html } =
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

	try {
		await email.sendMail({
			from: emailService.getEmailFrom(),
			to,
			subject,
			text,
			html,
		});
	} catch (error) {
		loggerError(
			`${auxLogger} error to send email notification: `,
			error as Error,
		);
	}
};
