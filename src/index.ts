import 'dotenv/config';
import 'reflect-metadata';
import '@config/ioc/dependency-injection';
import app from './app';
import { measurePerformance } from '@utils/measure-performance';
import { initServices } from './init-services';
import environment from '@config/env';

const { getApp, start } = app;
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

getApp().get('/', (req, res) => {
	res.send('Running project tracking gps!');
});

await measurePerformance(start, '[EXPRESS] (start) server initialized in:');

await initServices({
	redisHost: REDIS_HOST,
	redisPort: REDIS_PORT,
	// kafkaBrokers: [KAFKA_BROKER],
	// kafkaClientId: KAFKA_CLIENT_ID,
	// kafkaLogLevel: KAFKA_LOG_LEVEL,
	clickhouseDb: CLICKHOUSE_DB,
	clickhouseHost: CLICKHOUSE_HOST,
	clickhousePassword: CLICKHOUSE_PASSWORD,
	clickhousePort: CLICKHOUSE_PORT,
	clickhouseUser: CLICKHOUSE_USER,
	isNeedCache: true,
});
