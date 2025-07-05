import z, { number, object, string } from 'zod/v4';

export const DefaultServerLimitsSchema = object({
	LIMIT_TEXT: string().nonempty(),
	LIMIT_JSON: string().nonempty(),
	LIMIT_URLENCODED: string().nonempty(),
	LIMIT_PARAMETER: number().nonnegative(),
});

export type DefaultServerLimitsSchema = z.infer<
	typeof DefaultServerLimitsSchema
>;
