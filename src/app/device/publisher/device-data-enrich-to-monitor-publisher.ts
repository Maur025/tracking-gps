import { kafkaProducer } from '@common/kafka/kafka-producer.js';
import { Device } from '../entity/device.js';
import { kafkaTopics } from '@src/kafka-topics.js';

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
