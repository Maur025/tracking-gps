import { kafkaTopics } from '@src/kafka-topics';
import { kafkaConsumer } from './kafka-consumer';
import {
	exampleTestConsumer,
	TestKafkaInterface,
} from '@kafka/consumers/example-test-consumer';

const { EXAMPLE } = kafkaTopics;

export const configureConsumers = async (): Promise<void> => {
	const { addConsumer } = kafkaConsumer();

	await addConsumer<TestKafkaInterface>({
		topics: [EXAMPLE],
		groupId: 'EXAMPLE-TEST',
		handler: exampleTestConsumer,
	});
};
