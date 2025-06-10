import { redisClient } from '@config/redis/create-redis-client';

export const deleteDeviceCacheData = (
	deviceBatch: string[]
): Promise<number[]> =>
	Promise.all(deviceBatch.map(deviceKey => redisClient.del(deviceKey)));
