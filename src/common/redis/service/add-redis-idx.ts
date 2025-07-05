import { redisClient } from '@common/redis/create-redis-client';
import { loggerWarn } from '@maur025/core-logger';

export const addRedisIdx = async (
	idx: string,
	objectToIndex: object,
	prefix: string,
	typeOn: 'JSON' | 'HASH' = 'JSON',
): Promise<void> => {
	if (!idx || !prefix) {
		loggerWarn(`idx or prefix must not be undefined, skiping ...`);
		return;
	}

	const existingIndexes = await redisClient.ft._list();

	if (existingIndexes.includes(idx)) {
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
