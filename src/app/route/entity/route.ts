import { BaseDataAudit } from '@maur025/core-model-data';
import z, { array, number, string } from 'zod/v4';
import { District } from './district';
import { Point } from './Point';
import { RouteSection } from './route-section';

export const Route = BaseDataAudit.extend({
	name: string().nonempty().optional(),
	description: string().nonempty().optional(),
	distance: number().nonnegative().optional(),
	color: string().nonempty().optional(),
	min_split_mt: number().nonnegative().optional(),
	max_split_mt: number().nonnegative().optional(),
	district: District,
	points: array(Point).default([]),
	frecuency: string().nonempty(),
	extend: array(number()).default([]).optional(),
	sections: array(RouteSection).default([]).optional(),
	completed: number().nonnegative().optional(),
});

export type Route = z.infer<typeof Route>;
