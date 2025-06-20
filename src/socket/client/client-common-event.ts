import { loggerDebug, loggerError, loggerInfo } from '@maur025/core-logger';
import { externalSocketTopics } from '@src/external-socket-topics';
import { Socket } from 'socket.io-client';

const { RECONNECT_ATTEMPT, RECONNECT_FAILED, RECONNECT } = externalSocketTopics;

export const clientCommonEvent = ({
	socketClient,
	clientName,
	serverUrl,
}: ClientCommonEvent): void => {
	socketClient.io.on(RECONNECT_ATTEMPT, () => {
		loggerDebug(
			`[${clientName}] trying reconnect to socket-server ${serverUrl}`,
		);
	});

	socketClient.io.on(RECONNECT_FAILED, () => {
		loggerError(`[${clientName}] Can't connect to socket-server ${serverUrl}`);
	});

	socketClient.io.on(RECONNECT, () => {
		loggerInfo(`[${clientName}] reconnected to socket-server ${serverUrl}`);
	});
};

interface ClientCommonEvent {
	socketClient: Socket;
	clientName: string;
	serverUrl: string;
}
