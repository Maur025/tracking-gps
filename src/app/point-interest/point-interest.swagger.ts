import { LoadSwaggerDocsSchema } from '@docs/load-swagger-docs.schema';
import SwaggerRegisterPath from '@docs/swagger/swagger-register-path';
import ZodSwaggerGenerator from '@docs/swagger/zod-swagger-generator';
import { container } from 'tsyringe';
import { pointInterestPaths } from './point-interest-paths';
import { array } from 'zod/v4';
import { Geofence } from '@app/geofence/entity/geofence';

const { DEFAULT } = pointInterestPaths;

export const pointInterestSwagger = ({
	path,
	tag,
}: LoadSwaggerDocsSchema): void => {
	const zodSwaggerGenerator = container.resolve(ZodSwaggerGenerator);

	SwaggerRegisterPath.builder()
		.withRegister(zodSwaggerGenerator.getRegistry())
		.withRequest({
			method: 'get',
			path: `${path}${DEFAULT}`,
			summary: 'get all point interests in cache.',
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
