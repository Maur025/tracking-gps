import { BaseData } from '@maur025/core-model-data';
import z, { array, string } from 'zod/v4';
import { GeofenceData } from './geofence-data';
import { GeofenceType } from './geofence-type';

export const Geofence = BaseData.extend({
	data: array(GeofenceData).optional(),
	name: string().nonempty().optional(),
	type: GeofenceType.optional(),
});

export type Geofence = z.infer<typeof Geofence>;
