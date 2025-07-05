import z, { number, object } from 'zod/v4';

export const MonitorConfigSchema = object({
	MAX_POINT_DISTANCE: number().nonnegative(),
});

export type MonitorConfigSchema = z.infer<typeof MonitorConfigSchema>;
