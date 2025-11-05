import { GeofenceIn } from '@app/geofence/entity/geofence-in.js';
import { loggerDebug } from '@maur025/core-logger';

export const matchIsNewGeofenceIn = (
	geofenceInAllList: GeofenceIn[],
	geofenceInNewList: GeofenceIn[],
): void => {
	if (!geofenceInAllList.length || !geofenceInNewList.length) {
		loggerDebug(
			`[GEOFENCE] (matchIsNewGeofenceIn) nothing to match, skipping...`,
		);
		return;
	}

	const geofenceInNewMap: Set<string> = new Set<string>(
		geofenceInNewList.map(({ geofenceId }) => geofenceId),
	);

	for (const geofenceIn of geofenceInAllList) {
		if (geofenceInNewMap.has(geofenceIn.geofenceId)) {
			geofenceIn.isNew = true;

			continue;
		}

		geofenceIn.isNew = false;
	}
};
