import { loggerError } from '@maur025/core-logger';
import { container } from 'tsyringe';
import { getVehiclesOfGroup } from '../../vehicle/service/get-vehicles-of-group';
import { GroupCache } from '../cache/group-cache';
import { Group } from '../entity/group';
import { GroupResponse } from '../dto/response/group-response';
import { addDataInBatch } from '@common/redis/service/add-data-in-batch';
import { addGroupBatchToRedis } from '../cache/add-group-batch-to-redis';

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
