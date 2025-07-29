import { AddDataInBatchSchema } from '../schema/add-data-in-batch.schema';
import { addRedisIdx } from './add-redis-idx';

export const addDataInBatch = async <E>(
	request: AddDataInBatchSchema<E>,
): Promise<void> => {
	const {
		dataList,
		dataIndex,
		dataBaseKey,
		registerInRedisFn,
		fieldsToIndex = {},
	} = AddDataInBatchSchema.parse(request);

	const BATCH_LIMIT: number = 500;
	let dataBatch: E[] = [];

	await addRedisIdx(
		dataIndex,
		{
			'$.id': { type: 'TAG', AS: 'id' },
			...fieldsToIndex,
		},
		dataBaseKey,
	);

	for (const data of dataList) {
		dataBatch.push(data);

		if (dataBatch.length === BATCH_LIMIT) {
			await registerInRedisFn(dataBatch, dataBaseKey);

			dataBatch = [];
		}
	}

	if (dataBatch.length) {
		await registerInRedisFn(dataBatch, dataBaseKey);

		dataBatch = [];
	}
};
