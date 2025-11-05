import { kafkaProducer } from '@common/kafka/kafka-producer.js';
import { TestKafkaInterface } from '../consumers/example-test-consumer.js';
import { kafkaTopics } from '@src/kafka-topics.js';

const { EXAMPLE } = kafkaTopics;

export const exampleTestPublisher = async (
	objectData: TestKafkaInterface,
): Promise<void> => {
	const { publish } = kafkaProducer();

	await publish({ topic: EXAMPLE, value: objectData });
};
