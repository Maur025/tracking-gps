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
					spec: spec.name ? { ...spec } : '',
					config: config.IMEI ? { ...config } : '',
					type,
					elapsed,
					setup: setup.REQ_UPDATE ? { ...setup } : '',
					states: states.SPEED || states.SORTED ? { ...states } : '',
					last: last.t ? { ...last } : '',
					vehicleData: vehicleData.name ? { ...vehicleData } : '',
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
