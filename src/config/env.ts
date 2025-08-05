import { EnvironmentSchema } from './schema/environment.schema';

const {
	HOST,
	PORT = '7767',
	STATIC_PATH = 'public',
	BACKEND_URL = 'http://172.20.50.60:9988',
	TRACK_URL = 'http://172.20.50.60:7777',
	REDIS_HOST = 'localhost',
	REDIS_PORT = '6379',
	KAFKA_BROKER = 'localhost:9092',
	KAFKA_CLIENT_ID = 'tracking-gps',
	KAFKA_LOG_LEVEL = 'WARN',
	CLICKHOUSE_HOST = 'http://localhost',
	CLICKHOUSE_PORT = '8123',
	CLICKHOUSE_DB = 'default',
	CLICKHOUSE_USER = 'user',
	CLICKHOUSE_PASSWORD = 'password',
} = process.env;

const environment: EnvironmentSchema = {
	HOST,
	PORT: Number(PORT),
	STATIC_PATH,
	BACKEND_URL,
	TRACK_URL,
	REDIS_HOST,
	REDIS_PORT: Number(REDIS_PORT),
	KAFKA_BROKER,
	KAFKA_CLIENT_ID,
	KAFKA_LOG_LEVEL,
	CLICKHOUSE_HOST,
	CLICKHOUSE_PORT: Number(CLICKHOUSE_PORT),
	CLICKHOUSE_DB,
	CLICKHOUSE_USER,
	CLICKHOUSE_PASSWORD,
};

export default environment;
