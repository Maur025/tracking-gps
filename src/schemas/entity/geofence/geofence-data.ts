import { BaseData } from '@maur025/core-model-data';
import { PositionSchema } from '@schemas/position.schema';
import z, { boolean, number, enum as enum_, string } from 'zod/v4';

export const GeofenceData = BaseData.extend({
	show: boolean().optional().default(false),
	over: boolean().optional(),
	area: number().nonnegative().optional(),
	radius: number().nonnegative().optional(),
	type: enum_(['POLYGONS', 'POINTS']).optional(),
	coords: PositionSchema.optional(),
	name: string().optional(),
});

export type GeofenceData = z.infer<typeof GeofenceData>;
