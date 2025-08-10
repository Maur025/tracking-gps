import z, { any, array, object, string } from 'zod/v4';

export const AddDataInBatchSchema = object({
	dataList: array(any()).nonempty().default([]),
	dataBaseKey: string().nonempty(),
	registerInRedisFn: any(),
});

export type AddDataInBatchSchema<T> = Omit<
	z.infer<typeof AddDataInBatchSchema>,
	'registerInRedisFn' | 'dataList'
> & {
	registerInRedisFn: (
		dataBatch: T[],
		basekey: string,
	) => Promise<unknown[] | null>;
	dataList: T[];
};
