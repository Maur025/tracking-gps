import environment from '@config/env';
import { Topics } from '@models/enums/topics.enum';
import { io, Socket } from 'socket.io-client';
import { clientCommonEvent } from './client-common-event';
import { loggerInfo } from '@maur025/core-logger';

const CLIENT_NAME: string = 'track-reply-client';
let socketReply: Socket | null = null;

export const connectReply = (): Socket => {
	if (!socketReply) {
		socketReply = io(environment.TRACK_URL, {
			reconnection: true,
			reconnectionDelay: 10000,
			reconnectionDelayMax: 15000,
			reconnectionAttempts: 30,
		});

		clientCommonEvent({
			socketClient: socketReply,
			clientName: CLIENT_NAME,
			serverUrl: environment.TRACK_URL,
		});

		socketReply.on(Topics.CONNECT, () => {
			loggerInfo(
				`[${CLIENT_NAME}] connected to socket-server ${environment.TRACK_URL} with id: '${socketReply?.id}'`
			);
		});
	}

	return socketReply;
};
