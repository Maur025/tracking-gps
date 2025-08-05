import { Device } from '@app/device/entity/device';
import { DeviceGeofenceOut } from '@app/device/entity/device-geofence-out';
import { GeofenceIn } from '@app/geofence/entity/geofence-in';
import { loggerDebug } from '@maur025/core-logger';
import z, { array, object, string, map } from 'zod/v4';
import { getGeofenceOutList } from './get-geofence-out-list';

const GetGeofencesDeviceOutSchema = object({
	device: Device,
	geofenceInFullList: array(GeofenceIn).default([]),
	geofenceInPrevDataBackupMap: map(string(), GeofenceIn).default(new Map()),
});

type GetGeofencesDeviceOutSchema = z.infer<typeof GetGeofencesDeviceOutSchema>;

const loggerAuxData: string = '[DEVICE] (getGeofencesDeviceOut)';

export const getGeofencesDeviceOut = async (
	request: GetGeofencesDeviceOutSchema,
): Promise<DeviceGeofenceOut> => {
	const { device, geofenceInFullList, geofenceInPrevDataBackupMap } =
		GetGeofencesDeviceOutSchema.parse(request);

	if (!device?.id || !device?.last?.lon || !device?.last?.lat) {
		loggerDebug(
			`${loggerAuxData} device id invalid or position not found, skipping...`,
		);

		return { geofenceList: [], geofenceOutTotal: 0 };
	}

	if (!geofenceInPrevDataBackupMap.size) {
		loggerDebug(`${loggerAuxData} no data to compare, skipping...`);

		return { geofenceList: [], geofenceOutTotal: 0 };
	}

	const geofenceOutList: GeofenceIn[] = await getGeofenceOutList({
		geofenceInFullList,
		geofenceInBackupList: Array.from(geofenceInPrevDataBackupMap.values()),
	});

	return {
		geofenceList: geofenceOutList,
		geofenceOutTotal: geofenceOutList.length,
	};
};
