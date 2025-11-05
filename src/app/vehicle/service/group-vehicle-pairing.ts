import { Device } from '@app/device/entity/device.js';
import { GroupCache } from '@app/group/cache/group-cache.js';
import { container } from 'tsyringe';
import { Vehicle } from '../entity/vehicle.js';

export const groupVehiclePairing = (payload: Device[]) => {
	const groupCache = container.resolve(GroupCache);

	const deviceSet = new Set<string>(payload.map(device => device.id ?? ''));

	let groupVehicle = {};

	for (const group of groupCache.getAll()) {
		groupVehicle = {
			...groupVehicle,
			[group.name]: {
				...group,
				vehicles: getVehicleList(group.vehicles, deviceSet),
			},
		};
	}

	return groupVehicle;
};

const getVehicleList = (
	vehicles: Vehicle[],
	deviceSet: Set<string>,
): Vehicle[] => {
	const vehicleList: Vehicle[] = [];

	for (const vehicle of vehicles) {
		if (!vehicle.deviceId) {
			continue;
		}

		if (deviceSet.has(vehicle.deviceId)) {
			vehicleList.push(vehicle);
		}
	}

	return vehicleList;
};
