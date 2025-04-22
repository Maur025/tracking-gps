import environment from '@config/env';
import Device from '@models/entity/device';
import { Topics } from '@models/enums/topics.enum';
import { deviceSync } from '@services/device/device-sync';
import { loggerInfo } from '@utils/logger';
import { io, Socket } from 'socket.io-client';

export const connect = (): void => {
	const socket: Socket = io(environment.TRACK_URL, {
		reconnection: true,
		reconnectionDelay: 10000,
	});

	socket.on(Topics.CONNECT, () => {
		loggerInfo(`Connect to Track with ID: ${socket.id}`);

		socket.emit(Topics.MESSAGE, 'enviando');
	});

	socket.on(Topics.DEVICES, (payload: Device[]) =>
		deviceSync({ deviceList: [...payload], socketClient: socket })
	);
};
