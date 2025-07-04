import { Socket } from 'socket.io-client';
import { container } from 'tsyringe';
import {
	generateFakePrefix,
	randomLetters,
	randomNumberByRange,
} from '@utils/random-number-by-range';
import { addDeviceCacheData } from '@app/device/cache/add-device-cache-data';
import { loggerWarn } from '@maur025/core-logger';
import { externalSocketTopics } from '@src/external-socket-topics';
import DeviceCache from '../cache/device-cache';
import { Device } from '../entity/device';
import { deviceSyncEnrichData } from './device-sync-enrich-data';

interface Request {
	deviceList: Device[];
	socketClient: Socket;
}

const { DEVICE_UNSUBSCRIBE_ALL, DEVICE_SUBSCRIBE } = externalSocketTopics;

export const deviceListProcess = async ({
	deviceList,
	socketClient,
}: Request): Promise<void> => {
	const deviceCache = container.resolve(DeviceCache);

	await deviceCache.clearCacheData();

	if (!deviceList?.length) {
		loggerWarn(
			`device list must not be empty or undefined, skipping initialization ...`,
		);

		return;
	}

	const idList: string[] = deviceList?.map(({ id }) => id ?? '');

	socketClient.emit(DEVICE_UNSUBSCRIBE_ALL, '');
	socketClient.emit(DEVICE_SUBSCRIBE, [...idList]);

	const newDeviceList: Device[] = await deviceSyncEnrichData(deviceList);

	// adding fake data: remove when fixed devices with vehicles problems
	for (const device of newDeviceList) {
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

	await addDeviceCacheData(newDeviceList);

	await deviceCache.loadCacheData();
};
