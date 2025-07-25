import { connectReply } from '@socket/client/socket-track-reply-client';
import { Server, Socket } from 'socket.io';
import { Socket as SocketClient } from 'socket.io-client';
import { geofenceVerify } from '@app/geofence/service/verify-in-out/geofence-verify';
import { container } from 'tsyringe';
import { externalSocketTopics } from '@src/external-socket-topics';
import { availableRooms } from '@src/available-rooms';
import { getPayloadSocketResponse } from '@utils/get-payload-socket-response';
import DeviceCache from '@app/device/cache/device-cache';
import { Device } from '@app/device/entity/device';
import { Track } from '@app/track/entity/track';
import { internalSocketTopics } from '@src/internal-socket-topics';
import { groupVehiclePairing } from '@app/vehicle/service/group-vehicle-pairing';

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

const { VEHICLE_SORTBY_GEOFENCE_RESPONSE, VEHICLE_SORTBY_GROUP_RESPONSE } =
	internalSocketTopics;

const { DEVICE_MONITORING_ROOM } = availableRooms;

const deviceCache = container.resolve(DeviceCache);

export const socketReply = (socket: Socket, io: Server) => {
	//remove listener
	clientReply.off(MESSAGE);
	clientReply.off(DEVICE);
	clientReply.off(DEVICES);
	clientReply.off(DEVICE_NEW);
	clientReply.off(DEVICE_REMOVE);
	clientReply.off(DEVICE_TRACKS);
	clientReply.off(DEVICE_SETUP);
	clientReply.off(DEVICE_STATE);
	clientReply.off(DEVICE_CONFIG);
	clientReply.off(DEVICE_LAST);
	clientReply.off(DEVICE_CLEARED);
	clientReply.off(DEVICE_TRACK_END);
	clientReply.off(DEVICE_SUBSCRIBE);
	clientReply.off(DEVICE_UNSUBSCRIBE);
	clientReply.off(DEVICE_UNSUBSCRIBE_ALL);

	// CLIENT-REPLY EMIT IN SOCKET-SERVER TO FINAL CONSUMING
	//add listener
	clientReply.on(MESSAGE, (payload: unknown): void => {
		const responsePayload = getPayloadSocketResponse(MESSAGE, payload);
		io.to(DEVICE_MONITORING_ROOM).emit(MESSAGE, responsePayload);

		// remove latest
		socket.emit(MESSAGE, payload);
	});

	clientReply.on(DEVICE, (payload: unknown): void => {
		const responsePayload = getPayloadSocketResponse(DEVICE, payload);
		io.to(DEVICE_MONITORING_ROOM).emit(DEVICE, responsePayload);

		// remove latest
		socket.emit(DEVICE, payload);
	});

	clientReply.on(DEVICES, (payload: Device[]): void => {
		const responsePayload = getPayloadSocketResponse<Device[]>(
			DEVICES,
			deviceCache.getAll(),
		);

		io.to(DEVICE_MONITORING_ROOM).emit(DEVICES, responsePayload);

		const groupVehicle = groupVehiclePairing(payload);
		const groupVehicleResponse = getPayloadSocketResponse(
			VEHICLE_SORTBY_GEOFENCE_RESPONSE,
			groupVehicle,
		);

		socket.emit(VEHICLE_SORTBY_GROUP_RESPONSE, groupVehicleResponse);

		const geofenceVehicleResponse = getPayloadSocketResponse(
			VEHICLE_SORTBY_GEOFENCE_RESPONSE,
			{},
		);

		socket.emit(VEHICLE_SORTBY_GEOFENCE_RESPONSE, geofenceVehicleResponse);

		socket.emit(DEVICES, deviceCache.getAll());
	});

	clientReply.on(DEVICE_NEW, payload => {
		const responsePayload = getPayloadSocketResponse(DEVICE_NEW, payload);
		io.to(DEVICE_MONITORING_ROOM).emit(DEVICE_NEW, responsePayload);

		// remove latest
		socket.emit(DEVICE_NEW, payload);
	});

	clientReply.on(DEVICE_REMOVE, payload => {
		const responsePayload = getPayloadSocketResponse(DEVICE_REMOVE, payload);
		io.to(DEVICE_MONITORING_ROOM).emit(DEVICE_REMOVE, responsePayload);

		// remove latest
		socket.emit(DEVICE_REMOVE, payload);
	});

	clientReply.on(DEVICE_TRACKS, payload => {
		const responsePayload = getPayloadSocketResponse(DEVICE_TRACKS, payload);
		io.to(DEVICE_MONITORING_ROOM).emit(DEVICE_TRACKS, responsePayload);

		// remove latest
		socket.emit(DEVICE_TRACKS, payload);
	});

	clientReply.on(DEVICE_SETUP, payload => {
		const responsePayload = getPayloadSocketResponse(DEVICE_SETUP, payload);
		io.to(DEVICE_MONITORING_ROOM).emit(DEVICE_SETUP, responsePayload);

		// remove latest
		socket.emit(DEVICE_SETUP, payload);
	});

	clientReply.on(DEVICE_STATE, payload => {
		const responsePayload = getPayloadSocketResponse(DEVICE_STATE, payload);
		io.to(DEVICE_MONITORING_ROOM).emit(DEVICE_STATE, responsePayload);

		// remove latest
		socket.emit(DEVICE_STATE, payload);
	});

	clientReply.on(DEVICE_CONFIG, payload => {
		const responsePayload = getPayloadSocketResponse(DEVICE_CONFIG, payload);
		io.to(DEVICE_MONITORING_ROOM).emit(DEVICE_CONFIG, responsePayload);

		// remove latest
		socket.emit(DEVICE_CONFIG, payload);
	});

	clientReply.on(DEVICE_LAST, (payload: { id: string; last: Track }) => {
		geofenceVerify({
			deviceId: payload.id,
			lastTrack: { ...payload.last },
			ioServer: io,
		});

		const responsePayload = getPayloadSocketResponse(DEVICE_LAST, payload);
		io.to(DEVICE_MONITORING_ROOM).emit(DEVICE_LAST, responsePayload);

		// remove latest
		socket.emit(DEVICE_LAST, payload);
	});

	clientReply.on(DEVICE_CLEARED, payload => {
		const responsePayload = getPayloadSocketResponse(DEVICE_CLEARED, payload);
		io.to(DEVICE_MONITORING_ROOM).emit(DEVICE_CLEARED, responsePayload);

		// remove latest
		socket.emit(DEVICE_CLEARED, payload);
	});

	clientReply.on(DEVICE_TRACK_END, payload => {
		const responsePayload = getPayloadSocketResponse(DEVICE_TRACK_END, payload);
		io.to(DEVICE_MONITORING_ROOM).emit(DEVICE_TRACK_END, responsePayload);

		// remove latest
		socket.emit(DEVICE_TRACK_END, payload);
	});

	clientReply.on(DEVICE_SUBSCRIBE, payload => {
		const responsePayload = getPayloadSocketResponse(DEVICE_SUBSCRIBE, payload);
		io.to(DEVICE_MONITORING_ROOM).emit(DEVICE_SUBSCRIBE, responsePayload);

		// remove latest
		socket.emit(DEVICE_SUBSCRIBE, payload);
	});

	clientReply.on(DEVICE_UNSUBSCRIBE, payload => {
		const responsePayload = getPayloadSocketResponse(
			DEVICE_UNSUBSCRIBE,
			payload,
		);
		io.to(DEVICE_MONITORING_ROOM).emit(DEVICE_UNSUBSCRIBE, responsePayload);

		// remove latest
		socket.emit(DEVICE_UNSUBSCRIBE, payload);
	});

	clientReply.on(DEVICE_UNSUBSCRIBE_ALL, payload => {
		const responsePayload = getPayloadSocketResponse(
			DEVICE_UNSUBSCRIBE_ALL,
			payload,
		);
		io.to(DEVICE_MONITORING_ROOM).emit(DEVICE_UNSUBSCRIBE_ALL, responsePayload);

		// remove latest
		socket.emit(DEVICE_UNSUBSCRIBE_ALL, payload);
	});
};
