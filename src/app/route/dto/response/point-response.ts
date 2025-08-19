import { BaseData } from '@maur025/core-model-data';
import z, { number, string } from 'zod/v4';

export const PointResponse = BaseData.extend({
	route_id: string().nonempty().optional(),
	section: number().nonnegative().optional(),
	lat: number().optional(),
	lon: number().optional(),
});

export type PointResponse = z.infer<typeof PointResponse>;
