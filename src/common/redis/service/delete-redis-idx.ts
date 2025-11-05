import { redisClient } from '@common/redis/create-redis-client.js';
import { loggerDebug } from '@maur025/core-logger';

export const deleteRedisIdx = async (idx?: string): Promise<void> => {
	if (!idx) {
		loggerDebug(
			`[REDIS] (deleteRedisIdx) idx must not be undefined, skipping ...`,
		);

		return;
	}

	const existingIndexes: string[] = await redisClient.ft._list();

	if (!existingIndexes.includes(idx)) {
		loggerDebug(
			`[REDIS] (deleteRedisIdx) idx ${idx} does not exist, skipping ...`,
		);

		return;
	}

	await redisClient.ft.dropIndex(idx, { DD: true });
};
