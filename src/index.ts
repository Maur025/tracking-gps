import 'dotenv/config';
import 'reflect-metadata';
import '@config/ioc/dependency-injection';
import app from './app';
import { measurePerformance } from '@utils/measure-performance';
import { initServices } from './init-services';
import environment from '@config/env';

const { getApp, start } = app;
const { REDIS_HOST, REDIS_PORT } = environment;

getApp().get('/', (req, res) => {
	res.send('Running project tracking gps!');
});

await measurePerformance(start, '[EXPRESS] (start) server initialized in:');

await initServices({
	redisHost: REDIS_HOST,
	redisPort: REDIS_PORT,
});
