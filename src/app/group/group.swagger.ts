import { LoadSwaggerDocsSchema } from '@docs/load-swagger-docs.schema.js';
import SwaggerRegisterPath from '@docs/swagger/swagger-register-path.js';
import ZodSwaggerGenerator from '@docs/swagger/zod-swagger-generator.js';
import { container } from 'tsyringe';
import { groupPaths } from './group-paths.js';
import { array } from 'zod/v4';
import { Group } from './entity/group.js';

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
							schema: array(Group),
						},
					},
				},
			},
		})
		.register();
};
