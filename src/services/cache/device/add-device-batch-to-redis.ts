import { redisClient } from '@config/redis/create-redis-client';
import Device from '@models/entity/device';

export const addDeviceBatchToRedis = async (
	deviceBatch: Device[],
	basekey: string
): Promise<('OK' | null)[]> =>
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
				redisClient.json.set(`${basekey}${id}`, '$', {
					id,
					config: { ...config },
					type,
					elapsed,
					setup: { ...setup },
					states: { ...states },
					last: { ...last },
					personal: { ...personal },
				})
		)
	);
