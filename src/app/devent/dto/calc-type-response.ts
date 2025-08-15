import z, { boolean, number, object, string } from 'zod/v4';

export const CalcTypeResponse = object({
	id: number(),
	name: string().nonempty(),
	avg: boolean().default(false),
	delta: boolean().default(false),
	interval: number().nonnegative(),
	time: number().nonnegative(),
});

export type CalcTypeResponse = z.infer<typeof CalcTypeResponse>;
