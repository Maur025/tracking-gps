import 'dotenv/config';
import 'reflect-metadata';
import '@config/ioc/dependency-injection';
import app from 'app';
import SocketServerBuilderResponse from '@models/interface/socket-server-builder-response.interface';
import SocketServerBuilder from 'socket/server/socket-server-builder';
import { socketListeners } from 'socket/server/socket-listeners';

const { getApp } = app;

getApp().get('/', (req, res) => {
	res.send('Running project tracking gps!');
});

const ioServer: SocketServerBuilderResponse = SocketServerBuilder.builder()
	.setApplication(getApp())
	.setListenersFunction(socketListeners)
	.build();

ioServer.startListening();
