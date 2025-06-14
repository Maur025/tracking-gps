import Device from '@models/entity/device';
import { container } from 'tsyringe';
import DeviceCache from '@cache/device-cache';
import { addDeviceBatchToRedis } from './add-device-batch-to-redis';
import { SCHEMA_FIELD_TYPE } from 'redis';
import { addRedisIdx } from '@services/redis/add-redis-idx';

export const addDeviceCacheData = async (
	deviceList: Device[]
): Promise<void> => {
	if (!deviceList?.length) {
		return;
	}

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

	await addRedisIdx(
		deviceCache.getIdxData(),
		{
			id: SCHEMA_FIELD_TYPE.TAG,
		},
		deviceCache.getRedisKey()
	);
};
