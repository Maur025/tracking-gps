import { GeofenceDataIoResponse } from '@app/geofence/dto/geofence-data-io-response';
import { GeofenceIoResponse } from '@app/geofence/dto/geofence-io-response';
import { GeofenceIn } from '@app/geofence/entity/geofence-in';

export const getGeofenceInIoResponse = (
	geofenceInList: GeofenceIn[],
): GeofenceIoResponse[] => {
	const geofenceInIdList: string[] = geofenceInList.map(
		({ geofenceId }) => geofenceId,
	);

	const geofenceInIdSet: Set<string> = new Set(geofenceInIdList);
	const geofenceInIdUniqueList: string[] = Array.from(geofenceInIdSet);

	return geofenceInIdUniqueList.map(geofenceInId => {
		const matchingGeofenceIn: GeofenceIn[] = geofenceInList.filter(
			({ geofenceId }) => geofenceId === geofenceInId,
		);

		const sections: GeofenceDataIoResponse[] = matchingGeofenceIn.map(
			({ section, date }) => ({ ...section!, date }),
		);

		const geofenceName: string = matchingGeofenceIn[0].geofenceName ?? '';

		return {
			geofenceId: geofenceInId,
			geofenceName,
			sections,
		};
	});
};
