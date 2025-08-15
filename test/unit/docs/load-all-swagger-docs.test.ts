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

import { testSwagger } from '@app/test-app/test.swagger';
import { loadAllSwaggerDocs } from '@src/docs/load-all-swagger-docs';
import ZodSwaggerGenerator from '@src/docs/swagger/zod-swagger-generator';
import { container } from 'tsyringe';
import { groupSwagger } from '@app/group/group.swagger';
import { geofenceSwagger } from '@app/geofence/geofence.swagger';
import { deviceSwagger } from '@app/device/device.swagger';
import { vehicleSwagger } from '@app/vehicle/vehicle.swagger';
import { pointInterestSwagger } from '@app/point-interest/point-interest.swagger';
import { ruleSwagger } from '@app/rule/rule.swagger';
import { deventSwagger } from '@app/devent/devent.swagger';

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
		]);
	});
});
