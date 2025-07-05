import z, { boolean, number, object, string } from 'zod/v4';

export const GetAllPaginatedRequest = object({
	size: number().nonnegative().default(100).optional(),
	page: number().nonnegative().default(0).optional(),
	sortBy: string().nonempty().default('id').optional(),
	descending: boolean().default(true).optional(),
	keyword: string().nonempty().optional(),
});

export type GetAllPaginatedRequest = z.infer<typeof GetAllPaginatedRequest>;
