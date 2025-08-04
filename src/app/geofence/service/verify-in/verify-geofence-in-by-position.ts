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
	geofenceCoords: PositionSchema,
	radius: number().nonnegative(),
});

type VerifyGeofenceInByPositionSchema = z.infer<
	typeof VerifyGeofenceInByPositionSchema
>;

export const verifyGeofenceInByPosition = (
	request: VerifyGeofenceInByPositionSchema,
): boolean => {
	const { geofenceType, positionCoords, geofenceCoords, radius } =
		VerifyGeofenceInByPositionSchema.parse(request);

	const currentPosition: Feature<Point, GeoJsonProperties> =
		turfPoint(positionCoords);

	switch (geofenceType) {
		case 'POLYGONS': {
			return verifyByPolygonGeofence(currentPosition, geofenceCoords);
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
