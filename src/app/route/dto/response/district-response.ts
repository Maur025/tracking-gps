import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod/v4';

export const DistrictResponse = BaseData.extend({
	name: string().nonempty().optional(),
	color: string().nonempty().optional(),
});

export type DistrictResponse = z.infer<typeof DistrictResponse>;
