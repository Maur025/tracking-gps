import environment from '@config/env';
import { Topics } from '@models/enums/topics.enum';
import { loggerInfo } from '@utils/logger';
import { io, Socket } from 'socket.io-client';
import { clientCommonEvent } from './client-common-event';

let socketReply: Socket | null = null;

export const connect = (): Socket => {
	if (!socketReply) {
		socketReply = io(environment.TRACK_URL, {
			reconnection: true,
			reconnectionDelay: 10000,
			reconnectionDelayMax: 15000,
			reconnectionAttempts: 30,
		});

		clientCommonEvent({
			socketClient: socketReply,
			clientName: 'track-reply-client',
			serverUrl: environment.BACKEND_URL,
		});

		socketReply.on(Topics.CONNECT, () => {
			loggerInfo(
				`[track-reply-client] connected to socket-server ${environment.TRACK_URL} with id: ${socketReply?.id}`
			);
		});
	}

	return socketReply;
};
