import { testSwagger } from '@app/test-app/test.swagger';
import { container } from 'tsyringe';
import ZodSwaggerGenerator from './swagger/zod-swagger-generator';
import { groupSwagger } from '@app/group/group.swagger';
import { geofenceSwagger } from '@app/geofence/geofence.swagger';

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
		path: `${BASE_PATH}/geofences`,
		tag: 'GEOFENCE',
	});

	groupSwagger({
		path: `${BASE_PATH}/groups`,
		tag: 'GROUP',
	});

	zodSwaggerGenerator.setTags(TAGS_CONFIG);
};
