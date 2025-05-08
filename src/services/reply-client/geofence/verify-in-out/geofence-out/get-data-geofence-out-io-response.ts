import GeofenceIn from '@models/entity/geofence-in';
import { getGeofenceInIoResponse } from '../get-geofence-in-io-response';
import GeofenceIoResponse from '@models/dto/response/socket/geofence-io-response';
import { pipe } from '@maur025/core-common';

interface Request {
	geofenceInOutTransition: GeofenceIn[];
}

export const getDataGeofenceOutIoResponse = ({
	geofenceInOutTransition,
}: Request): GeofenceIoResponse[] =>
	pipe(geofenceInOutTransition, getGeofenceInIoResponse);
