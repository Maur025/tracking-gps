import { loggerWarn } from '@maur025/core-logger';
import { Device } from '../entity/device';
import { container } from 'tsyringe';
import DeviceCache from '../cache/device-cache';
import { Vehicle } from '@app/vehicle/entity/vehicle';

export const processDeviceData = async (
	device: Device,
): Promise<Device | null> => {
	if (!device.id) {
		loggerWarn(
			`(processDeviceData) device id is undefined or empty. Skipping... `,
		);
		return null;
	}

	const deviceCache = container.resolve(DeviceCache);
	const deviceInMapCache: Device | undefined = deviceCache.getById(device.id);

	const vehicleData = getDeviceVehicleData(device, deviceInMapCache);

	return { ...device, vehicleData };
};

const getDeviceVehicleData = (
	device: Device,
	deviceInMapCache: Device | undefined,
): Vehicle => {
	if (deviceInMapCache?.vehicleData) {
		return deviceInMapCache.vehicleData;
	}

	// get data with redis search

	return {} as Vehicle;
};
