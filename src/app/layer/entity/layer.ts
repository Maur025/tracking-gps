import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod/v4';
import { LayerType } from './layer-type.js';

export const Layer = BaseData.extend({
	name: string().nonempty(),
	type: LayerType,
});

export type Layer = z.infer<typeof Layer>;
