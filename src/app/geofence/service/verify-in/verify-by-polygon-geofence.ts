import { PositionL3, PositionSchema } from '@common/schema/position.schema';
import { getGeofenceCoordLeveled } from './get-geofence-coord-leveled';
import { Feature, GeoJsonProperties, Point, Polygon } from 'geojson';
import {
	polygon as turfPolygon,
	booleanPointInPolygon,
	booleanIntersects,
	circle,
} from '@turf/turf';
import z, { any, object } from 'zod/v4';
import environment from '@config/env';
import { loggerDebug } from '@maur025/core-logger';

const { GPS_RADIUS } = environment;

const VerifyByPolygonGeofenceRequest = object({
	position: any(),
	geofenceCoords: PositionSchema,
});

type VerifyByPolygonGeofenceRequest = Omit<
	z.infer<typeof VerifyByPolygonGeofenceRequest>,
	'position'
> & {
	position: Feature<Point, GeoJsonProperties>;
};

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
		return booleanPointInPolygon(position, polygonGeofence);
	}

	const circleOfPrecision = circle(
		position?.geometry?.coordinates,
		GPS_RADIUS,
		{ units: 'meters' },
	);
	return booleanIntersects(circleOfPrecision, polygonGeofence);
};
