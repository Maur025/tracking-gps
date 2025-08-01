import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod/v4';
import { LayerResponse } from '../../layer/dto/layer-response';

export const GeofenceResponse = BaseData.extend({
	layer_id: string().nonempty().optional(),
	name: string().nonempty().optional(),
	description: string().optional(),
	color: string().nullable().optional(),
	icon: string().nullable().optional(),
	coords: string().nullable().optional(),
	data: string().nonempty().optional(),
	layer: LayerResponse,
});

export type GeofenceResponse = z.infer<typeof GeofenceResponse>;
