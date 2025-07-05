import SocketServerBuilderResponse from '@server/interface/socket-server-builder-response.interface';
import { socketListeners } from './socket-listeners';
import SocketServerBuilder from './socket-server-builder';
import app from '@src/app';

const { getApp } = app;

const ioServer: SocketServerBuilderResponse = SocketServerBuilder.builder()
	.setApplication(getApp())
	.setListenersFunction(socketListeners)
	.build();

export default ioServer;
