import ServerBuilderResponse from '@models/interface/server-builder-response.interface';
import IServerBuilder from '@models/interface/server-builder.interface';
import express, { Application } from 'express';
import { Server } from 'http';
// import compresion from 'compression';
// import cors from 'cors';

export default class ServerBuilder implements IServerBuilder {
	private readonly app: Application;
	private host: string | null = null;
	private port: number | null = null;

	private constructor() {
		this.app = express();
	}

	public static builder(): ServerBuilder {
		return new ServerBuilder();
	}

	public setHost(host: string): this {
		this.host = host;
		return this;
	}

	public setPort(port: number): this {
		this.port = port;
		return this;
	}

	public applyMiddlewares(): this {
		// Implement the logic to apply middlewares
		return this;
	}

	public applyRoutes(): this {
		// Implement the logic to apply routes
		return this;
	}

	public configureServer(): this {
		// this.app.use(
		// 	cors({
		// 		origin: '*',
		// 	})
		// );
		// Implement the logic to configure the server
		return this;
	}

	public build(): ServerBuilderResponse {
		if (!this.port) {
			throw new Error(
				'Port not set. Please set the port before building the server.'
			);
		}

		return { getApp: () => this.app, start: () => this.start() };
	}

	public start(): Server {
		if (!this.port) {
			throw new Error(
				'Port not set. Please set the port before starting the server.'
			);
		}

		if (!this.host) {
			return this.app?.listen(this.port, () => this.getMessageSuccess());
		}

		return this.app?.listen(this.port, this.host, () =>
			this.getMessageSuccess()
		);
	}

	private readonly getMessageSuccess = (): void => {
		console.info(`Server running on ${this.host ?? 'localhost'}:${this.port}`);
	};
}
