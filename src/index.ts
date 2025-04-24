import 'dotenv/config';
import 'reflect-metadata';
import '@config/ioc/dependency-injection';
import app from 'app';
import ioServer from '@socket/server/io-server';
import * as socketTrackClient from '@socket/client/socket-track-client';
import { cacheInitializer } from '@services/cache-initializer';
import { loggerError, loggerInfo } from '@utils/logger';
import { beginTest } from '@socket/client/test-client';

const { getApp } = app;

getApp().get('/', (req, res) => {
	res.send('Running project tracking gps!');
});

ioServer.startListening();

cacheInitializer().subscribe({
	error: error => {
		loggerError(`error occurred while initializing cache -> `, error);
		loggerInfo(`client sockets will not be initialized.`);
	},
	complete: () => {
		socketTrackClient.connect();

		beginTest();
	},
});
