import { container, injectable } from 'tsyringe';
import { Application } from 'express';
import { createServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import commonException from '@utils/common-exception';
import SocketServerBuilderResponse from '@models/interface/socket-server-builder-response.interface';
import environment from '@config/env';

import type { Server as HttpServer } from 'node:http';
import { socketErrors } from './socket-errors';
import { Topics } from '@models/enums/topics.enum';
import { loggerInfo } from '@utils/logger';

@injectable()
export default class SocketServerBuilder {
	private app: Application | null = null;
	private listenersFunction: (socket: Socket) => void = () => {};

	public static builder() {
		return container.resolve(SocketServerBuilder);
	}

	public setApplication(app: Application): this {
		this.app = app;

		return this;
	}

	public setListenersFunction(
		listenersFunction: (socket: Socket) => void
	): this {
		this.listenersFunction = listenersFunction;

		return this;
	}

	public build(): SocketServerBuilderResponse {
		if (!this.app) {
			throw commonException(
				`App not set. Please set app before building server`
			);
		}

		const httpServer = createServer(this.app);
		const ioServer = this.createSocketServer(httpServer);

		ioServer.on(Topics.CONNECTION, this.listenersFunction);
		ioServer.on(Topics.ERROR, socketErrors);

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
				`Server Express and server IO running on: ${
					environment.HOST ?? 'localhost'
				}:${environment.PORT}`
			);
		});
	};
}
