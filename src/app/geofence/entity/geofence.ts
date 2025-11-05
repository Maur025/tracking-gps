import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod/v4';
import { GeofenceData } from './geofence-data.js';
import { Layer } from '@app/layer/entity/layer.js';

export const Geofence = BaseData.extend({
	layerId: string().nonempty().optional(),
	name: string().nonempty().optional(),
	description: string().optional(),
	color: string().nullable().optional(),
	icon: string().nullable().optional(),
	coords: string().nullable().optional(),
	data: GeofenceData.optional(),
	layer: Layer,
});

export type Geofence = z.infer<typeof Geofence>;
