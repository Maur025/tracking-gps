import { redisClient } from '@config/redis/create-redis-client';

export const deleteDeviceCacheData = (
	deviceKeyBatch: string[]
): Promise<number[]> =>
	Promise.all(deviceKeyBatch.map(deviceKey => redisClient.del(deviceKey)));
