import z, { any, object, record, string } from 'zod/v4';

export const UpdateRequest = object({
	id: string().nonempty(),
	data: record(string(), any()),
});

export type UpdateRequest = z.infer<typeof UpdateRequest>;
