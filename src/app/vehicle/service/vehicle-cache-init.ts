import { loggerError } from '@maur025/core-logger';
import { VehicleResponse } from '../dto/response/vehicle-response.js';
import { container } from 'tsyringe';
import VehicleCache from '../cache/vehicle-cache.js';
import { Vehicle } from '../entity/vehicle.js';
import { getVehicleMetadata } from './get-vehicle-metadata.js';
import { addDataInBatch } from '@common/redis/service/add-data-in-batch.js';
import { addVehicleBatchToRedis } from '../cache/add-vehicle-batch-to-redis.js';

export const vehicleCacheInit = async (
	vehicleResponseList: VehicleResponse[],
): Promise<void> => {
	if (!vehicleResponseList?.length) {
		loggerError(
			'[VEHICLE] (vehicleCacheInit) vehicle response undefined or empty',
		);

		return;
	}

	const vehicleCache = container.resolve(VehicleCache);

	vehicleCache.clear();

	const vehicleList: Vehicle[] = vehicleResponseList.map(
		({ id, device, type, name, metadata }) => ({
			id,
			devices: device.map(({ device_id }) => device_id ?? ''),
			deviceId: device?.length ? device[0].device_id : undefined,
			type,
			name,
			metadata: getVehicleMetadata(metadata),
		}),
	);

	vehicleCache.addMany(vehicleList);

	await addDataInBatch<Vehicle>({
		dataList: vehicleList,
		dataBaseKey: vehicleCache.getRedisKey(),
		registerInRedisFn: addVehicleBatchToRedis,
	});
};
