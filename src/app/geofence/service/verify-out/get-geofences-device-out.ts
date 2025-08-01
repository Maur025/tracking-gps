import { Device } from '@app/device/entity/device';
import { DeviceGeofenceOut } from '@app/device/entity/device-geofence-out';
import { loggerDebug } from '@maur025/core-logger';

export const getGeofencesDeviceOut = async (
	device: Device,
): Promise<DeviceGeofenceOut> => {
	if (!device?.id || !device?.last?.lon || !device?.last?.lat) {
		loggerDebug(
			`[DEVICE] (getGeofencesDeviceOut) device id invalid or position not found, skipping...`,
		);

		return { geofenceList: [], geofenceOutTotal: 0 };
	}

	return { geofenceList: [], geofenceOutTotal: 0 };
};
