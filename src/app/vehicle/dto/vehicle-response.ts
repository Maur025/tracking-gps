import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod/v4';

export const VehicleResponse = BaseData.extend({
	name: string().nonempty(),
	type: string().nonempty(),
	metadata: string().nonempty(),
});

export type VehicleResponse = z.infer<typeof VehicleResponse>;
