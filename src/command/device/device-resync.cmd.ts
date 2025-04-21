import DeviceCache from '@cache/device-cache';
import { AbstractAsyncCommand } from '@command/AbstractAsyncCommand';
import Device from '@models/entity/device';
import { Topics } from '@models/enums/topics.enum';
import { syncAndEnrichDevices } from '@services/device/device-sync-enrich-data';
import { Socket } from 'socket.io-client';
import { inject, singleton } from 'tsyringe';

@singleton()
export default class DeviceResyncCmd extends AbstractAsyncCommand<
	Request,
	void
> {
	constructor(@inject(DeviceCache) private readonly deviceCache: DeviceCache) {
		super();
	}

	protected async run(request: Request): Promise<void> {
		const { deviceList, socketClient } = request;

		const idList: string[] = deviceList?.map(({ id }) => id ?? '');

		socketClient.emit(Topics.DEVICE_UNSUBSCRIBE_ALL, '');
		socketClient.emit(Topics.DEVICE_SUBSCRIBE, [...idList]);

		const newDeviceList: Device[] = await syncAndEnrichDevices(deviceList);

		this.deviceCache.updateAll(newDeviceList);
	}
}

interface Request {
	deviceList: Device[];
	socketClient: Socket;
}
