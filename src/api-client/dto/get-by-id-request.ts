import z, { object, string } from 'zod/v4';

export const GetByIdRequest = object({
	id: string().nonempty(),
});

export type GetByIdRequest = z.infer<typeof GetByIdRequest>;
