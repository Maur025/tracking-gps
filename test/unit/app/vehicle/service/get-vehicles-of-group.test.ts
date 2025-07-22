import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('@app/vehicle/service/get-vehicle-metadata', () => ({
	getVehicleMetadata: vi.fn(() => ({})),
}));

vi.mock('@maur025/core-logger', () => ({
	loggerError: vi.fn(),
}));

vi.mock('@app/vehicle/service/get-vehicle-device-map', () => ({
	getVehicleDeviceMap: vi.fn(() => new Map<string, string>()),
}));

import { getVehicleMetadata } from '@app/vehicle/service/get-vehicle-metadata';
import { getVehiclesOfGroup } from '@app/vehicle/service/get-vehicles-of-group';
import { loggerError } from '@maur025/core-logger';
import { GroupVehicleResponse } from '@app/group/dto/group-vehicle-response';
import { getVehicleDeviceMap } from '@app/vehicle/service/get-vehicle-device-map';

describe('get vehicles of group test', () => {
	const groupVehicleResponse = [
		{
			group_id: 'group1',
			vehicle_id: 'vehicle1',
			vehicle: {
				id: 'vehicle1',
				name: 'vehicle 1',
				type: 'type 1',
				metadata: '',
				device: [
					{
						vehicle_id: 'vehicle1',
						device_id: '0000001',
					},
				],
			},
		},
		{
			group_id: 'group1',
			vehicle_id: 'vehicle2',
			vehicle: {
				id: 'vehicle2',
				name: 'vehicle2',
				type: 'type 2',
				metadata: '',
				device: [],
			},
		},
	] as GroupVehicleResponse[];

	beforeEach(() => {
		vi.resetAllMocks();
	});

	test('should return Vehicle list of groupVehicleList', async () => {
		const vehicles = await getVehiclesOfGroup(groupVehicleResponse);

		expect(getVehicleDeviceMap).toHaveBeenCalledWith(
			expect.objectContaining({
				groupVehicles: groupVehicleResponse,
			}),
		);
		expect(vehicles).toBeDefined();
		expect(vehicles.length).toBe(2);

		expect(getVehicleMetadata).toHaveBeenCalledTimes(2);
	});

	test('should return array empty if groupVehicleList is undefined', async () => {
		const vehicles = await getVehiclesOfGroup(undefined);

		expect(vehicles).toBeDefined();
		expect(vehicles.length).toBe(0);
		expect(loggerError).toHaveBeenCalledOnce();
	});
});
