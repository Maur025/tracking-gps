import { loggerError } from '@maur025/core-logger';
import { container } from 'tsyringe';
import { getVehiclesOfGroup } from '../../vehicle/service/get-vehicles-of-group.js';
import { GroupCache } from '../cache/group-cache.js';
import { Group } from '../entity/group.js';
import { GroupResponse } from '../dto/response/group-response.js';
import { addDataInBatch } from '@common/redis/service/add-data-in-batch.js';
import { addGroupBatchToRedis } from '../cache/add-group-batch-to-redis.js';

export const groupCacheInit = async (
	groupResponseList?: GroupResponse[],
): Promise<void> => {
	if (!groupResponseList?.length) {
		loggerError('[GROUP] (groupCacheInit) group response undefined or empty');

		return;
	}

	const groupCache = container.resolve(GroupCache);

	groupCache.clear();

	const groupList: Group[] = await Promise.all(
		groupResponseList?.map(
			async ({
				id = '',
				name = '',
				description = '',
				vehicles = [],
			}: GroupResponse) => ({
				id,
				name,
				description,
				vehicles: await getVehiclesOfGroup(vehicles),
			}),
		),
	);

	groupCache.addMany(groupList);

	await addDataInBatch<Group>({
		dataList: groupList,
		dataBaseKey: groupCache.getRedisKey(),
		registerInRedisFn: addGroupBatchToRedis,
	});
};
