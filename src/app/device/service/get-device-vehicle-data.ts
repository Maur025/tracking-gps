import { Vehicle } from '@app/vehicle/entity/vehicle';
import { Device } from '../entity/device';
import { container } from 'tsyringe';
import VehicleCache from '@app/vehicle/cache/vehicle-cache';
import { loggerError } from '@maur025/core-logger';
import { isInvalidId } from '@utils/is-invalid-id';
import { searchByIndexInRedis } from '@common/redis/service/search-by-index-in-redis';

export const getDeviceVehicleData = async (
	device: Device,
	deviceInMapCache: Device | undefined,
): Promise<Vehicle | undefined> => {
	if (deviceInMapCache?.vehicleData) {
		return deviceInMapCache.vehicleData;
	}

	if (isInvalidId(device.id)) {
		loggerError('[DEVICE] (getDeviceVehicleData) device id is invalid.');

		return undefined;
	}

	const vehicleCache = container.resolve(VehicleCache);

	const result = await searchByIndexInRedis<Vehicle>({
		index: vehicleCache.getIdxData(),
		query: `@deviceId:"${device.id}"`,
		options: {
			LIMIT: { from: 0, size: 1 },
		},
	});

	if (!result?.total) {
		loggerError(
			`[DEVICE] (getDeviceVehicleData) vehicle not asignment to device ${device.id}, data not found in search.`,
		);

		return undefined;
	}

	let vehicleValue = result.documents[0]?.value;

	if (result.total == 2) {
		vehicleValue = JSON.parse(result.documents[1].id[1]);
	}

	const vehicleData: Vehicle = {
		...vehicleValue,
	};

	return vehicleData;
};
