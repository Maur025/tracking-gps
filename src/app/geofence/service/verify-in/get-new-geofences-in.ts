import GeofenceInCache from '@app/geofence/cache/geofence-in-cache.js';
import { GeofenceIn } from '@app/geofence/entity/geofence-in.js';
import { container } from 'tsyringe';
import z, { array, object, string } from 'zod/v4';
import { addGeofenceInToCache } from './add-geofence-in-to-cache.js';
import { loggerDebug } from '@maur025/core-logger';

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

	const cache: Map<
		string,
		Map<string, GeofenceIn>
	> = geofenceInCache.getCache();

	const geofenceOnlyInList = geofenceInFullList.filter(
		geofenceInteraction => geofenceInteraction.finalState === 'IN',
	);

	if (!cache.has(deviceId)) {
		loggerDebug(
			`[GEOFENCE] (getNewGeofencesIn) no cache for deviceId ${deviceId}, init device id and adding all in list...`,
		);

		await addGeofenceInToCache({ geofenceInList: geofenceOnlyInList });

		return changeIsNewToTrue(geofenceInFullList);
	}

	const lastGeofenceInCache: Map<string, GeofenceIn> | undefined =
		cache.get(deviceId);

	if (!lastGeofenceInCache) {
		loggerDebug(
			`[GEOFENCE] (getNewGeofencesIn) lastGeofenceInCache is void or undefined, adding all in list...`,
		);
		await addGeofenceInToCache({ geofenceInList: geofenceOnlyInList });

		return changeIsNewToTrue(geofenceInFullList);
	}

	loggerDebug(
		`[GEOFENCE] (getNewGeofencesIn) checking for new geofences in cache list, compare previous with current...`,
	);

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
	geofenceInList.map(geofenceIn => {
		if (geofenceIn.finalState === 'IN') {
			return { ...geofenceIn, isNew: true };
		}

		return geofenceIn;
	});
