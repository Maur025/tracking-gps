import { GeofenceIn } from '@app/geofence/entity/geofence-in';
import { Track } from '../../../track/entity/track';
import { container } from 'tsyringe';
import GeofenceCache from '@app/geofence/cache/geofence-cache';
import { Geofence } from '@app/geofence/entity/geofence';
import { loggerDebug } from '@maur025/core-logger';
import { verifyGeofenceInByPosition } from './verify-geofence-in-by-position';
import z, { object, string } from 'zod/v4';
import { Feature, GeoJsonProperties, Point } from 'geojson';
import { point as turfPoint } from '@turf/turf';
import { GeofenceCalculateStates } from '../../entity/geofence-in';
import { rebuildRouteBetweenTwoPoints } from '../rebuild-route-between-two-points';

const GetGeofencesInByLocationRequest = object({
	deviceLastTrack: Track,
	deviceId: string(),
	previousDeviceTrack: Track.optional(),
});

type GetGeofencesInByLocationRequest = z.infer<
	typeof GetGeofencesInByLocationRequest
>;

export const getGeofencesInByLocation = (
	request: GetGeofencesInByLocationRequest,
): GeofenceIn[] => {
	const { deviceLastTrack, deviceId, previousDeviceTrack } =
		GetGeofencesInByLocationRequest.parse(request);

	const { t: trackTimestamp = 0, lat = 0, lon = 0 } = deviceLastTrack;
	const {
		t: previousTrackTimestamp = 0,
		lat: previousLat = 0,
		lon: previousLon = 0,
	} = previousDeviceTrack ?? {};

	const geofenceCache = container.resolve(GeofenceCache);
	const geofenceList: Geofence[] = geofenceCache.getAll();

	const geofenceInsideList: GeofenceIn[] = [];
	let pointOfLocation: Feature<Point, GeoJsonProperties>[] = [];

	if (previousLat == 0 && previousLon == 0) {
		loggerDebug(
			`[GEOFENCE] (getGeofencesInByLocation) previous device track position not exists, nothing to rebuild... using current position only.`,
		);
		pointOfLocation.push(turfPoint([lon, lat]));
	} else {
		loggerDebug(
			`[GEOFENCE] (getGeofencesInByLocation) rebuilding route between two points...`,
		);
		pointOfLocation = rebuildRouteBetweenTwoPoints({
			coords: [lon, lat],
			previousCoords: [previousLon, previousLat],
			previousTimestamp: previousTrackTimestamp,
			timestamp: trackTimestamp,
		});
	}

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
		for (const point of pointOfLocation) {
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
		deviceInGeofence.finalState = getFinalStateFromStates(
			routeSummary,
			deviceInGeofence.initialState,
		);

		if (
			deviceInGeofence.initialState === 'NONE' &&
			deviceInGeofence.finalState === 'NONE'
		) {
			loggerDebug(
				`[GEOFENCE] (getGeofencesInByLocation) device never IN, OUT or IN_OUT this geofence`,
			);

			continue;
		}

		geofenceInsideList.push({ ...deviceInGeofence });
	}

	return geofenceInsideList;
};

const getFinalStateFromStates = (
	stateList: boolean[],
	initialState: GeofenceCalculateStates,
) => {
	let finalState: GeofenceCalculateStates = 'NONE';

	for (const state of stateList) {
		if (state && finalState === 'NONE' && initialState === 'NONE') {
			finalState = 'IN';
		}

		if (!state && finalState === 'IN' && initialState === 'NONE') {
			finalState = 'IN_OUT';
		}

		if (!state && finalState === 'NONE' && initialState === 'IN') {
			finalState = 'OUT';
		}

		if (state && finalState === 'OUT' && initialState === 'IN') {
			finalState = 'IN';
		}
	}

	return finalState;
};
