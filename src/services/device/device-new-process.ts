import DeviceCache from '@cache/device-cache';
import Device from '@models/entity/device';
import { loggerWarn } from '@utils/logger';
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
