import { container } from 'tsyringe';
import {
	generateFakePrefix,
	randomLetters,
	randomNumberByRange,
} from '@utils/random-number-by-range';
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

	// adding fake data: remove when fixed devices with vehicles problems
	for (const device of deviceList) {
		const plaque: string = `${randomNumberByRange(3, 4)}${randomLetters()}`;
		const prefix: string = generateFakePrefix();
		let icon = 'fa-truck-moving';

		if (prefix === 'V') {
			icon = 'fa-car-side';
		}
		if (prefix === 'S') {
			icon = 'fa-truck-field';
		}

		device.personal = {
			plaque,
			name: `${prefix}-${plaque}`,
			icon,
		};
	}

	await addDeviceCacheData(deviceList);

	await deviceCache.loadCacheData();
};
