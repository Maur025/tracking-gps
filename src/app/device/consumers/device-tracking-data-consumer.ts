import { KafkaRecordSchema } from '@common/kafka/schema/kafka-record.schema';
import { Device } from '../entity/device';
import { ZodSafeParseResult } from 'zod/v4';
import { zodFailedValidationLog } from '@utils/zod-failed-validation-log';
import { loggerWarn } from '@maur025/core-logger';
import { processDeviceData } from '../service/process-device-data';
import { syncDeviceInRedis } from '../cache/sync-device-in-redis';
import { deviceDataEnrichToMonitorPublisher } from '../publisher/device-data-enrich-to-monitor-publisher';

export const deviceTrackingDataConsumer = async (
	record: KafkaRecordSchema<Device>,
): Promise<void> => {
	const validate: ZodSafeParseResult<Device> = await Device.safeParseAsync(
		record.value,
	);

	if (!validate.success) {
		zodFailedValidationLog({
			error: validate.error,
			message: '[DEVICE] (deviceTrackingDataConsumer) validation failed:',
		});

		return;
	}

	if (!validate.data?.id) {
		loggerWarn(
			`[DEVICE] (deviceTrackingDataConsumer) device id is undefined or empty. Skipping`,
		);
		return;
	}

	const deviceData: Device | null = await processDeviceData(validate.data);

	console.log(deviceData);

	await syncDeviceInRedis(deviceData);

	if (deviceData) {
		await deviceDataEnrichToMonitorPublisher(deviceData);
	}
};
