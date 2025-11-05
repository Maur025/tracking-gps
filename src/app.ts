import environment from '@config/env.js';
import ServerBuilder from '@server/server-builder.js';
import ServerBuilderResponse from '@server/interface/server-builder-response.interface.js';
import { installCache } from '@config/dns-cache.js';
import routes from '@routes/index.routes.js';

installCache();

const app: ServerBuilderResponse = ServerBuilder.builder()
	.withRequest({
		host: environment.HOST,
		port: environment.PORT,
		staticPath: environment.STATIC_PATH,
	})
	.applyMiddlewares()
	.applyRoutes(routes)
	.configureStatic()
	.build();

export default app;
