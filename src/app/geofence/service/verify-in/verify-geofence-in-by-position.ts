import { GeofenceType } from '@app/geofence/entity/geofence-type';
import { PositionSchema } from '@common/schema/position.schema';
import z, { array, number, object } from 'zod/v4';
import { verifyByRadialGeofence } from './verify-by-radial-geofence';
import { verifyByPolygonGeofence } from './verify-by-polygon-geofence';
import { loggerDebug } from '@maur025/core-logger';

const VerifyGeofenceInByPositionSchema = object({
	geofenceType: GeofenceType,
	position: array(number()),
	geofenceCoords: PositionSchema,
	geofenceRadius: number().nonnegative(),
});

type VerifyGeofenceInByPositionSchema = z.infer<
	typeof VerifyGeofenceInByPositionSchema
>;

export const verifyGeofenceInByPosition = (
	request: VerifyGeofenceInByPositionSchema,
): boolean => {
	const { geofenceType, position, geofenceCoords, geofenceRadius } =
		VerifyGeofenceInByPositionSchema.parse(request);

	switch (geofenceType) {
		case 'POLYGONS': {
			return verifyByPolygonGeofence({
				position,
				geofenceCoords,
			});
		}
		case 'POINTS': {
			return verifyByRadialGeofence({
				position,
				geofenceCoords,
				geofenceRadius,
			});
		}
		default: {
			loggerDebug(
				`[GEOFENCE] (verifyGeofenceInByPosition) geofence type not supported`,
			);

			return false;
		}
	}
};
