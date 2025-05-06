import GeofenceCache from '@cache/geofence-cache';
import GeofenceIn from '@models/entity/geofence-in';
import Track from '@models/entity/track';
import { container } from 'tsyringe';
import { caseSectionPolygon } from './process-case-polyon-section';

interface Request {
	deviceId: string;
	lastTrack: Track;
}

const geofenceCache = container.resolve(GeofenceCache);

export const getGeofenceInList = ({
	deviceId,
	lastTrack,
}: Request): GeofenceIn[] => {
	let geofenceInList: GeofenceIn[] = [];

	for (const geofence of geofenceCache.getIterable()) {
		const { data } = geofence;

		if (!data) {
			continue;
		}

		let sectionCount: number = 0;

		for (const section of data) {
			const { type, name: sectionName } = section;
			sectionCount++;

			switch (type) {
				case 'POINTS': {
					break;
				}
				case 'POLYGONS': {
					const geofenceIn = caseSectionPolygon({
						deviceId,
						lastTrack,
						geofence,
						//TODO: Remove when section contains name from backend data
						section: { ...section, name: `${sectionName ?? sectionCount}` },
					});

					geofenceInList = [...geofenceInList, ...geofenceIn];
					break;
				}
			}
		}
	}

	return geofenceInList;
};
