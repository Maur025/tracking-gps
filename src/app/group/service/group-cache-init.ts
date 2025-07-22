import { loggerError } from '@maur025/core-logger';
import { container } from 'tsyringe';
import { getVehiclesOfGroup } from '../../vehicle/service/get-vehicles-of-group';
import { GroupCache } from '../cache/group-cache';
import { Group } from '../entity/group';
import { GroupResponse } from '../dto/group-response';

export const groupCacheInit = async (
	groupResponse?: GroupResponse[],
): Promise<void> => {
	if (!groupResponse?.length) {
		loggerError('group response undefined or empty');

		return;
	}

	const groupCache = container.resolve(GroupCache);

	groupCache.clear();

	const groupList: Group[] = await Promise.all(
		groupResponse?.map(
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
};
