import { LoadSwaggerDocsSchema } from '@docs/load-swagger-docs.schema';
import { deventPaths } from './devent-paths';
import { container } from 'tsyringe';
import ZodSwaggerGenerator from '@docs/swagger/zod-swagger-generator';
import SwaggerRegisterPath from '@docs/swagger/swagger-register-path';
import { array } from 'zod/v4';
import { Devent } from './entity/devent';

const { DEFAULT } = deventPaths;

export const deventSwagger = (request: LoadSwaggerDocsSchema): void => {
	const { path, tag } = LoadSwaggerDocsSchema.parse(request);

	const zodSwaggerGenerator = container.resolve(ZodSwaggerGenerator);

	SwaggerRegisterPath.builder()
		.withRegister(zodSwaggerGenerator.getRegistry())
		.withRequest({
			method: 'get',
			path: `${path}${DEFAULT}`,
			summary: 'get all devents in cache',
			tags: [tag],
			request: {},
			responses: {
				200: {
					description: '',
					content: { 'application/json': { schema: array(Devent) } },
				},
			},
		})
		.register();
};
