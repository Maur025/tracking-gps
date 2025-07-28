import { kafkaTopics } from '@src/kafka-topics';
import { kafkaConsumer } from '../common/kafka/kafka-consumer';
import {
	exampleTestConsumer,
	TestKafkaInterface,
} from '@app/test-app/consumers/example-test-consumer';

const { EXAMPLE, TRACKING_GPS_DEVICE } = kafkaTopics;

export const configureConsumers = async (): Promise<void> => {
	const { addConsumer } = kafkaConsumer();

	await addConsumer<TestKafkaInterface>({
		topics: [EXAMPLE],
		groupId: 'EXAMPLE-TEST',
		handler: exampleTestConsumer,
	});

	await addConsumer<void>({
		topics: [TRACKING_GPS_DEVICE],
		groupId: 'tracking-gps',
		handler: async (data: unknown) => {
			console.log(data);
		},
	});
};
