import { handleKafkaClient } from '@common/kafka/handle-kafka-client';
import { kafkaConsumer } from '@common/kafka/kafka-consumer';
import { kafkaProducer } from '@common/kafka/kafka-producer';
import { clickhouseClient } from '@common/log-db/connect-to-clickhouse';
import { redisClient } from '@common/redis/create-redis-client';
import environment from '@config/env';
import { initServices } from '@src/init-services';
import z, { boolean, object } from 'zod/v4';

const {
	TEST_REDIS_HOST,
	TEST_REDIS_PORT,
	TEST_KAFKA_BROKER,
	TEST_KAFKA_CLIENT_ID,
	TEST_CLICKHOUSE_DB,
	TEST_CLICKHOUSE_HOST,
	TEST_CLICKHOUSE_PORT,
	TEST_CLICKHOUSE_USER,
	TEST_CLICKHOUSE_PASSWORD,
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
		redisHost: withRedis ? TEST_REDIS_HOST : undefined,
		redisPort: withRedis ? TEST_REDIS_PORT : undefined,
		kafkaBrokers: withKafka ? [TEST_KAFKA_BROKER] : undefined,
		kafkaClientId: withKafka ? TEST_KAFKA_CLIENT_ID : undefined,
		kafkaLogLevel: withKafka ? 'ERROR' : undefined,
		clickhouseDb: withClickhouse ? TEST_CLICKHOUSE_DB : undefined,
		clickhouseHost: withClickhouse ? TEST_CLICKHOUSE_HOST : undefined,
		clickhousePassword: withClickhouse ? TEST_CLICKHOUSE_PASSWORD : undefined,
		clickhousePort: withClickhouse ? TEST_CLICKHOUSE_PORT : undefined,
		clickhouseUser: withClickhouse ? TEST_CLICKHOUSE_USER : undefined,
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
