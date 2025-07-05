import 'dotenv/config';
import 'reflect-metadata';
import '@config/ioc/dependency-injection';
import ioServer from '@socket/server/io-server';
import * as socketTrackClient from '@socket/client/socket-track-client';
import { cacheInitializer } from '@common/cache/service/cache-initializer';
import { loggerError, loggerInfo } from '@maur025/core-logger';
import { initRedisClient } from '@common/redis/create-redis-client';
import app from './app';
import { configureConsumers } from '@config/configure-consumers';

const { getApp } = app;

getApp().get('/', (req, res) => {
	res.send('Running project tracking gps!');
});

console.time('EXPRESS and SOCKET servers initialized in');
ioServer.startListening();
console.timeEnd('EXPRESS and SOCKET servers initialized in');

console.time('KAFKA ready in');
await configureConsumers();
console.timeEnd('KAFKA ready in');

console.time('REDIS initialized in');
await initRedisClient();
console.timeEnd('REDIS initialized in');

console.time('CACHE-INIT ready in');
cacheInitializer().subscribe({
	error: error => {
		loggerError(`error occurred while initializing cache -> `, error);
		loggerInfo(`client sockets will not be initialized.`);
	},
	complete: () => {
		socketTrackClient.connect();
	},
});
console.timeEnd('CACHE-INIT ready in');
