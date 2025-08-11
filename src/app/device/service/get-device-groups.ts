import { Vehicle } from '@app/vehicle/entity/vehicle';
import { DeviceGroup } from '../entity/device-group';
import { loggerDebug } from '@maur025/core-logger';
import { isInvalidId } from '@utils/is-invalid-id';
import { container } from 'tsyringe';
import { GroupCache } from '@app/group/cache/group-cache';
import { searchByIndexInRedis } from '@common/redis/service/search-by-index-in-redis';

export const getDeviceGroups = async (
	vehicleData?: Vehicle,
): Promise<DeviceGroup[]> => {
	if (!vehicleData) {
		loggerDebug(
			`[DEVICE] (getDeviceGroups) vehicle data is undefined, can't group without vehicle`,
		);

		return [];
	}

	if (isInvalidId(vehicleData.id)) {
		loggerDebug(`[DEVICE] (getDeviceGroups) vehicle id is invalid.`);
		return [];
	}

	console.log(vehicleData.id);

	const groupCache = container.resolve(GroupCache);
	const result = await searchByIndexInRedis({
		index: groupCache.getIdxData(),
		query: `@groupVehicleId:"${vehicleData.id}"`,
	});

	console.log(result);

	return [];
};
