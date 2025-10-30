import z, { array, number, object, string } from 'zod/v4';

export const TracePointResponse = object({
	alternatives_count: number(),
	waypoint_index: number(),
	matchings_index: number(),
	location: array(number()).default([]),
	name: string(),
	distance: number().nonnegative(),
	hint: string(),
});

export type TracePointResponse = z.infer<typeof TracePointResponse>;
