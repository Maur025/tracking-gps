import { KafkaRecordSchema } from '@common/kafka/schema/kafka-record.schema';
import { Device } from '../entity/device';
import { ZodSafeParseResult } from 'zod/v4';
import { zodFailedValidationLog } from '@utils/zod-failed-validation-log';

export const deviceTrackingDataConsumer = async (
	record: KafkaRecordSchema<Device>,
): Promise<void> => {
	const validate: ZodSafeParseResult<Device> = await Device.safeParseAsync(
		record.value,
	);

	if (!validate.success) {
		zodFailedValidationLog({
			error: validate.error,
			message: 'deviceTrackingDataConsumer validation failed:',
		});

		return;
	}

	console.log(validate.data);
};
