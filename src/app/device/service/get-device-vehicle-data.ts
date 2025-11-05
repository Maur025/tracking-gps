import { Vehicle } from '@app/vehicle/entity/vehicle.js';
import { Device } from '../entity/device.js';
import { container } from 'tsyringe';
import VehicleCache from '@app/vehicle/cache/vehicle-cache.js';
import { loggerDebug, loggerError } from '@maur025/core-logger';
import { isInvalidId } from '@utils/is-invalid-id.js';
import { searchByIndexInRedis } from '@common/redis/service/search-by-index-in-redis.js';

export const getDeviceVehicleData = async (
	device: Device,
	deviceInMapCache: Device | undefined,
): Promise<Vehicle | undefined> => {
	if (deviceInMapCache?.vehicleData) {
		loggerDebug(`[DEVICE] (getDeviceVehicleData) vehicle data found in cache.`);

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

	loggerDebug(
		`[DEVICE] (getDeviceVehicleData) vehicle data found: ${vehicleData.id}`,
	);
	return vehicleData;
};
