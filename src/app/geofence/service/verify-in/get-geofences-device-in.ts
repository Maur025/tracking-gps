import { Device } from '@app/device/entity/device';
import { DeviceGeofenceIn } from '../../../device/entity/device-geofence-in';
import { loggerDebug } from '@maur025/core-logger';
import { getGeofencesInByLocation } from './get-geofences-in-by-location';
import { GeofenceIn } from '@app/geofence/entity/geofence-in';
import { getNewGeofencesIn } from './get-new-geofences-in';

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
			newGeofenceInList: [],
		};
	}

	const currentGeofencesIn: GeofenceIn[] = getGeofencesInByLocation(
		device.last,
		device.id,
	);

	const newGeofencesIn: GeofenceIn[] = await getNewGeofencesIn({
		deviceId: device.id ?? '',
		geofenceInFullList: currentGeofencesIn,
	});

	console.log(currentGeofencesIn);

	return {
		geofenceList: currentGeofencesIn,
		geofenceInTotal: currentGeofencesIn.length,
		quantityNewIn: newGeofencesIn.length,
		geofenceInNames: currentGeofencesIn.map(
			({ geofenceName = '' }) => geofenceName,
		),
		newGeofenceInList: newGeofencesIn,
	};
};
