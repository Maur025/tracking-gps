import { kafkaProducer } from '@common/kafka/kafka-producer';
import { Device } from '../entity/device';
import { kafkaTopics } from '@src/kafka-topics';

const { TRACKING_VEHICLE_DEVICE } = kafkaTopics;

export const deviceDataEnrichToMonitorPublisher = async (
	payload: Device,
): Promise<void> => {
	const { publish } = kafkaProducer();

	await publish<Device>({
		topic: TRACKING_VEHICLE_DEVICE,
		value: payload,
	});
};
