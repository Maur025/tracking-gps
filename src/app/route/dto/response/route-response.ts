import { BaseDataAudit } from '@maur025/core-model-data';
import z, { any, array, number, string } from 'zod/v4';
import { DistrictResponse } from './district-response';
import { PointResponse } from './point-response';
import { RouteSectionResponse } from './route-section-response';

export const RouteResponse = BaseDataAudit.extend({
	name: string().nonempty().optional(),
	description: string().nonempty().optional(),
	distance: number().nonnegative().optional(),
	color: string().nonempty().optional(),
	min_split_mt: number().nonnegative().optional(),
	max_split_mt: number().nonnegative().optional(),
	district_id: number().int().nonnegative(),
	district: DistrictResponse,
	points: array(PointResponse).default([]),
	frecuency: string().nonempty(),
	extend: array(number()).default([]).optional(),
	sections: array(RouteSectionResponse).default([]).optional(),
	tracksIn: array(any()).default([]).optional(),
	tracksOut: array(any()).default([]).optional(),
	splitCoordsLine: array(any()).default([]).optional(),
});

export type RouteResponse = z.infer<typeof RouteResponse>;
