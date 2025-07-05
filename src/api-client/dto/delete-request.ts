import z, { object, string } from 'zod/v4';

export const DeleteRequest = object({
	id: string().nonempty(),
});

export type DeleteRequest = z.infer<typeof DeleteRequest>;
