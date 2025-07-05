import { getGeofenceInIoResponse } from '../get-geofence-in-io-response';
import { pipe } from '@maur025/core-common';
import { GeofenceIn } from '@app/geofence/entity/geofence-in';
import { GeofenceIoResponse } from '@app/geofence/dto/geofence-io-response';
import { GeofenceInIoResponse } from '@app/geofence/dto/geofence-in-io-response';

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
