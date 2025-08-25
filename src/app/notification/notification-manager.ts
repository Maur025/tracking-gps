import { loggerError, loggerInfo } from '@maur025/core-logger';
import PQueue from 'p-queue';
import { singleton } from 'tsyringe';
import { NotifyToEmailSchema } from './schema/notify-to-email.schema';
import { sendNotificationToMail } from './service/email/send-notification-to-mail';

@singleton()
export default class NotificationManager {
	private readonly emailQueue = new PQueue({ concurrency: 1 });
	private readonly whatsappQueue = new PQueue({ concurrency: 1 });

	constructor() {}

	public async initialize(): Promise<void> {
		this.emailQueue.add(async () =>
			loggerInfo(
				`[NOTIFICATION] (NotificationManager.initialize) email queue initialize`,
			),
		);

		this.whatsappQueue.add(async () =>
			loggerInfo(
				`[NOTIFICATION] (NotificationManager.initialize) whatsapp queue initialize`,
			),
		);

		this.emailQueue.on('error', error => {
			loggerError(
				`[NOTIFICATION] (NotificationManager.emailQueue) ${error.message}`,
			);
		});

		this.whatsappQueue.on('error', error => {
			loggerError(
				`[NOTIFICATION] (NotificationManager.whatsappQueue) ${error.message}`,
			);
		});
	}

	public notifyToWhatsapp() {}

	public notifyToEmail(request: NotifyToEmailSchema) {
		const { senderList, subject, htmlMessage } =
			NotifyToEmailSchema.parse(request);

		this.emailQueue.add(async () => {
			await sendNotificationToMail({
				to: senderList,
				subject,
				text: htmlMessage,
				html: htmlMessage,
			});
		});
	}
}
