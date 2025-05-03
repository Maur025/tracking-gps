import {
	MultiIoResponse,
	MultiIoResponseBuilder,
	SingleIoResponse,
	SingleIoResponseBuilder,
} from '@maur025/core-model-data';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

interface Request<T> {
	data: T | T[];
	socket: Socket;
	eventType: string;
	message?: string;
}

export const emitSocketResponse = <R>({
	data,
	socket,
	eventType,
	message,
}: Request<R>): void => {
	const id: string = uuidv4();
	const timestamp: string = new Date().toISOString();

	let payload: SingleIoResponse<R> | MultiIoResponse<R> = {
		id: '',
		timestamp: '',
	};

	if (Array.isArray(data)) {
		payload = MultiIoResponseBuilder.builder<R>()
			.withResponse({ id, timestamp, eventType, message })
			.build();
	} else {
		payload = SingleIoResponseBuilder.builder<R>()
			.withResponse({ id, timestamp, eventType, message })
			.build();
	}

	socket.emit(eventType, payload);
};
