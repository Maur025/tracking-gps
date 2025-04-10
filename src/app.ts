import environment from '@config/env';
import ServerBuilder from '@config/server-builder';
import ServerBuilderResponse from '@models/interface/server-builder-response.interface';
import { installCache } from '@config/dns-cache';

installCache();

const app: ServerBuilderResponse = ServerBuilder.builder()
	.setHost(environment.HOST)
	.setPort(environment.PORT)
	.applyMiddlewares()
	.applyRoutes()
	.configureServer()
	.build();

export default app;
