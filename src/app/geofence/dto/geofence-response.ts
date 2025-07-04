import { BaseData } from '@maur025/core-model-data';
import z, { string, enum as enum_ } from 'zod/v4';
import { LayerResponse } from '../../../schemas/dto/response/layer/layer-response';

export const GeofenceResponse = BaseData.extend({
	data: string().nonempty().optional(),
	name: string().nonempty().optional(),
	type: enum_(['POLYGONS', 'POINTS']).optional(),
	layer: LayerResponse,
});

export type GeofenceResponse = z.infer<typeof GeofenceResponse>;
