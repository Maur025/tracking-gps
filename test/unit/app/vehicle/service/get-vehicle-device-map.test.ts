import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

import { GroupVehicleResponse } from '@app/group/dto/group-vehicle-response';
import { getVehicleDeviceMap } from '@app/vehicle/service/get-vehicle-device-map';
import VehicleService from '@app/vehicle/service/vehicle.service';
import { container } from 'tsyringe';

describe('get vehicle device map test', () => {
	const groupVehicles = Array.from({ length: 60 }, (_, i) => ({
		group_id: `${i + 1}`,
		vehicle_id: `vehicle${i + 1}`,
		vehicle: {
			id: `vehicle${i + 1}`,
			name: `vehicle ${i + 1}`,
			type: `type ${i + 1}`,
			metadata: 'dato',
		},
	})) as GroupVehicleResponse[];

	let vehicleServiceMock: VehicleService;
	const getByIdMock = vi.fn(() => []);

	beforeAll(() => {
		const VehicleServiceMock = vi.fn();
		VehicleServiceMock.prototype.getById = getByIdMock;
		vehicleServiceMock = new VehicleServiceMock();
	});

	beforeEach(() => {
		vi.clearAllMocks();
		container.registerInstance(VehicleService, vehicleServiceMock);
	});

	test('should return a map whit devices', async () => {
		const vehicleDeviceMap = await getVehicleDeviceMap({ groupVehicles });

		expect(vehicleDeviceMap).toBeDefined();
		expect(getByIdMock).toHaveBeenCalledTimes(60);
	});
});
