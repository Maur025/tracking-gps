import { PositionL1 } from '@common/schema/position.schema.js';
import { BaseData } from '@maur025/core-model-data';
import z, { boolean, number, string } from 'zod/v4';
import { GeofenceType } from './geofence-type.js';
import { GeofenceCalculateStates } from './geofence-calculate-state.js';

export const GeofenceIn = BaseData.extend({
	deviceId: string().nonempty(),
	geofenceId: string().nonempty(),
	geofenceName: string().nonempty(),
	layerId: string().nonempty(),
	layerName: string().nonempty(),
	timestamp: number().nonnegative(),
	date: string().nonempty(),
	positionCoords: PositionL1.default([0, 0]),
	area: number().nonnegative().optional(),
	radius: number().nonnegative().optional(),
	type: GeofenceType,
	initialState: GeofenceCalculateStates,
	finalState: GeofenceCalculateStates,
	isNew: boolean().default(false),
});

export type GeofenceIn = z.infer<typeof GeofenceIn>;
