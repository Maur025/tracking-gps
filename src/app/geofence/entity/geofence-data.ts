import { BaseData } from '@maur025/core-model-data';
import { PositionSchema } from '@common/schema/position.schema';
import z, { boolean, number, string } from 'zod/v4';
import { GeofenceType } from './geofence-type';

export const GeofenceData = BaseData.extend({
	show: boolean().optional().default(false),
	over: boolean().optional(),
	area: number().nonnegative().optional(),
	radius: number().nonnegative().optional(),
	type: GeofenceType.optional(),
	coords: PositionSchema.optional(),
	name: string().optional(),
});

export type GeofenceData = z.infer<typeof GeofenceData>;
