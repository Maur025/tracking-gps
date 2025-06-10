import DeviceCache from '@cache/device-cache';
import { redisClient } from '@config/redis/create-redis-client';
import Device from '@models/entity/device';
import { container } from 'tsyringe';

export const addDeviceCacheData = async (
	deviceList: Device[]
): Promise<void> => {
	const BATCH_LIMIT: number = 50;
	const deviceBatch: Device[] = [];
	const deviceCache = container.resolve(DeviceCache);

	for (const device of deviceList) {
		deviceBatch.push(device);

		if (deviceBatch.length === BATCH_LIMIT) {
			await addDeviceBatchToRedis(deviceBatch, deviceCache.getRedisKey());

			deviceBatch.length = 0;
		}
	}

	if (deviceBatch.length) {
		await addDeviceBatchToRedis(deviceBatch, deviceCache.getRedisKey());

		deviceBatch.length = 0;
	}
};

const addDeviceBatchToRedis = async (
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
