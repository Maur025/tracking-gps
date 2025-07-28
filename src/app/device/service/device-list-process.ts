import { container } from 'tsyringe';
import { addDeviceCacheData } from '@app/device/cache/add-device-cache-data';
import { loggerWarn } from '@maur025/core-logger';
import DeviceCache from '../cache/device-cache';
import { Device } from '../entity/device';

interface Request {
	deviceList: Device[];
}

/**
 * @deprecated it's marked, for possible useless
 */
export const deviceListProcess = async ({
	deviceList,
}: Request): Promise<void> => {
	const deviceCache = container.resolve(DeviceCache);

	await deviceCache.clearCacheData();

	if (!deviceList?.length) {
		loggerWarn(
			`device list must not be empty or undefined, skipping initialization ...`,
		);

		return;
	}

	await addDeviceCacheData(deviceList);

	await deviceCache.loadCacheData();
};
