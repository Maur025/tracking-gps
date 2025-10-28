import { Device } from '@app/device/entity/device';
import { DeviceGeofenceIn } from '../../../device/entity/device-geofence-in';
import { getGeofencesInByLocation } from './get-geofences-in-by-location';
import { GeofenceIn } from '@app/geofence/entity/geofence-in';
import { getNewGeofencesIn } from './get-new-geofences-in';
import { matchIsNewGeofenceIn } from './match-is-new-geofence-in';
import z, { object } from 'zod/v4';
import { Track } from '@app/track/entity/track';
import { container } from 'tsyringe';
import GeofenceInCache from '@app/geofence/cache/geofence-in-cache';
import { validateToIgnoreDevicePositionCalculate } from '@app/device/service/validate-to-ignore-device-position-calculate';
import { DeviceMovingDirection } from '@app/device/entity/device-moving-direction';

const GetGeofencesDeviceInSchema = object({
	device: Device,
	previousDeviceTrack: Track.optional(),
	movingDirection: DeviceMovingDirection,
});

type GetGeofencesDeviceInSchema = z.infer<typeof GetGeofencesDeviceInSchema>;

const loggerAuxData: string = '[DEVICE] (getGeofencesDeviceIn)';

export const getGeofencesDeviceIn = async (
	request: GetGeofencesDeviceInSchema,
): Promise<DeviceGeofenceIn> => {
	const { device, previousDeviceTrack, movingDirection } =
		GetGeofencesDeviceInSchema.parse(request);

	const resultOfValidation =
		validateToIgnoreDevicePositionCalculate<DeviceGeofenceIn>({
			device,
			previousDeviceTrack,
			loggerAuxData,
			noIdCallback: () => buildGeofencesDeviceInResponse([], []),
			otherValidationsCallback: () =>
				buildGeofencesDeviceInResponse(
					recoveryGeofenceInFromCache(device.id!),
					[],
				),
		});

	if (resultOfValidation) {
		return resultOfValidation;
	}

	const currentGeofencesIn: GeofenceIn[] = getGeofencesInByLocation({
		deviceLastTrack: device.last!,
		deviceId: device.id!,
		previousDeviceTrack,
		movingDirection,
	});

	const newGeofencesIn: GeofenceIn[] = await getNewGeofencesIn({
		deviceId: device.id!,
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
