import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('@services/cache/group/get-vehicle-metadata', () => ({
	getVehicleMetadata: vi.fn(() => ({})),
}));

vi.mock('@maur025/core-logger', () => ({
	loggerError: vi.fn(),
}));

import { getVehicleMetadata } from '@services/cache/group/get-vehicle-metadata';
import { getVehiclesOfGroup } from '@services/cache/group/get-vehicles-of-group';
import { GroupVehicleResponse } from '@models/dto/response/group-vehicle-response';
import { loggerError } from '@maur025/core-logger';

describe('get vehicles of group test', () => {
	const groupVehicleResponse = [
		{
			group_id: 'group1',
			vehicle_id: 'vehicle1',
			vehicle: {
				name: 'vehicle 1',
				type: 'type 1',
				metadata: '',
			},
		},
		{
			group_id: 'group1',
			vehicle_id: 'vehicle1',
			vehicle: {
				name: 'vehicle 1',
				type: 'type 1',
				metadata: '',
			},
		},
	] as GroupVehicleResponse[];

	beforeEach(() => {
		vi.resetAllMocks();
	});

	test('should return Vehicle list of groupVehicleList', () => {
		const vehicles = getVehiclesOfGroup(groupVehicleResponse);

		expect(vehicles).toBeDefined();
		expect(vehicles.length).toBe(2);

		expect(getVehicleMetadata).toHaveBeenCalledTimes(2);
	});

	test('should return array empty if groupVehicleList is undefined', () => {
		const vehicles = getVehiclesOfGroup(undefined);

		expect(vehicles).toBeDefined();
		expect(vehicles.length).toBe(0);
		expect(loggerError).toHaveBeenCalledOnce();
	});
});
