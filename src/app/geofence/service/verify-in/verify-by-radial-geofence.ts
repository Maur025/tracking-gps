import { loggerDebug } from '@maur025/core-logger';
import { Feature, GeoJsonProperties, Point, Position } from 'geojson';
import { getGeofenceCoordLeveled } from './get-geofence-coord-leveled';
import { PositionSchema } from '@common/schema/position.schema';
import {
	booleanIntersects,
	circle,
	point as turfPoint,
	distance as turfDistance,
} from '@turf/turf';
import environment from '@config/env';
import z, { any, number, object } from 'zod/v4';

const { GPS_RADIUS } = environment;

const VerifyByRadialGeofenceRequest = object({
	position: any(),
	geofenceRadius: number().nonnegative(),
	geofenceCoords: PositionSchema,
	positionRadiusCorrection: number().default(1).optional(),
});

type VerifyByRadialGeofenceRequest = Omit<
	z.infer<typeof VerifyByRadialGeofenceRequest>,
	'position'
> & {
	position: Feature<Point, GeoJsonProperties>;
};

export const verifyByRadialGeofence = (
	request: VerifyByRadialGeofenceRequest,
): boolean => {
	const { position, geofenceRadius, geofenceCoords, positionRadiusCorrection } =
		VerifyByRadialGeofenceRequest.parse(request);

	if (!geofenceRadius) {
		loggerDebug(
			`[GEOFENCE] (verifyByRadialGeofence) geofence without radius, skipping...`,
		);

		return false;
	}

	const geofenceRadiusCoords: Position = getGeofenceCoordLeveled(
		geofenceCoords,
		1,
	) as Position;

	if (GPS_RADIUS <= 0) {
		loggerDebug(
			`[GEOFENCE] (verifyByRadialGeofence) GPS_RADIUS <= 0, using exact distance check.`,
		);

		const geofenceRadiusPoint = turfPoint(geofenceRadiusCoords);

		const distanceBetweenPoints: number = turfDistance(
			geofenceRadiusPoint,
			position,
			{ units: 'meters' },
		);

		return distanceBetweenPoints <= geofenceRadius;
	}

	// loggerDebug(
	// 	`[GEOFENCE] (verifyByRadialGeofence) using circle intersection check.`,
	// );

	const circleOfPrecision = circle(
		position?.geometry?.coordinates,
		GPS_RADIUS * (positionRadiusCorrection ?? 1),
		{ units: 'meters' },
	);

	const circleOfGeofence = circle(geofenceRadiusCoords, geofenceRadius, {
		units: 'meters',
	});

	return booleanIntersects(circleOfPrecision, circleOfGeofence);
};
