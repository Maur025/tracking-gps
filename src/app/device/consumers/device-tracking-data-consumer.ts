import { KafkaRecordSchema } from '@common/kafka/schema/kafka-record.schema';
import { Device } from '../entity/device';
import { ZodSafeParseResult } from 'zod/v4';
import { zodFailedValidationLog } from '@utils/zod-failed-validation-log';
import DeviceCache from '../cache/device-cache';
import { container } from 'tsyringe';
import { getMinutesOfTimestamp } from '@utils/get-minutes-of-timestamp';
import { loggerWarn } from '@maur025/core-logger';
import { processDeviceData } from '../service/process-device-data';

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

	const timestampNow: number = Date.now();
	const deviceCache = container.resolve(DeviceCache);
	const deviceData: Device = await processDeviceData(validate.data);

	console.log(deviceData);
	if (!deviceData.id) {
		loggerWarn(`device id is undefined or empty. Skipping`);
		return;
	}

	if (!deviceCache.hasId(deviceData.id)) {
		await deviceCache.syncDataInRedisCache(deviceData);

		return;
	}

	const deviceDataInMap = deviceCache.getById(deviceData.id);
	const sinceLastUpdate: number = getMinutesOfTimestamp(
		timestampNow - (deviceDataInMap?.lastRedisUpdate ?? 0),
	);

	if (sinceLastUpdate >= 12) {
		await deviceCache.syncDataInRedisCache(deviceData);
	}
};
