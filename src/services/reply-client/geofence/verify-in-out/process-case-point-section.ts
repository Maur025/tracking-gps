import Geofence from '@models/entity/geofence';
import GeofenceData from '@models/entity/geofence-data';
import GeofenceIn from '@models/entity/geofence-in';
import Track from '@models/entity/track';
import { getDistance } from 'ol/sphere';
import { buildGeofenceIn } from './build-geofence-in';

interface Request {
	deviceId: string;
	lastTrack: Track;
	geofence: Geofence;
	section: GeofenceData;
}

export const processCasePointSection = ({
	deviceId,
	lastTrack: { lat = 0, lon = 0 },
	geofence,
	section,
}: Request): GeofenceIn[] => {
	const { coords, radius = 0 } = section;

	if (!coords) {
		return [];
	}

	const distanceBetweenPoints: number = getDistance(coords, [lon, lat]);

	if (!distanceBetweenPoints || distanceBetweenPoints > radius) {
		return [];
	}

	return [buildGeofenceIn({ deviceId, geofence, section })];
};
