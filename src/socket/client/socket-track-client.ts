import environment from '@config/env';
import { deviceListProcess } from '@app/device/service/device-list-process';
import { io, Socket } from 'socket.io-client';
import { clientCommonEvent } from './client-common-event';
import { deviceProcess } from '@app/device/service/device-process';
import { deviceNewProcess } from '@app/device/service/device-new-process';
import { loggerInfo } from '@maur025/core-logger';
import { externalSocketTopics } from '@src/external-socket-topics';
import { Device } from '@app/device/entity/device';

const CLIENT_NAME: string = 'track-client';
const { CONNECT, MESSAGE, DEVICES, DEVICE, DEVICE_NEW, DEVICE_LAST } =
	externalSocketTopics;

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
			`[${CLIENT_NAME}] connected to socket-server ${environment.TRACK_URL} with id: '${socket.id}'`,
		);

		socket.emit(MESSAGE, 'enviando');
	});

	socket.on(DEVICES, (payload: Device[]) =>
		deviceListProcess({ deviceList: [...payload], socketClient: socket }),
	);

	socket.on(DEVICE, (payload: Device) =>
		deviceProcess({ deviceData: { ...payload }, socketClient: socket }),
	);
	socket.on(DEVICE_NEW, (payload: Device) =>
		deviceNewProcess({ deviceData: { ...payload } }),
	);

	socket.on(
		DEVICE_LAST,
		//payload
		() => {
			// console.log(payload);
		},
	);
};
