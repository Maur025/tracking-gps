import { redisClient } from '@common/redis/create-redis-client';
import { GeofenceIn } from '../entity/geofence-in';

export const addGeofenceInBatchToRedis = async (
	geofenceInBatch: GeofenceIn[],
	baseKey: string,
): Promise<unknown[] | null> => {
	if (!geofenceInBatch?.length) {
		return null;
	}

	const multi = redisClient.multi();

	geofenceInBatch.forEach(
		({
			id = '',
			deviceId,
			geofenceId,
			geofenceName,
			layerId,
			layerName,
			timestamp,
			date,
			positionCoords,
			area,
			radius,
			type,
			isNew,
		}) =>
			multi.json.set(`${baseKey}${id}`, '$', {
				id,
				deviceId,
				geofenceId,
				geofenceName,
				layerId,
				layerName,
				timestamp: timestamp,
				date: date.toString(),
				positionCoords: positionCoords.toString(),
				area: area ?? 0,
				radius: radius ?? 0,
				type: type,
				isNew: isNew?.toString(),
			}),
	);

	return multi.exec();
};
