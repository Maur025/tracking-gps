import z, { number, object } from 'zod/v4';

export const Track = object({
	t: number().nonnegative().optional(),
	lat: number().optional(),
	lon: number().optional(),
	bat: number().nonnegative().optional(),
	acc: number().nonnegative().optional(),
	stp: number().nonnegative().optional(),
});

export type Track = z.infer<typeof Track>;
