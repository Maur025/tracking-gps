import environment from '@config/env';
import { loggerWarn } from '@maur025/core-logger';
import { kafkaLogger } from '@common/kafka/util/kafka-logger';
import { Kafka, logLevel } from 'kafkajs';

const { KAFKA_BROKER, KAFKA_CLIENT_ID, KAFKA_LOG_LEVEL } = environment;
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
			logLevel: getKafkaLogLevel(KAFKA_LOG_LEVEL),
			logCreator: () => kafkaLogger,
		});

		return kafkaClientInstance;
	};

	const restart = (): void => {
		kafkaClientInstance = null;
	};

	return { kafkaClient: getKafkaClient(), restart };
};

const getKafkaLogLevel = (level: string): number => {
	if (!level) {
		loggerWarn(
			'[kafka] env variable KAFKA_LOG_LEVEL is empty, skipping custom logger init',
		);

		return logLevel.NOTHING;
	}

	switch (level) {
		case 'WARN': {
			return logLevel.WARN;
		}
		case 'INFO': {
			return logLevel.INFO;
		}
		case 'DEBUG': {
			return logLevel.DEBUG;
		}
		case 'ERROR': {
			return logLevel.ERROR;
		}
		default: {
			return logLevel.NOTHING;
		}
	}
};
