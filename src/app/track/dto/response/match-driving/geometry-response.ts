import z, { array, number, object, string } from 'zod/v4';

export const GeometryResponse = object({
	coordinates: array(array(number())).default([]),
	type: string(),
});

export type GeometryResponse = z.infer<typeof GeometryResponse>;
