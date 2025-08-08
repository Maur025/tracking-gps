import { loggerError, loggerInfo } from '@maur025/core-logger';
import { createClient } from 'redis';
import z from 'zod/v4';
import { number, object, string } from 'zod/v4';

let redisClient: ReturnType<typeof createClient>;

const getRedisClient = (
	redisHost: string,
	redisPort: number,
): typeof redisClient =>
	createClient({
		url: `redis://${redisHost}:${redisPort}`,
	})
		.on('error', error =>
			loggerError(`[REDIS] (createClient) Redis client error: `, error),
		)
		.on('ready', () =>
			loggerInfo(
				`[REDIS] (createClient) redis client running in http://${redisHost}:${redisPort}`,
			),
		);

const InitRedisClientSchema = object({
	redisHost: string().nonempty(),
	redisPort: number().nonnegative(),
});

type InitRedisClientSchema = z.infer<typeof InitRedisClientSchema>;

const initRedisClient = async (
	request: InitRedisClientSchema,
): Promise<void> => {
	const { redisHost, redisPort } = InitRedisClientSchema.parse(request);

	redisClient = getRedisClient(redisHost, redisPort);

	await redisClient.connect();
};

export { redisClient, initRedisClient };
