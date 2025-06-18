import GeofenceInIoResponse from '@models/dto/response/socket/geofence-in-io-response';
import GeofenceIn from '@models/entity/geofence-in';
import { emitSocketResponse } from '@utils/emit-socket-response';
import { Server } from 'socket.io';
import { getGeofenceInMessage } from '../get-geofence-message';
import { getDataGeofenceInIoResponse } from './get-data-geofence-in-io-response';
import { internalSocketTopics } from '@src/internal-socket-topics';

interface Request {
	deviceId: string;
	ioServer: Server;
	geofenceInList: GeofenceIn[];
}

const { GEOFENCE_IN_RESPONSE } = internalSocketTopics;

export const emitGeofenceIn = ({
	deviceId,
	ioServer,
	geofenceInList,
}: Request) => {
	const geofenceInIoResponse: GeofenceInIoResponse =
		getDataGeofenceInIoResponse({
			deviceId,
			geofenceInList,
		});

	const message = getGeofenceInMessage(geofenceInList);

	emitSocketResponse<GeofenceInIoResponse>({
		data: geofenceInIoResponse,
		ioServer: ioServer,
		eventType: GEOFENCE_IN_RESPONSE,
		message,
	});
};
