import { redisClient } from '@config/redis/create-redis-client';
import Device from '@models/entity/device';

export const addDeviceBatchToRedis = async (
	deviceBatch: Device[],
	basekey: string
): Promise<number[]> =>
	Promise.all(
		deviceBatch.map(
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
				redisClient.hSet(`${basekey}${id}`, {
					id,
					config: JSON.stringify(config),
					type,
					elapsed,
					setup: JSON.stringify(setup),
					states: JSON.stringify(states),
					last: JSON.stringify(last),
					personal: JSON.stringify(personal),
				})
		)
	);
