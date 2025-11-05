import z, { array, object, string } from 'zod/v4';
import { TracePointResponse } from './trace-point-response.js';
import { MatchingResponse } from './matching-response.js';

export const MatchDrivingResponse = object({
	code: string(),
	matchings: array(MatchingResponse).default([]),
	tracepoints: array(TracePointResponse).default([]),
});

export type MatchDrivingResponse = z.infer<typeof MatchDrivingResponse>;
