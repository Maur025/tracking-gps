import { Server } from 'socket.io';

export default interface SocketServerBuilderResponse {
	getIoServer(): Server;
	startListening(): void;
}
