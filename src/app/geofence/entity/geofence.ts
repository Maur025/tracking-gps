import { BaseData } from '@maur025/core-model-data';
import z, { array, string, enum as enum_ } from 'zod/v4';
import { GeofenceData } from './geofence-data';

export const Geofence = BaseData.extend({
	data: array(GeofenceData).optional(),
	name: string().nonempty().optional(),
	type: enum_(['POLYGONS', 'POINTS']).optional(),
});

export type Geofence = z.infer<typeof Geofence>;
