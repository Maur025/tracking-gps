import { testSwagger } from '@routes/v1/test/test.swagger';
import { container } from 'tsyringe';
import ZodSwaggerGenerator from './swagger/zod-swagger-generator';
import { geofenceSwagger } from '@routes/v1/geofence/geofence.swagger';

export const loadAllSwaggerDocs = (): void => {
	const BASE_PATH: string = '/api/v1';
	const zodSwaggerGenerator = container.resolve(ZodSwaggerGenerator);

	const TAGS_CONFIG: { name: string; description: string }[] = [
		{
			name: 'TEST',
			description: 'endpoint TEST only internal uses',
		},
		{ name: 'GEOFENCE', description: 'management of geofences' },
		{ name: 'GROUP', description: 'management of group vehicles' },
	];

	testSwagger({
		path: `${BASE_PATH}/test`,
		tag: 'TEST',
	});

	geofenceSwagger({
		path: `${BASE_PATH}/geofence`,
		tag: 'GEOFENCE',
	});

	zodSwaggerGenerator.setTags(TAGS_CONFIG);
};
