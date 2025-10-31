import { PositionL3, PositionSchema } from '@common/schema/position.schema';
import { getGeofenceCoordLeveled } from './get-geofence-coord-leveled';
import { Feature, GeoJsonProperties, Polygon } from 'geojson';
import {
	polygon as turfPolygon,
	booleanPointInPolygon,
	booleanIntersects,
	circle,
	point as turfPoint,
} from '@turf/turf';
import z, { array, number, object } from 'zod/v4';
import environment from '@config/env';
import { loggerDebug } from '@maur025/core-logger';

const { GPS_RADIUS } = environment;

const VerifyByPolygonGeofenceRequest = object({
	position: array(number()),
	geofenceCoords: PositionSchema,
});

type VerifyByPolygonGeofenceRequest = z.infer<
	typeof VerifyByPolygonGeofenceRequest
>;

export const verifyByPolygonGeofence = (
	request: VerifyByPolygonGeofenceRequest,
): boolean => {
	const { position, geofenceCoords } =
		VerifyByPolygonGeofenceRequest.parse(request);

	const geofencePolygonCoords: PositionL3 = getGeofenceCoordLeveled(
		geofenceCoords,
		3,
	) as PositionL3;

	const polygonGeofence: Feature<Polygon, GeoJsonProperties> = turfPolygon(
		geofencePolygonCoords,
	);

	if (GPS_RADIUS <= 0) {
		loggerDebug(
			`[GEOFENCE] (verifyByPolygonGeofence) GPS_RADIUS <= 0, using exact point-in-polygon check.`,
		);
		const positionPoint = turfPoint(position);

		return booleanPointInPolygon(positionPoint, polygonGeofence);
	}

	const circleOfPrecision = circle(position, GPS_RADIUS, { units: 'meters' });
	return booleanIntersects(circleOfPrecision, polygonGeofence);
};
