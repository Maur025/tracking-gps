import { PositionL3, PositionSchema } from '@common/schema/position.schema';
import { getGeofenceCoordLeveled } from './get-geofence-coord-leveled';
import { Feature, GeoJsonProperties, Point, Polygon } from 'geojson';
import { polygon as turfPolygon, booleanPointInPolygon } from '@turf/turf';

export const verifyByPolygonGeofence = (
	currentPosition: Feature<Point, GeoJsonProperties>,
	geofenceCoords: PositionSchema,
): boolean => {
	const geofencePolygonCoords: PositionL3 = getGeofenceCoordLeveled(
		geofenceCoords,
		3,
	) as PositionL3;

	const polygonGeofence: Feature<Polygon, GeoJsonProperties> = turfPolygon(
		geofencePolygonCoords,
	);

	return booleanPointInPolygon(currentPosition, polygonGeofence);
};
