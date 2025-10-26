import { GeofenceIn } from '@app/geofence/entity/geofence-in';
import z, { array, object } from 'zod/v4';
import { removeGeofenceOutOfCache } from './remove-geofence-out-of-cache';

const GetGeofenceOutListSchema = object({
	geofenceInFullList: array(GeofenceIn).default([]),
	geofenceInBackupList: array(GeofenceIn).default([]),
});

type GetGeofenceOutListSchema = z.infer<typeof GetGeofenceOutListSchema>;

export const getGeofenceOutList = async (
	request: GetGeofenceOutListSchema,
): Promise<GeofenceIn[]> => {
	const { geofenceInFullList, geofenceInBackupList } =
		GetGeofenceOutListSchema.parse(request);

	if (!geofenceInFullList.length && geofenceInBackupList.length) {
		await removeGeofenceOutOfCache({ geofenceOutList: geofenceInBackupList });
		return geofenceInBackupList;
	}

	const geofenceOutList: GeofenceIn[] = [];
	const geofenceInFullSet: Set<string> = new Set<string>(
		geofenceInFullList.map(({ id }) => id ?? ''),
	);

	console.log(geofenceInBackupList);

	for (const geofenceIn of geofenceInBackupList) {
		if (!geofenceIn.id || geofenceInFullSet.has(geofenceIn.id)) {
			continue;
		}

		geofenceOutList.push(geofenceIn);
	}

	await removeGeofenceOutOfCache({ geofenceOutList });
	return geofenceOutList;
};
