import z, { string, object, any, enum as enum_, array } from 'zod/v4';

const SchemaObject = any();

const MediaTypeObject = object({
	schema: SchemaObject.optional(),
});

const ResponseContent = object({
	'application/json': MediaTypeObject.optional(),
});

const ResponseObject = object({
	description: string(),
	content: ResponseContent.optional(),
});

const ResponsesMainObject = object({
	200: ResponseObject.optional(),
	400: ResponseObject.optional(),
	404: ResponseObject.optional(),
	500: ResponseObject.optional(),
});

export const SwaggerRegisterPathSchema = object({
	method: enum_(['get', 'post', 'put', 'patch', 'delete']).nonoptional(),
	path: string().nonempty().nonoptional(),
	summary: string().optional(),
	description: string().optional(),
	tags: array(string()).optional().default([]),
	request: object({
		params: SchemaObject.optional(),
		query: SchemaObject.optional(),
		body: SchemaObject.optional(),
	}).optional(),
	responses: ResponsesMainObject.optional(),
});

export type SwaggerRegisterPathSchema = z.infer<
	typeof SwaggerRegisterPathSchema
>;
