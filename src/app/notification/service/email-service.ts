import z, { boolean, number, object, string } from 'zod/v4';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

let transporterMail: Transporter<SMTPTransport.SentMessageInfo> | null = null;

const EmailServiceRequest = object({
	host: string(),
	port: number(),
	withSsl: boolean().default(false),
	auth: object({
		user: string().nonempty(),
		pass: string(),
	}),
});

type EmailServiceRequest = z.infer<typeof EmailServiceRequest>;

export const emailService = (): {
	closeTransporter: () => void;
	getTransporter: (
		request?: EmailServiceRequest,
	) => Transporter<SMTPTransport.SentMessageInfo>;
} => {
	const getTransporter = (
		request?: EmailServiceRequest,
	): Transporter<SMTPTransport.SentMessageInfo> => {
		if (!request && transporterMail) {
			return transporterMail;
		}

		const { host, port, withSsl, auth } = EmailServiceRequest.parse(request);

		transporterMail = createTransport({
			host: host,
			port: port,
			secure: withSsl,
			auth: { user: auth?.user, pass: auth?.pass },
		});

		return transporterMail;
	};

	const closeTransporter = (): void => {
		if (!transporterMail) {
			return;
		}

		transporterMail.close();
		transporterMail = null;
	};

	return { closeTransporter, getTransporter };
};
