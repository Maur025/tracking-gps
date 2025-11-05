import { BaseData } from '@maur025/core-model-data';
import z from 'zod/v4';
import { number, string } from 'zod/v4';

export const Point = BaseData.extend({
	route_id: string().nonempty().optional(),
	section: number().nonnegative().optional(),
	lat: number().optional(),
	lon: number().optional(),
});

export type Point = z.infer<typeof Point>;
