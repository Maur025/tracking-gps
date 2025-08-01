import { redisClient } from '@common/redis/create-redis-client';
import { Geofence } from '../entity/geofence';

export const addGeofenceBatchToRedis = async (
	geofenceBatch: Geofence[],
	baseKey: string,
): Promise<unknown[] | null> => {
	if (!geofenceBatch?.length) {
		return null;
	}

	const multi = redisClient.multi();

	geofenceBatch.forEach(
		({
			id = '',
			layerId = '',
			name = '',
			description = '',
			color = '',
			icon = '',
			coords = '',
			data = {},
			layer = {},
		}) =>
			multi.json.set(`${baseKey}${id}`, '$', {
				id,
				layerId,
				name,
				description,
				color,
				icon,
				coords,
				data,
				layer,
			}),
	);

	return multi.exec();
};
