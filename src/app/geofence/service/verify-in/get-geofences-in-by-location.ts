import { GeofenceIn } from '@app/geofence/entity/geofence-in';
import { Track } from '../../../track/entity/track';
import { container } from 'tsyringe';
import GeofenceCache from '@app/geofence/cache/geofence-cache';
import { Geofence } from '@app/geofence/entity/geofence';
import { loggerDebug } from '@maur025/core-logger';
import { verifyGeofenceInByPosition } from './verify-geofence-in-by-position';

export const getGeofencesInByLocation = (
	deviceLastTrack: Track,
	deviceId: string,
): GeofenceIn[] => {
	const { t: trackTimestamp = 0, lat = 0, lon = 0 } = deviceLastTrack;

	const geofenceCache = container.resolve(GeofenceCache);
	const geofenceList: Geofence[] = geofenceCache.getAll();

	const geofenceInsideList: GeofenceIn[] = [];

	for (const geofence of geofenceList) {
		const {
			id: geofenceId = '',
			name: geofenceName = '',
			layerId = '',
		} = geofence;

		const {
			type: geofenceType,
			coords,
			area = 0,
			radius = 0,
		} = geofence?.data ?? { coords: [] };
		const { name: layerName = '' } = geofence?.layer ?? {};

		if (!coords?.length || !geofenceType) {
			loggerDebug(
				`[GEOFENCE] (getGeofencesInByLocation) geofence without coords or geofence without type, skipping...`,
			);

			continue;
		}

		const deviceInGeofence: GeofenceIn = {
			deviceId,
			geofenceId,
			geofenceName,
			layerId,
			layerName,
			timestamp: trackTimestamp,
			date: new Date(trackTimestamp).toISOString(),
			positionCoords: [lon, lat],
			area,
			radius,
			type: geofenceType,
			isNew: false,
		};

		const isGeofenceInside: boolean = verifyGeofenceInByPosition({
			geofenceType,
			radius,
			positionCoords: [lon, lat],
			geofenceCoords: coords,
		});

		if (isGeofenceInside) {
			geofenceInsideList.push({ ...deviceInGeofence });
		}
	}

	return geofenceInsideList;
};
