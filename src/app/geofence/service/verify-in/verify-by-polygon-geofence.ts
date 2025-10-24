import { PositionL3, PositionSchema } from '@common/schema/position.schema';
import { getGeofenceCoordLeveled } from './get-geofence-coord-leveled';
import { Feature, GeoJsonProperties, Point, Polygon } from 'geojson';
import { polygon as turfPolygon, booleanPointInPolygon } from '@turf/turf';
import z, { any, object } from 'zod/v4';

const VerifyByPolygonGeofenceRequest = object({
	currentPosition: any(),
	geofenceCoords: PositionSchema,
	previousPosition: any().optional(),
});

type VerifyByPolygonGeofenceRequest = Omit<
	z.infer<typeof VerifyByPolygonGeofenceRequest>,
	'currentPosition'
> & {
	currentPosition: Feature<Point, GeoJsonProperties>;
	previousPosition: Feature<Point, GeoJsonProperties> | undefined;
};

export const verifyByPolygonGeofence = (
	request: VerifyByPolygonGeofenceRequest,
): boolean => {
	const { currentPosition, geofenceCoords, previousPosition } =
		VerifyByPolygonGeofenceRequest.parse(request);

	let isInGeofence = false;

	const geofencePolygonCoords: PositionL3 = getGeofenceCoordLeveled(
		geofenceCoords,
		3,
	) as PositionL3;

	const polygonGeofence: Feature<Polygon, GeoJsonProperties> = turfPolygon(
		geofencePolygonCoords,
	);

	isInGeofence = booleanPointInPolygon(currentPosition, polygonGeofence);

	// if (isInGeofence || !previousPosition) {
	// 	return isInGeofence;
	// }

	// const route = lineString([previousPosition, currentPosition]);
	// console.log(route);

	// const routeDistance = turfLength(route, { units: 'meters' });
	// console.log(`routeDistance: ${routeDistance} meters`);

	return isInGeofence;
};
