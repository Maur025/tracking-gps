import { redisClient } from '@common/redis/create-redis-client';
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
			spec = {},
			config = {},
			type = '',
			elapsed = 0,
			setup = {},
			states = {},
			last = {},
			vehicleData = {},
			groups = [],
			geofencesIn = {},
			geofencesOut = {},
			rulesApplied = [],
		}) => {
			const key: string = `${basekey}${id}`;

			return multi.json
				.set(key, '$', {
					id,
					spec: { ...spec },
					config: { ...config },
					type,
					elapsed,
					setup: { ...setup },
					states: { ...states },
					last: { ...last },
					vehicleData: { ...vehicleData },
					groups: [...groups],
					geofencesIn: { ...geofencesIn },
					geofencesOut: { ...geofencesOut },
					rulesApplied: [...rulesApplied],
				})
				.expire(key, 3600);
		},
	);

	return multi.exec();
};
