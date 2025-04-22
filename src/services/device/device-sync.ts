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

export const deviceSync = async (request: Request): Promise<void> => {
	const { deviceList, socketClient } = request;

	const idList: string[] = deviceList?.map(({ id }) => id ?? '');

	socketClient.emit(Topics.DEVICE_UNSUBSCRIBE_ALL, '');
	socketClient.emit(Topics.DEVICE_SUBSCRIBE, [...idList]);

	const newDeviceList: Device[] = await syncAndEnrichDevices(deviceList);

	deviceCache.updateAll(newDeviceList);
};
