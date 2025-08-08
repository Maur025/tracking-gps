import 'dotenv/config';
import 'reflect-metadata';
import '@config/ioc/dependency-injection';
import { clickhouseClient } from '@common/log-db/connect-to-clickhouse';
import { redisClient } from '@common/redis/create-redis-client';
import environment from '@config/env';
import { initServices } from '@src/init-services';
import { afterAll, beforeAll } from 'vitest';
import { handleKafkaClient } from '@common/kafka/handle-kafka-client';
import { kafkaConsumer } from '@common/kafka/kafka-consumer';
import { kakfaProducer } from '@common/kafka/kafka-producer';

const {
	TEST_REDIS_HOST,
	TEST_REDIS_PORT,
	TEST_KAFKA_BROKER,
	TEST_KAFKA_CLIENT_ID,
} = environment;

beforeAll(async () => {
	await initServices({
		redisHost: TEST_REDIS_HOST,
		redisPort: TEST_REDIS_PORT,
		kafkaBrokers: [TEST_KAFKA_BROKER],
		kafkaClientId: TEST_KAFKA_CLIENT_ID,
		kafkaLogLevel: 'ERROR',
	});
});

afterAll(async () => {
	await redisClient.quit();
	await clickhouseClient.close();

	const { disconnect } = kakfaProducer();
	const { disconnectAll } = kafkaConsumer();
	const { restart } = handleKafkaClient();

	await disconnect();
	await disconnectAll();
	restart();
});
