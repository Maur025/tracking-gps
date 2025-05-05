import GeofenceCache from '@cache/geofence-cache';
import Track from '@models/entity/track';
import { Socket } from 'socket.io';
import { container } from 'tsyringe';
import { getGeofenceInList } from './geofence/verify-in-out/get-geofence-in-list';
import { emitSocketResponse } from '@utils/emit-socket-response';
import GeofenceInIoResponse from '@models/dto/response/socket/geofence-in-io-response';
import { Topics } from '../../models/enums/topics.enum';
import GeofenceIn from '@models/entity/geofence-in';
import GeofenceIoResponse from '@models/dto/response/socket/geofence-io-response';

interface Request {
	deviceId: string;
	lastTrack: Track;
	socketServer: Socket;
}
const { GEOFENCE_IN } = Topics;
const geofenceCache = container.resolve(GeofenceCache);

export const geofenceVerify = ({
	deviceId,
	lastTrack,
	socketServer,
}: Request): void => {
	if (!geofenceCache.size()) {
		return;
	}

	const geofenceInList: GeofenceIn[] = getGeofenceInList({
		deviceId,
		lastTrack,
	});

	console.log(geofenceInList);
	console.log('=================================');

	const geofenceInIoResponse: GeofenceInIoResponse = getGeofenceInIoResponse(
		deviceId,
		geofenceInList
	);

	emitSocketResponse<GeofenceInIoResponse>({
		data: geofenceInIoResponse,
		socket: socketServer,
		eventType: GEOFENCE_IN,
		message: ``,
	});
};

const getGeofenceInIoResponse = (
	deviceId: string,
	geofenceInList: GeofenceIn[]
): GeofenceInIoResponse => {
	const geofenceInIdList: string[] = geofenceInList.map(
		({ geofenceId }) => geofenceId
	);

	const geofenceInIdSet: Set<string> = new Set(geofenceInIdList);

	let geofenceIoResponseList: GeofenceIoResponse[] = [];

	for (const geofenceId of geofenceInIdSet) {
		// const geofenceIoResponse: GeofenceIoResponse = [];
		console.log(geofenceId);
	}

	return { deviceId, geofences: geofenceIoResponseList, isInside: true };
};
