import { Server } from 'socket.io';

export default interface SocketServerBuilderResponse {
	getSocketServer(): Server;
	startListening(): void;
}
