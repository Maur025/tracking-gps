import GeofenceInIoResponse from '@models/to-delete/geofence-in-io-response';
import GeofenceIoResponse from '@models/to-delete/geofence-io-response';
import { getGeofenceInIoResponse } from '../get-geofence-in-io-response';
import { pipe } from '@maur025/core-common';
import { GeofenceIn } from '@app/geofence/entity/geofence-in';

interface Request {
	deviceId: string;
	geofenceInList: GeofenceIn[];
}

export const getDataGeofenceInIoResponse = ({
	deviceId,
	geofenceInList,
}: Request): GeofenceInIoResponse =>
	pipe(
		geofenceInList,
		getGeofenceInIoResponse,
		(geofenceIoResponseList: GeofenceIoResponse[]): GeofenceInIoResponse => ({
			deviceId,
			geofences: geofenceIoResponseList,
			isInside: !geofenceIoResponseList.length,
		}),
	);
