import { Server, Socket } from 'socket.io';
import { Socket as SocketClient } from 'socket.io-client';
import { socketReply } from './socket-reply';
import { connectReply } from '@socket/client/socket-track-reply-client';
import { loggerInfo } from '@maur025/core-logger';
import { availableRooms } from '@src/available-rooms';
import { emitSocketResponse } from '@utils/emit-socket-response';
import { externalSocketTopics } from '@src/external-socket-topics';
import { internalSocketTopics } from '@src/internal-socket-topics';

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
} = externalSocketTopics;

const {
	ROOM_JOIN_REQUEST,
	ROOM_JOIN_RESPONSE,
	ROOM_LEAVE_REQUEST,
	ROOM_LEAVE_RESPONSE,
	ROOM_LIST_REQUEST,
	ROOM_LIST_RESPONSE,
} = internalSocketTopics;

export const socketListeners = (socket: Socket, io: Server): void => {
	loggerInfo(`[socket-server] new client '${socket.id}' connected.`);

	socket.on(MESSAGE, payload => clientReply.emit(MESSAGE, payload));

	socket.on(DEVICE, payload => clientReply.emit(DEVICE, payload));

	socket.on(DEVICES, payload => {
		clientReply.emit(DEVICES, payload);
	});

	socket.on(DEVICE_NEW, payload => clientReply.emit(DEVICE_NEW, payload));

	socket.on(DEVICE_REMOVE, payload => clientReply.emit(DEVICE_REMOVE, payload));

	socket.on(DEVICE_TRACKS, payload => clientReply.emit(DEVICE_TRACKS, payload));

	socket.on(DEVICE_SETUP, payload => clientReply.emit(DEVICE_SETUP, payload));

	socket.on(DEVICE_STATE, payload => clientReply.emit(DEVICE_STATE, payload));

	socket.on(DEVICE_CONFIG, payload => clientReply.emit(DEVICE_CONFIG, payload));

	socket.on(DEVICE_LAST, payload => clientReply.emit(DEVICE_LAST, payload));

	socket.on(DEVICE_CLEARED, payload =>
		clientReply.emit(DEVICE_CLEARED, payload),
	);

	socket.on(DEVICE_TRACK_END, payload =>
		clientReply.emit(DEVICE_TRACK_END, payload),
	);

	socket.on(DEVICE_SUBSCRIBE, payload =>
		clientReply.emit(DEVICE_SUBSCRIBE, payload),
	);

	socket.on(DEVICE_UNSUBSCRIBE, payload =>
		clientReply.emit(DEVICE_UNSUBSCRIBE, payload),
	);

	socket.on(DEVICE_UNSUBSCRIBE_ALL, payload =>
		clientReply.emit(DEVICE_UNSUBSCRIBE_ALL, payload),
	);

	socket.on(ROOM_LIST_REQUEST, (): void => {
		emitSocketResponse<string[]>({
			data: getRoomValueAsList(),
			eventType: ROOM_LIST_RESPONSE,
			socket,
		});
	});

	socket.on(ROOM_JOIN_REQUEST, (roomName: string) => {
		const socketRooms = getRoomValueAsList();

		if (!socketRooms.includes(roomName)) {
			socket.emit(
				ROOM_JOIN_RESPONSE,
				`can't join to room ${roomName} it's invalid or non-existent`,
			);

			return;
		}

		socket.join(roomName);
		socket.emit(
			ROOM_JOIN_RESPONSE,
			`client ${socket.id} joined to room ${roomName} successfully`,
		);
	});

	socket.on(ROOM_LEAVE_REQUEST, (roomName: string) => {
		const socketRooms = getRoomValueAsList();

		if (!socketRooms.includes(roomName)) {
			socket.emit(
				ROOM_LEAVE_RESPONSE,
				`can't be left to room ${roomName} it's invalid or non-existent`,
			);

			return;
		}

		socket.leave(roomName);
		socket.emit(
			ROOM_JOIN_RESPONSE,
			`client ${socket.id} left the room ${roomName} successfully `,
		);
	});

	socketReply(socket, io);
};

const getRoomValueAsList = () => {
	const availableRoomList: string[] = [];

	for (const [, roomValue] of Object.entries(availableRooms)) {
		availableRoomList.push(roomValue);
	}

	return [...availableRoomList];
};
