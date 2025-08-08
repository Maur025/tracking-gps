import 'dotenv/config';
import 'reflect-metadata';
import '@config/ioc/dependency-injection';
import { clickhouseClient } from '@common/log-db/connect-to-clickhouse';
import { redisClient } from '@common/redis/create-redis-client';
import environment from '@config/env';
import { initServices } from '@src/init-services';
import { afterAll, beforeAll } from 'vitest';

const { TEST_REDIS_HOST, TEST_REDIS_PORT } = environment;

beforeAll(async () => {
	await initServices({
		redisHost: TEST_REDIS_HOST,
		redisPort: TEST_REDIS_PORT,
	});
});

afterAll(async () => {
	await redisClient.quit();
	await clickhouseClient.close();
});
