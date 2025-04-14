import { Socket } from 'socket.io';
import { socketReply } from './socket-reply';

export const socketListeners = (socket: Socket): void => {
	console.info(`Socket connect: ${socket.id}`);

	socketReply(socket);
};
