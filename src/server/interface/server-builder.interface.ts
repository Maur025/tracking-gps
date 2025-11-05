import { Server } from 'http';
import ServerBuilderResponse from './server-builder-response.interface.js';
import { Router } from 'express';

export default interface IServerBuilder {
	applyMiddlewares(): this;
	applyRoutes(router: Router): this;
	configureStatic(): this;
	build(): ServerBuilderResponse;
	start(): Server;
}
