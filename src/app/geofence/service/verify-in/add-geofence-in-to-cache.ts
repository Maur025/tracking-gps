import { addGeofenceInBatchToRedis } from '@app/geofence/cache/add-geofence-in-batch-to-redis.js';
import { addGeofenceInToMap } from '@app/geofence/cache/add-geofence-in-to-map.js';
import GeofenceInCache from '@app/geofence/cache/geofence-in-cache.js';
import { addGeofenceEventLoggerByBatchs } from '@app/geofence/clickhouse/add-geofence-event-logger-by-batchs.js';
import { GeofenceIn } from '@app/geofence/entity/geofence-in.js';
import { addDataInBatch } from '@common/redis/service/add-data-in-batch.js';
import { loggerDebug } from '@maur025/core-logger';
import { container } from 'tsyringe';
import z, { object, array } from 'zod/v4';

const AddGeofenceInToCacheSchema = object({
	geofenceInList: array(GeofenceIn).default([]),
});

type AddGeofenceInToCacheSchema = z.infer<typeof AddGeofenceInToCacheSchema>;

export const addGeofenceInToCache = async (
	request: AddGeofenceInToCacheSchema,
): Promise<void> => {
	const { geofenceInList } = AddGeofenceInToCacheSchema.parse(request);

	if (!geofenceInList?.length) {
		loggerDebug(
			`[GEOFENCE] (addGeofenceInToCache) geofence in list is empty ... nothing to add, skipping`,
		);

		return;
	}

	const geofenceInCache = container.resolve(GeofenceInCache);

	await addDataInBatch<GeofenceIn>({
		dataList: geofenceInList,
		dataBaseKey: geofenceInCache.getRedisKey(),
		registerInRedisFn: addGeofenceInBatchToRedis,
	});

	addGeofenceInToMap(geofenceInList);

	await addGeofenceEventLoggerByBatchs(geofenceInList, 'IN');
};
