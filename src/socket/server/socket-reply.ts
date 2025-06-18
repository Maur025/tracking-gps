import { connectReply } from '@socket/client/socket-track-reply-client';
import { Server, Socket } from 'socket.io';
import { Socket as SocketClient } from 'socket.io-client';
import Device from '../../models/entity/device';
import Track from '@models/entity/track';
import { geofenceVerify } from '@services/reply-client/geofence/verify-in-out/geofence-verify';
import { container } from 'tsyringe';
import DeviceCache from '@cache/device-cache';
import { externalSocketTopics } from '@src/external-socket-topics';
import { availableRooms } from '@src/available-rooms';
import { getPayloadSocketResponse } from '@utils/get-payload-socket-response';

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

const { DEVICE_MONITORING_ROOM } = availableRooms;

const deviceCache = container.resolve(DeviceCache);

export const socketReply = (socket: Socket, io: Server) => {
	// CLIENT-REPLY EMIT IN SOCKET-SERVER TO FINAL CONSUMING
	clientReply.on(MESSAGE, payload => {
		const responsePayload = getPayloadSocketResponse(MESSAGE, payload);
		io.to(DEVICE_MONITORING_ROOM).emit(MESSAGE, responsePayload);
	});

	clientReply.on(DEVICE, payload => {
		const responsePayload = getPayloadSocketResponse(DEVICE, payload);
		io.to(DEVICE_MONITORING_ROOM).emit(DEVICE, responsePayload);
	});

	clientReply.on(DEVICES, (payload: Device[]) => {
		const responsePayload = getPayloadSocketResponse<Device[]>(
			DEVICES,
			deviceCache.getAll()
		);

		// socket.emit(DEVICES, responsePayload);
		io.to(DEVICE_MONITORING_ROOM).emit(DEVICES, responsePayload);
	});

	clientReply.on(DEVICE_NEW, payload => {
		const responsePayload = getPayloadSocketResponse(DEVICE_NEW, payload);
		io.to(DEVICE_MONITORING_ROOM).emit(DEVICE_NEW, responsePayload);
	});

	clientReply.on(DEVICE_REMOVE, payload => {
		const responsePayload = getPayloadSocketResponse(DEVICE_REMOVE, payload);
		io.to(DEVICE_MONITORING_ROOM).emit(DEVICE_REMOVE, responsePayload);
	});

	clientReply.on(DEVICE_TRACKS, payload => {
		const responsePayload = getPayloadSocketResponse(DEVICE_TRACKS, payload);
		io.to(DEVICE_MONITORING_ROOM).emit(DEVICE_TRACKS, responsePayload);
	});

	clientReply.on(DEVICE_SETUP, payload => {
		const responsePayload = getPayloadSocketResponse(DEVICE_SETUP, payload);
		io.to(DEVICE_MONITORING_ROOM).emit(DEVICE_SETUP, responsePayload);
	});

	clientReply.on(DEVICE_STATE, payload => {
		const responsePayload = getPayloadSocketResponse(DEVICE_STATE, payload);
		io.to(DEVICE_MONITORING_ROOM).emit(DEVICE_STATE, responsePayload);
	});

	clientReply.on(DEVICE_CONFIG, payload => {
		const responsePayload = getPayloadSocketResponse(DEVICE_CONFIG, payload);
		io.to(DEVICE_MONITORING_ROOM).emit(DEVICE_CONFIG, responsePayload);
	});

	clientReply.on(DEVICE_LAST, (payload: { id: string; last: Track }) => {
		geofenceVerify({
			deviceId: payload.id,
			lastTrack: { ...payload.last },
			ioServer: io,
		});

		const responsePayload = getPayloadSocketResponse(DEVICE_LAST, payload);
		io.to(DEVICE_MONITORING_ROOM).emit(DEVICE_LAST, responsePayload);
	});

	clientReply.on(DEVICE_CLEARED, payload => {
		const responsePayload = getPayloadSocketResponse(DEVICE_CLEARED, payload);
		io.to(DEVICE_MONITORING_ROOM).emit(DEVICE_CLEARED, responsePayload);
	});

	clientReply.on(DEVICE_TRACK_END, payload => {
		const responsePayload = getPayloadSocketResponse(DEVICE_TRACK_END, payload);
		io.to(DEVICE_MONITORING_ROOM).emit(DEVICE_TRACK_END, responsePayload);
	});

	clientReply.on(DEVICE_SUBSCRIBE, payload => {
		const responsePayload = getPayloadSocketResponse(DEVICE_SUBSCRIBE, payload);
		io.to(DEVICE_MONITORING_ROOM).emit(DEVICE_SUBSCRIBE, responsePayload);
	});

	clientReply.on(DEVICE_UNSUBSCRIBE, payload => {
		const responsePayload = getPayloadSocketResponse(
			DEVICE_UNSUBSCRIBE,
			payload
		);
		io.to(DEVICE_MONITORING_ROOM).emit(DEVICE_UNSUBSCRIBE, responsePayload);
	});

	clientReply.on(DEVICE_UNSUBSCRIBE_ALL, payload => {
		const responsePayload = getPayloadSocketResponse(
			DEVICE_UNSUBSCRIBE_ALL,
			payload
		);
		io.to(DEVICE_MONITORING_ROOM).emit(DEVICE_UNSUBSCRIBE_ALL, responsePayload);
	});
};
