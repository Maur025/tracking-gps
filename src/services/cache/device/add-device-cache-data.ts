import Device from '@models/entity/device';
import { container } from 'tsyringe';
import DeviceCache from '@cache/device-cache';
import { addDeviceBatchToRedis } from './add-device-batch-to-redis';

export const addDeviceCacheData = async (
	deviceList: Device[]
): Promise<void> => {
	const BATCH_LIMIT: number = 50;
	let deviceBatch: Device[] = [];
	const deviceCache = container.resolve(DeviceCache);

	for (const device of deviceList) {
		deviceBatch.push(device);

		if (deviceBatch.length === BATCH_LIMIT) {
			await addDeviceBatchToRedis(deviceBatch, deviceCache.getRedisKey());

			deviceBatch = [];
		}
	}

	if (deviceBatch.length) {
		await addDeviceBatchToRedis(deviceBatch, deviceCache.getRedisKey());

		deviceBatch = [];
	}
};
