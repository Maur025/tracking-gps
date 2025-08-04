import { Device } from '@app/device/entity/device';
import { DeviceGeofenceIn } from '../../../device/entity/device-geofence-in';
import { loggerDebug } from '@maur025/core-logger';
import { getGeofencesInByLocation } from './get-geofences-in-by-location';
import { GeofenceIn } from '@app/geofence/entity/geofence-in';

export const getGeofencesDeviceIn = async (
	device: Device,
): Promise<DeviceGeofenceIn> => {
	if (!device?.id || !device?.last?.lon || !device?.last?.lat) {
		loggerDebug(
			`[DEVICE] (getGeofencesDeviceIn) device id invalid or position not found, skipping...`,
		);

		return {
			geofenceList: [],
			geofenceInTotal: 0,
			quantityNewIn: 0,
			geofenceInNames: [],
		};
	}

	const currentGeofencesIn: GeofenceIn[] = getGeofencesInByLocation(
		device.last,
		device.id,
	);

	return {
		geofenceList: currentGeofencesIn,
		geofenceInTotal: 0,
		quantityNewIn: 0,
		geofenceInNames: [],
	};
};
