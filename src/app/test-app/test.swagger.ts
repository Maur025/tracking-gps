import { LoadSwaggerDocsSchema } from '@src/docs/load-swagger-docs.schema';
import ZodSwaggerGenerator from '@src/docs/swagger/zod-swagger-generator';
import SwaggerRegisterPath from '@src/docs/swagger/swagger-register-path';
import { container } from 'tsyringe';
import { testPaths } from './test-paths';
import { TestSchema } from '@app/test-app/schema/test.schema';
import { object, string } from 'zod/v4';

const { ZOD_VALIDATION, KAFKA } = testPaths;

export const testSwagger = ({ path, tag }: LoadSwaggerDocsSchema): void => {
	const zodSwaggerGenerator = container.resolve(ZodSwaggerGenerator);

	SwaggerRegisterPath.builder()
		.withRegister(zodSwaggerGenerator.getRegistry())
		.withRequest({
			method: 'get',
			path: `${path}${ZOD_VALIDATION}`,
			summary: 'GET test',
			tags: [tag],
			request: {},
			responses: {
				200: {
					description: 'return',
					content: {
						'application/json': { schema: TestSchema },
					},
				},
			},
		})
		.register();

	SwaggerRegisterPath.builder()
		.withRegister(zodSwaggerGenerator.getRegistry())
		.withRequest({
			method: 'post',
			path: `${path}${KAFKA}`,
			summary: 'kafka publish example test',
			tags: [tag],
			request: {},
			responses: {
				200: {
					description: 'response successfully',
					content: {
						'application/json': { schema: object({ message: string() }) },
					},
				},
			},
		})
		.register();
};
