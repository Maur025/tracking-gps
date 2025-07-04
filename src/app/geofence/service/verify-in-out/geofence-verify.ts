import GeofenceCache from '@app/geofence/cache/geofence-cache';
import Track from '@models/entity/track';
import { Server } from 'socket.io';
import { container } from 'tsyringe';
import { getGeofenceInList } from './get-geofence-in-list';
import { syncGeofenceEventInCache } from './sync-geofence-event-in-cache';
import { GeofenceIn } from '@app/geofence/entity/geofence-in';

interface Request {
	deviceId: string;
	lastTrack: Track;
	ioServer: Server;
}

const geofenceCache = container.resolve(GeofenceCache);

export const geofenceVerify = ({
	deviceId,
	lastTrack,
	ioServer,
}: Request): void => {
	if (!geofenceCache.size()) {
		return;
	}

	const geofenceInList: GeofenceIn[] = getGeofenceInList({
		deviceId,
		lastTrack,
	});

	syncGeofenceEventInCache({ deviceId, ioServer, geofenceInList });
};
