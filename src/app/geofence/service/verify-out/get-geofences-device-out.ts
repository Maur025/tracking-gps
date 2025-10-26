import { Device } from '@app/device/entity/device';
import { DeviceGeofenceOut } from '@app/device/entity/device-geofence-out';
import { GeofenceIn } from '@app/geofence/entity/geofence-in';
import { loggerDebug } from '@maur025/core-logger';
import z, { array, object, string, map } from 'zod/v4';
import { getGeofenceOutList } from './get-geofence-out-list';
import { Track } from '@app/track/entity/track';
import { getTotalSecondsElapsedSincePreviousTimestamp } from '@app/device/service/get-total-elapsed-since-previous-timestamp';

const GetGeofencesDeviceOutSchema = object({
	device: Device,
	geofenceInFullList: array(GeofenceIn).default([]),
	geofenceInPrevDataBackupMap: map(string(), GeofenceIn).default(new Map()),
	previousDeviceTrack: Track.optional(),
});

type GetGeofencesDeviceOutSchema = z.infer<typeof GetGeofencesDeviceOutSchema>;

const loggerAuxData: string = '[DEVICE] (getGeofencesDeviceOut)';

export const getGeofencesDeviceOut = async (
	request: GetGeofencesDeviceOutSchema,
): Promise<DeviceGeofenceOut> => {
	const {
		device,
		geofenceInFullList,
		geofenceInPrevDataBackupMap,
		previousDeviceTrack,
	} = GetGeofencesDeviceOutSchema.parse(request);

	if (!device?.id || !device?.last?.lon || !device?.last?.lat) {
		loggerDebug(
			`${loggerAuxData} device id invalid or position not found, skipping...`,
		);

		return buildGeofencesDeviceOutResponse([]);
	}

	const { lat = 0, lon = 0, t: timestamp = 0 } = device.last;
	const {
		lat: prevLat = 0,
		lon: prevLon = 0,
		t: prevTimestamp = 0,
	} = previousDeviceTrack ?? {};

	if (!prevLat && !prevLon && !lat && !lon) {
		loggerDebug(
			`${loggerAuxData} device position prev and current are invalid, loading lastest data...`,
		);

		return buildGeofencesDeviceOutResponse([]);
	}

	if (prevLat === lat && prevLon === lon) {
		loggerDebug(
			`${loggerAuxData} device has not moved in position, skipping...`,
		);

		return buildGeofencesDeviceOutResponse([]);
	}

	const timeElapsedSincePreviousTrack =
		getTotalSecondsElapsedSincePreviousTimestamp(timestamp, prevTimestamp);

	if (timeElapsedSincePreviousTrack <= 0) {
		loggerDebug(
			`${loggerAuxData} device has not moved in time, same timestamp received, skipping...`,
		);
		return buildGeofencesDeviceOutResponse([]);
	}

	const geofencesInOutList: GeofenceIn[] = geofenceInFullList.filter(
		geofenceInteraction => geofenceInteraction.finalState === 'IN_OUT',
	);

	if (!geofenceInPrevDataBackupMap.size) {
		loggerDebug(`${loggerAuxData} no data to compare, skipping...`);

		return buildGeofencesDeviceOutResponse([...geofencesInOutList]);
	}

	const geofenceOutList: GeofenceIn[] = await getGeofenceOutList({
		geofenceInFullList,
		geofenceInBackupList: Array.from(geofenceInPrevDataBackupMap.values()),
	});

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
