import { container } from 'tsyringe';
import { GeofenceIn } from '../entity/geofence-in';
import GeofenceInCache from './geofence-in-cache';

export const addGeofenceInToMap = (geofenceInList: GeofenceIn[]): void => {
	const geofenceInCache = container.resolve(GeofenceInCache);

	for (const geofenceIn of geofenceInList) {
		const cache = geofenceInCache.getCache();

		if (!cache.has(geofenceIn.deviceId)) {
			cache.set(geofenceIn.deviceId, new Map<string, GeofenceIn>());
		}

		const geofenceInData: Map<string, GeofenceIn> = cache.get(
			geofenceIn.deviceId,
		)!;

		geofenceInData.set(geofenceIn.geofenceId, geofenceIn);
	}
};
