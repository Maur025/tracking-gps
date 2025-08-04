import GeofenceInCache from '@app/geofence/cache/geofence-in-cache';
import { GeofenceIn } from '@app/geofence/entity/geofence-in';
import { container } from 'tsyringe';
import z, { array, object, string } from 'zod/v4';
import { addGeofenceInToCache } from './add-geofence-in-to-cache';

const GetNewGeofencesInSchema = object({
	deviceId: string().nonempty(),
	geofenceInFullList: array(GeofenceIn).default([]),
});
type GetNewGeofencesInSchema = z.infer<typeof GetNewGeofencesInSchema>;

export const getNewGeofencesIn = async (
	request: GetNewGeofencesInSchema,
): Promise<GeofenceIn[]> => {
	const { deviceId, geofenceInFullList } =
		GetNewGeofencesInSchema.parse(request);

	const geofenceInCache = container.resolve(GeofenceInCache);

	if (geofenceInCache.getCache().has(deviceId)) {
		await addGeofenceInToCache({ geofenceInList: geofenceInFullList });

		return changeIsNewToTrue(geofenceInFullList);
	}

	const lastGeofenceInCache: Map<string, GeofenceIn> | undefined =
		geofenceInCache.getCache().get(deviceId);

	if (!lastGeofenceInCache) {
		await addGeofenceInToCache({ geofenceInList: geofenceInFullList });

		return changeIsNewToTrue(geofenceInFullList);
	}

	const newGeofenceInList: GeofenceIn[] = [];

	for (const geofenceIn of geofenceInFullList) {
		if (lastGeofenceInCache.has(geofenceIn.geofenceId)) {
			continue;
		}

		newGeofenceInList.push(geofenceIn);
	}

	await addGeofenceInToCache({ geofenceInList: newGeofenceInList });
	return changeIsNewToTrue(newGeofenceInList);
};

const changeIsNewToTrue = (geofenceInList: GeofenceIn[]): GeofenceIn[] =>
	geofenceInList.map(geofenceIn => ({ ...geofenceIn, isNew: true }));
