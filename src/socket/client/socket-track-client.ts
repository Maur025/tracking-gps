import environment from '@config/env';
import { Topics } from '@models/enums/topics.enum';
import { io } from 'socket.io-client';

export const connect = (): void => {
	const socket = io(environment.TRACK_URL, {
		reconnection: true,
		reconnectionDelay: 10000,
	});

	socket.on(Topics.CONNECT, () => {
		console.info(`connect to Track with ID: ${socket.id}`);
		socket.emit('message', 'enviando');
	});

	socket.on(Topics.DEVICES, payload => {
		console.log(payload);
	});
};
