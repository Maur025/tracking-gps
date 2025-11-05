import { LoadSwaggerDocsSchema } from '@docs/load-swagger-docs.schema.js';
import SwaggerRegisterPath from '@docs/swagger/swagger-register-path.js';
import ZodSwaggerGenerator from '@docs/swagger/zod-swagger-generator.js';
import { container } from 'tsyringe';
import { vehiclePaths } from './vehicle-paths.js';
import { array } from 'zod/v4';
import { Vehicle } from './entity/vehicle.js';

const { DEFAULT } = vehiclePaths;

export const vehicleSwagger = ({ path, tag }: LoadSwaggerDocsSchema) => {
	const zodSwaggerGenerator = container.resolve(ZodSwaggerGenerator);

	SwaggerRegisterPath.builder()
		.withRegister(zodSwaggerGenerator.getRegistry())
		.withRequest({
			method: 'get',
			path: `${path}${DEFAULT}`,
			summary: 'get all vehicles in cache',
			tags: [tag],
			request: {},
			responses: {
				200: {
					description: '',
					content: {
						'application/json': {
							schema: array(Vehicle),
						},
					},
				},
			},
		})
		.register();
};
