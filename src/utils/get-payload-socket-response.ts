import {
	MultiIoResponse,
	MultiIoResponseBuilder,
	SingleIoResponse,
	SingleIoResponseBuilder,
} from '@maur025/core-model-data';
import { v4 as uuidv4 } from 'uuid';

export const getPayloadSocketResponse = <T>(
	eventType: string,
	data: T | T[],
	message?: string
): SingleIoResponse<T> | MultiIoResponse<T> => {
	const id: string = uuidv4();
	const timestamp: string = new Date().toISOString();

	let payload: SingleIoResponse<T> | MultiIoResponse<T> = {
		id: '',
		timestamp: '',
	};

	if (Array.isArray(data)) {
		payload = MultiIoResponseBuilder.builder<T>()
			.withResponse({ id, timestamp, eventType, message, data })
			.build();
	} else {
		payload = SingleIoResponseBuilder.builder<T>()
			.withResponse({ id, timestamp, eventType, message, data })
			.build();
	}

	return payload;
};
