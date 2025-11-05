import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('@app/test-app/test.swagger', () => ({
	testSwagger: vi.fn(),
}));

vi.mock('@app/geofence/geofence.swagger', () => ({
	geofenceSwagger: vi.fn(),
}));

vi.mock('@app/group/group.swagger', () => ({
	groupSwagger: vi.fn(),
}));

vi.mock('@app/device/device.swagger', () => ({
	deviceSwagger: vi.fn(),
}));

vi.mock('@app/vehicle/vehicle.swagger', () => ({
	vehicleSwagger: vi.fn(),
}));

vi.mock('@app/point-interest/point-interest.swagger', () => ({
	pointInterestSwagger: vi.fn(),
}));

vi.mock('@app/rule/rule.swagger', () => ({
	ruleSwagger: vi.fn(),
}));

vi.mock('@app/devent/devent.swagger', () => ({
	deventSwagger: vi.fn(),
}));

vi.mock('@app/channel/channel.swagger', () => ({
	channelSwagger: vi.fn(),
}));

import { testSwagger } from '@app/test-app/test.swagger.js';
import { loadAllSwaggerDocs } from '@src/docs/load-all-swagger-docs.js';
import ZodSwaggerGenerator from '@src/docs/swagger/zod-swagger-generator.js';
import { container } from 'tsyringe';
import { groupSwagger } from '@app/group/group.swagger.js';
import { geofenceSwagger } from '@app/geofence/geofence.swagger.js';
import { deviceSwagger } from '@app/device/device.swagger.js';
import { vehicleSwagger } from '@app/vehicle/vehicle.swagger.js';
import { pointInterestSwagger } from '@app/point-interest/point-interest.swagger.js';
import { ruleSwagger } from '@app/rule/rule.swagger.js';
import { deventSwagger } from '@app/devent/devent.swagger.js';
import { channelSwagger } from '@app/channel/channel.swagger.js';

describe('load all swagger docs test', () => {
	const BASE_PATH: string = '/api/v1';
	let mockZodSwaggerGenerator: ZodSwaggerGenerator;
	const mockTags = vi.fn();

	beforeAll(() => {
		const MockZodSwaggerGenerator = vi.fn();
		MockZodSwaggerGenerator.prototype.setTags = mockTags;

		mockZodSwaggerGenerator = new MockZodSwaggerGenerator();
	});

	beforeEach(() => {
		vi.resetAllMocks();

		container.registerInstance(ZodSwaggerGenerator, mockZodSwaggerGenerator);
	});

	test('should load all docs data', () => {
		loadAllSwaggerDocs();

		expect(testSwagger).toHaveBeenCalledWith(
			expect.objectContaining({ path: `${BASE_PATH}/tests`, tag: 'TEST' }),
		);

		expect(geofenceSwagger).toHaveBeenCalledWith(
			expect.objectContaining({
				path: `${BASE_PATH}/geofences`,
				tag: 'GEOFENCE',
			}),
		);

		expect(groupSwagger).toHaveBeenCalledWith(
			expect.objectContaining({ path: `${BASE_PATH}/groups`, tag: 'GROUP' }),
		);

		expect(deviceSwagger).toHaveBeenCalledWith(
			expect.objectContaining({ path: `${BASE_PATH}/devices`, tag: 'DEVICE' }),
		);

		expect(vehicleSwagger).toHaveBeenCalledWith(
			expect.objectContaining({
				path: `${BASE_PATH}/vehicles`,
				tag: 'VEHICLE',
			}),
		);

		expect(pointInterestSwagger).toHaveBeenCalledWith(
			expect.objectContaining({
				path: `${BASE_PATH}/point-interests`,
				tag: 'POINT INTEREST',
			}),
		);

		expect(ruleSwagger).toHaveBeenCalledWith(
			expect.objectContaining({
				path: `${BASE_PATH}/rules`,
				tag: 'RULE',
			}),
		);

		expect(deventSwagger).toHaveBeenCalledWith(
			expect.objectContaining({
				path: `${BASE_PATH}/devents`,
				tag: 'DEVENT',
			}),
		);

		expect(channelSwagger).toHaveBeenCalledWith(
			expect.objectContaining({
				path: `${BASE_PATH}/channels`,
				tag: 'CHANNEL',
			}),
		);

		expect(mockTags).toHaveBeenCalledWith([
			expect.objectContaining({
				name: 'TEST',
				description: expect.any(String),
			}),
			expect.objectContaining({
				name: 'GEOFENCE',
				description: expect.any(String),
			}),
			expect.objectContaining({
				name: 'GROUP',
				description: expect.any(String),
			}),
			expect.objectContaining({
				name: 'DEVICE',
				description: expect.any(String),
			}),
			expect.objectContaining({
				name: 'VEHICLE',
				description: expect.any(String),
			}),
			expect.objectContaining({
				name: 'POINT INTEREST',
				description: expect.any(String),
			}),
			expect.objectContaining({
				name: 'RULE',
				description: expect.any(String),
			}),
			expect.objectContaining({
				name: 'DEVENT',
				description: expect.any(String),
			}),
			expect.objectContaining({
				name: 'CHANNEL',
				description: expect.any(String),
			}),
		]);
	});
});
