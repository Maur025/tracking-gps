import { redisClient } from '@common/redis/create-redis-client';
import { Device } from '../entity/device';

export const getDeviceBatchFromRedis = async (
	deviceKeyBatch: string[],
): Promise<Device[]> => {
	if (!deviceKeyBatch?.length) {
		return [];
	}

	const multi = redisClient.multi();

	deviceKeyBatch.forEach(deviceKey => multi.json.get(deviceKey));

	return multi.exec() as Promise<unknown[]> as Promise<Device[]>;
};
