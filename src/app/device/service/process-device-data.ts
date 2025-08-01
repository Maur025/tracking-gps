import { loggerWarn } from '@maur025/core-logger';
import { Device } from '../entity/device';
import { container } from 'tsyringe';
import DeviceCache from '../cache/device-cache';
import { Vehicle } from '@app/vehicle/entity/vehicle';
import { getDeviceVehicleData } from './get-device-vehicle-data';
import { getGeofencesDeviceIn } from '@app/geofence/service/verify-in/get-geofences-device-in';
import { DeviceGeofenceOut } from '../entity/device-geofence-out';
import { getGeofencesDeviceOut } from '@app/geofence/service/verify-out/get-geofences-device-out';
import { DeviceGeofenceIn } from '../entity/device-geofence-in';

export const processDeviceData = async (
	device: Device,
): Promise<Device | null> => {
	if (!device?.id) {
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

	const geofenceInData: DeviceGeofenceIn = await getGeofencesDeviceIn(device);

	const geofenceOutData: DeviceGeofenceOut =
		await getGeofencesDeviceOut(device);

	return {
		...device,
		vehicleData,
		geofencesIn: geofenceInData,
		geofencesOut: geofenceOutData,
	};
};
