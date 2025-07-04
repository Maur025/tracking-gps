import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod/v4';

export const LayerResponse = BaseData.extend({
	name: string().nonempty().optional(),
	type: string().nonempty().optional(),
});

export type LayerResponse = z.infer<typeof LayerResponse>;
