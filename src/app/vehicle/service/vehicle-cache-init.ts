import { loggerError } from '@maur025/core-logger';
import { VehicleResponse } from '../dto/vehicle-response';
import { container } from 'tsyringe';
import VehicleCache from '../cache/vehicle-cache';
import { Vehicle } from '../entity/vehicle';
import { getVehicleMetadata } from './get-vehicle-metadata';
import { addDataInBatch } from '@common/redis/service/add-data-in-batch';
import { addVehicleBatchToRedis } from '../cache/add-vehicle-batch-to-redis';
import { deleteRedisIdx } from '@common/redis/service/delete-redis-idx';

export const vehicleCacheInit = async (
	vehicleResponse: VehicleResponse[],
): Promise<void> => {
	if (!vehicleResponse?.length) {
		loggerError('vehicle response undefined or empty');

		return;
	}

	const vehicleCache = container.resolve(VehicleCache);

	vehicleCache.clear();
	await deleteRedisIdx(vehicleCache.getIdxData());

	const vehicleList: Vehicle[] = vehicleResponse.map(
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

	await addDataInBatch({
		dataList: vehicleList,
		dataIndex: vehicleCache.getIdxData(),
		dataBaseKey: vehicleCache.getRedisKey(),
		registerInRedisFn: addVehicleBatchToRedis,
		fieldsToIndex: { '$.deviceId': { type: 'TAG', AS: 'deviceId' } },
	});
};
