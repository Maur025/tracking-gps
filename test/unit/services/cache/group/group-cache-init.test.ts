import {
	beforeAll,
	beforeEach,
	describe,
	expect,
	expectTypeOf,
	test,
	vi,
} from 'vitest';

vi.mock('@maur025/core-logger', () => ({
	loggerError: vi.fn(() => {}),
}));

vi.mock('@services/cache/group/get-vehicles-of-group', () => ({
	getVehiclesOfGroup: vi.fn(() => [
		{
			name: 'vehicle1',
			type: 'type1',
			metadata: {
				plaque: '6510UDP',
				brand: 'Toyota',
				model: 'Corolla',
				color: 'Blanco',
				totalTour: '11050',
				totalFuel: '40',
				fuelKilometer: '0.06',
				detail: 'test details',
			},
		},
	]),
}));

import { loggerError } from '@maur025/core-logger';
import { GroupResponse } from '@models/dto/response/group-response';
import { groupCacheInit } from '@services/cache/group/group-cache-init';
import { GroupCache } from '@cache/group-cache';
import { container } from 'tsyringe';
import { getVehiclesOfGroup } from '@services/cache/group/get-vehicles-of-group';

describe('Group cache init test', () => {
	const groupResponse = [
		{
			name: 'group1',
			description: 'test description',
			vehicles: [
				{
					group_id: '',
					vehicle_id: '',
					vehicle: {
						name: 'vehicle name',
						type: 'type test',
						metadata:
							'{"plaque":"6510UDP","brand":"Toyota","model":"Corolla","color":"Blanco","totalTour":"11050","totalFuel":"40","fuelKilometer":"0.06","detail":""}',
					},
				},
			],
		},
		{ name: 'group2', description: 'test description', vehicles: [] },
	] as GroupResponse[];

	let groupCacheMock: Partial<GroupCache>;

	beforeAll(() => {
		const GroupCacheMock = vi.fn();
		GroupCacheMock.prototype.clear = vi.fn();
		GroupCacheMock.prototype.addMany = vi.fn();
		groupCacheMock = new GroupCacheMock();
	});

	beforeEach(() => {
		vi.clearAllMocks();

		container.registerInstance(GroupCache, groupCacheMock);
	});

	test('should be a function', () => {
		expectTypeOf(groupCacheInit).toBeFunction();
	});

	test('should be receipt once param of group response type', () => {
		groupCacheInit([]);

		expect(loggerError).toHaveBeenCalledWith(
			'group response undefined or empty',
		);
	});

	test('should clear data and write new data', () => {
		groupCacheInit(groupResponse);

		expect(groupCacheMock.clear).toHaveBeenCalled();
		expect(groupCacheMock.clear).toHaveBeenCalledTimes(1);

		expect(groupCacheMock.addMany).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					name: expect.any(String),
					description: expect.any(String),
					vehicles: expect.arrayContaining([
						expect.objectContaining({
							metadata: expect.objectContaining({
								brand: expect.any(String),
								color: expect.any(String),
								detail: expect.any(String),
								fuelKilometer: expect.any(String),
								model: expect.any(String),
								plaque: expect.any(String),
								totalFuel: expect.any(String),
								totalTour: expect.any(String),
							}),
							name: expect.any(String),
							type: expect.any(String),
						}),
					]),
				}),
			]),
		);
		expect(groupCacheMock.addMany).toHaveBeenCalledTimes(1);

		expect(getVehiclesOfGroup).toHaveBeenCalledTimes(2);
	});
});
