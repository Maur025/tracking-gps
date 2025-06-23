import z, { object, string } from 'zod/v4';

export const LoadSwaggerDocsSchema = object({
	path: string().nonempty(),
	tag: string().nonempty(),
});

export type LoadSwaggerDocsSchema = z.infer<typeof LoadSwaggerDocsSchema>;
