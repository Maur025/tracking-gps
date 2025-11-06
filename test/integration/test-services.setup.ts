import { handleKafkaClient } from '@common/kafka/handle-kafka-client.js';
import { kafkaConsumer } from '@common/kafka/kafka-consumer.js';
import { kafkaProducer } from '@common/kafka/kafka-producer.js';
import { clickhouseClient } from '@common/log-db/connect-to-clickhouse.js';
import { redisClient } from '@common/redis/create-redis-client.js';
import environment from '@config/env.js';
import { initServices } from '@src/init-services.js';
import z, { boolean, object } from 'zod/v4';

const {
	REDIS_HOST,
	REDIS_PORT,
	KAFKA_BROKER,
	KAFKA_CLIENT_ID,
	KAFKA_LOG_LEVEL,
	CLICKHOUSE_DB,
	CLICKHOUSE_HOST,
	CLICKHOUSE_PORT,
	CLICKHOUSE_USER,
	CLICKHOUSE_PASSWORD,
} = environment;

const StartTestServicesSchema = object({
	withCache: boolean().default(false).optional(),
	withKafka: boolean().default(false).optional(),
	withClickhouse: boolean().default(false).optional(),
	withRedis: boolean().default(false).optional(),
});

type StartTestServicesSchema = z.infer<typeof StartTestServicesSchema>;

export const startTestServices = async (
	request: StartTestServicesSchema,
): Promise<void> => {
	const {
		withCache = false,
		withKafka = false,
		withClickhouse = false,
		withRedis = false,
	} = StartTestServicesSchema.parse(request);

	await initServices({
		redisHost: withRedis ? REDIS_HOST : undefined,
		redisPort: withRedis ? REDIS_PORT : undefined,
		kafkaBrokers: withKafka ? [KAFKA_BROKER] : undefined,
		kafkaClientId: withKafka ? KAFKA_CLIENT_ID : undefined,
		kafkaLogLevel: withKafka ? KAFKA_LOG_LEVEL : undefined,
		clickhouseDb: withClickhouse ? CLICKHOUSE_DB : undefined,
		clickhouseHost: withClickhouse ? CLICKHOUSE_HOST : undefined,
		clickhousePassword: withClickhouse ? CLICKHOUSE_PASSWORD : undefined,
		clickhousePort: withClickhouse ? CLICKHOUSE_PORT : undefined,
		clickhouseUser: withClickhouse ? CLICKHOUSE_USER : undefined,
		isNeedCache: withCache,
	});
};

export const stopTestServices = async (): Promise<void> => {
	if (redisClient?.isOpen) {
		await redisClient.quit();
	}

	if (clickhouseClient) {
		await clickhouseClient.close();
	}

	try {
		const { kafkaClient, restart } = handleKafkaClient();

		if (kafkaClient) {
			const { disconnectAll } = kafkaConsumer();
			const { disconnect } = kafkaProducer();

			await disconnectAll();
			await disconnect();
			restart();
		}
	} catch (error: unknown) {
		console.log(`Kafka not initialized ${error}`);
	}
};
