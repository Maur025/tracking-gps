import SocketServerBuilderResponse from '@models/interface/socket-server-builder-response.interface';
import app from 'app';
import { socketListeners } from './socket-listeners';
import SocketServerBuilder from './socket-server-builder';

const { getApp } = app;

const ioServer: SocketServerBuilderResponse = SocketServerBuilder.builder()
	.setApplication(getApp())
	.setListenersFunction(socketListeners)
	.build();

export default ioServer;
