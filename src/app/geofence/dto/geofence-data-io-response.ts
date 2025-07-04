import { BaseData } from '@maur025/core-model-data';
import z, { boolean, number, string } from 'zod/v4';
import { GeofenceType } from '../entity/geofence-type';
import { PositionSchema } from '@schemas/position.schema';

export const GeofenceDataIoResponse = BaseData.extend({
	show: boolean().default(false).optional(),
	over: boolean().default(false).optional(),
	area: number().nonnegative().optional(),
	radius: number().nonnegative().optional(),
	type: GeofenceType.optional(),
	coords: PositionSchema.optional(),
	name: string().nonempty().optional(),
	date: string().nonempty().optional(),
});

export type GeofenceDataIoResponse = z.infer<typeof GeofenceDataIoResponse>;
