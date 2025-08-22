import { singleton } from 'tsyringe';
import { EmailServiceInitializeSchema } from '../../schema/email-service-initialize.schema';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { loggerError, loggerInfo } from '@maur025/core-logger';

@singleton()
export default class EmailService {
	private emailInstance: Transporter<SMTPTransport.SentMessageInfo> | null =
		null;

	private emailFrom: string = '';

	constructor() {}

	public async initialize(request: EmailServiceInitializeSchema) {
		const { host, port, withSsl, auth } =
			EmailServiceInitializeSchema.parse(request);

		const transporterEmail: Transporter<SMTPTransport.SentMessageInfo> =
			createTransport({
				host,
				port,
				secure: withSsl,
				auth: { user: auth.user, pass: auth.pass },
				tls: {
					rejectUnauthorized: false,
					// remove in production
				},
			});

		try {
			await transporterEmail.verify();
			loggerInfo(
				`[EMAIL] (EmailService.initialize) SMTP connection established`,
			);

			this.emailInstance = transporterEmail;
			this.emailFrom = auth.user;
		} catch (error) {
			loggerError(
				`[EMAIL] (EmailService.initialize) SMTP connection error`,
				error as Error,
			);
		}
	}

	public getEmailService(): Transporter<SMTPTransport.SentMessageInfo> {
		if (this.emailInstance) {
			return this.emailInstance;
		}

		throw new Error(
			`[EMAIL] (EmailService.getEmailService) Email service not initialized]`,
		);
	}

	public getEmailFrom(): string {
		return this.emailFrom;
	}

	public closeService(): void {
		if (this.emailInstance) {
			this.emailFrom = '';
			this.emailInstance.close();
			this.emailInstance = null;
		}
	}
}
