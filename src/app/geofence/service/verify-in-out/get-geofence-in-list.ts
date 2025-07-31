import GeofenceCache from '@app/geofence/cache/geofence-cache';
import { container } from 'tsyringe';
import { GeofenceIn } from '@app/geofence/entity/geofence-in';
import { Track } from '@app/track/entity/track';

interface Request {
	deviceId: string;
	lastTrack: Track;
}

const geofenceCache = container.resolve(GeofenceCache);

export const getGeofenceInList = ({
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	deviceId,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	lastTrack,
}: Request): GeofenceIn[] => {
	const geofenceInList: GeofenceIn[] = [];

	for (const geofence of geofenceCache.getIterable()) {
		const { data } = geofence;

		if (!data) {
			continue;
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const sectionCount: number = 0;

		// for (const section of data) {
		// 	const { type, name: sectionName } = section;
		// 	sectionCount++;

		// 	const sectionNameToUse: string = `${sectionName ?? sectionCount}`;
		// 	let geofenceInFoundList: GeofenceIn[] = [];

		// 	switch (type) {
		// 		case 'POINTS': {
		// 			geofenceInFoundList = processCasePointSection({
		// 				deviceId,
		// 				lastTrack,
		// 				geofence,
		// 				section: { ...section, name: sectionNameToUse },
		// 			});

		// 			break;
		// 		}
		// 		case 'POLYGONS': {
		// 			geofenceInFoundList = processCasePolygonSection({
		// 				deviceId,
		// 				lastTrack,
		// 				geofence,
		// 				section: { ...section, name: sectionNameToUse },
		// 			});

		// 			break;
		// 		}
		// 	}

		// 	geofenceInList = [...geofenceInList, ...geofenceInFoundList];
		// }
	}

	return geofenceInList;
};
