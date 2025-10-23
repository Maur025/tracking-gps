import { Device } from '@app/device/entity/device';
import { DeviceGeofenceIn } from '../../../device/entity/device-geofence-in';
import { loggerDebug } from '@maur025/core-logger';
import { getGeofencesInByLocation } from './get-geofences-in-by-location';
import { GeofenceIn } from '@app/geofence/entity/geofence-in';
import { getNewGeofencesIn } from './get-new-geofences-in';
import { matchIsNewGeofenceIn } from './match-is-new-geofence-in';
import z, { object } from 'zod/v4';
import { Track } from '@app/track/entity/track';

const GetGeofencesDeviceInSchema = object({
	device: Device,
	previousDeviceTrack: Track.optional(),
});

type GetGeofencesDeviceInSchema = z.infer<typeof GetGeofencesDeviceInSchema>;

export const getGeofencesDeviceIn = async (
	request: GetGeofencesDeviceInSchema,
): Promise<DeviceGeofenceIn> => {
	const { device, previousDeviceTrack } =
		GetGeofencesDeviceInSchema.parse(request);

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

	loggerDebug(`device current las track:`);
	console.log(device.last);

	loggerDebug(`device previous las track:`);
	console.log(previousDeviceTrack);

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
