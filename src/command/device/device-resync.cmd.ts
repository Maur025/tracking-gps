import DeviceCache from '@cache/device-cache';
import { AbstractCommand } from '@maur025/core-commands';
import Device from '@models/entity/device';
import { Topics } from '@models/enums/topics.enum';
import { Socket } from 'socket.io-client';
import { inject, singleton } from 'tsyringe';

@singleton()
export default class DeviceResyncCmd extends AbstractCommand<Request, void> {
	constructor(@inject(DeviceCache) private readonly deviceCache: DeviceCache) {
		super();
	}

	protected run(request: Request): void {
		const { deviceList, socketClient } = request;
		this.deviceCache.updateAll(deviceList);

		const deviceCacheList = this.deviceCache.getAll();

		const idsList: string[] = deviceCacheList?.map(({ id }) => id ?? '');

		socketClient.emit(Topics.DEVICE_UNSUBSCRIBE_ALL, '');
		socketClient.emit(Topics.DEVICE_SUBSCRIBE, [...idsList]);

		// ADD logica de comparacion para sincronizar
	}
}

interface Request {
	deviceList: Device[];
	socketClient: Socket;
}
