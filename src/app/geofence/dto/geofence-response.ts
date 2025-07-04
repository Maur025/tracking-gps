import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod/v4';
import { LayerResponse } from '../../layer/dto/layer-response';
import { GeofenceType } from '../entity/geofence-type';

export const GeofenceResponse = BaseData.extend({
	data: string().nonempty().optional(),
	name: string().nonempty().optional(),
	type: GeofenceType.optional(),
	layer: LayerResponse,
});

export type GeofenceResponse = z.infer<typeof GeofenceResponse>;
