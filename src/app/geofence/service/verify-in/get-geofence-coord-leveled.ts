import { loggerDebug } from '@maur025/core-logger';
import { getArrayDeepLevel } from '@utils/get-array-deep-level';

export const getGeofenceCoordLeveled = (
	geofenceCoords: unknown,
	levelReturn: number,
): unknown => {
	const arrayDeepLevel: number = getArrayDeepLevel(geofenceCoords);

	if (arrayDeepLevel === levelReturn) {
		return geofenceCoords;
	}

	if (arrayDeepLevel > levelReturn) {
		return (geofenceCoords as Array<unknown>).flat(
			arrayDeepLevel - levelReturn,
		);
	}

	loggerDebug(
		`[GEOFENCE] (getGeofenceCoords) array coords ${arrayDeepLevel} level is less than ${levelReturn} required level`,
	);

	return geofenceCoords;
};
