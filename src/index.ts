import 'dotenv/config';
import 'reflect-metadata';
import '@config/ioc/dependency-injection';
import ioServer from '@socket/server/io-server';
import * as socketTrackClient from '@socket/client/socket-track-client';
import { cacheInitializer } from '@services/cache-initializer';
import { loggerError, loggerInfo } from '@maur025/core-logger';
import { initRedisClient } from '@config/redis/create-redis-client';
import app from './app';
import { configureConsumers } from '@config/kafka/configure-consumers';
import { kakfaProducer } from '@config/kafka/kafka-producer';

const { getApp } = app;
const { initializeProducer } = kakfaProducer();

getApp().get('/', (req, res) => {
	res.send('Running project tracking gps!');
});

ioServer.startListening();

await configureConsumers();

await initializeProducer();

await initRedisClient();

cacheInitializer().subscribe({
	error: error => {
		loggerError(`error occurred while initializing cache -> `, error);
		loggerInfo(`client sockets will not be initialized.`);
	},
	complete: () => {
		socketTrackClient.connect();
	},
});
