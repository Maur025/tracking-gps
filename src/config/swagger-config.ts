import { Application } from 'express';
import ZodSwaggerGenerator from '../docs/swagger/zod-swagger-generator';
import { container } from 'tsyringe';
import swaggerUiExpress from 'swagger-ui-express';
import { loadAllSwaggerDocs } from '@src/docs/load-all-swagger-docs';

export const swaggerConfig = (app: Application) => {
	loadAllSwaggerDocs();

	const zodSwaggerGenerator = container.resolve(ZodSwaggerGenerator);

	app.use(
		'/docs',
		swaggerUiExpress.serve,
		swaggerUiExpress.setup(zodSwaggerGenerator.getOpenApiDocument() ?? {}),
	);
};
