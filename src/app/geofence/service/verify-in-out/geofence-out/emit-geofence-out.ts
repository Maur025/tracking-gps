import { emitSocketResponse } from '@utils/emit-socket-response';
import { Server } from 'socket.io';
import { getDataGeofenceOutIoResponse } from './get-data-geofence-out-io-response';
import { getGeofenceOutMessage } from '../get-geofence-message';
import { loggerWarn } from '@maur025/core-logger';
import { internalSocketTopics } from '@src/internal-socket-topics';
import { GeofenceIn } from '@app/geofence/entity/geofence-in';
import { GeofenceOutIoResponse } from '@app/geofence/dto/geofence-out-io-response';

interface Request {
	deviceId: string;
	ioServer: Server;
	geofenceInOldSet?: Set<GeofenceIn>;
	geofenceInCurrentList?: GeofenceIn[];
}

const { GEOFENCE_OUT_RESPONSE } = internalSocketTopics;

export const emitGeofenceOut = ({
	ioServer,
	deviceId,
	geofenceInOldSet,
	geofenceInCurrentList = [],
}: Request): void => {
	if (!geofenceInOldSet?.size) {
		loggerWarn(`geofence in data not found for comparison.`);
		return;
	}

	let geofenceOutList: GeofenceIn[] = [];

	if (!geofenceInCurrentList?.length) {
		geofenceOutList = Array.from(geofenceInOldSet);
	} else {
		geofenceOutList = Array.from(geofenceInOldSet).filter(
			geofenceIn =>
				!geofenceInCurrentList.some(({ id }) => geofenceIn.id === id),
		);
	}

	const geofenceOutIoResponse: GeofenceOutIoResponse = {
		deviceId,
		geofences: getDataGeofenceOutIoResponse({
			geofenceInOutTransition: geofenceOutList,
		}),
		isInside: false,
	};

	const message: string = getGeofenceOutMessage(geofenceOutList);

	emitSocketResponse<GeofenceOutIoResponse>({
		data: geofenceOutIoResponse,
		ioServer: ioServer,
		eventType: GEOFENCE_OUT_RESPONSE,
		message,
	});
};
