import { Partitioners } from 'kafkajs';
import { handleKafkaClient } from './handle-kafka-client';
import { KafkaPublishSchema } from './kafka-publish.schema';
import { loggerError, loggerInfo, loggerWarn } from '@maur025/core-logger';
import { prettifyError } from 'zod/v4';
import { v4 as uuid4 } from 'uuid';

export const kakfaProducer = () => {
	const { kafkaClient } = handleKafkaClient();
	let isProducerReady: boolean = false;

	const producer = kafkaClient.producer({
		createPartitioner: Partitioners.LegacyPartitioner,
	});

	const initializeProducer = async (): Promise<void> => {
		if (isProducerReady) {
			loggerWarn(`[KAFKA] currently producer is ready, skipping...`);
			return;
		}

		await producer.connect();
		isProducerReady = true;
		loggerInfo(`[KAFKA] producer is Ready`);
	};

	const publish = async <V>({ topic, value, key }: KafkaPublishSchema<V>) => {
		if (!isProducerReady) {
			loggerError(`Sent failed, producer not initialized.`);

			return;
		}

		const validation = await KafkaPublishSchema.safeParseAsync({
			topic,
			value,
			key,
		});

		if (!validation.success) {
			loggerError(
				`publish data validation error: '\n${prettifyError(validation.error)}'`,
			);

			return;
		}

		await producer.send({
			topic,
			messages: [
				{
					key: JSON.stringify(key ?? { id: uuid4() }),
					value: JSON.stringify(value),
				},
			],
		});
	};

	return { publish, initializeProducer };
};
