import 'dotenv/config';
import 'reflect-metadata';
import '@config/ioc/dependency-injection';
import { cacheInitializer } from '@common/cache/service/cache-initializer';
import { loggerError, loggerWarn } from '@maur025/core-logger';
import { initRedisClient } from '@common/redis/create-redis-client';
import app from './app';
import { configureConsumers } from '@config/configure-consumers';
import { measurePerformance } from '@utils/measure-performance';
import { defaultIfEmpty, lastValueFrom } from 'rxjs';

const { getApp, start } = app;

getApp().get('/', (req, res) => {
	res.send('Running project tracking gps!');
});

await measurePerformance(start, '[EXPRESS] (start) server initialized in:');
await measurePerformance(
	configureConsumers,
	'[KAFKA] (configureConsumers) consumers ready in:',
);
await measurePerformance(
	initRedisClient,
	'[REDIS] (initRedisClient) initialized in:',
);

await measurePerformance(async () => {
	try {
		await lastValueFrom(cacheInitializer().pipe(defaultIfEmpty(null)));
	} catch (error: unknown) {
		loggerError(
			`[SYSTEM] (cacheInitializer) error occurred while initializing cache -> `,
			error as Error,
		);
		loggerWarn(
			`[SYSTEM] (cacheInitializer) client sockets will not be initialized.`,
		);
	}
}, '[SYSTEM] (cacheInitializer) cache initialized in:');
