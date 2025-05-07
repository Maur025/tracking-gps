import GeofenceOutIoResponse from '@models/dto/response/socket/geofence-out-io-response';
import GeofenceIn from '@models/entity/geofence-in';
import { Topics } from '@models/enums/topics.enum';
import { emitSocketResponse } from '@utils/emit-socket-response';
import { loggerWarn } from '@utils/logger';
import { Server } from 'socket.io';
import { getDataGeofenceOutIoResponse } from './get-data-geofence-out-io-response';
import { getGeofenceOutMessage } from '../get-geofence-message';

interface Request {
	deviceId: string;
	ioServer: Server;
	geofenceInOldSet?: Set<GeofenceIn>;
	geofenceInCurrentList?: GeofenceIn[];
}

const { GEOFENCE_OUT } = Topics;

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
				!geofenceInCurrentList.some(
					({ sectionInternalId }) =>
						geofenceIn.sectionInternalId === sectionInternalId
				)
		);
	}

	let geofenceOutIoResponse: GeofenceOutIoResponse = {
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
		eventType: GEOFENCE_OUT,
		message,
	});
};
