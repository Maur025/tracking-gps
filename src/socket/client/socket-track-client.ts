import environment from '@config/env';
import Device from '@models/entity/device';
import { Topics } from '@models/enums/topics.enum';
import { deviceListProcess } from '@services/device/device-list-process';
import { loggerInfo } from '@utils/logger';
import { io, Socket } from 'socket.io-client';
import { clientCommonEvent } from './client-common-event';
import { deviceProcess } from '@services/device/device-process';

const CLIENT_NAME: string = 'track-client';
const { CONNECT, MESSAGE, DEVICES, DEVICE, DEVICE_TRACKS, DEVICE_LAST } =
	Topics;

export const connect = (): void => {
	const socket: Socket = io(environment.TRACK_URL, {
		reconnection: true,
		reconnectionDelay: 10000,
		reconnectionDelayMax: 20000,
		reconnectionAttempts: 20,
	});

	clientCommonEvent({
		socketClient: socket,
		clientName: CLIENT_NAME,
		serverUrl: environment.TRACK_URL,
	});

	socket.on(CONNECT, () => {
		loggerInfo(
			`[${CLIENT_NAME}] connected to socket-server ${environment.TRACK_URL} with id: '${socket.id}'`
		);

		socket.emit(MESSAGE, 'enviando');
	});

	socket.on(DEVICES, (payload: Device[]) =>
		deviceListProcess({ deviceList: [...payload], socketClient: socket })
	);

	socket.on(DEVICE, payload =>
		deviceProcess({ deviceData: { ...payload }, socketClient: socket })
	);

	socket.on(DEVICE_TRACKS, payload => {
		// console.log(payload);
	});

	socket.on(DEVICE_LAST, payload => {
		console.log(payload);
	});
};
