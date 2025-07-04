import { LoadSwaggerDocsSchema } from '@docs/load-swagger-docs.schema';
import SwaggerRegisterPath from '@docs/swagger/swagger-register-path';
import ZodSwaggerGenerator from '@docs/swagger/zod-swagger-generator';
import { container } from 'tsyringe';
import { groupPaths } from './group-paths';
import { any, array } from 'zod/v4';

const { DEFAULT } = groupPaths;

export const groupSwagger = ({ path, tag }: LoadSwaggerDocsSchema): void => {
	const zodSwaggerGenerator = container.resolve(ZodSwaggerGenerator);

	SwaggerRegisterPath.builder()
		.withRegister(zodSwaggerGenerator.getRegistry())
		.withRequest({
			method: 'get',
			path: `${path}${DEFAULT}`,
			summary: 'get all groups in cache',
			tags: [tag],
			request: {},
			responses: {
				200: {
					description: '',
					content: {
						'application/json': {
							schema: array(any()),
						},
					},
				},
			},
		})
		.register();
};
