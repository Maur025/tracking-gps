import { GeofenceType } from '@app/geofence/entity/geofence-type';
import { PositionSchema } from '@common/schema/position.schema';
import { Feature, GeoJsonProperties, Point } from 'geojson';
import z, { array, number, object } from 'zod/v4';
import { point as turfPoint } from '@turf/turf';
import { verifyByRadialGeofence } from './verify-by-radial-geofence';
import { verifyByPolygonGeofence } from './verify-by-polygon-geofence';
import { loggerDebug } from '@maur025/core-logger';

const VerifyGeofenceInByPositionSchema = object({
	geofenceType: GeofenceType,
	positionCoords: array(number()).min(2),
	previousPositionCoords: array(number()).min(2).optional(),
	geofenceCoords: PositionSchema,
	radius: number().nonnegative(),
	currentTimestamp: number().nonnegative(),
	previousTimestamp: number().nonnegative(),
});

type VerifyGeofenceInByPositionSchema = z.infer<
	typeof VerifyGeofenceInByPositionSchema
>;

export const verifyGeofenceInByPosition = (
	request: VerifyGeofenceInByPositionSchema,
): boolean => {
	const {
		geofenceType,
		positionCoords,
		geofenceCoords,
		radius,
		previousPositionCoords,
		currentTimestamp,
		previousTimestamp,
	} = VerifyGeofenceInByPositionSchema.parse(request);
	// if (
	// 	previousPositionCoords &&
	// 	positionCoords[0] === previousPositionCoords[0] &&
	// 	positionCoords[1] == previousPositionCoords[1]
	// ) {
	// 	loggerDebug(
	// 		`[GEOFENCE] (verifyGeofenceInByPosition) position not changed from previous, skipping...`,
	// 	);

	// 	return false;
	// }

	const secondsTranscurredFromPrevTimestamp =
		getTotalSecondsTranscurredFromPreviousTimestamp(
			currentTimestamp,
			previousTimestamp,
		);

	const currentPosition: Feature<Point, GeoJsonProperties> =
		turfPoint(positionCoords);

	const previousPosition: Feature<Point, GeoJsonProperties> | undefined =
		previousPositionCoords &&
		previousPositionCoords[1] != positionCoords[1] &&
		previousPositionCoords[0] != positionCoords[0]
			? turfPoint(previousPositionCoords)
			: undefined;

	switch (geofenceType) {
		case 'POLYGONS': {
			return verifyByPolygonGeofence({
				currentPosition,
				geofenceCoords,
				previousPosition,
			});
		}
		case 'POINTS': {
			return verifyByRadialGeofence(currentPosition, geofenceCoords, radius);
		}
		default: {
			loggerDebug(
				`[GEOFENCE] (verifyGeofenceInByPosition) geofence type not supported`,
			);

			return false;
		}
	}
};

const getTotalSecondsTranscurredFromPreviousTimestamp = (
	currentTimestamp: number,
	previousTimestamp: number,
): number => {
	const timeDifference = currentTimestamp - previousTimestamp;
	return Math.floor(timeDifference / 1000);
};
