import Geofence from '@models/entity/geofence';
import GeofenceData from '@models/entity/geofence-data';
import GeofenceIn from '@models/entity/geofence-in';
import Track from '@models/entity/track';
import { buildGeofenceIn } from './build-geofence-in';
import { getPolygonByCoords } from './get-geofence-polygon-by-coords';
import { Polygon } from 'ol/geom.js';
import { fromLonLat } from 'ol/proj.js';

interface Request {
	deviceId: string;
	lastTrack: Track;
	geofence: Geofence;
	section: GeofenceData;
}

export const processCasePolygonSection = ({
	deviceId,
	lastTrack: { lon = 0, lat = 0 },
	geofence,
	section,
}: Request): GeofenceIn[] => {
	const { coords } = section;

	if (!coords) {
		return [];
	}

	const polygon: Polygon = getPolygonByCoords({ coords });

	const isInside: boolean = polygon.intersectsCoordinate(
		fromLonLat([lon, lat])
	);

	if (isInside) {
		return [buildGeofenceIn({ deviceId, geofence, section })];
	}

	return [];
};
