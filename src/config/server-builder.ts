import ServerBuilderResponse from '@models/interface/server-builder-response.interface';
import IServerBuilder from '@models/interface/server-builder.interface';
import express, { Application } from 'express';
import { Server } from 'http';

export default class ServerBuilder implements IServerBuilder {
	private readonly app: Application;
	private readonly port: number;

	constructor(port: number) {
		this.app = express();
		this.port = port;
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
		// Implement the logic to configure the server
		return this;
	}

	public build(): ServerBuilderResponse {
		return { getApp: () => this.app, start: () => this.start() };
	}

	public start(): Server {
		return this.app?.listen(this.port, () => {
			console.log(`Server running on port: ${this.port}`);
		});
	}
}
