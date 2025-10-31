import z, { any, array, number, object, string } from 'zod/v4';

export const LegResponse = object({
	steps: array(any()).default([]),
	distance: number().nonnegative(),
	duration: number().nonnegative(),
	summary: string(),
	weight: number().nonnegative(),
});

export type LegResponse = z.infer<typeof LegResponse>;
