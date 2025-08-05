import z, { any, array, object, string } from 'zod/v4';

export const RemoveDataInBatchSchema = object({
	dataList: array(any()).nonempty().default([]),
	dataBaseKey: string().nonempty(),
});

export type RemoveDataInBatchSchema<T> = Omit<
	z.infer<typeof RemoveDataInBatchSchema>,
	'dataList' | 'deleteInRedisFn'
> & {
	dataList: T[];
};
