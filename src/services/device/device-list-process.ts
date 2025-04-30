import Device from '@models/entity/device';
import { Socket } from 'socket.io-client';
import { syncAndEnrichDevices } from './device-sync-enrich-data';
import { Topics } from '@models/enums/topics.enum';
import { container } from 'tsyringe';
import DeviceCache from '@cache/device-cache';

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
	deviceCache.addMany(newDeviceList);
};
