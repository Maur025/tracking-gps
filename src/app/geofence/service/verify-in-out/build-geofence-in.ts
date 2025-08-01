import { Geofence } from '@app/geofence/entity/geofence';
import { GeofenceData } from '@app/geofence/entity/geofence-data';
import { GeofenceIn } from '@app/geofence/entity/geofence-in';

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
	const date: string = new Date().toISOString();

	return {
		deviceId,
		geofenceId,
		geofenceName,
		//section,
		id: section.id,
		//isInside: true,
		date,
	} as GeofenceIn;
};
