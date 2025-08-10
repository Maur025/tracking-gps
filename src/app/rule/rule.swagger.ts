import { LoadSwaggerDocsSchema } from '@docs/load-swagger-docs.schema';
import { rulePaths } from './rule-paths';
import { container } from 'tsyringe';
import ZodSwaggerGenerator from '@docs/swagger/zod-swagger-generator';
import SwaggerRegisterPath from '@docs/swagger/swagger-register-path';
import { array } from 'zod/v4';
import { Rule } from './entity/rule';

const { DEFAULT } = rulePaths;

export const ruleSwagger = (request: LoadSwaggerDocsSchema) => {
	const { path, tag } = LoadSwaggerDocsSchema.parse(request);

	const zodSwaggerGenerator = container.resolve(ZodSwaggerGenerator);

	SwaggerRegisterPath.builder()
		.withRegister(zodSwaggerGenerator.getRegistry())
		.withRequest({
			method: 'get',
			path: `${path}${DEFAULT}`,
			summary: 'get all rules in cache',
			tags: [tag],
			request: {},
			responses: {
				200: {
					description: '',
					content: {
						'application/json': {
							schema: array(Rule),
						},
					},
				},
			},
		})
		.register();
};
