import { getGeofenceOutMessage } from '../get-geofence-message';
import { loggerWarn } from '@maur025/core-logger';
import { GeofenceIn } from '@app/geofence/entity/geofence-in';

interface Request {
	deviceId: string;
	geofenceInOldSet?: Set<GeofenceIn>;
	geofenceInCurrentList?: GeofenceIn[];
}

/**
 * @deprecated it's marked, for possible useless
 */
export const emitGeofenceOut = ({
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

	const message: string = getGeofenceOutMessage(geofenceOutList);
	console.log('deviceId, ', deviceId);
	console.log('message, ', message);
};
