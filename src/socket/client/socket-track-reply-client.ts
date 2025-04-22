import environment from '@config/env';
import { Topics } from '@models/enums/topics.enum';
import { loggerInfo } from '@utils/logger';
import { io, Socket } from 'socket.io-client';

let socketReply: Socket | null = null;

export const connect = (): Socket => {
	if (!socketReply) {
		socketReply = io(environment.TRACK_URL, {
			reconnection: true,
			reconnectionDelay: 10000,
		});

		socketReply.on(Topics.CONNECT, () => {
			loggerInfo(`reply connect to Track with ID: ${socketReply?.id}`);
		});
	}

	return socketReply;
};
