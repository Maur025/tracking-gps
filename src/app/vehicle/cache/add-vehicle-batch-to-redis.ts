import { redisClient } from '@common/redis/create-redis-client';
import { Vehicle } from '../entity/vehicle';

export const addVehicleBatchToRedis = async (
	vehicleBatch: Vehicle[],
	baseKey: string,
): Promise<unknown[] | null> => {
	if (!vehicleBatch?.length) {
		return null;
	}

	const multi = redisClient.multi();

	vehicleBatch.forEach(
		({
			id = '',
			deviceId = '',
			devices = [],
			name = '',
			type = '',
			metadata = {},
		}) =>
			multi.json.set(`${baseKey}${id}`, '$', {
				id,
				deviceId,
				devices,
				name,
				type,
				metadata,
			}),
	);

	return multi.exec();
};
