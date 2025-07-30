import { loggerWarn } from '@maur025/core-logger';
import { Device } from '../entity/device';
import { container } from 'tsyringe';
import DeviceCache from '../cache/device-cache';
import { Vehicle } from '@app/vehicle/entity/vehicle';
import { getDeviceVehicleData } from './get-device-vehicle-data';

export const processDeviceData = async (
	device: Device,
): Promise<Device | null> => {
	if (!device.id) {
		loggerWarn(
			`[DEVICE] (processDeviceData) device id is undefined or empty. Skipping... `,
		);
		return null;
	}

	const deviceCache = container.resolve(DeviceCache);
	const deviceInMapCache: Device | undefined = deviceCache.getById(device.id);

	const vehicleData: Vehicle | undefined = await getDeviceVehicleData(
		device,
		deviceInMapCache,
	);

	return { ...device, vehicleData };
};
