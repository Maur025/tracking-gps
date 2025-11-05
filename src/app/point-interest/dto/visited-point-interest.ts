import { GeofenceCalculateStates } from '@app/geofence/entity/geofence-calculate-state.js';
import z, { array, number, object, string } from 'zod/v4';

export const VisitedPointInterest = object({
	deviceId: string().nonempty(),
	pointInterestId: string().nonempty(),
	pointInterestName: string().nonempty(),
	layerId: string().nonempty(),
	layerName: string().nonempty(),
	timestamp: z.number().nonnegative(),
	date: string().nonempty(),
	positionCoords: array(number()),
	area: number().nonnegative().optional(),
	radius: number().nonnegative().optional(),
	initialState: GeofenceCalculateStates,
	finalState: GeofenceCalculateStates,
});

export type VisitedPointInterest = z.infer<typeof VisitedPointInterest>;
