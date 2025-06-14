import { redisClient } from '@config/redis/create-redis-client';

export const addRedisIdx = async (
	idx: string,
	objectToIndex: object,
	prefix: string,
	typeOn: 'JSON' | 'HASH' = 'JSON'
): Promise<void> => {
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
		}
	);
};
