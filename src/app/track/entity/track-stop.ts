import z from 'zod/v4';
import { number, object } from 'zod/v4';

export const TrackStop = object({
	start_date: number().nonnegative().optional(),
	start_lat: number().optional(),
	start_lon: number().optional(),
	end_date: number().nonnegative().optional(),
	end_lat: number().optional(),
	end_lon: number().optional(),
	duration: number().nonnegative().optional(),
});

export type TrackStop = z.infer<typeof TrackStop>;
