import { Topics } from '@models/enums/topics.enum';
import { connectReply } from '@socket/client/socket-track-reply-client';
import { Socket } from 'socket.io';
import { Socket as SocketClient } from 'socket.io-client';
import Device from '../../models/entity/device';

const clientReply: SocketClient = connectReply();

const {
	MESSAGE,
	DEVICE,
	DEVICES,
	DEVICE_NEW,
	DEVICE_REMOVE,
	DEVICE_TRACKS,
	DEVICE_SETUP,
	DEVICE_STATE,
	DEVICE_CONFIG,
	DEVICE_LAST,
	DEVICE_CLEARED,
	DEVICE_TRACK_END,
	DEVICE_SUBSCRIBE,
	DEVICE_UNSUBSCRIBE,
	DEVICE_UNSUBSCRIBE_ALL,
} = Topics;

export const socketReply = (socket: Socket) => {
	// CLIENT-REPLY EMIT IN SOCKET-SERVER TO FINAL CONSUMING
	clientReply.on(MESSAGE, payload => {
		socket.emit(MESSAGE, payload);
	});

	clientReply.on(DEVICE, payload => socket.emit(DEVICE, payload));

	clientReply.on(DEVICES, (payload: Device[]) => {
		socket.emit(DEVICES, payload);
	});

	clientReply.on(DEVICE_NEW, payload => socket.emit(DEVICE_NEW, payload));

	clientReply.on(DEVICE_REMOVE, payload => socket.emit(DEVICE_REMOVE, payload));

	clientReply.on(DEVICE_TRACKS, payload => socket.emit(DEVICE_TRACKS, payload));

	clientReply.on(DEVICE_SETUP, payload => socket.emit(DEVICE_SETUP, payload));

	clientReply.on(DEVICE_STATE, payload => socket.emit(DEVICE_STATE, payload));

	clientReply.on(DEVICE_CONFIG, payload => socket.emit(DEVICE_CONFIG, payload));

	clientReply.on(DEVICE_LAST, payload => socket.emit(DEVICE_LAST, payload));

	clientReply.on(DEVICE_CLEARED, payload =>
		socket.emit(DEVICE_CLEARED, payload)
	);

	clientReply.on(DEVICE_TRACK_END, payload =>
		socket.emit(DEVICE_TRACK_END, payload)
	);

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
