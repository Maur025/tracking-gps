import { Socket } from 'socket.io';

export const socketListeners = (socket: Socket): void => {
	console.info(`Socket connect: ${socket.id}`);
};
