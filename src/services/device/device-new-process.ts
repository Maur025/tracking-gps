import DeviceCache from '@cache/device-cache';
import { loggerWarn } from '@maur025/core-logger';
import Device from '@models/entity/device';
import { container } from 'tsyringe';

interface Request {
	deviceData: Device;
}

const deviceCache = container.resolve(DeviceCache);

export const deviceNewProcess = ({ deviceData }: Request): void => {
	if (!deviceData?.id) {
		loggerWarn(`data without device id.`);
		return;
	}

	deviceCache.addById(deviceData.id, deviceData);
};
