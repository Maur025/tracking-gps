import { LoadSwaggerDocsSchema } from '@docs/load-swagger-docs.schema.js';
import SwaggerRegisterPath from '@docs/swagger/swagger-register-path.js';
import ZodSwaggerGenerator from '@docs/swagger/zod-swagger-generator.js';
import { container } from 'tsyringe';
import { devicePaths } from './device-paths.js';
import { array } from 'zod/v4';
import { Device } from './entity/device.js';

const { DEFAULT } = devicePaths;

export const deviceSwagger = ({ path, tag }: LoadSwaggerDocsSchema): void => {
	const zodSwaggerGenerator = container.resolve(ZodSwaggerGenerator);

	SwaggerRegisterPath.builder()
		.withRegister(zodSwaggerGenerator.getRegistry())
		.withRequest({
			method: 'get',
			path: `${path}${DEFAULT}`,
			summary: 'get all devices in cache',
			tags: [tag],
			request: {},
			responses: {
				200: {
					description: '',
					content: {
						'application/json': {
							schema: array(Device),
						},
					},
				},
			},
		})
		.register();
};
