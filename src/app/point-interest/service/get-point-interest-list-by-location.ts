import { Track } from '@app/track/entity/track';
import { VisitedPointInterest } from '../dto/visited-point-interest';
import { Feature, GeoJsonProperties, Point } from 'geojson';
import { loggerDebug } from '@maur025/core-logger';
import { point as turfPoint } from '@turf/turf';
import { container } from 'tsyringe';
import PointInterestCache from '../cache/point-interest-cache';
import { rebuildRouteBetweenTwoPoints } from '@app/geofence/service/rebuild-route-between-two-points';
import { verifyByRadialGeofence } from '@app/geofence/service/verify-in/verify-by-radial-geofence';
import { getFinalStateFromStates } from '@app/geofence/service/get-final-state-from-states';
import z, { object, string } from 'zod/v4';

const GetPointInterestListByLocationRequest = object({
	deviceLastTrack: Track,
	deviceId: string(),
	previousDeviceTrack: Track.optional(),
});

type GetPointInterestListByLocationRequest = z.infer<
	typeof GetPointInterestListByLocationRequest
>;

const loggerAuxData: string =
	'[POINT OF INTEREST] (getPointInterestByLocation)';

export const getPointInterestListByLocation = (
	request: GetPointInterestListByLocationRequest,
): VisitedPointInterest[] => {
	const { deviceLastTrack, deviceId, previousDeviceTrack } =
		GetPointInterestListByLocationRequest.parse(request);

	const { t: trackTimestamp = 0, lat = 0, lon = 0 } = deviceLastTrack;
	const {
		t: previousTrackTimestamp = 0,
		lat: previousLat = 0,
		lon: previousLon = 0,
	} = previousDeviceTrack ?? {};

	let pointsOfLocation: Feature<Point, GeoJsonProperties>[] = [];

	if (previousLat == 0 && previousLon == 0) {
		loggerDebug(
			`${loggerAuxData} previous device track position not exists, nothing to rebuild... using current position only.`,
		);
		pointsOfLocation.push(turfPoint([lon, lat]));
	} else {
		loggerDebug(`${loggerAuxData} rebuilding route between two points...`);

		pointsOfLocation = rebuildRouteBetweenTwoPoints({
			coords: [lon, lat],
			previousCoords: [previousLon, previousLat],
			previousTimestamp: previousTrackTimestamp,
			timestamp: trackTimestamp,
		});
	}

	const pointInterestCache = container.resolve(PointInterestCache);
	const pointInterestList = pointInterestCache.getAll();

	const visitedPointInterestList: VisitedPointInterest[] = [];

	for (const pointInterest of pointInterestList) {
		const pointInterestCoords = pointInterest?.data?.coords ?? [];

		if (!pointInterestCoords.length) {
			loggerDebug(
				`[POINT OF INTEREST] (getPointInterestByLocation) point of interest ${pointInterest?.id} does not have coordinates defined. Skipping...`,
			);
			continue;
		}

		const { id: pointInterestId = '', name: pointInterestName = '' } =
			pointInterest;
		const { area = 0, radius: pointInterestRadius = 0 } =
			pointInterest?.data ?? {};

		const { name: layerName = '', id: layerId = '' } =
			pointInterest?.layer ?? {};

		const rebuildRouteResults: boolean[] = [];
		for (const point of pointsOfLocation) {
			rebuildRouteResults.push(
				verifyByRadialGeofence({
					position: point,
					geofenceCoords: pointInterestCoords,
					geofenceRadius: pointInterestRadius,
				}),
			);
		}

		const initialState = rebuildRouteResults[0] ? 'IN' : 'NONE';
		const visitedPointInterest: VisitedPointInterest = {
			deviceId,
			pointInterestId,
			pointInterestName,
			layerId,
			layerName,
			timestamp: trackTimestamp,
			date: new Date(trackTimestamp).toISOString(),
			positionCoords: [lon, lat],
			area,
			radius: pointInterestRadius,
			initialState,
			finalState: getFinalStateFromStates({
				stateList: rebuildRouteResults,
				initialState,
			}),
		};

		if (
			visitedPointInterest.finalState === 'NONE' &&
			visitedPointInterest.initialState === 'NONE'
		) {
			loggerDebug(
				`[POINT OF INTEREST] (getPointInterestByLocation) point of interest ${pointInterestName} was not visited. Skipping...`,
			);
			continue;
		}

		visitedPointInterestList.push({ ...visitedPointInterest });
	}

	return visitedPointInterestList;
};
