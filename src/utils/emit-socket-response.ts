import { MultiIoResponse, SingleIoResponse } from '@maur025/core-model-data';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { getPayloadSocketResponse } from './get-payload-socket-response';

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

	const payload: SingleIoResponse<R> | MultiIoResponse<R> =
		getPayloadSocketResponse<R>(eventType, data);

	if (!socket && ioServer) {
		ioServer.emit(eventType, payload, message);

		return;
	}

	socket?.emit(eventType, payload);
};
