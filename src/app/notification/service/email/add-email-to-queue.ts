import { AddEmailToQueueSchema } from '@app/notification/schema/add-email-to-queue.schema';
import environment from '@config/env';
import { loggerError, loggerInfo } from '@maur025/core-logger';

const { NOTIFICATION_URL } = environment;
const source = 'api/notifications';

export const addEmailToQueue = async (
	request: AddEmailToQueueSchema,
): Promise<void> => {
	const payload = AddEmailToQueueSchema.parse(request);

	const response = await fetch(`${NOTIFICATION_URL}/${source}/emails/queue`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		loggerError(
			`[EMAIL] (addEmailToQueue) Error adding email to queue: ${response.status} - ${response.statusText}`,
		);

		return;
	}

	loggerInfo('[EMAIL] (addEmailToQueue) Email added to queue successfully');
};
