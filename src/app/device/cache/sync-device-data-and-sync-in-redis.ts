import { loggerWarn } from '@maur025/core-logger';
import { Device } from '../entity/device';
import DeviceCache from './device-cache';
import { container } from 'tsyringe';
import { getMinutesOfTimestamp } from '@utils/get-minutes-of-timestamp';

export const syncDeviceDataAndSyncInRedis = async (
	deviceData: Device | null,
): Promise<void> => {
	if (!deviceData?.id) {
		loggerWarn(
			`(syncDeviceInRedis) device id is undefined or empty. Skipping...`,
		);
		return;
	}

	const timestampNow: number = Date.now();
	const deviceCache = container.resolve(DeviceCache);

	if (!deviceCache.hasId(deviceData.id)) {
		await deviceCache.syncDataInRedisCache(deviceData);
	}

	const deviceDataMap: Device | undefined = deviceCache.getById(deviceData.id);

	if (!deviceDataMap) {
		loggerWarn(`(syncDeviceInRedis) device data is undefined. Skipping...`);
		return;
	}

	const sinceLastUpdate: number = getMinutesOfTimestamp(
		timestampNow - (deviceDataMap?.lastRedisUpdate ?? 0),
	);

	if (sinceLastUpdate >= 12) {
		await deviceCache.syncDataInRedisCache(deviceData);
		return;
	}

	deviceCache.updateById(deviceData.id, {
		...deviceData,
		lastRedisUpdate: deviceDataMap.lastRedisUpdate,
	});
};
