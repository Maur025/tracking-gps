import Geofence from '@models/entity/geofence';
import GeofenceData from '@models/entity/geofence-data';
import GeofenceIn from '@models/entity/geofence-in';

interface Request {
	deviceId: string;
	geofence: Geofence;
	section: GeofenceData;
}

export const buildGeofenceIn = ({
	deviceId,
	geofence: { id: geofenceId = '', name: geofenceName = 'No name' },
	section,
}: Request): GeofenceIn => {
	return {
		deviceId,
		geofenceId,
		geofenceName,
		section,
		sectionInternalId: section.internalId,
		isInside: true,
	};
};
