import { Device } from '@app/device/entity/device';
import { DeviceGeofenceOut } from '@app/device/entity/device-geofence-out';
import { GeofenceIn } from '@app/geofence/entity/geofence-in';
import { loggerDebug } from '@maur025/core-logger';
import z, { array, object, string, map } from 'zod/v4';
import { getGeofenceOutList } from './get-geofence-out-list';
import { Track } from '@app/track/entity/track';
import { validateToIgnoreDevicePositionCalculate } from '@app/device/service/validate-to-ignore-device-position-calculate';

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

	const resultOfValidation =
		validateToIgnoreDevicePositionCalculate<DeviceGeofenceOut>({
			device,
			previousDeviceTrack,
			loggerAuxData,
			noIdCallback: () => buildGeofencesDeviceOutResponse([]),
			otherValidationsCallback: () => buildGeofencesDeviceOutResponse([]),
		});

	if (resultOfValidation) {
		return resultOfValidation;
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
