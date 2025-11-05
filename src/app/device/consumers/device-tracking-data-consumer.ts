import { KafkaRecordSchema } from '@common/kafka/schema/kafka-record.schema.js';
import { Device } from '../entity/device.js';
import { ZodSafeParseResult } from 'zod/v4';
import { zodFailedValidationLog } from '@utils/zod-failed-validation-log.js';
import { loggerWarn } from '@maur025/core-logger';
import { processDeviceData } from '../service/process-device-data.js';
import { syncDeviceDataAndSyncInRedis } from '../cache/sync-device-data-and-sync-in-redis.js';
import { deviceDataEnrichToMonitorPublisher } from '../publisher/device-data-enrich-to-monitor-publisher.js';
import { measurePerformance } from '@utils/measure-performance.js';

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

	let deviceData: Device | null = null;

	await measurePerformance(async () => {
		deviceData = await processDeviceData(validate.data);
		console.log(deviceData);
	}, `[DEVICE] (deviceTrackingDataConsumer) device processed in:`);

	await syncDeviceDataAndSyncInRedis(deviceData);

	if (deviceData) {
		await deviceDataEnrichToMonitorPublisher(deviceData);
	}
};
