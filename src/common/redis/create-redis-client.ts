import environment from '@config/env';
import { loggerError, loggerInfo } from '@maur025/core-logger';
import { createClient } from 'redis';

const { REDIS_HOST, REDIS_PORT } = environment;

export const redisClient = createClient({
	url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
})
	.on('error', error => loggerError(`Redis client error: `, error))
	.on('ready', () =>
		loggerInfo(
			`[redis] redis client running in http://${REDIS_HOST}:${REDIS_PORT}`,
		),
	);

export const initRedisClient = async (): Promise<void> => {
	await redisClient.connect();
};
