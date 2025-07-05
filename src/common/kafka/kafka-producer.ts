import { Partitioners, Producer } from 'kafkajs';
import { handleKafkaClient } from './handle-kafka-client';
import { KafkaPublishSchema } from './schema/kafka-publish.schema';
import { loggerDebug, loggerError } from '@maur025/core-logger';
import { prettifyError } from 'zod/v4';
import { v4 as uuid4 } from 'uuid';

let producerInstance: Producer | null = null;
let isProducerReady: boolean = false;

export const kakfaProducer = (): {
	publish: <V>(kafkaPublishSchema: KafkaPublishSchema<V>) => Promise<void>;
	restart: () => void;
} => {
	const { kafkaClient } = handleKafkaClient();

	const getProducer = async (): Promise<Producer> => {
		if (producerInstance) {
			return producerInstance;
		}

		producerInstance = kafkaClient.producer({
			createPartitioner: Partitioners.LegacyPartitioner,
		});

		await producerInstance.connect();
		isProducerReady = true;
		loggerDebug(`[KAFKA] producer is Ready`);

		return producerInstance;
	};

	const publish = async <V>({
		topic,
		value,
		key,
	}: KafkaPublishSchema<V>): Promise<void> => {
		const producer = await getProducer();

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
				`kafka publish validation failed: '\n${prettifyError(validation.error)}'`,
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

	const restart = (): void => {
		producerInstance = null;
		isProducerReady = false;
	};

	return { publish, restart };
};
