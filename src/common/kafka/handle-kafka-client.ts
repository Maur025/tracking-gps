import { loggerWarn } from '@maur025/core-logger';
import { kafkaLogger } from '@common/kafka/util/kafka-logger';
import { Kafka, logLevel } from 'kafkajs';
import z, { array, object, string } from 'zod/v4';

let kafkaClientInstance: Kafka | null = null;

export const HandleKafkaClientSchema = object({
	kafkaBrokers: array(string().nonempty()).nonempty(),
	kafkaClientId: string().nonempty(),
	kafkaLogLevel: string().nonempty(),
});

export type HandleKafkaClientSchema = z.infer<typeof HandleKafkaClientSchema>;

export const handleKafkaClient = (
	request?: HandleKafkaClientSchema,
): {
	kafkaClient: Kafka;
	restart: () => void;
} => {
	const getKafkaClient = (): Kafka => {
		if (kafkaClientInstance) {
			return kafkaClientInstance;
		}

		const { kafkaBrokers, kafkaClientId, kafkaLogLevel } =
			HandleKafkaClientSchema.parse(request);

		kafkaClientInstance = new Kafka({
			clientId: kafkaClientId,
			brokers: [...kafkaBrokers],
			logLevel: getKafkaLogLevel(kafkaLogLevel),
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
			'[kafka] (getKafkaLogLevel) env variable KAFKA_LOG_LEVEL is empty, skipping custom logger init',
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
