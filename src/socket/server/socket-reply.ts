import { Topics } from '@models/enums/topics.enum';
import { connect } from '@socket/client/socket-track-reply-client';
import { Socket } from 'socket.io';
import { Socket as SocketClient } from 'socket.io-client';
import Device from '../../models/entity/device';

const clientReply: SocketClient = connect();

const {
	MESSAGE,
	DEVICES,
	DEVICE_NEW,
	DEVICE_REMOVE,
	DEVICE_TRACK,
	DEVICE_LAST,
	DEVICE_SUBSCRIBE,
	DEVICE_UNSUBSCRIBE,
	DEVICE_UNSUBSCRIBE_ALL,
} = Topics;

export const socketReply = (socket: Socket) => {
	clientReply.on(MESSAGE, payload => socket.emit(MESSAGE, payload));

	clientReply.on(DEVICES, (payload: Device[]) => socket.emit(DEVICES, payload));

	clientReply.on(DEVICE_NEW, payload => socket.emit(DEVICE_NEW, payload));

	clientReply.on(DEVICE_REMOVE, payload => socket.emit(DEVICE_REMOVE, payload));

	clientReply.on(DEVICE_TRACK, payload => socket.emit(DEVICE_TRACK, payload));

	clientReply.on(DEVICE_LAST, payload => socket.emit(DEVICE_LAST, payload));

	clientReply.on(DEVICE_SUBSCRIBE, payload =>
		socket.emit(DEVICE_SUBSCRIBE, payload)
	);

	clientReply.on(DEVICE_UNSUBSCRIBE, payload =>
		socket.emit(DEVICE_UNSUBSCRIBE, payload)
	);

	clientReply.on(DEVICE_UNSUBSCRIBE_ALL, payload =>
		socket.emit(DEVICE_UNSUBSCRIBE_ALL, payload)
	);
};
