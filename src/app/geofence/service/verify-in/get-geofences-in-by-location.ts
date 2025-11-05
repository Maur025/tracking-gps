import { GeofenceIn } from '@app/geofence/entity/geofence-in.js';
import { Track } from '../../../track/entity/track.js';
import { container } from 'tsyringe';
import GeofenceCache from '@app/geofence/cache/geofence-cache.js';
import { Geofence } from '@app/geofence/entity/geofence.js';
import { loggerDebug } from '@maur025/core-logger';
import { verifyGeofenceInByPosition } from './verify-geofence-in-by-position.js';
import z, { object, string } from 'zod/v4';
import { getFinalStateFromStates } from '../get-final-state-from-states.js';
import { DeviceReconstructedRoad } from '@app/device/entity/device-reconstructed-road.js';

const GetGeofencesInByLocationRequest = object({
	deviceLastTrack: Track,
	deviceId: string(),
	reconstructedRoad: DeviceReconstructedRoad,
});

type GetGeofencesInByLocationRequest = z.infer<
	typeof GetGeofencesInByLocationRequest
>;

export const getGeofencesInByLocation = (
	request: GetGeofencesInByLocationRequest,
): GeofenceIn[] => {
	const { deviceLastTrack, deviceId, reconstructedRoad } =
		GetGeofencesInByLocationRequest.parse(request);

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
			coords: geofenceCoords,
			area = 0,
			radius = 0,
		} = geofence?.data ?? { coords: [] };
		const { name: layerName = '' } = geofence?.layer ?? {};

		if (!geofenceCoords?.length || !geofenceType) {
			loggerDebug(
				`[GEOFENCE] (getGeofencesInByLocation) geofence without coords or geofence without type, skipping...`,
			);

			continue;
		}

		const deviceInGeofence: GeofenceIn = {
			id: `${deviceId}-${geofenceId}`,
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
			initialState: 'NONE',
			finalState: 'NONE',
		};

		const routeSummary: boolean[] = [];
		for (const point of reconstructedRoad.coords) {
			routeSummary.push(
				verifyGeofenceInByPosition({
					geofenceType,
					geofenceRadius: radius,
					position: point,
					geofenceCoords,
				}),
			);
		}

		deviceInGeofence.initialState = routeSummary[0] ? 'IN' : 'NONE';
		deviceInGeofence.finalState = getFinalStateFromStates({
			stateList: routeSummary,
			initialState: deviceInGeofence.initialState,
		});

		if (
			deviceInGeofence.initialState === 'NONE' &&
			deviceInGeofence.finalState === 'NONE'
		) {
			// loggerDebug(
			// 	`[GEOFENCE] (getGeofencesInByLocation) device never IN, OUT or IN_OUT this geofence`,
			// );

			continue;
		}

		geofenceInsideList.push({ ...deviceInGeofence });
	}

	return geofenceInsideList;
};
