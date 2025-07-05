import { container, injectable } from 'tsyringe';
import { Application } from 'express';
import { createServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import commonException from '@utils/common-exception';
import SocketServerBuilderResponse from '@server/interface/socket-server-builder-response.interface';
import environment from '@config/env';

import type { Server as HttpServer } from 'node:http';
import { socketErrors } from './socket-errors';
import { loggerInfo } from '@maur025/core-logger';
import { externalSocketTopics } from '@src/external-socket-topics';

@injectable()
export default class SocketServerBuilder {
	private app: Application | null = null;
	private listenersFunction: (socket: Socket, io: Server) => void = () => {};

	public static builder() {
		return container.resolve(SocketServerBuilder);
	}

	public setApplication(app: Application): this {
		this.app = app;

		return this;
	}

	public setListenersFunction(
		listenersFunction: (socket: Socket, io: Server) => void,
	): this {
		this.listenersFunction = listenersFunction;

		return this;
	}

	public build(): SocketServerBuilderResponse {
		if (!this.app) {
			throw commonException(
				`App not set. Please set app before building server`,
			);
		}

		const httpServer = createServer(this.app);
		const ioServer = this.createSocketServer(httpServer);

		ioServer.on(externalSocketTopics.CONNECTION, (socket: Socket) =>
			this.listenersFunction(socket, ioServer),
		);
		ioServer.on(externalSocketTopics.ERROR, socketErrors);

		return {
			getIoServer: () => ioServer,
			startListening: () => this.startListening(httpServer),
		};
	}

	private readonly createSocketServer = (httpServer: HttpServer): Server =>
		new Server(httpServer, {
			cors: {
				origin: '*',
				methods: ['GET', 'POST'],
			},
		});

	private readonly startListening = (httpServer: HttpServer): void => {
		httpServer.listen(environment.PORT, () => {
			loggerInfo(
				`server 'Express' and server 'IO' running on: ${
					environment.HOST ?? 'http://localhost'
				}:${environment.PORT}`,
			);
		});
	};
}
