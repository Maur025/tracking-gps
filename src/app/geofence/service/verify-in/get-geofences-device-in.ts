import { Device } from '@app/device/entity/device.js';
import { DeviceGeofenceIn } from '../../../device/entity/device-geofence-in.js';
import { getGeofencesInByLocation } from './get-geofences-in-by-location.js';
import { GeofenceIn } from '@app/geofence/entity/geofence-in.js';
import { getNewGeofencesIn } from './get-new-geofences-in.js';
import { matchIsNewGeofenceIn } from './match-is-new-geofence-in.js';
import z, { object } from 'zod/v4';
import { container } from 'tsyringe';
import GeofenceInCache from '@app/geofence/cache/geofence-in-cache.js';
import { DeviceReconstructedRoad } from '@app/device/entity/device-reconstructed-road.js';
import { loggerDebug } from '@maur025/core-logger';

const GetGeofencesDeviceInSchema = object({
	device: Device,
	reconstructedRoad: DeviceReconstructedRoad,
});

type GetGeofencesDeviceInSchema = z.infer<typeof GetGeofencesDeviceInSchema>;

const loggerAuxData: string = '[DEVICE] (getGeofencesDeviceIn)';

export const getGeofencesDeviceIn = async (
	request: GetGeofencesDeviceInSchema,
): Promise<DeviceGeofenceIn> => {
	const { device, reconstructedRoad } =
		GetGeofencesDeviceInSchema.parse(request);

	if (reconstructedRoad.statusOfRebuildRoad === 'DEVICE_ID_MISSING') {
		loggerDebug(`${loggerAuxData} Device ID is missing.`);
		return buildGeofencesDeviceInResponse([], []);
	}

	if (reconstructedRoad.statusOfRebuildRoad !== 'REBUILD_SUCCESS') {
		loggerDebug(
			`${loggerAuxData} omitting calculation by ${reconstructedRoad.statusOfRebuildRoad}.`,
		);
		return buildGeofencesDeviceInResponse(
			recoveryGeofenceInFromCache(device.id!),
			[],
		);
	}

	const currentGeofencesIn: GeofenceIn[] = getGeofencesInByLocation({
		deviceLastTrack: device.last!,
		deviceId: device.id!,
		reconstructedRoad,
	});

	const newGeofencesIn: GeofenceIn[] = await getNewGeofencesIn({
		deviceId: device.id!,
		geofenceInFullList: currentGeofencesIn,
	});

	matchIsNewGeofenceIn(currentGeofencesIn, newGeofencesIn);

	loggerDebug(`${loggerAuxData} geofence IN interactions processed.`);

	return buildGeofencesDeviceInResponse(currentGeofencesIn, newGeofencesIn);
};

const recoveryGeofenceInFromCache = (deviceId: string): GeofenceIn[] => {
	const geofenceInCache = container.resolve(GeofenceInCache);

	const geofenceIn = geofenceInCache.getCache();
	const geofenceInOfDeviceMap = geofenceIn.get(deviceId);

	return geofenceInOfDeviceMap
		? Array.from(geofenceInOfDeviceMap.values()).map(geofenceIn => geofenceIn)
		: [];
};

const buildGeofencesDeviceInResponse = (
	geofenceInList: GeofenceIn[],
	newGeofenceInList: GeofenceIn[],
): DeviceGeofenceIn => ({
	geofenceList: geofenceInList,
	geofenceInTotal: geofenceInList.length,
	quantityNewIn: newGeofenceInList.length,
	newGeofenceInList,
	geofenceInNames: geofenceInList.map(({ geofenceName }) => geofenceName),
});
