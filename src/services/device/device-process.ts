import DeviceCache from '@cache/device-cache';
import Device from '@models/entity/device';
import { Topics } from '@models/enums/topics.enum';
import { loggerWarn } from '@utils/logger';
import { Socket } from 'socket.io-client';
import { container } from 'tsyringe';

const { DEVICE_SUBSCRIBE } = Topics;

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
