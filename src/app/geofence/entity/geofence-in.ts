import { PositionSchema } from '@common/schema/position.schema';
import { BaseData } from '@maur025/core-model-data';
import z, { boolean, number, string } from 'zod/v4';
import { GeofenceType } from './geofence-type';

export const GeofenceIn = BaseData.extend({
	deviceId: string().nonempty(),
	geofenceId: string().nonempty(),
	geofenceName: string().nonempty(),
	layerId: string().nonempty(),
	layerName: string().nonempty(),
	timestamp: number().nonnegative(),
	date: string().nonempty(),
	coords: PositionSchema.default([0, 0]).optional(),
	area: number().nonnegative().optional(),
	radius: number().nonnegative().optional(),
	type: GeofenceType.optional(),
	isNew: boolean().default(false),
});

export type GeofenceIn = z.infer<typeof GeofenceIn>;
