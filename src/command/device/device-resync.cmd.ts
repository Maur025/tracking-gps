import DeviceCache from '@cache/device-cache';
import { AbstractCommand } from '@maur025/core-commands';
import Device from '@models/entity/device';
import { Topics } from '@models/enums/topics.enum';
import { syncAndEnrichDevices } from '@utils/device-sync-enrich-data';
import { Socket } from 'socket.io-client';
import { inject, singleton } from 'tsyringe';

@singleton()
export default class DeviceResyncCmd extends AbstractCommand<Request, void> {
	constructor(@inject(DeviceCache) private readonly deviceCache: DeviceCache) {
		super();
	}

	protected run(request: Request): void {
		const { deviceList, socketClient } = request;

		const idList: string[] = deviceList?.map(({ id }) => id ?? '');

		socketClient.emit(Topics.DEVICE_UNSUBSCRIBE_ALL, '');
		socketClient.emit(Topics.DEVICE_SUBSCRIBE, [...idList]);

		this.deviceCache.updateAll(syncAndEnrichDevices(deviceList));
	}
}

interface Request {
	deviceList: Device[];
	socketClient: Socket;
}
