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

vi.mock('@app/vehicle/service/get-vehicles-of-group', () => ({
	getVehiclesOfGroup: vi.fn(() => [
		{
			id: 'vehicle1',
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
			device_id: '0000001',
		},
	]),
}));

vi.mock('@common/redis/service/add-data-in-batch', () => ({
	addDataInBatch: vi.fn().mockResolvedValue(undefined),
}));

import { loggerError } from '@maur025/core-logger';
import { groupCacheInit } from '@app/group/service/group-cache-init';
import { container } from 'tsyringe';
import { getVehiclesOfGroup } from '@app/vehicle/service/get-vehicles-of-group';
import { GroupResponse } from '@app/group/dto/response/group-response';
import { GroupCache } from '@app/group/cache/group-cache';
import { addDataInBatch } from '@common/redis/service/add-data-in-batch';

describe('Group cache init test', () => {
	const groupResponse = [
		{
			id: 'group1',
			name: 'group1',
			description: 'test description',
			vehicles: [
				{
					id: 'groupVehicle1',
					group_id: 'group1',
					vehicle_id: 'vehicle1',
					vehicle: {
						id: 'vehicle1',
						name: 'vehicle name',
						type: 'type test',
						metadata:
							'{"plaque":"6510UDP","brand":"Toyota","model":"Corolla","color":"Blanco","totalTour":"11050","totalFuel":"40","fuelKilometer":"0.06","detail":""}',
						device: [
							{
								id: 'deviceVehicle1',
								vehicle_id: 'vehicle1',
								device_id: '0000001',
							},
						],
					},
				},
			],
		},
		{
			id: 'groupVehicle2',
			name: 'group2',
			description: 'test description',
			vehicles: [],
		},
	] as GroupResponse[];

	let groupCacheMock: Partial<GroupCache>;

	beforeAll(() => {
		const GroupCacheMock = vi.fn();
		GroupCacheMock.prototype.clear = vi.fn();
		GroupCacheMock.prototype.addMany = vi.fn();
		GroupCacheMock.prototype.getRedisKey = vi.fn(() => 'test-key');
		groupCacheMock = new GroupCacheMock();
	});

	beforeEach(() => {
		vi.clearAllMocks();

		container.registerInstance(GroupCache, groupCacheMock);
	});

	test('should be a function', () => {
		expectTypeOf(groupCacheInit).toBeFunction();
	});

	test('should be receipt once param of group response type', async () => {
		await groupCacheInit([]);

		expect(loggerError).toHaveBeenCalledWith(
			'[GROUP] (groupCacheInit) group response undefined or empty',
		);
	});

	test('should clear data and write new data', async () => {
		await groupCacheInit(groupResponse);

		expect(groupCacheMock.clear).toHaveBeenCalled();
		expect(groupCacheMock.clear).toHaveBeenCalledTimes(1);

		expect(groupCacheMock.addMany).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					id: expect.any(String),
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

		expect(getVehiclesOfGroup).toHaveBeenCalledTimes(2);
		expect(groupCacheMock.addMany).toHaveBeenCalledTimes(1);
		expect(addDataInBatch).toHaveBeenCalledWith(
			expect.objectContaining({
				dataList: expect.arrayContaining([
					expect.objectContaining({ id: expect.any(String) }),
				]),
				dataBaseKey: 'test-key',
				registerInRedisFn: expect.any(Function),
			}),
		);
	});
});
