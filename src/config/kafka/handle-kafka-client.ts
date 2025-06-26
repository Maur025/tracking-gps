import environment from '@config/env';
import { kafkaLogger } from '@utils/kafka/kafka-logger';
import { Kafka, logLevel } from 'kafkajs';

const { KAFKA_BROKER } = environment;

export const handleKafkaClient = (): { kafkaClient: Kafka } => {
	const CLIENT_ID: string = 'tracking-gps';

	const kafkaClient: Kafka = new Kafka({
		clientId: CLIENT_ID,
		brokers: [KAFKA_BROKER],
		logLevel: logLevel.INFO,
		logCreator: () => kafkaLogger,
	});

	return { kafkaClient };
};
