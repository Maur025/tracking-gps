import 'dotenv/config';
import 'reflect-metadata';
import '@config/ioc/dependency-injection';
import app from 'app';
import ioServer from '@socket/server/io-server';
import * as socketTrackClient from '@socket/client/socket-track-client';

const { getApp } = app;

getApp().get('/', (req, res) => {
	res.send('Running project tracking gps!');
});

ioServer.startListening();

socketTrackClient.connect();
