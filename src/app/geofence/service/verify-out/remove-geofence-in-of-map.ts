import GeofenceInCache from '@app/geofence/cache/geofence-in-cache';
import { GeofenceIn } from '@app/geofence/entity/geofence-in';
import { loggerDebug } from '@maur025/core-logger';
import { container } from 'tsyringe';

export const removeGeofenceInOfMap = (geofenceOutList: GeofenceIn[]): void => {
	const geofenceInCache = container.resolve(GeofenceInCache);

	const cache: Map<
		string,
		Map<string, GeofenceIn>
	> = geofenceInCache.getCache();

	for (const geofenceIn of geofenceOutList) {
		if (!cache.has(geofenceIn.deviceId)) {
			loggerDebug(
				`[GEOFENCE] (removeGeofenceInOfMap) nothing found, skipping...`,
			);

			continue;
		}

		const geofenceInData: Map<string, GeofenceIn> = cache.get(
			geofenceIn.deviceId,
		)!;

		if (geofenceInData.has(geofenceIn.geofenceId)) {
			geofenceInData.delete(geofenceIn.geofenceId);
		}
	}
};
