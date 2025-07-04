import { redisClient } from '@config/redis/create-redis-client';
import { Device } from '../entity/device';

export const addDeviceBatchToRedis = async (
	deviceBatch: Device[],
	basekey: string,
): Promise<unknown[] | null> => {
	if (!deviceBatch?.length) {
		return null;
	}

	const multi = redisClient.multi();

	deviceBatch.forEach(
		({
			id = '',
			config = {},
			type = '',
			elapsed = 0,
			setup = {},
			states = {},
			last = {},
			personal = {},
		}) =>
			multi.json.set(`${basekey}${id}`, '$', {
				id,
				config: { ...config },
				type,
				elapsed,
				setup: { ...setup },
				states: { ...states },
				last: { ...last },
				personal: { ...personal },
			}),
	);

	return multi.exec();
};
