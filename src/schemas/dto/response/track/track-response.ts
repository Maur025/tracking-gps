import z, { number, object } from 'zod/v4';

export const TrackResponse = object({
	t: number().nonnegative().optional(),
	lat: number().optional(),
	lon: number().optional(),
	bat: number().optional(),
	acc: number().optional(),
	stp: number().optional(),
});

export type TrackResponse = z.infer<typeof TrackResponse>;
