import { redisClient } from '@common/redis/create-redis-client';
import { loggerDebug, loggerWarn } from '@maur025/core-logger';
import { RediSearchSchema } from 'redis';

export const addRedisIdx = async (
	idx: string,
	objectToIndex: RediSearchSchema,
	prefix: string,
	typeOn: 'JSON' | 'HASH' = 'JSON',
): Promise<void> => {
	if (!idx || !prefix) {
		loggerWarn(
			`[REDIS] (addRedisIdx) idx or prefix must not be undefined, skiping ...`,
		);
		return;
	}

	const existingIndexes = await redisClient.ft._list();

	if (existingIndexes.includes(idx)) {
		loggerDebug(
			`[REDIS] (addRedisIdx) idx ${idx} already exists, skipping ...`,
		);
		return;
	}

	await redisClient.ft.create(
		idx,
		{ ...objectToIndex },
		{
			ON: typeOn,
			PREFIX: prefix,
		},
	);
};
