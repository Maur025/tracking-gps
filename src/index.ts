import 'dotenv/config';
import 'reflect-metadata';
import '@config/ioc/dependency-injection';
import app from 'app';
import ioServer from '@socket/server/io-server';
import * as socketTrackClient from '@socket/client/socket-track-client';
import { cacheInitializer } from '@services/cache-initializer';

const { getApp } = app;

getApp().get('/', (req, res) => {
	res.send('Running project tracking gps!');
});

ioServer.startListening();

cacheInitializer().subscribe({
	error: error => {
		console.error('Error Ocurred, cache initializer', error);
	},
	complete: () => {
		socketTrackClient.connect();
	},
});
