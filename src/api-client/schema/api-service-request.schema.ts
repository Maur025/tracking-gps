import z, { object, string } from 'zod/v4';

export const ApiServiceRequestSchema = object({
	baseUrl: string().nonempty(),
	resource: string().nonempty(),
	prefix: string().nonempty().optional(),
});

export type ApiServiceRequestSchema = z.infer<typeof ApiServiceRequestSchema>;
