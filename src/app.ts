import environment from '@config/env';
import ServerBuilder from '@config/server-builder';
import ServerBuilderResponse from '@models/interface/server-builder-response.interface';
import { installCache } from '@config/dns-cache';

installCache();

const app: ServerBuilderResponse = ServerBuilder.builder()
	.setHost(environment.HOST)
	.setPort(environment.PORT)
	.setStaticPath(environment.STATIC_PATH)
	.applyMiddlewares()
	.applyRoutes()
	.configureStatic()
	.build();

export default app;
