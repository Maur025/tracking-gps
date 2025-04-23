import 'dotenv/config';
import 'reflect-metadata';
import '@config/ioc/dependency-injection';
import app from 'app';
import ioServer from '@socket/server/io-server';
import * as socketTrackClient from '@socket/client/socket-track-client';
import { cacheInitializer } from '@services/cache-initializer';
import { loggerError } from '@utils/logger';

const { getApp } = app;

getApp().get('/', (req, res) => {
	res.send('Running project tracking gps!');
});

ioServer.startListening();

cacheInitializer().subscribe({
	error: error => {
		loggerError(`Error occurred while initializing cache -> `, error);
	},
	complete: () => {
		socketTrackClient.connect();
	},
});
