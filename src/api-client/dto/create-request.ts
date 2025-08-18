import z, { any, object, record, string } from 'zod/v4';

export const CreateRequest = object({
	data: record(string(), any()),
});

export type CreateRequest<T> = Omit<z.infer<typeof CreateRequest>, 'data'> & {
	data: T;
};
