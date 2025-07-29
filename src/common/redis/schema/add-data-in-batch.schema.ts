import { RediSearchSchema } from 'redis';
import z, { any, array, object, record, string } from 'zod/v4';

export const AddDataInBatchSchema = object({
	dataList: array(any()).nonempty().default([]),
	dataIndex: string().nonempty(),
	dataBaseKey: string().nonempty(),
	registerInRedisFn: any(),
	fieldsToIndex: record(
		string(),
		object({ type: string().optional(), AS: string().optional() }),
	)
		.default({})
		.optional(),
});

export type AddDataInBatchSchema<T> = Omit<
	z.infer<typeof AddDataInBatchSchema>,
	'registerInRedisFn' | 'dataList' | 'fieldsToIndex'
> & {
	registerInRedisFn: (
		dataBatch: T[],
		basekey: string,
	) => Promise<unknown[] | null>;
	dataList: T[];
	fieldsToIndex: RediSearchSchema;
};
