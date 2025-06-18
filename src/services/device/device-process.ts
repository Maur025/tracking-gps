import DeviceCache from '@cache/device-cache';
import { loggerWarn } from '@maur025/core-logger';
import Device from '@models/entity/device';
import { externalSocketTopics } from '@src/external-socket-topics';
import { Socket } from 'socket.io-client';
import { container } from 'tsyringe';

const { DEVICE_SUBSCRIBE } = externalSocketTopics;

interface Request {
	deviceData: Device;
	socketClient: Socket;
}

const deviceCache = container.resolve(DeviceCache);

export const deviceProcess = ({ deviceData, socketClient }: Request): void => {
	if (!deviceData?.id) {
		loggerWarn(`data without device id.`);
		return;
	}

	deviceCache.addById(deviceData.id, deviceData);

	socketClient.emit(DEVICE_SUBSCRIBE, [deviceData?.id]);
};
