import { loggerDebug } from '@maur025/core-logger';
import { Feature, GeoJsonProperties, Point, Position } from 'geojson';
import { getGeofenceCoordLeveled } from './get-geofence-coord-leveled';
import { PositionSchema } from '@common/schema/position.schema';
import { distance as turfDistance } from '@turf/turf';

export const verifyByRadialGeofence = (
	currentPosition: Feature<Point, GeoJsonProperties>,
	geofenceCoords: PositionSchema,
	radius: number,
): boolean => {
	if (!radius) {
		loggerDebug(
			`[GEOFENCE] (verifyByRadialGeofence) geofence without radius, skipping...`,
		);

		return false;
	}

	const geofenceRadiusCoords: Position = getGeofenceCoordLeveled(
		geofenceCoords,
		1,
	) as Position;

	const distanceBetweenPoints: number = turfDistance(
		geofenceRadiusCoords,
		currentPosition,
		{ units: 'meters' },
	);

	return distanceBetweenPoints <= radius;
};
