import Device from '@models/entity/device';
import { Socket } from 'socket.io-client';
import { syncAndEnrichDevices } from './device-sync-enrich-data';
import { Topics } from '@models/enums/topics.enum';
import { container } from 'tsyringe';
import DeviceCache from '@cache/device-cache';
import {
	generateFakePrefix,
	randomLetters,
	randomNumberByRange,
} from '@utils/random-number-by-range';

interface Request {
	deviceList: Device[];
	socketClient: Socket;
}

const deviceCache = container.resolve(DeviceCache);

const { DEVICE_UNSUBSCRIBE_ALL, DEVICE_SUBSCRIBE } = Topics;

export const deviceListProcess = async ({
	deviceList,
	socketClient,
}: Request): Promise<void> => {
	deviceCache.clear();
	const idList: string[] = deviceList?.map(({ id }) => id ?? '');

	socketClient.emit(DEVICE_UNSUBSCRIBE_ALL, '');
	socketClient.emit(DEVICE_SUBSCRIBE, [...idList]);

	const newDeviceList: Device[] = await syncAndEnrichDevices(deviceList);

	// quitar cuando se arregle el problema con devices y vehicles
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

	deviceCache.addMany(newDeviceList);
};
