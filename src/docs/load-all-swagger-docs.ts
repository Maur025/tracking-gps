import { testSwagger } from '@app/test-app/test.swagger';
import { container } from 'tsyringe';
import ZodSwaggerGenerator from './swagger/zod-swagger-generator';
import { groupSwagger } from '@app/group/group.swagger';
import { geofenceSwagger } from '@app/geofence/geofence.swagger';
import { deviceSwagger } from '@app/device/device.swagger';
import { vehicleSwagger } from '@app/vehicle/vehicle.swagger';
import { pointInterestSwagger } from '@app/point-interest/point-interest.swagger';
import { ruleSwagger } from '@app/rule/rule.swagger';

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
		{ name: 'DEVICE', description: 'management of devices' },
		{ name: 'VEHICLE', description: 'management of vehicles' },
		{ name: 'POINT INTEREST', description: 'management of point interests' },
		{
			name: 'RULE',
			description: 'management of rules',
		},
	];

	testSwagger({
		path: `${BASE_PATH}/tests`,
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

	deviceSwagger({
		path: `${BASE_PATH}/devices`,
		tag: 'DEVICE',
	});

	vehicleSwagger({
		path: `${BASE_PATH}/vehicles`,
		tag: 'VEHICLE',
	});

	pointInterestSwagger({
		path: `${BASE_PATH}/point-interests`,
		tag: 'POINT INTEREST',
	});

	ruleSwagger({
		path: `${BASE_PATH}/rules`,
		tag: 'RULE',
	});

	zodSwaggerGenerator.setTags(TAGS_CONFIG);
};
