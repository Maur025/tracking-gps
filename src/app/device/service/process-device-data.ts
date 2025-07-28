import { Device } from '../entity/device';

export const processDeviceData = async (device: Device): Promise<Device> => {
	return { ...device };
};
