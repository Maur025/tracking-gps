import { kafkaTopics } from '@src/kafka-topics';
import { kafkaConsumer } from './kafka-consumer';
import { EachMessagePayload } from 'kafkajs';

const { EXAMPLE } = kafkaTopics;

export const configureConsumers = async (): Promise<void> => {
	const { addConsumer } = kafkaConsumer();

	await addConsumer({
		topics: [EXAMPLE],
		groupId: 'EXAMPLE-TEST',
		handler: async (payload: EachMessagePayload): Promise<void> => {
			console.log(payload);
		},
	});
};
