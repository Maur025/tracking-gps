import { loggerDebug } from '@maur025/core-logger';
import { redisClient } from '../create-redis-client';

export const deleteDataInBatch = async (
	keyBatch: string[],
): Promise<unknown> => {
	if (!keyBatch?.length) {
		loggerDebug(`[REDIS] (deleteDataInBatch) key batch is empty, skipping...`);

		return;
	}

	const multi = redisClient.multi();

	keyBatch.forEach(key => multi.del(key));

	return multi.exec();
};
