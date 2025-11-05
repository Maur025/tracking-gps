import GeofenceInCache from '@app/geofence/cache/geofence-in-cache.js';
import { addGeofenceEventLoggerByBatchs } from '@app/geofence/clickhouse/add-geofence-event-logger-by-batchs.js';
import { GeofenceIn } from '@app/geofence/entity/geofence-in.js';
import { removeDataInBatch } from '@common/redis/service/remove-data-in-batch.js';
import { loggerDebug } from '@maur025/core-logger';
import { container } from 'tsyringe';
import z, { array, object } from 'zod/v4';

const RemoveGeofenceOutOfCacheSchema = object({
	geofenceOutList: array(GeofenceIn).default([]),
});

type RemoveGeofenceOutOfCacheSchema = z.infer<
	typeof RemoveGeofenceOutOfCacheSchema
>;

export const removeGeofenceOutOfCache = async (
	request: RemoveGeofenceOutOfCacheSchema,
): Promise<void> => {
	const { geofenceOutList } = RemoveGeofenceOutOfCacheSchema.parse(request);

	if (!geofenceOutList?.length) {
		loggerDebug(
			`[GEOFENCE] (removeGeofenceOutOfCache) geofence out list is empty ... nothing to remove, skipping`,
		);

		return;
	}

	const geofenceInCache = container.resolve(GeofenceInCache);

	await removeDataInBatch<GeofenceIn>({
		dataList: geofenceOutList,
		dataBaseKey: geofenceInCache.getRedisKey(),
	});

	await addGeofenceEventLoggerByBatchs(geofenceOutList, 'OUT');
};
