import { loggerError } from '@maur025/core-logger';
import { GroupResponse } from '@models/dto/response/group-response';
import { Group } from '@models/entity/group';
import { container } from 'tsyringe';
import { GroupCache } from '@cache/group-cache';
import { getVehiclesOfGroup } from './get-vehicles-of-group';

export const groupCacheInit = (groupResponse?: GroupResponse[]): void => {
	if (!groupResponse?.length) {
		loggerError('group response undefined or empty');

		return;
	}

	const groupCache = container.resolve(GroupCache);

	groupCache.clear();

	const groupList: Group[] = groupResponse?.map(
		({ name = '', description = '', vehicles = [] }: GroupResponse) => {
			return {
				name,
				description,
				vehicles: getVehiclesOfGroup(vehicles),
			};
		}
	);

	groupCache.addMany(groupList);
};
