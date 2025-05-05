import {
	MultiIoResponse,
	MultiIoResponseBuilder,
	SingleIoResponse,
	SingleIoResponseBuilder,
} from '@maur025/core-model-data';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

interface Request<T> {
	data: T | T[];
	eventType: string;
	message?: string;
	socket?: Socket;
	ioServer?: Server;
}

export const emitSocketResponse = <R>({
	data,
	eventType,
	message,
	socket,
	ioServer,
}: Request<R>): void => {
	const id: string = uuidv4();
	const timestamp: string = new Date().toISOString();

	let payload: SingleIoResponse<R> | MultiIoResponse<R> = {
		id: '',
		timestamp: '',
	};

	if (Array.isArray(data)) {
		payload = MultiIoResponseBuilder.builder<R>()
			.withResponse({ id, timestamp, eventType, message, data })
			.build();
	} else {
		payload = SingleIoResponseBuilder.builder<R>()
			.withResponse({ id, timestamp, eventType, message, data })
			.build();
	}

	if (!socket && ioServer) {
		ioServer.emit(eventType, payload);

		return;
	}

	socket?.emit(eventType, payload);
};
