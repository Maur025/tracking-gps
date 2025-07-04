import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('@routes/v1/test/test.swagger', () => ({
	testSwagger: vi.fn(),
}));

vi.mock('@app/geofence/geofence.swagger', () => ({
	geofenceSwagger: vi.fn(),
}));

vi.mock('@routes/v1/group/group.swagger', () => ({
	groupSwagger: vi.fn(),
}));

import { testSwagger } from '@routes/v1/test/test.swagger';
import { loadAllSwaggerDocs } from '@src/docs/load-all-swagger-docs';
import ZodSwaggerGenerator from '@src/docs/swagger/zod-swagger-generator';
import { container } from 'tsyringe';
import { groupSwagger } from '@routes/v1/group/group.swagger';
import { geofenceSwagger } from '@app/geofence/geofence.swagger';

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
			expect.objectContaining({ path: `${BASE_PATH}/test`, tag: 'TEST' }),
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
		]);
	});
});
