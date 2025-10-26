import { Device } from '@app/device/entity/device';
import { DeviceGeofenceIn } from '../../../device/entity/device-geofence-in';
import { loggerDebug } from '@maur025/core-logger';
import { getGeofencesInByLocation } from './get-geofences-in-by-location';
import { GeofenceIn } from '@app/geofence/entity/geofence-in';
import { getNewGeofencesIn } from './get-new-geofences-in';
import { matchIsNewGeofenceIn } from './match-is-new-geofence-in';
import z, { object } from 'zod/v4';
import { Track } from '@app/track/entity/track';
import { container } from 'tsyringe';
import GeofenceInCache from '@app/geofence/cache/geofence-in-cache';
import { getTotalSecondsElapsedSincePreviousTimestamp } from '@app/device/service/get-total-elapsed-since-previous-timestamp';

const GetGeofencesDeviceInSchema = object({
	device: Device,
	previousDeviceTrack: Track.optional(),
});

type GetGeofencesDeviceInSchema = z.infer<typeof GetGeofencesDeviceInSchema>;

const loggerAuxData: string = '[DEVICE] (getGeofencesDeviceIn)';

export const getGeofencesDeviceIn = async (
	request: GetGeofencesDeviceInSchema,
): Promise<DeviceGeofenceIn> => {
	const { device, previousDeviceTrack } =
		GetGeofencesDeviceInSchema.parse(request);

	if (!device?.id || !device?.last?.lon || !device?.last?.lat) {
		loggerDebug(
			`${loggerAuxData} device id invalid or position not found, skipping...`,
		);

		return buildGeofencesDeviceInResponse([], []);
	}

	const { lat = 0, lon = 0, t: timestamp = 0 } = device.last;
	const {
		lat: previousLat = 0,
		lon: previousLon = 0,
		t: previousTimestamp = 0,
	} = previousDeviceTrack ?? {};

	if (!previousLat && !previousLon && !lat && !lon) {
		loggerDebug(
			`${loggerAuxData} device position prev and current are invalid, loading lastest data...`,
		);

		return buildGeofencesDeviceInResponse(
			recoveryGeofenceInFromCache(device.id),
			[],
		);
	}

	const timeElapsedSincePreviousTrack =
		getTotalSecondsElapsedSincePreviousTimestamp(timestamp, previousTimestamp);

	if (timeElapsedSincePreviousTrack <= 0) {
		loggerDebug(
			`${loggerAuxData} device has not moved in time, same timestamp received, loading lastest data...`,
		);

		return buildGeofencesDeviceInResponse(
			recoveryGeofenceInFromCache(device.id),
			[],
		);
	}

	if (previousLat === lat && previousLon === lon) {
		loggerDebug(
			`${loggerAuxData} device position not changed from previous, nothing to calculate, loading lastest data...`,
		);

		return buildGeofencesDeviceInResponse(
			recoveryGeofenceInFromCache(device.id),
			[],
		);
	}

	const currentGeofencesIn: GeofenceIn[] = getGeofencesInByLocation({
		deviceLastTrack: device.last,
		deviceId: device.id,
		previousDeviceTrack,
	});

	const newGeofencesIn: GeofenceIn[] = await getNewGeofencesIn({
		deviceId: device.id ?? '',
		geofenceInFullList: currentGeofencesIn,
	});

	matchIsNewGeofenceIn(currentGeofencesIn, newGeofencesIn);

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
