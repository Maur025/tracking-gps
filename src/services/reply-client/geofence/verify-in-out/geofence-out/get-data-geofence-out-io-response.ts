import GeofenceOutIoResponse from '@models/dto/response/socket/geofence-out-io-response';
import GeofenceIn from '@models/entity/geofence-in';
import { pipe } from '@utils/pipe-util';
import { getGeofenceInIoResponse } from '../get-geofence-in-io-response';
import GeofenceIoResponse from '@models/dto/response/socket/geofence-io-response';

interface Request {
	geofenceInOutTransition: GeofenceIn[];
}

export const getDataGeofenceOutIoResponse = ({
	geofenceInOutTransition,
}: Request): GeofenceIoResponse[] =>
	pipe(geofenceInOutTransition, getGeofenceInIoResponse);
