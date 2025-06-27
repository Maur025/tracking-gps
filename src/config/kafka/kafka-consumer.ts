import { Consumer, EachMessagePayload } from 'kafkajs';
import { handleKafkaClient } from './handle-kafka-client';
import { AddConsumerRequest, AddConsumerSchema } from './add-consumer.schema';
import { loggerError, loggerInfo } from '@maur025/core-logger';
import { prettifyError } from 'zod/v4';
import { KafkaRecordSchema } from './kafka-record.schema';

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

		await consumer.run({
			eachMessage: async (payload: EachMessagePayload) => {
				const record: KafkaRecordSchema = getRecord(payload);

				await handler(record);
			},
		});

		loggerInfo(`[KAFKA] joined to [${groupId}]`);
	};

	const getRecord = ({ message }: EachMessagePayload): KafkaRecordSchema => {
		return { ...message };
	};

	return { addConsumer };
};
