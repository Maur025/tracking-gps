import z, { object, string, number } from 'zod/v4';

export const EnvironmentSchema = object({
	HOST: string().nonempty().optional(),
	PORT: number().nonnegative(),
	STATIC_PATH: string().nonempty(),

	BACKEND_URL: string().nonempty(),
	TRACK_URL: string().nonempty(),

	REDIS_HOST: string().nonempty(),
	REDIS_PORT: number().nonnegative(),

	KAFKA_BROKER: string().nonempty(),
	KAFKA_CLIENT_ID: string().nonempty(),
	KAFKA_LOG_LEVEL: string().nonempty(),

	CLICKHOUSE_HOST: string().nonempty(),
	CLICKHOUSE_PORT: number().nonnegative(),
	CLICKHOUSE_DB: string().nonempty(),
	CLICKHOUSE_USER: string().nonempty(),
	CLICKHOUSE_PASSWORD: string(),

	TEST_REDIS_HOST: string().nonempty(),
	TEST_REDIS_PORT: number().nonnegative(),

	TEST_KAFKA_BROKER: string().nonempty(),
	TEST_KAFKA_CLIENT_ID: string().nonempty(),

	TEST_CLICKHOUSE_HOST: string().nonempty(),
	TEST_CLICKHOUSE_PORT: number().nonnegative(),
	TEST_CLICKHOUSE_DB: string().nonempty(),
	TEST_CLICKHOUSE_USER: string().nonempty(),
	TEST_CLICKHOUSE_PASSWORD: string(),
});

export type EnvironmentSchema = z.infer<typeof EnvironmentSchema>;
