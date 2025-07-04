import { loggerWarn } from '@maur025/core-logger';
import { container } from 'tsyringe';
import { Device } from '../entity/device';
import DeviceCache from '../cache/device-cache';

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
