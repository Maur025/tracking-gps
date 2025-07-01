import { LoadSwaggerDocsSchema } from '@docs/load-swagger-docs.schema';
import SwaggerRegisterPath from '@docs/swagger/swagger-register-path';
import ZodSwaggerGenerator from '@docs/swagger/zod-swagger-generator';
import { container } from 'tsyringe';
import { geofencePaths } from './geofence-paths';
import { Geofence } from '@schemas/entity/geofence/geofence';
import { array } from 'zod/v4';

const { DEFAULT } = geofencePaths;

export const geofenceSwagger = ({ path, tag }: LoadSwaggerDocsSchema): void => {
	const zodSwaggerGenerator = container.resolve(ZodSwaggerGenerator);

	SwaggerRegisterPath.builder()
		.withRegister(zodSwaggerGenerator.getRegistry())
		.withRequest({
			method: 'get',
			path: `${path}${DEFAULT}`,
			summary: 'get all geofences in cache.',
			tags: [tag],
			request: {},
			responses: {
				200: {
					description: '',
					content: {
						'application/json': {
							schema: array(Geofence),
						},
					},
				},
			},
		})
		.register();
};
