import { io } from 'socket.io-client';

export const connect = (): void => {
	const socket = io('http://localhost:7767');

	socket.on('connect', () => {
		console.info(`conectado con ID: ${socket.id}`);
	});
};
