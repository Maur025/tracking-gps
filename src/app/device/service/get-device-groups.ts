import { Vehicle } from '@app/vehicle/entity/vehicle.js';
import { DeviceGroup } from '../entity/device-group.js';
import { loggerDebug } from '@maur025/core-logger';
import { isInvalidId } from '@utils/is-invalid-id.js';
import { container } from 'tsyringe';
import { GroupCache } from '@app/group/cache/group-cache.js';
import { searchByIndexInRedis } from '@common/redis/service/search-by-index-in-redis.js';
import { Group } from '@app/group/entity/group.js';

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

	const groupCache = container.resolve(GroupCache);
	const result = await searchByIndexInRedis<Group>({
		index: groupCache.getIdxData(),
		query: `@groupVehicleId:"${vehicleData.id}"`,
	});

	if (!result?.total) {
		loggerDebug(
			`[DEVICE] (getDeviceGroups) groups not founded for vehicle ${vehicleData.id}`,
		);

		return [];
	}

	const deviceGroupList: DeviceGroup[] = [];

	for (const resultData of result.documents) {
		const { value } = resultData;

		deviceGroupList.push({
			id: value.id,
			name: value.name,
			description: value.description,
		});
	}

	loggerDebug(
		`[DEVICE] (getDeviceGroups) found ${deviceGroupList.length} groups.`,
	);
	return deviceGroupList;
};
