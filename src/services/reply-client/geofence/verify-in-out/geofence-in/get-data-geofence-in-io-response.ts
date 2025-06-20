import GeofenceInIoResponse from '@models/dto/response/socket/geofence-in-io-response';
import GeofenceIoResponse from '@models/dto/response/socket/geofence-io-response';
import GeofenceIn from '@models/entity/geofence-in';
import { getGeofenceInIoResponse } from '../get-geofence-in-io-response';
import { pipe } from '@maur025/core-common';

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
