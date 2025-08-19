import { testSwagger } from '@app/test-app/test.swagger';
import { container } from 'tsyringe';
import ZodSwaggerGenerator from './swagger/zod-swagger-generator';
import { groupSwagger } from '@app/group/group.swagger';
import { geofenceSwagger } from '@app/geofence/geofence.swagger';
import { deviceSwagger } from '@app/device/device.swagger';
import { vehicleSwagger } from '@app/vehicle/vehicle.swagger';
import { pointInterestSwagger } from '@app/point-interest/point-interest.swagger';
import { ruleSwagger } from '@app/rule/rule.swagger';
import { deventSwagger } from '@app/devent/devent.swagger';
import { channelSwagger } from '@app/channel/channel.swagger';

const TAGS = {
	TEST: 'TEST',
	GEOFENCE: 'GEOFENCE',
	GROUP: 'GROUP',
	DEVICE: 'DEVICE',
	VEHICLE: 'VEHICLE',
	POINT_INTEREST: 'POINT INTEREST',
	RULE: 'RULE',
	DEVENT: 'DEVENT',
	CHANNEL: 'CHANNEL',
};

export const loadAllSwaggerDocs = (): void => {
	const BASE_PATH: string = '/api/v1';
	const zodSwaggerGenerator = container.resolve(ZodSwaggerGenerator);

	const TAGS_CONFIG: { name: string; description: string }[] = Object.values(
		TAGS,
	).map(tag => ({
		name: `${tag?.toUpperCase()}`,
		description: `management of ${tag?.toLowerCase() ?? 'unknown'}s`,
	}));

	testSwagger({
		path: `${BASE_PATH}/tests`,
		tag: TAGS.TEST,
	});

	geofenceSwagger({
		path: `${BASE_PATH}/geofences`,
		tag: TAGS.GEOFENCE,
	});

	groupSwagger({
		path: `${BASE_PATH}/groups`,
		tag: TAGS.GROUP,
	});

	deviceSwagger({
		path: `${BASE_PATH}/devices`,
		tag: TAGS.DEVICE,
	});

	vehicleSwagger({
		path: `${BASE_PATH}/vehicles`,
		tag: TAGS.VEHICLE,
	});

	pointInterestSwagger({
		path: `${BASE_PATH}/point-interests`,
		tag: TAGS.POINT_INTEREST,
	});

	ruleSwagger({
		path: `${BASE_PATH}/rules`,
		tag: TAGS.RULE,
	});

	deventSwagger({
		path: `${BASE_PATH}/devents`,
		tag: TAGS.DEVENT,
	});

	channelSwagger({
		path: `${BASE_PATH}/channels`,
		tag: TAGS.CHANNEL,
	});

	zodSwaggerGenerator.setTags(TAGS_CONFIG);
};
