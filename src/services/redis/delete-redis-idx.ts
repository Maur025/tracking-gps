import { redisClient } from '@config/redis/create-redis-client';

export const deleteRedisIdx = async (idx?: string): Promise<void> => {
	if (!idx) {
		return;
	}

	const existingIndexes: string[] = await redisClient.ft._list();

	if (!existingIndexes.includes(idx)) {
		return;
	}

	await redisClient.ft.dropIndex(idx, { DD: true });
};
