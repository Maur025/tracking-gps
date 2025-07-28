import { Consumer, EachMessagePayload } from 'kafkajs';
import { handleKafkaClient } from './handle-kafka-client';
import {
	AddConsumerRequest,
	AddConsumerSchema,
} from './schema/add-consumer.schema';
import { loggerError, loggerInfo } from '@maur025/core-logger';
import { prettifyError } from 'zod/v4';
import { KafkaRecordSchema } from './schema/kafka-record.schema';
import { getObjectOfString } from '@utils/get-object-of-string';

export const kafkaConsumer = () => {
	const { kafkaClient } = handleKafkaClient();

	const addConsumer = async <V>({
		topics,
		groupId,
		handler,
		fromBeginning,
	}: AddConsumerRequest<V>): Promise<void> => {
		const validation = await AddConsumerSchema.safeParseAsync({
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
			sessionTimeout: 6000,
			rebalanceTimeout: 5000,
			heartbeatInterval: 2000,
		});

		await consumer.connect();

		for (const topic of topics) {
			consumer.subscribe({ topic, fromBeginning: fromBeginning ?? false });
		}

		await consumer.run({
			eachMessage: async (payload: EachMessagePayload) => {
				const record: KafkaRecordSchema<V> = getRecord<V>(payload);

				const { topic, partition } = payload;

				consumer.pause([{ topic, partitions: [partition] }]);

				try {
					await handler(record);
				} catch (error: unknown) {
					loggerError(`Exception catch in: [${topic}]`, error as Error);
				} finally {
					consumer.resume([{ topic, partitions: [partition] }]);
				}
			},
		});

		loggerInfo(`[KAFKA] joined to [${groupId}]`);
	};

	const getRecord = <V>({
		message,
	}: EachMessagePayload): KafkaRecordSchema<V> => {
		const value = getMessage<V>(message.value);
		const messageString = message.key?.toString() ?? '';

		return { ...message, value, key: messageString };
	};

	const getMessage = <V>(message: Buffer<ArrayBufferLike> | null): V | null => {
		if (!message) {
			loggerError(
				`Message kafka is null or undefined ... nothing to transform`,
			);

			return null;
		}

		try {
			const value: string = message.toString();

			return getObjectOfString(value);
		} catch (error) {
			loggerError(`Failed to parse kafka message: ${error}`);
			throw new Error(`Message value can't  handled as string`, {
				cause: error,
			});
		}
	};

	return { addConsumer };
};
