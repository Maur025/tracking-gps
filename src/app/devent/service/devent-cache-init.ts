import z, { array, object } from 'zod/v4';
import { DeventResponse } from '../dto/response/devent-response';
import { loggerError } from '@maur025/core-logger';
import { container } from 'tsyringe';
import DeventCache from '../cache/devent-cache';
import { Devent } from '../entity/devent';
import { DeventType } from '../entity/devent-type';
import { DeventCondition } from '../entity/devent-condition';
import { getDeventSensorList } from './get-devent-sensor-list';
import { addDataInBatch } from '@common/redis/service/add-data-in-batch';
import { addDeventBatchToRedis } from '../cache/add-devent-batch-to-redis';

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
