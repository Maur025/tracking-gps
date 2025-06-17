import { redisClient } from '@config/redis/create-redis-client';

export const deleteDeviceCacheData = async (
	deviceKeyBatch: string[]
): Promise<unknown> => {
	if (!deviceKeyBatch?.length) {
		return;
	}

	const multi = redisClient.multi();
	deviceKeyBatch.forEach(deviceKey => multi.del(deviceKey));

	return multi.exec();
};
