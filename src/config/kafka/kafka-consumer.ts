import { Consumer } from 'kafkajs';
import { handleKafkaClient } from './handle-kafka-client';
import { AddConsumerRequest, AddConsumerSchema } from './kafka-consumer.schema';
import { loggerError, loggerInfo } from '@maur025/core-logger';
import { prettifyError } from 'zod/v4';

export const kafkaConsumer = () => {
	const { kafkaClient } = handleKafkaClient();

	const addConsumer = async ({
		topics,
		groupId,
		handler,
		fromBeginning,
	}: AddConsumerRequest): Promise<void> => {
		const validation = AddConsumerSchema.safeParse({
			topics,
			groupId,
			handler,
			fromBeginning,
		});

		if (!validation.success) {
			loggerError(`addConsumer error: '\n${prettifyError(validation.error)}'`);

			return;
		}

		const consumer: Consumer = kafkaClient.consumer({
			groupId,
		});

		await consumer.connect();

		for (const topic of topics) {
			consumer.subscribe({ topic, fromBeginning: fromBeginning ?? false });
		}

		await consumer.run({ eachMessage: handler });
		loggerInfo(`[KAFKA] joined to [${groupId}]`);
	};

	return { addConsumer };
};
