import { loggerInfo } from '@maur025/core-logger';
import PQueue from 'p-queue';
import { singleton } from 'tsyringe';

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
	}

	public notifyToWhatsapp() {}

	public notifyToEmail() {}
}
