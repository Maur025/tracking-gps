import { BaseData } from '@maur025/core-model-data';
import { RemoveDataInBatchSchema } from '../schema/remove-data-in-batch.schema.js';
import { deleteDataInBatch } from './delete-data-in-batch.js';

export const removeDataInBatch = async <E extends BaseData>(
	request: RemoveDataInBatchSchema<E>,
): Promise<void> => {
	const { dataList, dataBaseKey } = RemoveDataInBatchSchema.parse(request);

	const BATCH_LIMIT: number = 500;
	const dataVerifyList: E[] = dataList as E[];

	let keyBatch: string[] = [];

	for (const data of dataVerifyList) {
		if (!data.id) {
			continue;
		}

		keyBatch.push(`${dataBaseKey}${data.id}`);

		if (keyBatch.length === BATCH_LIMIT) {
			await deleteDataInBatch(keyBatch);

			keyBatch = [];
		}
	}

	if (keyBatch.length) {
		await deleteDataInBatch(keyBatch);

		keyBatch = [];
	}
};
