import z, { array, object } from 'zod/v4';
import { DeventResponse } from '../dto/response/devent-response.js';
import { loggerError } from '@maur025/core-logger';
import { container } from 'tsyringe';
import DeventCache from '../cache/devent-cache.js';
import { Devent } from '../entity/devent.js';
import { DeventType } from '../entity/devent-type.js';
import { DeventCondition } from '../entity/devent-condition.js';
import { getDeventSensorList } from './get-devent-sensor-list.js';
import { addDataInBatch } from '@common/redis/service/add-data-in-batch.js';
import { addDeventBatchToRedis } from '../cache/add-devent-batch-to-redis.js';

const DeventCacheInitRequest = object({
	deventResponseList: array(DeventResponse).default([]),
});

type DeventCacheInitRequest = z.infer<typeof DeventCacheInitRequest>;

export const deventCacheInit = async (
	request: DeventCacheInitRequest,
): Promise<void> => {
	const { deventResponseList } = DeventCacheInitRequest.parse(request);

	if (!deventResponseList?.length) {
		loggerError(
			`[DEVENT] (deventCacheInit) devent response undefined or empty`,
		);

		return;
	}

	const deventCache = container.resolve(DeventCache);

	const deventList: Devent[] = await Promise.all(
		deventResponseList.map(
			async ({ id, name, devent_type, condition, sensors }) => ({
				id,
				name,
				deventType: DeventType.parse(devent_type),
				condition: DeventCondition.parse(condition),
				sensors: await getDeventSensorList(sensors),
			}),
		),
	);

	deventCache.addMany(deventList);

	await addDataInBatch<Devent>({
		dataList: deventList,
		dataBaseKey: deventCache.getRedisKey(),
		registerInRedisFn: addDeventBatchToRedis,
	});
};
