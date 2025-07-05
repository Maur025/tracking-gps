import z, { enum as enum_ } from 'zod/v4';

export const HttpMethodSchema = enum_([
	'GET',
	'POST',
	'PUT',
	'DELETE',
	'PATCH',
]);

export type HttpMethodSchema = z.infer<typeof HttpMethodSchema>;
