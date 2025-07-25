import GeofenceCache from '@app/geofence/cache/geofence-cache';
import { container } from 'tsyringe';
import { getGeofenceInList } from './get-geofence-in-list';
import { syncGeofenceEventInCache } from './sync-geofence-event-in-cache';
import { GeofenceIn } from '@app/geofence/entity/geofence-in';
import { Track } from '@app/track/entity/track';

interface Request {
	deviceId: string;
	lastTrack: Track;
}

const geofenceCache = container.resolve(GeofenceCache);

/**
 * @deprecated it's marked, for possible useless
 */
export const geofenceVerify = ({ deviceId, lastTrack }: Request): void => {
	if (!geofenceCache.size()) {
		return;
	}

	const geofenceInList: GeofenceIn[] = getGeofenceInList({
		deviceId,
		lastTrack,
	});

	syncGeofenceEventInCache({ deviceId, geofenceInList });
};
