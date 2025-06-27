import environment from '@config/env';
import { kafkaLogger } from '@utils/kafka/kafka-logger';
import { Kafka, logLevel } from 'kafkajs';

const { KAFKA_BROKER, KAFKA_CLIENT_ID } = environment;
let kafkaClientInstance: Kafka | null = null;

export const handleKafkaClient = (): {
	kafkaClient: Kafka;
	restart: () => void;
} => {
	const getKafkaClient = (): Kafka => {
		if (kafkaClientInstance) {
			return kafkaClientInstance;
		}

		kafkaClientInstance = new Kafka({
			clientId: KAFKA_CLIENT_ID,
			brokers: [KAFKA_BROKER],
			logLevel: logLevel.INFO,
			logCreator: () => kafkaLogger,
		});

		return kafkaClientInstance;
	};

	const restart = (): void => {
		kafkaClientInstance = null;
	};

	return { kafkaClient: getKafkaClient(), restart };
};
