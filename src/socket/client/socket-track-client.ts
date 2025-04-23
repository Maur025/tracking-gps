import environment from '@config/env';
import Device from '@models/entity/device';
import { Topics } from '@models/enums/topics.enum';
import { deviceSync } from '@services/device/device-sync';
import { loggerInfo } from '@utils/logger';
import { io, Socket } from 'socket.io-client';
import { clientCommonEvent } from './client-common-event';

const { CONNECT, MESSAGE, DEVICES } = Topics;

export const connect = (): void => {
	const socket: Socket = io(environment.TRACK_URL, {
		reconnection: true,
		reconnectionDelay: 10000,
		reconnectionDelayMax: 20000,
		reconnectionAttempts: 20,
	});

	clientCommonEvent({
		socketClient: socket,
		clientName: 'track-client',
		serverUrl: environment.TRACK_URL,
	});

	socket.on(CONNECT, () => {
		loggerInfo(
			`[track-client] connected to socket-server ${environment.TRACK_URL} with id: ${socket.id}`
		);

		socket.emit(MESSAGE, 'enviando');
	});

	socket.on(DEVICES, (payload: Device[]) =>
		deviceSync({ deviceList: [...payload], socketClient: socket })
	);
};
