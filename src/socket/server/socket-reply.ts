import { Topics } from '@models/enums/topics.enum';
import { connect } from '@socket/client/socket-track-reply-client';
import { Socket } from 'socket.io';
import { Socket as SocketClient } from 'socket.io-client';

const clientReply: SocketClient = connect();

export const socketReply = (socket: Socket) => {
	clientReply.on(Topics.MESSAGE, payload => {
		console.log(payload);
		socket.emit('message', payload);
	});

	clientReply.on(Topics.DEVICES, payload => {
		socket.emit('devices', payload);
	});

	clientReply.on(Topics.DEVICE_NEW, payload => {
		socket.emit('device.new', payload);
	});

	clientReply.on(Topics.DEVICE_TRACK, payload => {
		socket.emit('device.track', payload);
	});
};
