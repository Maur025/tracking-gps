import { getGeofenceInIoResponse } from '../get-geofence-in-io-response';
import GeofenceIoResponse from '@models/to-delete/geofence-io-response';
import { pipe } from '@maur025/core-common';
import { GeofenceIn } from '@app/geofence/entity/geofence-in';

interface Request {
	geofenceInOutTransition: GeofenceIn[];
}

export const getDataGeofenceOutIoResponse = ({
	geofenceInOutTransition,
}: Request): GeofenceIoResponse[] =>
	pipe(geofenceInOutTransition, getGeofenceInIoResponse);
