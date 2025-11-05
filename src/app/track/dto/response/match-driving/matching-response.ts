import z, { array, number, object, string } from 'zod/v4';
import { GeometryResponse } from './geometry-response.js';
import { LegResponse } from './leg-response.js';

export const MatchingResponse = object({
	confidence: number().nonnegative(),
	geometry: GeometryResponse,
	legs: array(LegResponse).default([]),
	distance: number().nonnegative(),
	duration: number().nonnegative(),
	weight_name: string(),
	weight: number().nonnegative(),
});

export type MatchingResponse = z.infer<typeof MatchingResponse>;
