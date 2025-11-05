import { container } from 'tsyringe';
import { GeofenceIn } from '../entity/geofence-in.js';
import GeofenceInCache from './geofence-in-cache.js';

export const addGeofenceInToMap = (geofenceInList: GeofenceIn[]): void => {
	const geofenceInCache = container.resolve(GeofenceInCache);

	const cache: Map<
		string,
		Map<string, GeofenceIn>
	> = geofenceInCache.getCache();

	for (const geofenceIn of geofenceInList) {
		if (!cache.has(geofenceIn.deviceId)) {
			cache.set(geofenceIn.deviceId, new Map<string, GeofenceIn>());
		}

		const geofenceInData: Map<string, GeofenceIn> = cache.get(
			geofenceIn.deviceId,
		)!;

		geofenceInData.set(geofenceIn.geofenceId, geofenceIn);
	}
};
