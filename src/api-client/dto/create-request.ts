import z, { any, object, record, string } from 'zod/v4';

export const CreateRequest = object({
	data: record(string(), any()),
});

export type CreateRequest = z.infer<typeof CreateRequest>;
