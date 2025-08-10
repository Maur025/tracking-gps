import { AddDataInBatchSchema } from '../schema/add-data-in-batch.schema';

export const addDataInBatch = async <E>(
	request: AddDataInBatchSchema<E>,
): Promise<void> => {
	const { dataList, dataBaseKey, registerInRedisFn } =
		AddDataInBatchSchema.parse(request);

	const BATCH_LIMIT: number = 500;
	let dataBatch: E[] = [];

	for (const data of dataList) {
		dataBatch.push(data);

		if (dataBatch.length === BATCH_LIMIT) {
			await registerInRedisFn(dataBatch, dataBaseKey);

			dataBatch = [];
		}
	}

	if (dataBatch.length) {
		await registerInRedisFn(dataBatch, dataBaseKey);
	}
};
