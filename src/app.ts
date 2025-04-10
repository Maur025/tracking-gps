import environment from '@config/env';
import ServerBuilder from '@config/server-builder';
import ServerBuilderResponse from '@models/interface/server-builder-response.interface';

const app: ServerBuilderResponse = new ServerBuilder(environment.PORT)
	.applyMiddlewares()
	.applyRoutes()
	.configureServer()
	.build();

export default app;
