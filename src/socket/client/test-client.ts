import { io, Socket } from 'socket.io-client';
import { clientCommonEvent } from './client-common-event';
import { Topics } from '@models/enums/topics.enum';
import { loggerInfo } from '@maur025/core-logger';

const CLIENT_NAME = 'socket-client-test';
const TEST_CLIENT_HOST = 'http://localhost:7767';
const { CONNECT, MESSAGE, DEVICES, DEVICE_TRACKS } = Topics;

export const beginTest = (): void => {
	const socketTest: Socket = io(TEST_CLIENT_HOST, {
		reconnection: true,
		reconnectionDelay: 10000,
		reconnectionDelayMax: 15000,
		reconnectionAttempts: 10,
	});

	clientCommonEvent({
		socketClient: socketTest,
		clientName: CLIENT_NAME,
		serverUrl: TEST_CLIENT_HOST,
	});

	socketTest.on(CONNECT, () => {
		loggerInfo(
			`[${CLIENT_NAME}] connected to socket-server ${TEST_CLIENT_HOST} with id: '${socketTest.id}'`
		);

		socketTest.emit(MESSAGE, 'prueba with client test');
	});

	socketTest.on(MESSAGE, payload => {
		conLog('MESSAGE', payload);
	});

	socketTest.on(DEVICES, payload => {
		// conLog('DEVICES', payload);
	});

	socketTest.on(DEVICE_TRACKS, payload => {
		// conLog('DEVICE_TRACKS', payload);
	});
};

const conLog = (message: string, payload: unknown) => {
	console.log(`[${CLIENT_NAME}] ${message ?? ''}: `, payload);
};
