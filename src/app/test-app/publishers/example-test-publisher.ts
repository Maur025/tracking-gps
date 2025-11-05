import { kafkaProducer } from '@common/kafka/kafka-producer';
import { TestKafkaInterface } from '../consumers/example-test-consumer';
import { kafkaTopics } from '@src/kafka-topics';

const { EXAMPLE } = kafkaTopics;

export const exampleTestPublisher = async (
	objectData: TestKafkaInterface,
): Promise<void> => {
	const { publish } = kafkaProducer();

	await publish({ topic: EXAMPLE, value: objectData });
};
