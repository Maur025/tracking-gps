import { AddWhatsappToQueueSchema } from '@app/notification/schema/add-whatsapp-to-queue.schema.js';
import environment from '@config/env.js';
import { loggerError, loggerInfo } from '@maur025/core-logger';

const { NOTIFICATION_URL } = environment;
const source = 'api/notifications';

export const addWhatsappToQueue = async (
	request: AddWhatsappToQueueSchema,
): Promise<void> => {
	const payload = AddWhatsappToQueueSchema.parse(request);

	const response = await fetch(
		`${NOTIFICATION_URL}/${source}/whatsapps/queue`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		},
	).catch(() => undefined);

	if (!response) {
		loggerError(
			`[WHATSAPP] (addWhatsappToQueue) No response from notification service`,
		);

		return;
	}

	if (!response.ok) {
		loggerError(
			`[WHATSAPP] (addWhatsappToQueue) Error adding whatsapp to queue: ${response.status} - ${response.statusText}`,
		);

		return;
	}

	loggerInfo(
		'[WHATSAPP] (addWhatsappToQueue) Whatsapp added to queue successfully',
	);
};
