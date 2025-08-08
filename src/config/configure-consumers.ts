import { kafkaTopics } from '@src/kafka-topics';
import { kafkaConsumer } from '../common/kafka/kafka-consumer';
import {
	exampleTestConsumer,
	TestKafkaInterface,
} from '@app/test-app/consumers/example-test-consumer';
import { deviceTrackingDataConsumer } from '@app/device/consumers/device-tracking-data-consumer';
import { Device } from '@app/device/entity/device';
import { HandleKafkaClientSchema } from '@common/kafka/handle-kafka-client';

const { EXAMPLE, TRACKING_GPS_DEVICE } = kafkaTopics;

export const configureConsumers = async (
	request: HandleKafkaClientSchema,
): Promise<void> => {
	const { addConsumer } = kafkaConsumer(request);

	await addConsumer<TestKafkaInterface>({
		topics: [EXAMPLE],
		groupId: 'EXAMPLE-TEST',
		handler: exampleTestConsumer,
	});

	await addConsumer<Device>({
		topics: [TRACKING_GPS_DEVICE],
		groupId: 'tracking-gps',
		handler: deviceTrackingDataConsumer,
	});
};
