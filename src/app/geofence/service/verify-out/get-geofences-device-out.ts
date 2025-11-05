import { DeviceGeofenceOut } from '@app/device/entity/device-geofence-out.js';
import { GeofenceIn } from '@app/geofence/entity/geofence-in.js';
import { loggerDebug } from '@maur025/core-logger';
import z, { array, object, string, map } from 'zod/v4';
import { getGeofenceOutList } from './get-geofence-out-list.js';
import { DeviceReconstructedRoad } from '@app/device/entity/device-reconstructed-road.js';

const GetGeofencesDeviceOutSchema = object({
	geofenceInFullList: array(GeofenceIn).default([]),
	geofenceInPrevDataBackupMap: map(string(), GeofenceIn).default(new Map()),
	reconstructedRoad: DeviceReconstructedRoad,
});

type GetGeofencesDeviceOutSchema = z.infer<typeof GetGeofencesDeviceOutSchema>;

const loggerAuxData: string = '[DEVICE] (getGeofencesDeviceOut)';

export const getGeofencesDeviceOut = async (
	request: GetGeofencesDeviceOutSchema,
): Promise<DeviceGeofenceOut> => {
	const { geofenceInFullList, geofenceInPrevDataBackupMap, reconstructedRoad } =
		GetGeofencesDeviceOutSchema.parse(request);

	if (reconstructedRoad.statusOfRebuildRoad !== 'REBUILD_SUCCESS') {
		loggerDebug(
			`${loggerAuxData} omitting calculation by ${reconstructedRoad.statusOfRebuildRoad}.`,
		);
		return buildGeofencesDeviceOutResponse([]);
	}

	const geofencesInOutList: GeofenceIn[] = geofenceInFullList.filter(
		geofenceInteraction => geofenceInteraction.finalState === 'IN_OUT',
	);

	if (!geofenceInPrevDataBackupMap.size) {
		loggerDebug(
			`${loggerAuxData} no data previous in cache to compare, skipping...`,
		);

		return buildGeofencesDeviceOutResponse([...geofencesInOutList]);
	}

	const geofenceOutList: GeofenceIn[] = await getGeofenceOutList({
		geofenceInFullList,
		geofenceInBackupList: Array.from(geofenceInPrevDataBackupMap.values()),
	});

	loggerDebug(`${loggerAuxData} geofence OUT interactions processed.`);

	return buildGeofencesDeviceOutResponse([
		...geofencesInOutList,
		...geofenceOutList,
	]);
};

const buildGeofencesDeviceOutResponse = (
	geofenceOutList: GeofenceIn[],
): DeviceGeofenceOut => ({
	geofenceList: geofenceOutList,
	geofenceOutTotal: geofenceOutList.length,
});
