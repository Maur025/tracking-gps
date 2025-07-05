import { getGeofenceInIoResponse } from '../get-geofence-in-io-response';
import { pipe } from '@maur025/core-common';
import { GeofenceIn } from '@app/geofence/entity/geofence-in';
import { GeofenceIoResponse } from '@app/geofence/dto/geofence-io-response';

interface Request {
	geofenceInOutTransition: GeofenceIn[];
}

export const getDataGeofenceOutIoResponse = ({
	geofenceInOutTransition,
}: Request): GeofenceIoResponse[] =>
	pipe(geofenceInOutTransition, getGeofenceInIoResponse);
