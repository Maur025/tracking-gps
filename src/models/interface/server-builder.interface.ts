import { Server } from 'http';
import ServerBuilderResponse from './server-builder-response.interface';

export default interface IServerBuilder {
	applyMiddlewares(): this;
	applyRoutes(): this;
	configureServer(): this;
	build(): ServerBuilderResponse;
	start(): Server;
}
