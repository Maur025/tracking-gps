import { emitSocketResponse } from '@utils/emit-socket-response';
import { Server } from 'socket.io';
import { getGeofenceInMessage } from '../get-geofence-message';
import { getDataGeofenceInIoResponse } from './get-data-geofence-in-io-response';
import { internalSocketTopics } from '@src/internal-socket-topics';
import { GeofenceIn } from '@app/geofence/entity/geofence-in';
import { GeofenceInIoResponse } from '@app/geofence/dto/geofence-in-io-response';

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
